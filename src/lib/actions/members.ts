"use server";
import { Role } from "@prisma/client";
import { getSession } from "../auth";
import { withTeamAuth } from "./middleware";
import prisma from "../prisma";

export interface Member {
    role: string;
    username: string;
    image: string;
    userId: string;
    email: string;
}

export const getTeamMembers = async (teamName: string): Promise<Member[] | { error: string }> => {
    const session = await getSession();
    if (!session) {
        return {
            error: "Not authenticated",
        };
    }
    const decodedTeamName = decodeURIComponent(teamName);
    try {
        const team  = await prisma.team.findFirst({
            where: {
                name: decodedTeamName,
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
                                email: true,
                            },
                        },
                    },
                },
            },
        });

        return team?.members.map(({ role, user }: { role: string, user: any }) => ({
            role,
            username: user.username,
            image: user.image,
            userId: user.id,
            email: user.email,
        })) || [];
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

// export const getRequestForAccess = async (teamName: string) => {
//     const session = await getSession();
//     if (!session) {
//         return {
//             error: "Not authenticated",
//         };
//     }
//     try {

//         const requests = await prisma.teamAccessRequest.findMany({
//             where: {
//                 team: {
//                     name: teamName,
//                 }
//             },
//             select: {
//                 id: true,
//                 requestedByUser: {
//                     select: {
//                         username: true,
//                         image: true,
//                         id: true,
//                     },
//                 },
//             },
//         });

//         return requests;
//     } catch (error) {
//         console.error("Failed to get team access requests:", error);
//         return {
//             error: "Failed to get team access requests",
//         };
//     }
// }

export const inviteUserToTeam = withTeamAuth(Role.ADMIN, async (team, formData) => {
    const username = formData?.get('username') as string;
    const email = formData?.get('email') as string;    
    const role = formData?.get('role') as Role;
    if (!username && !email) {
        throw new Error("Missing username or email");
    }
    try {
        const query = username ? { username: username } : { email: email };

        prisma.$transaction(async () => {
        const user = await prisma.user.findFirst({
            where: {
                ...query,
            },
            select: {
                id: true,
            },
        });
        
        if (!user) {
            return { error: "No user found with that email or username" };
        }

        const result = await prisma.teamInvitation.create({
            data: {
                team: {
                    connect: {
                        id: team.id,
                    },
                },
                invitedUser: {
                    connect: {
                        id: user.id,
                    },
                },
                role: role || "MEMBER",
            },
        });
        console.log(result);
        
    
    })
        return { success: true };
    } catch (error) {
        console.error("Failed to invite user to team:", error);
        return { error: "Failed to invite user to team" };
    }
})

// export const approveTeamAccessRequest = withTeamAuth(Role.ADMIN, async (team, formData) => {
//     const requestId = formData?.get('id') as string;
//     if (!requestId) {
//         throw new Error("Missing requestId");
//     }
//     try {
//         prisma.$transaction(async () => {
//             await prisma.teamAccessRequest.delete({
//                 where: {
//                     id: requestId,
//                 },
//             })
//             await prisma.teamMember.create({
//                 data: {
//                     team: {
//                         connect: {
//                             id: team.id,
//                         },
//                     },
//                     user: {
//                         connect: {
//                             id: team.id,
//                         },
//                     },
//                     role: "MEMBER",
//                 },
//             })
//         });
//         return { success: true };
//     } catch (error) {
//         console.error("Failed to approve team access request:", error);
//         return { error: "Failed to approve team access request" };
//     }
// });