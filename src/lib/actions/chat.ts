"use server"

import { getSession } from "../auth";
import prisma from "../prisma";

export const createChat = async (formData: FormData, teamName: string) => {
    const session = await getSession();
    if (!session) {
        return {
            error: "Not authenticated",
        };
    }

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    teamName = decodeURIComponent(teamName);
    
    if (!name) {
        return {
            error: "Required fields are missing",
        };
    }

    try {
        const chat = await prisma.chat.create({
            data: {
                name: name,
                description: description,
                team: {
                    connect: { name: teamName },
                },
            },
        })
        return chat;
    } catch (error) {
        console.log(error);

        return {
            error: "An error occurred while creating the chat. Please try again later.",
        };
    }
}

export const getChat = async (teamName: string, chatName: string) => {
    teamName = decodeURIComponent(teamName);
    chatName = decodeURIComponent(chatName);
    try {
        const chat = await prisma.chat.findFirst({
            where: {
                name: chatName,
                team: {
                    name: teamName,
                },
            },
        });

        return chat;
    } catch (error) {
        console.log(error);

        return {
            error: "An error occurred while getting the chat. Please try again later.",
        };
    }
}