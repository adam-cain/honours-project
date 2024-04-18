"use client"

import Editor from "./editor";
import EditorProvider from "./editor-provider";
import type { Flow as FlowType } from "@prisma/client";

export default function FlowEditor({ flow }: { flow: FlowType}) {
    return (
        <EditorProvider>
            <Editor flow={flow} />
        </EditorProvider>
    );
}