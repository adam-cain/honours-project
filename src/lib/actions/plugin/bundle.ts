"use server"
import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';
import { init, parse } from 'es-module-lexer';
import { promisify } from 'util';
import { exec } from 'child_process';
import { tempDir } from "./file";
import { uploadFunction } from "./bundleStorage";
import { nanoid } from "nanoid";
import prisma from "../../prisma";
import * as ts from 'typescript';

const execAsync = promisify(exec);

interface TypeInfo {
    parameters: { name: string; type: string | undefined }[];
    returnType: string | undefined;
    envVariables: string[];
}

async function analyzeTSFile(filePath: string): Promise<TypeInfo | undefined> {
    const program = ts.createProgram([filePath], {
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.CommonJS
    });

    const sourceFile = program.getSourceFile(filePath);
    if (!sourceFile) {
        console.error('File not found:', filePath);
        return undefined;
    }

    let typeInfo: TypeInfo | undefined = undefined;
    let envVariables: string[] = extractEnvVariables(sourceFile.getFullText());

    ts.forEachChild(sourceFile, node => {
        if (ts.isExportAssignment(node) && node.isExportEquals === false) {
            const symbol = program.getTypeChecker().getSymbolAtLocation(node.expression);
            if (symbol && symbol.valueDeclaration) {
                const type = program.getTypeChecker().getTypeAtLocation(symbol.valueDeclaration);
                const callSignatures = type.getCallSignatures();

                if (callSignatures.length > 0) {
                    const signature = callSignatures[0];
                    const parameters = signature.parameters.map(param => {
                        const paramDecl = param.valueDeclaration as ts.ParameterDeclaration;
                        return {
                            name: param.name,
                            type: program.getTypeChecker().typeToString(program.getTypeChecker().getTypeAtLocation(paramDecl))
                        };
                    });

                    const returnType = program.getTypeChecker().typeToString(signature.getReturnType());

                    typeInfo = {
                        parameters: parameters,
                        returnType: returnType,
                        envVariables: envVariables
                    };
                }
            }
        }
    });
    console.log('Type Info:', typeInfo)
    return typeInfo;
}

function extractEnvVariables(sourceCode: string): string[] {
    const sourceFile = ts.createSourceFile('temp.ts', sourceCode, ts.ScriptTarget.Latest, true);
    const envVariables: string[] = [];

    function visit(node: ts.Node) {
        if (ts.isPropertyAccessExpression(node)) {
            if (node.expression.kind === ts.SyntaxKind.Identifier && node.expression.getText() === 'env') {
                envVariables.push(node.name.getText());
            }
        }
        ts.forEachChild(node, visit);
    }

    ts.forEachChild(sourceFile, visit);
    return envVariables;
}

async function installDependencies(dependencies: string[]): Promise<void> {
    if (dependencies.length === 0) return;
    const packagesString = dependencies.join(' ');
    const { stdout, stderr } = await execAsync(`npm install ${packagesString}`);
    if (stderr) console.error('NPM Install error:', stderr);
}

async function extractDependencies(code: string, isJavaScript: boolean = false): Promise<string[]> {
    await init;
    const [imports] = parse(code);

    let dependencies = imports.map(importee => {
        const importName = importee.n;
        if (importName && importName.includes("/")) {
            return importName.split("/")[0];
        }
        return importName;
    }).filter(Boolean) as string[];

    const requireRegex = /require\(['"`](.*?)['"`]\)/g;
    let match;
    while ((match = requireRegex.exec(code)) !== null) {
        const moduleName = match[1];
        if (moduleName && moduleName.includes("/")) {
            dependencies.push(moduleName.split("/")[0]);
        } else {
            dependencies.push(moduleName);
        }
    }

    dependencies = Array.from(new Set(dependencies));

    if (!isJavaScript) {
        // Assuming all imports in TypeScript files could have corresponding @types/ packages
        const typeDependencies = dependencies.map(dep => `@types/${dep.replace(/[^a-zA-Z0-9_]/g, "__")}`);
        return dependencies.concat(typeDependencies);
    }

    return dependencies;
}

function extractDefaultExportParameters(sourceCode: string): string[] | undefined {
    const sourceFile = ts.createSourceFile('temp.ts', sourceCode, ts.ScriptTarget.Latest, true);
    let parameters: string[] | undefined;

    function visit(node: ts.Node) {
        if (ts.isFunctionDeclaration(node) && node.modifiers?.some(m => m.kind === ts.SyntaxKind.DefaultKeyword)) {
            // Assuming the default export is a function declaration
            parameters = node.parameters.map(param => param.name.getText());
        } else if (ts.isExportAssignment(node)) {
            // Handle the case where the default export is an expression e.g., export default () => {}
            if (ts.isFunctionLike(node.expression)) {
                parameters = node.expression.parameters.map(param => param.name.getText());
            }
        }
        ts.forEachChild(node, visit);
    }

    ts.forEachChild(sourceFile, visit);
    return parameters;
}

export default async function bundleUserCode(scriptId:string, code: string, isJavaScript: boolean = false) {
    if (!fs.existsSync(tempDir)) {
        await fs.mkdirSync(tempDir);
    }    

    const ranString = nanoid();
    const inFile = path.join(tempDir, `entry-${ranString}${isJavaScript ? '.js' : '.ts'}`);
    const outFile = path.join(tempDir, `output-${ranString}.js`);

    await fs.writeFileSync(inFile, code)

    const dependencies = await extractDependencies(code, isJavaScript);
    await installDependencies(dependencies);

    var codeInfo: TypeInfo = {
        parameters: [],
        returnType: undefined,
        envVariables: []
    }

    if(isJavaScript == true){
        const parameters = extractDefaultExportParameters(code); 
        const envVariables = extractEnvVariables(code);
        codeInfo.parameters = parameters?.map(param => ({ name: param, type: undefined })) || [];  
        codeInfo.envVariables = envVariables;
    }else{
        const result = await analyzeTSFile(inFile);
        if(result){
            codeInfo = result;
        }else{
            throw new Error('Failed to analyze the code');
        }
    }
    
    try {
        await esbuild.build({
            entryPoints: [inFile],
            minify: true,//Set to true for production
            bundle: true,
            platform: 'node',
            format: 'iife',
            globalName: 'func',
            outfile: outFile,
            loader: {
                '.ts': 'ts',
                '.js': 'js'
            }
        });

        fs.unlinkSync(inFile);

        const bundleURL = await uploadFunction(outFile);
        fs.unlinkSync(outFile);

        if(bundleURL.success){
        const result = await prisma.script.update({
            where: {
                id: scriptId
            },
            data: {
                rawCode: code,
                devCompiledURL: bundleURL.message as string,
                params: codeInfo.parameters,
                envVars: codeInfo.envVariables,
                returnType: codeInfo.returnType
            }
        });
        return {success: true, message: result};
        }
        else{
            return {success: false, message: "Failed to upload the file to cloud storage"};
        }
    } catch (error) {
        console.error('Error during bundling:', error);
    }
}
