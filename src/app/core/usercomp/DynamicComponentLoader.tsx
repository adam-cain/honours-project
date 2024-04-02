// "use client";

// import React, { useState, useEffect } from 'react';
// import { fetchConfig } from './fetchconfig';

// // Simulated CommonJS environment for the dynamic module
// // Assuming the bundled component sets itself as `window.AnotherComponent`
// async function loadAndAppendScript(url: string) {
//     return new Promise((resolve, reject) => {
//       const script = document.createElement('script');
//       script.src = url;
//       script.onload = () => resolve(window.AnotherComponent);
//       script.onerror = (error) => reject(error);
//       document.head.appendChild(script);
//     });
//   }
  
//   const DynamicComponentLoader: React.FC = () => {
//     const [Component, setComponent] = useState<React.ComponentType | null>(null);
  
//     useEffect(() => {
//       fetchConfig().then(async (config) => {
//         try {
//           const component = await loadAndAppendScript(config.componentUrl);
//           setComponent(() => component);
//         } catch (error) {
//           console.error('Error loading the component', error);
//         }
//       });
//     }, []);
  
//     if (!Component) {
//       return <div>Loading component...</div>;
//     }
  
//     // Assuming your component can be rendered directly
//     return <React.Fragment>{React.createElement(Component)}</React.Fragment>;
//   };
  
//   export default DynamicComponentLoader;
  