"use client"
// components/CodeEditor.tsx
import React from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Info, Save, UploadCloudIcon } from 'lucide-react';
import { Title } from '@/components/PageComponents';
import { Button } from '@/components/ui/button';
import { Script } from "@prisma/client";

interface CodeEditorProps {
    params: { 
        script: string, 
        team: string
    }
    language: "javascript" | "typescript";
    defaultValue?: string;
    onChange?: (value: string | undefined) => void;
    script: Script
}

const CodeEditor: React.FC<CodeEditorProps> = ({
    language,
    defaultValue,
    onChange,
    params,
    script
}) => {

    const handleEditorChange = (value: string | undefined, event: any) => {
        if (onChange) {
            onChange(value);
        }
    };

    return (
        <div>
        <div className="flex w-full flex-row justify-between mb-2">
            <div className='flex flex-row gap-2'>
                <Title>{params.script}</Title>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger><Info className='size-5'/></TooltipTrigger>
                        <TooltipContent>
                            <p>{script.description}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <div className='flex flex-row gap-2'>
                <Button className='gap-1'>Save <Save className='size-5'/></Button>
                <Button className='gap-1'>Publish<UploadCloudIcon className='size-5'/></Button>
            </div>
        </div>
        <div>
<Editor
    className="rounded-lg"
      height="90vh" // Adjust the height as needed
      defaultLanguage={language}
      defaultValue={defaultValue}
      onChange={handleEditorChange}
      theme="vs-dark" // You can choose other themes
      options={{
        minimap: { enabled: false },
        // Add more options based on your requirements
      }}
    />
    </div>
    </div>
    );
};

export default CodeEditor;
