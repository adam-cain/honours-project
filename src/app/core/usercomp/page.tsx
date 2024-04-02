"use client"
import React, { useEffect, useState } from 'react';
import { transform } from '@babel/standalone';

function LoadingComponent() {
    return (<div>Loading dynamic component....</div>);
}

const DynamicComponentLoader = () => {
    const [component, setComponent ]= useState(LoadingComponent);
  useEffect(() => {
    async function loadAndExecuteComponent() {
      // Replace the URL with your actual cloud storage URL
      const fileUrl = 'https://umgn7lure7vaypuk.public.blob.vercel-storage.com/Components/AnotherComponent-TOQvanoSG9k8mWBjVPZvizwtApAYRe.tsx';
      
      try {
        const response = await fetch(fileUrl);
        const tsxContent = await response.text();

        // Transpile TSX to JS using Babel
        const { code } = transform(tsxContent, {
          presets: ['typescript', 'react'],
          filename: 'component.js'
        });

        // Dynamically execute the transpiled code.
        // This is risky and should be done with caution.
        setComponent(new Function(code as string)())
      } catch (error) {
        console.error('Failed to load or execute the component', error);
      }
    }

    loadAndExecuteComponent();
  }, []);

  return component;
};

export default DynamicComponentLoader;
