"use server"
import { put,  } from "@vercel/blob";
import fs from "fs";
import { nanoid } from "nanoid";

export async function uploadFunction(filePath: string) {
    try {
        const bundleCode = fs.readFileSync(filePath, 'utf8');
        const result = await put(`functions/${nanoid()}.js`, bundleCode,{
            contentType: 'application/javascript',
            access: 'public',
            addRandomSuffix: true
        });
        return {success: true, message: result.url};
    } catch (error) {
        return {success: false, message: error};
    }
}

export async function downloadFunction(url: string) {
    try {
        await fetch(url).then(async (res) => {
            const file = await res.text();   
            console.log("File downloaded successfully", file);
            return file;
        });
    } catch (error) {
        return null;
    }
}