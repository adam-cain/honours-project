import React, { useEffect, useState, FC } from 'react';

type DynamicComponentLoaderProps = {
  componentUrl: string;
};

const DynamicComponentLoader: FC<DynamicComponentLoaderProps> = ({ componentUrl }) => {
  // Define a state to hold the dynamically loaded component
  // The component is of type React.ComponentType<any> | null initially
  const [Component, setComponent] = useState<React.ComponentType<any> | null | undefined>(null);

  useEffect(() => {
    const loadComponent = async () => {
      try {
        const response = await fetch(componentUrl);
        const code = await response.text();
        // Using new Function to evaluate the fetched code.
        // The evaluated code is expected to return a React component.
        // Note: This poses a significant security risk if the code is not trusted.
        const Module = new Function('React', `${code}; return Component;`);
        setComponent(() => Module(React));
      } catch (error) {
        console.error('Failed to load component:', error);
      } 
    };

    loadComponent();
  }, [componentUrl]);

  // Rendering the dynamically loaded component if available, else showing a loading state
return Component
};

export default DynamicComponentLoader;
