"use server";
import { Role } from "@prisma/client";
import { getSession } from "../auth";
import { withTeamAuth } from "./middleware";
import prisma from "../prisma";

export const getTeamMembers = async (teamName: string) => {
    const session = await getSession();
    if (!session) {
        return {
            error: "Not authenticated",
        };
    }

    try {
        const members = await prisma.team.findFirst({
            where: {
                name: teamName,
            },
            select: {
                members: {
                    select: {
                        role: true,
                        user: {
                            select: {
                                username: true,
                                image: true,
                                id: true,
                            },
                        },
                    },
                },
            },
        });

        if (members) {
            const restructure = members.members.map((member: { role: any; user: { username: any; image: any; id: any }; }) => ({
                role: member.role,
                username: member.user.username,
                image: member.user.image,
                userId: member.user.id,
            }));
            return restructure;
        }
    } catch (error) {
        console.error("Failed to get team members:", error);
        return {
            error: "Failed to get team members",
        };
    }
}

export const updateTeamMemberRole =
withTeamAuth(Role.ADMIN,
        async (team, formData) => {
            const userId = formData?.get('userId') as string;
            const role = formData?.get('role') as string;

            if (!userId || !role) {
                throw new Error("Missing userId or role");
            }

            try {
                const member = await prisma.teamMember.update({
                    where: {
                        teamId_userId: {
                            teamId: team.id,
                            userId: userId,
                        },
                    },
                    data: {
                        role: role as Role,
                    },
                });
                return { success: true, member: member };
            } catch (error) {
                console.error("Failed to update team member role:", error);
                return { error: "Failed to update team member role" };
            }
        }
    )

export const getRequestForAccess = async (teamName: string) => {
    const session = await getSession();
    if (!session) {
        return {
            error: "Not authenticated",
        };
    }
    try {

        const requests = await prisma.teamAccessRequest.findMany({
            where: {
                team: {
                    name: teamName,
                }
            },
            select: {
                id: true,
                requestedByUser: {
                    select: {
                        username: true,
                        image: true,
                        id: true,
                    },
                },
            },
        });

        return requests;
    } catch (error) {
        console.error("Failed to get team access requests:", error);
        return {
            error: "Failed to get team access requests",
        };
    }
}

export const approveTeamAccessRequest = withTeamAuth(Role.ADMIN, async (team, formData) => {
    console.log(formData);
    
    const requestId = formData?.get('id') as string;
    if (!requestId) {
        throw new Error("Missing requestId");
    }
    try {
        prisma.$transaction(async () => {
            await prisma.teamAccessRequest.delete({
                where: {
                    id: requestId,
                },
            })
            await prisma.teamMember.create({
                data: {
                    team: {
                        connect: {
                            id: team.id,
                        },
                    },
                    user: {
                        connect: {
                            id: team.id,
                        },
                    },
                    role: "MEMBER",
                },
            })
        });
        return { success: true };
    } catch (error) {
    console.error("Failed to approve team access request:", error);
    return { error: "Failed to approve team access request" };
}
});