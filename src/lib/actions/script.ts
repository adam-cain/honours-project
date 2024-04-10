"use server"
import { Script } from "@prisma/client";
import { getSession } from "../auth";
import prisma from "../prisma";

export const createScript = async (formData: FormData, teamName: string) => {
    const session = await getSession();
    if (!session) {
        return {
            error: "Not authenticated",
        };
    }
    console.log("formmdata:",formData);
    
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const isJavascript = formData.get("isJS") === "js" ? true : false;
    teamName = decodeURIComponent(teamName);
    console.log( isJavascript,formData.get("isJavascript"));
    
    if (!name) {
        return {
            error: "Required fields are missing",
        };
    }

    try {
        const script = await prisma.script.create({
            data: {
                name: name,
                description: description,
                isJavascript: isJavascript,
                team: {
                    connect: { name: teamName },
                },
            },
        })
        console.log(script);
        
        return script;
    } catch (error) {
        console.log(error);

        return {
            error: "An error occurred while creating the script. Please try again later.",
        };
    }
}

export const getTeamScripts = async (teamName: string) => {
    const session = await getSession();
    if (!session) {
        return {
            error: "Not authenticated",
        };
    }

    teamName = decodeURIComponent(teamName);

    const scripts = await prisma.script.findMany({
        where: {
            team: {
                name: teamName,
            },
        },
    });    
    return scripts;
}

export const getScript = async (teamName: string, scriptName: string): Promise<Script | { error: string }> => {
    const session = await getSession();
    if (!session) {
        return {
            error: "Not authenticated",
        };
    }

    teamName = decodeURIComponent(teamName);
    scriptName = decodeURIComponent(scriptName);

    const script = await prisma.script.findFirst({
        where: {
            name: scriptName,
            team: {
                name: teamName,
            },
        },
    });
    return script;
}