// interface Config {
//     componentUrl: string;
//   }

// async function loadComponent(config: Config) {
//     const { componentUrl } = config;
//     try {
//       const module = await import(componentUrl);
//       console.log(module.default);
//       return module.default; // Assuming the module exports a component as default
//     } catch (error) {
//       console.error('Failed to load component', error);
//       return null;
//     }
//   }
  
//   export { loadComponent };