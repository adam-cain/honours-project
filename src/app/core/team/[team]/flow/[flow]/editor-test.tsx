const params = [
    { name: "city", type: "string" },
    { name: "date", type: "string" }
]

const output = `{"date":"2024-04-19 5:40","city":"London","country":"United Kingdom","condition":"Overcast","temp_c":10,"precip_mm":0.13}`

//London
//2023-01-01

import { Title } from "@/components/PageComponents";
import { useEditor } from "./editor-provider";
import { Button } from "@/components/ui/button";
import { ServerCogIcon } from "lucide-react";
import { useState } from "react";

export default function EditorTest() {
    const { state } = useEditor();
    const hasInput = state.editor.elements.some(node => node.type === 'Input');
    const [showOutput, setshowOutput] = useState(false)
    return (
        <div>
            {hasInput ?
                <div className="flex flex-col gap-y-3">
                    {params.map((param,key) => (
                        <div key={key} className="w-full">
                            <div>{param.name}:</div>
                            <div className="flex flex-row">
                                <input type="text" placeholder={param.name} className="rounded-l-md border px-2 py-1 text-sm placeholder:text-stone-400 w-full focus:outline-none border-stone-600 bg-black text-white placeholder-stone-700 focus:ring-white" />
                                <div className="rounded-r-md border-y border-r px-2 py-1 text-sm right-0 bg-stone-700 border-stone-600">{param.type}</div>
                            </div>
                        </div>
                    ))}
                    <Button onClick={() => setshowOutput(true)} className='gap-1 w-full '>Run Test<ServerCogIcon className='size-5' /></Button>
                    {showOutput && <div className="w-full flex flex-col">
                        <Title>Output:</Title>
                        {output}
                    </div>}
                </div>
                :
                    <div className="w-full h-[500px] flex flex-col justify-center items-center">
                        <Title className="text-center">An Input Node is Required to test</Title>
                    </div>
            }
                </div>
    );
}