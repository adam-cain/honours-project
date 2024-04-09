"use server"
import ivm, { Isolate } from 'isolated-vm';
import fs from 'fs';

export async function executeInIsolatedVm(bundlePath: string, args: any[] = []) {
    //WIP: Download the file from cloud storage

    const bundleCode = fs.readFileSync(bundlePath, 'utf8');

    const isolate = new Isolate({ memoryLimit: 128 });
    const context = await isolate.createContext();
    const global = context.global;

    await global.set('global', global.derefInto());
    await addLogging(context);
    await addFetch(context);

    // Load the bundled code into the isolate
    const script = await isolate.compileScript(bundleCode);
    await script.run(context);

    const result = await context.evalClosure(
        `return global.func.default(...$0)`,
        [args],
        { arguments: { copy: true }, result: { promise: true, copy: true } }
    );

    console.log(result);
    return result;
}

async function addLogging(context: ivm.Context) {
    await context.evalClosure(`
      global.console = { 
        log: function(...args) { 
          $0.applySync(undefined, args, { arguments: { copy: true } }); },
        error: function(...args) {
          $0.applySync(undefined, args, { arguments: { copy: true } }); }
        }
    `, [
        function (...args: any) {
            console.log(...args);
        },
        function (...args: any) {
            console.error(...args);
        }
    ], { arguments: { reference: true } });
}

  interface FetchOptions {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
    timeout?: number; // Add timeout to the options
}

  async function addFetch(context: ivm.Context) {
    await context.evalClosure(`
    globalThis.fetch = async function(url, options = {}) {
        // Pass options including method, headers, and body to the external fetch function
        return $0.apply(undefined, [url, options], { arguments: { copy: true }, result: { promise: true, copy: true } });
    };
  `, [async function (url: string, options: FetchOptions) {
      // Enhanced URL validation to ensure it's a URL you're willing to fetch from
      const allowedDomains = ['https://example.com', 'https://api.example.org', 'http://api.weatherapi.com'];
      const urlObject = new URL(url);
      if (!allowedDomains.some(domain => urlObject.origin === domain)) {
        throw new Error('URL is not allowed');
      }
      
      // Enforce a default method if none is provided
      options.method = options.method || 'GET';

      // Set up fetch options, including method, headers, and body
      const fetchOptions: RequestInit = {
        method: options.method,
        headers: options.headers,
        body: options.body,
        signal: null, // This will be set below with the AbortController
      };

      // Fetch data with a configurable timeout to prevent abuse
      const timeoutDuration = options.timeout || 5000; // Default timeout to 5 seconds if not specified
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);
      fetchOptions.signal = controller.signal;
      
      try {
        const response = await fetch(url, fetchOptions);
        if (!response.ok) {
          throw new Error(`Fetch failed: ${response.statusText}`);
        }
        
        // Automatically parse JSON response if content-type is application/json
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return response.json(); // Return a Promise resolving to JSON
        }

        // Return text for other content types
        return response.text();
      } catch (error: any) {
        throw new ivm.ExternalCopy(error.message).copyInto();
      } finally {
        clearTimeout(timeoutId);
      }
    }], { arguments: { reference: true } });
}
