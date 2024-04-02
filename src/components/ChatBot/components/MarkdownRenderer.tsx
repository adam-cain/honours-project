// components/MarkdownRenderer.tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Components } from 'react-markdown';

interface MarkdownRendererProps {
  markdown: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown }) => {
  const customRenderers: Partial<Components> = {
    h1: ({ node, ...props }) => <h1 className="text-3xl font-bold my-4" {...props} />,
    h2: ({ node, ...props }) => <h2 className="text-2xl font-bold my-4" {...props} />,
    h3: ({ node, ...props }) => <h3 className="text-xl font-bold my-3" {...props} />,
    p: ({ node, ...props }) => <p className="my-2" {...props} />,
    a: ({ node, ...props }) => <a className="text-blue-500 hover:text-blue-700 transition duration-150 ease-in-out" {...props} />,
    code: ({ node, className, ...props }) => {
        const isCodeBlock = className ? true : false; // Assuming code blocks have a className
        if (isCodeBlock) {
          // Render as a code block
          const match = /language-(\w+)/.exec(className || '');
          return (
            <pre className={`language-${match ? match[1] : 'plaintext'} w-full my-2 p-4 rounded-lg bg-gray-800 text-white overflow-x-scroll`}>
              <code {...props} />
            </pre>
          );
        } else {
          // Render as inline code
          return (
            <code className="px-2 py-1 bg-gray-800 text-white rounded" {...props} />
          );
        }
      },
    ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2" {...props} />,
    ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2" {...props} />,
    li: ({ node, ...props }) => <li className="my-1" {...props} />,
    blockquote: ({ node, ...props }) => <blockquote className="pl-4 border-l-4 border-gray-500 italic my-4" {...props} />,
    hr: ({ node, ...props }) => <hr className="my-4 border-gray-300" {...props} />,
    table: ({ node, ...props }) => <table className="min-w-full border-collapse border border-gray-400 my-4" {...props} />,
    thead: ({ node, ...props }) => <thead className="bg-gray-200" {...props} />,
    tbody: ({ node, ...props }) => <tbody {...props} />,
    tr: ({ node, ...props }) => <tr className="border-b border-gray-400" {...props} />,
    th: ({ node, ...props }) => <th className="text-left px-4 py-2 border-r border-gray-400" {...props} />,
    td: ({ node, ...props }) => <td className="px-4 py-2 border-r border-gray-400" {...props} />,
    em: ({ node, ...props }) => <em className="italic" {...props} />,
    strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
    // Add more custom renderers as needed for other elements
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={customRenderers}
    >
      {markdown}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
