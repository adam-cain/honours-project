import React, { useEffect, useState } from 'react';
import { useModal } from './provider';
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { Plus, XIcon } from 'lucide-react';
import { getTeamScripts } from '@/lib/actions/script';
import CreateScriptModal from "@/components/modal/create-script";
import { Script } from '@prisma/client';

interface Props {
    team: string;
    onScriptSelect: (script: Script) => void;
}

export default function ScriptList(props: Props) {
    const modal = useModal();
    const [scripts, setscripts] = useState<Script[]>()

    useEffect(() => {
        async function fetchData() {
            setscripts(await getTeamScripts(props.team))
        }
        fetchData();
    });
    
    return (
        <div className="relative flex flex-col space-y-4 p-5 md:p-10 border border-neutral-700 bg-neutral-900 rounded-lg w-[80vw] h-[80vh]">
            <div className="flex justify-between items-center">
                <h2 className="font-cal text-2xl text-white">Create or Select a Script</h2>
                <button
                    className="flex justify-end"
                    onClick={() => modal?.hide()}
                    aria-label="Close"
                >
                    <XIcon className="w-6 h-6" />
                </button>
            </div>
            <div
                onClick={() => modal?.show(<CreateScriptModal team={props.team} />)}
                className='w-full inline-flex py-1 align-middle rounded-md hover:bg-white hover:text-black border'>
                <Plus className='size-5 mx-2 my-auto' /> Create a new script
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Script Name</TableHead>
                        <TableHead>Description</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {scripts && scripts.map((script, index) => (
                        <TableRow key={index} onClick={() => props.onScriptSelect(script)}>
                            <TableCell className="font-medium">{script.name}</TableCell>
                            <TableCell>{script.description}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}