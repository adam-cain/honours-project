
//use the shell to install the package
// pages/api/[packageName].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as ivm from 'isolated-vm';

const execAsync = promisify(exec);

async function installPackage(packageName: string): Promise<void> {
  const { stdout, stderr } = await execAsync(`npm install ${packageName}`);
  console.log('NPM Install stdout:', stdout);
  console.error('NPM Install stderr:', stderr);
}

async function runInIsolate(packageName: string, res: NextApiResponse) {
  const isolate = new ivm.Isolate({ memoryLimit: 128 });
  const context = await isolate.createContext();
  const jail = context.global;

  await jail.set('global', jail.derefInto());

  // Assuming the package exports a function named `run`
  // Adjust this code to match the actual package API
  try {
    const module = await import(packageName);
    const functionCode = module.run.toString();
    
    // Transfer the function code into the isolate
    await context.eval(`global.run = ${functionCode}`);

    // Execute the function within the isolate
    await context.eval('run()').then(result => {
      res.status(200).json({ result });
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to execute the package function in the isolate.' });
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { packageName } = req.query;

  if (typeof packageName !== 'string') {
    res.status(400).json({ error: 'Invalid package name.' });
    return;
  }

  try {
    await installPackage(packageName);
    await runInIsolate(packageName, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to install or execute the package.' });
  }
}