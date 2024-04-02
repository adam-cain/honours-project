// utils/transpile.ts

import { transform } from '@babel/standalone';

export async function fetchAndTranspile(url: string): Promise<string> {
    const response = await fetch(url);
    const code = await response.text();
  
    const transpiledCode = transform(code, {
        presets: ['env', 'react', 'typescript'],
        filename: 'component.tsx'
      }).code;
      
    console.log(transpiledCode);
    
  return transpiledCode || "";
}
