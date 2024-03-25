"use server"

import * as ivm from "isolated-vm";

export async function runCode(userCode: string, args: any[] = []) {
  const isolate = new ivm.Isolate({ memoryLimit: 128 });
  const context = await isolate.createContext();
  await context.global.set('global', context.global.derefInto());

  // Define and set global variables
// Example:
//   const myGlobalConstant = new ivm.ExternalCopy('This is a global constant').copyInto();
//   await context.global.set('myConstant', myGlobalConstant);

  // Define and set global functions
  await addFetch(context);
  await addLogging(context);

  // Load the user function into the isolate
  await context.eval(`global.userFunction = ${userCode};`);

  // Execute the user function with arguments and capture the result
  try{
    const result = await context.evalClosure(
        `
        return (async () => {
          try {
            const result = await global.userFunction(...$0);
            return { success: true, result: result };
          } catch (error) {
            return { success: false, error: error.message };
          }
        })();
      `
      , [args], { arguments: { copy: true }, result: { promise: true, copy: true } });
      if(result.success) {
        return result.result;
      } else {
        console.error(result.error);
        return result.error;
      }
  } catch (error) {
    return error;
  }
}

async function addLogging(context: ivm.Context) {
  await context.evalClosure(`
    globalThis.console = { 
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

async function addFetch(context: ivm.Context) {
  await context.evalClosure(`
  globalThis.fetch = async function(url) {
      return $0.apply(undefined, [url], { arguments: { copy: true }, result: { promise: true, copy: true } });
  };
`, [async function (url: string) {
    // Implement URL validation to ensure it's a URL you're willing to fetch from
    if (url.startsWith('https://example.com')) {
      throw new Error('URL is not allowed');
    }

    // Fetch data with a timeout to prevent abuse
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout

    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) {
        throw new Error(`Fetch failed: ${response.statusText}`);
      }
      
      const data = await response.text(); // Consider limiting the size of the response
      return await data;
    } catch (error: any) {
      throw new ivm.ExternalCopy(error.message).copyInto();
    } finally {
      clearTimeout(timeoutId);
    }
  } ], { arguments: { reference: true } });
}
