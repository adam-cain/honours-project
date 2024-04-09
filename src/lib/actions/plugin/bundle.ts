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

const execAsync = promisify(exec);

async function installDependencies(dependencies: string[]): Promise<void> {
    if (dependencies.length === 0) return;
    const packagesString = dependencies.join(' ');
    const { stdout, stderr } = await execAsync(`npm install ${packagesString}`);
    if (stderr) console.error('NPM Install error:', stderr);
}

async function extractDependencies(code: string, isTypeScript: boolean = false): Promise<string[]> {
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

    if (isTypeScript) {
        // Assuming all imports in TypeScript files could have corresponding @types/ packages
        const typeDependencies = dependencies.map(dep => `@types/${dep.replace(/[^a-zA-Z0-9_]/g, "__")}`);
        return dependencies.concat(typeDependencies);
    }

    return dependencies;
}

export default async function bundleUserCode(code: string, isTypeScript: boolean = false) {
    if (!fs.existsSync(tempDir)) {
        await fs.mkdirSync(tempDir);
    }

    const dependencies = await extractDependencies(code, isTypeScript);
    await installDependencies(dependencies);

    const ranString = Math.random().toString(36).substring(7);
    const inFile = path.join(tempDir, `entry-${ranString}${isTypeScript ? '.ts' : '.js'}`);
    const outFile = path.join(tempDir, `output-${ranString}.js`);

    await fs.writeFileSync(inFile, code)

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
        // Need a way of saving current file made by user before deleting it
        fs.unlinkSync(inFile);
        // Clean up the input file after bundling
        //WIP: Upload the file to a cloud storage
        const result = uploadFunction(outFile, nanoid());

        return result;
    } catch (error) {
        console.error('Error during bundling:', error);
    }
}
