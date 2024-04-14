"use server"
import ivm, { Isolate } from 'isolated-vm';

import { KeyValue, KeyValueWithDataType } from '@/components/Script/code-editor';

const processArgs = (args: KeyValueWithDataType[]) => {
  return args.map((arg) => {
    if (arg.type === 'number') {
      return Number(arg.value);
    } else if (arg.type === 'boolean') {
      return arg.value === 'true';
    }
    else if(arg.type === 'object'){
      return JSON.parse(arg.value);
    }
    else {
      return arg.value;
    }
  });
}

export default async function runBundle(bundleURL: string, args: KeyValueWithDataType[] = [], envVariables: KeyValue[] = []) {
  const bundleCode = await fetch(bundleURL).then(async (res) => {
    return await res.text();
  })

  if (!bundleCode) {
    return { success: false, message: "Failed to download the file from cloud storage" };
  }
  const processedArgs = processArgs(args);


  console.log('Running the bundle');

  const isolate = new Isolate({ memoryLimit: 128 });
  const context = await isolate.createContext();
  const global = context.global;

  await global.set('global', global.derefInto());
  const loggedDataStore: KeyValue[] = [];

  await addLogging(context,loggedDataStore);
  await addFetch(context);
  await setEnvironmentVariables(context, envVariables);

  try{
    const script = await isolate.compileScript(bundleCode);
    await script.run(context);
  
    const result = await context.evalClosure(
      `return global.func.default(...$0)`,
      [processedArgs],
      { arguments: { copy: true }, result: { promise: true, copy: true } }
    );
    console.log(typeof result, result)
    loggedDataStore.push({ key: 'result', value: result });
    return { success: true, message: loggedDataStore };
  } catch (error) {
    loggedDataStore.push({ key: 'error', value: error });
    return { success: false, message: loggedDataStore };
  }
}

async function setEnvironmentVariables(context: ivm.Context, envVariables: { [key: string]: any }) {
  // Create an empty object and assign it to global.env if it does not already exist
  await context.global.set('env', new ivm.Reference({}), { promise: true });

  // Get the reference to the env object
  const env = await context.global.get('env', { reference: true });

  // Set environment variables
  for (const key in envVariables) {
    await env.set(envVariables[key].key, new ivm.ExternalCopy(envVariables[key].value).copyInto());
  }
}

async function addLogging(context: ivm.Context, loggedDataStore: KeyValue[]) {
  await context.evalClosure(`
      global.console = { 
        log: function(...args) { 
          $0.applySync(undefined, args, { arguments: { copy: true } }); 
        },
        error: function(...args) {
          $1.applySync(undefined, args, { arguments: { copy: true } }); }
        }
    `, [
    function (...args: any) {
      console.log("log:", ...args);
      loggedDataStore.push({ key: 'log', value: args })
    },
    function (...args: any) {
      console.error("err:", ...args);
      loggedDataStore.push({ key: 'error', value: args })
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
