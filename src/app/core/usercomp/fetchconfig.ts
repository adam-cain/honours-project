interface Config {
    componentUrl: string;
  }
  
  // Function to fetch configuration
  async function fetchConfig(): Promise<Config> {
    // const response = await fetch('https://example.com/config.json');
    // if (!response.ok) {
    //   throw new Error('Failed to fetch configuration');
    // }
    // return response.json();
    return {
        "componentUrl": "https://umgn7lure7vaypuk.public.blob.vercel-storage.com/Components/AnotherComponent-TOQvanoSG9k8mWBjVPZvizwtApAYRe.tsx"
      }
      
  }
  
export { fetchConfig };