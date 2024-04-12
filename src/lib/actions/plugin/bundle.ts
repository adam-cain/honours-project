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

function extractEnvVariables(sourceCode: string): string[] {
    const sourceFile = ts.createSourceFile('temp.ts', sourceCode, ts.ScriptTarget.Latest, true);
    const envVariables: string[] = [];

    function visit(node: ts.Node) {
        if (ts.isPropertyAccessExpression(node)) {
            // Check if the left side of the property access is an identifier named 'env'
            if (node.expression.kind === ts.SyntaxKind.Identifier && node.expression.getText() === 'env') {
                envVariables.push(node.name.getText());
            }
        }
        ts.forEachChild(node, visit);
    }

    ts.forEachChild(sourceFile, visit);
    return envVariables;
}

export default async function bundleUserCode(scriptId:string, code: string, isJavaScript: boolean = false) {
    if (!fs.existsSync(tempDir)) {
        await fs.mkdirSync(tempDir);
        console.log('\n\n\n\n\n\n\nCreated temp directory', tempDir);
    }
    console.log(tempDir);
    

    const dependencies = await extractDependencies(code, isJavaScript);
    console.log('Dependencies:', dependencies);
    
    await installDependencies(dependencies);

    const ranString = Math.random().toString(36).substring(7);
    const inFile = path.join(tempDir, `entry-${ranString}${isJavaScript ? '.js' : '.ts'}`);
    const outFile = path.join(tempDir, `output-${ranString}.js`);

    await fs.writeFileSync(inFile, code)

    const parameters = extractDefaultExportParameters(code); 
    const envVariables = extractEnvVariables(code);
    console.log(envVariables);
    
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
                params: parameters?.join(','),
                envVars: envVariables.join(',')
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
