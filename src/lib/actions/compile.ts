"use server"

import { buildSync } from 'esbuild';

export async function uploadComponent() {
    const sourceCode = `const MyComponent = () => <div>Hello World</div>; export default MyComponent;`;
    const filename = 'MyComponent.tsx';
  
    const compiledComponent = compileComponent(sourceCode, filename);
    console.log(compiledComponent);
    
    return compiledComponent
};

function compileComponent(sourceCode: string, filename: string): string {
    const extension = filename.split('.').pop();
    const loader = extension === 'tsx' ? 'tsx' : 'jsx';
  
    const result = buildSync({
      entryPoints: ['input.tsx'], // Placeholder, actual input is via stdin
      bundle: true,
      write: false,
      minify: true,
      platform: 'browser',
      format: 'esm',
      loader: { '.js': loader, '.ts': loader },
      stdin: {
        contents: sourceCode,
        resolveDir: process.cwd(),
        loader,
      },
    });
  
    return result.outputFiles[0].text;
  }
