"use client";
import { useState } from "react";

export function CodeBlock({ code, language, result }: { code: string; language: string; result?: string }) {
  const [collapsed, setCollapsed] = useState(true);

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  // Adding style object to conditionally set display property
  const paragraphStyle = {
    display: collapsed ? "none" : "block", // Hide paragraph if collapsed is true, else show it
  };

  return (
    <div className="w-full rounded-md m-2 bg-gray-600">
      <div className="flex flex-row justify-between bg-gray-800 rounded-md p-3">
        <h2>{language}</h2>
        <button onClick={handleCollapse}>{collapsed ? "Show" : "Hide"}</button>
      </div>
      <div className="rounded-b-md" style={paragraphStyle}>
        <p className=" p-3">{code}</p>
        {
          result ?
            <div className="bg-gray-700 p-3 rounded-b-md">
              <p className=" text-sm">Result:</p>
              <p>{result}</p>
            </div>
            :
            <></>
        }
      </div>
    </div>
  );
}
