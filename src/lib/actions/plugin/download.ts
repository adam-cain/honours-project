// Download the package tarball and extract it to a temporary directory
// pages/api/execute-package.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Isolate } from 'isolated-vm';
import { exec } from 'child_process';
import { promisify } from 'util';
import axios from 'axios';
import { mkdtemp, realpath } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';

const execAsync = promisify(exec);

async function fetchPackageTarballUrl(packageName: string): Promise<string> {
  const response = await axios.get(`https://registry.npmjs.org/${packageName}/latest`);
  return response.data.dist.tarball;
}

async function installPackage(packageName: string): Promise<string> {
  const tmpDir = await mkdtemp(path.join(tmpdir(), 'npm-'));
  const tarballUrl = await fetchPackageTarballUrl(packageName);
  await execAsync(`cd ${tmpDir} && npm install ${tarballUrl}`);
  return realpath(`${tmpDir}/node_modules/${packageName}`);
}

async function executePackage(req: NextApiRequest, res: NextApiResponse) {
  try {
    const packageName = req.query.packageName as string;
    const packagePath = await installPackage(packageName);

    const isolate = new Isolate({ memoryLimit: 128 });
    const context = await isolate.createContext();
    const jail = context.global;

    await jail.set('global', jail.derefInto());

    // Example: Load and execute a specific function from the package
    // This assumes the package exports a function named `exampleFunction`
    const modulePath = `${packagePath}`;
    const moduleCode = await import(modulePath);
    const result = moduleCode.exampleFunction();

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to execute the package', details: error });
  }
}

export default executePackage;