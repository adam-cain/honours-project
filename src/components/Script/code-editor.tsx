"use client"
import React, { MouseEventHandler, useEffect, useMemo, useRef, useState } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Dot, Info, Save, UploadCloudIcon, ServerCogIcon } from 'lucide-react';
import { Title } from '@/components/PageComponents';
import { Button } from '@/components/ui/button';
import { Script } from "@prisma/client";
import { Badge } from "../ui/badge";
import bundleUserCode from "@/lib/actions/plugin/bundle"
import runBundle from "@/lib/actions/plugin/runBundle";
// import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "../ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from '@/components/ui/resizable'

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

export interface KeyValue {
    key: string;
    value: any;
}

export interface KeyValueWithDataType extends KeyValue {
    type: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
    language,
    defaultValue,
    onChange,
    params,
    script
}) => {
    const [editorWidth, setEditorWidth] = useState("50%");
    const [editorHeight, setEditorHeight] = useState("100%");
    const [isDragging, setIsDragging] = useState(false);
    const [isTestingVisible, setIsTestingVisible] = useState(true);
    const contentRef = useRef<HTMLDivElement>(null);
    const [code, setCode] = useState<string | undefined>(defaultValue);
    const [output, setOutPut] = useState<KeyValue[]>([]);
    const [paramValues, setParamValues] = useState<KeyValueWithDataType[]>(() =>
        script.params ? script.params.split(",").map((param: string) => ({ key: param, value: "", type: "string" })) : []
    );
    const dataTypes = ["string", "number", "boolean", "object"];

    const handleParamChange = (index: number, field: keyof KeyValueWithDataType, value: string) => {
        const updatedParams = [...paramValues];
        updatedParams[index][field] = value;
        setParamValues(updatedParams);
        console.log(updatedParams);
    };

    const [envVarValues, setEnvVarValues] = useState<KeyValue[]>(() =>
        script.envVars ? script.envVars.split(",").map((envVar: string) => ({ key: envVar, value: "" })) : []
    );

    const handleEnvVarChange = (index: number, value: string) => {
        const updatedEnvVars = [...envVarValues];
        updatedEnvVars[index].value = value;
        setEnvVarValues(updatedEnvVars); // Update the state with the new array
    };

    useEffect(() => {
        const handleResize = () => {
            setEditorHeight(`${window.innerHeight - 150}px`);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleEditorWillMount = (monacoInstance: Monaco) => {
        monacoInstance.editor.defineTheme('transparentDark', {
            base: "vs-dark", // can also be vs-light or hc-black
            inherit: true,
            rules: [{ token: '', background: '#000000' }],
            colors: {
                'editor.background': '#000000',
            }
        });
    };

    const handleEditorChange = (value: string | undefined, event: any) => {
        setCode(value);
        if (onChange) {
            onChange(value);
        }
    };

    const startDragging = () => setIsDragging(true);
    const stopDragging = () => setIsDragging(false);
    const toggleTestingVisibility = () => setIsTestingVisible(!isTestingVisible);

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !contentRef.current) return;
        const sidebarWidth = contentRef.current.getBoundingClientRect().left;
        let newWidth = e.clientX - sidebarWidth;

        // Define the minimum and maximum width constraints (for example, between 300px and 800px)
        const minWidth = 250;
        const maxWidth = contentRef.current.offsetWidth - 200; // assuming 100px is reserved for other content

        // Apply constraints
        if (newWidth < minWidth) {
            newWidth = minWidth;
        } else if (newWidth > maxWidth) {
            // newWidth = maxWidth;
        }
        console.log(newWidth, maxWidth);

        setEditorWidth(`${newWidth}px`);
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", stopDragging);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", stopDragging);
        };
    });

    const onSave = async () => {
        toast.loading("Saving and Compiling Script");
        if (code) {
            console.log(code);

            const result = await bundleUserCode(script.id, code, language === "javascript");
            script.devCompiledURL = result?.message.devCompiledURL as string;
            if (result?.success) {
                const updatedData = result.message as Script;
                script.devCompiledURL = updatedData.devCompiledURL

                setParamValues(prevParams => {
                    const newParams = updatedData.params ? updatedData.params.split(",").map((param: string) => ({
                        key: param,
                        value: prevParams.find(p => p.key === param)?.value || ""
                    })) : [];
                    return newParams;
                });

                setEnvVarValues(prevEnvVars => {
                    const newEnvVars = updatedData.envVars ? updatedData.envVars.split(",").map((envVar: string) => ({
                        key: envVar,
                        value: prevEnvVars.find(e => e.key === envVar)?.value || ""
                    })) : [];
                    return newEnvVars;
                });
                toast.dismiss();
                toast.success("Script saved and compiled successfully");
            } else {
                toast.dismiss();
                toast.error("Failed to save and compile script: " + result?.message);
                console.log(result?.message);
            }
        }
    };

    const onRunTest = async () => {
        toast.loading("Running Test");
        if (script.devCompiledURL) {
            const result = await runBundle(script.devCompiledURL, paramValues, envVarValues);
            console.log(result);
            if (result.success) {
                setOutPut(result.message as KeyValue[]);
                toast.dismiss();
                toast.success("Test ran successfully");
            } else {
                toast.dismiss();
                toast.error("Failed to run test: " + result.message);
                console.log(result.message);
            }
        } else {
            toast.dismiss();
            toast.error("Failed to run test: Script not compiled");
        }
    }

    return (
        <div ref={contentRef}>
            <div className="flex w-full flex-row justify-between mb-2">
                <div className='flex flex-row gap-2'>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger><Info className='size-5' /></TooltipTrigger>
                            <TooltipContent>
                                <p>{script.description}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <Title>{params.script}</Title>
                    <Badge variant={"outline"}
                        className={`my-auto border-none
                             ${script.isJavascript ? " bg-yellow-300 text-black" : " bg-blue-600 text-white"}`}>
                        {script.isJavascript ? ".js" : ".ts"}</Badge>
                </div>
                <div className='flex flex-row gap-2'>
                    <Savebutton onClick={onSave} />
                    <Button className='gap-1'>Publish<UploadCloudIcon className='size-5' /></Button>
                    <Button onClick={toggleTestingVisibility}>
                        Toggle Testing Panel
                    </Button>
                </div>
            </div>
            <div className="flex flex-row w-full h-full overflow-hidden max-h-[85vh] border rounded-lg">
                <Editor
                    height={editorHeight}
                    width={isTestingVisible ? editorWidth : "100%"} defaultLanguage={language}
                    defaultValue={defaultValue}
                    onChange={handleEditorChange}
                    beforeMount={handleEditorWillMount}
                    theme="transparentDark"
                    options={{
                        minimap: { enabled: false },
                        wordWrap: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                    }}
                />

                <div onMouseDown={startDragging}
                    className={`${isTestingVisible ? '' : 'hidden'} transition-all duration-500 ease-in-out cursor-col-resize flex-none w-2 bg-secondary justify-center flex flex-col
                `} >
                    <Dot className="text-gray-50 -translate-x-1/3 translate-y-8" />
                    <Dot className="text-gray-50 -translate-x-1/3" />
                    <Dot className="text-gray-50 -translate-x-1/3 -translate-y-8" />
                </div>

                <div className={`flex flex-col flex-shrink p-4 w-full max-h-[85vh] max-w-[90vh] transition-all duration-500 ease-in-out ${isTestingVisible ? '' : 'max-w-0 overflow-hidden hidden'}`}>
                    {isTestingVisible && (<>
                        {script.devCompiledURL ? (
                            <>
                                {paramValues.length !== 0 ?
                                    <div className="gap-2 flex flex-col mb-2">
                                        <Title className="text-lg">Parameters:</Title>
                                        {paramValues.map((param, index) => (
                                            <div key={index} className="flex flex-row gap-2 my-2 items-center justify-between w-full h-8">
                                                <label>{`${param.key}:`}</label>
                                                <div className="flex flex-row">
                                                    <Input
                                                        type="text"
                                                        value={param.value}
                                                        placeholder={param.key}
                                                        onChange={(e) => handleParamChange(index, 'value', e.target.value)}
                                                        className="rounded-r-none"
                                                    />
                                                    <Select value={param.type} onValueChange={(value) => handleParamChange(index, 'type', value)}>
                                                        <SelectTrigger className="w-[190px] rounded-l-none">
                                                            <SelectValue placeholder="Datatype" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectLabel>Datatypes</SelectLabel>
                                                                {dataTypes.map(type => (
                                                                    <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                                                                ))}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        ))}</div> : null
                                }
                                {envVarValues.length !== 0 ?
                                    <>
                                        <div className="gap-2 flex flex-col mb-2">
                                            <Title className="text-lg">Environment Variables:</Title>
                                            {envVarValues.map((envVar, index) => (
                                                <div key={index} className="flex flex-row gap-2 my-2 items-center justify-between w-full">
                                                    <label>{envVar.key + ":"}</label>
                                                    <Input
                                                        type="text"
                                                        value={envVar.value}
                                                        placeholder={envVar.key}
                                                        onChange={(e) => handleEnvVarChange(index, e.target.value)}
                                                        className="rounded-r-none"
                                                    />
                                                </div>
                                            ))}</div></> : null
                                }
                                <Button onClick={onRunTest} className='gap-1 w-full '>Run Test<ServerCogIcon className='size-5' /></Button>

                                {output ?
                                    <>
                                        <Title className="text-xl my-2">Output</Title>
                                        <Table className="overflow-y-scroll flex-shrink overflow-x-hidden">
                                            <TableBody className="overflow-y-scroll flex-shrink overflow-x-hidden">
                                                {output.map((row, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell className="max-w-fit">{<OutputSymbol value={row.key} />}</TableCell>
                                                        <TableCell className="pl-6">{row.value}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </>
                                    : null}
                            </>
                        ) : (
                            <div className="size-full flex items-center justify-center flex-col gap-2 border rounded text-center">
                                <Title>Unable to Test</Title>
                                <p>You need to save your script to test</p>
                                <Savebutton onClick={onSave} />
                            </div>
                        )}</>)}
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;

function OutputSymbol({ value }: { value: string }) {
    switch (value) {
        case "error":
            return <Info className='size-5 text-red-500' />;
        case "log":
            return <Info className='size-5 text-orange-300' />;
        default:
            return <Info className='size-5' />;
    }
}

interface SaveButtonProps {
    onClick: MouseEventHandler<HTMLButtonElement>;
}

function Savebutton({ onClick }: SaveButtonProps) {
    return (
        <Button onClick={onClick} className='gap-1'>Save & Compile<Save className='size-5' /></Button>
    )
}