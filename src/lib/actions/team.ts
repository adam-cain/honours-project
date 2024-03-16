"use server"
import { Role } from "@prisma/client";
import { getSession } from "../auth";
import prisma from "@/lib/prisma";
import { withTeamAuth } from "./middleware";

export const createTeam = async (formData: FormData) => {
    const session = await getSession();
    if (!session) {
        return {
            error: "Not authenticated",
        };
    }

    const name = formData.get("name") as string;
    const subdomain = formData.get("subdomain") as string;
    const description = formData.get("description") as string;

    if (!name || !subdomain) {
        return {
            error: "Required fields are missing",
        };
    }


    const subdomainRegex = /^[a-zA-Z0-9-]+$/;
    if (!subdomainRegex.test(subdomain)) {
        return {
            error: "Subdomain format is invalid",
        };
    }

    try {
        const team = await prisma.team.create({
            data: {
                name: name,
                subDomain: subdomain,
                description: description,
                members: {
                    create: [{
                        user: {
                            connect: { id: session.user.id },
                        },
                        role: "OWNER",
                    }],
                },
            },
        });

        return team;
    } catch (error) {
        console.log(error);

        return {
            error: "An error occurred while creating the team",
        };
    }
}

export const getUserTeams = async () => {
    const session = await getSession();
    if (!session) {
        return {
            error: "Not authenticated",
        };
    }

    const teams = await prisma.team.findMany({
        where: {
            members: {
                some: {
                    userId: session.user.id,
                },
            },
        },
    });

    return teams;
}

export const getTeam = async (teamName: string) => {
    teamName = decodeURIComponent(teamName);
    const teams = await prisma.team.findUnique({
        where: {
            name: teamName,
        },
    });
    return teams;
}

export const hasTeamPermission = async (teamName: string) => {
    const session = await getSession();
    if (session) {
        teamName = decodeURIComponent(teamName);
        const team = await prisma.team.findUnique({
            where: {
                name: teamName,
            },
            include: {
                members: {
                    where: {
                        userId: session?.user.id,
                    },
                    select: {
                        id: true,
                        role: true,
                    },
                },
            },
        });

        if (team && team.members.length > 0) {
            return true;
        }
    }
    return false
}

export const getTeamChats = async (teamName: string) => {
    const session = await getSession();
    if (!session) {
        return {
            error: "Not authenticated",
        };
    }

    teamName = decodeURIComponent(teamName);

    const chats = await prisma.chat.findMany({
        where: {
            team: {
                name: teamName,
            },
        },
    });

    return chats;
}

export const userHasViewOnlyPerm = withTeamAuth(Role.VIEW_ONLY, async () => {
    return { success: true };
});

export const userHasMemberPerm = withTeamAuth(Role.MEMBER, async () => {
    return { success: true };
});

export const userHasAdminPerm = withTeamAuth(Role.ADMIN, async () => {
    return { success: true };
});

export const userHasOwnerPerm = withTeamAuth(Role.OWNER, async () => {
    return { success: true };
});

export const teamAccessRequest = async (teamName: string) => {
    const session = await getSession();
    if (!session) {
        return {
            error: "Not authenticated",
        };
    }
    
    teamName = decodeURIComponent(teamName);

    try{
        const request = await prisma.teamAccessRequest.create({
            data: {
                team: {
                    connect: {
                        name: teamName,
                    },
                },
                requestedByUser: {
                    connect: {
                        id: session.user.id,
                    },
                },
            },
        });

        return request;
    } catch (error) {
        console.log(error);
        if ((error as { code: string }).code === "P2025") {
            return {
                error: "This team does not exist.",
            };
        } else if ((error as { code: string }).code === "P2002") {
            return {
                error: "You have already requested access to this team.",
            };
        }
        return {
            error: "An error occurred while requesting access the request",
        };
    }
}