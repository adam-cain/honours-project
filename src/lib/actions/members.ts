"use server";
import { Prisma, Role } from "@prisma/client";
import { getSession } from "../auth";
import { withOrgAuth } from "./middleware";
import prisma from "../prisma";

export const getOrgMembers = async (orgName: string) => {
    const session = await getSession();
    if (!session) {
        return {
            error: "Not authenticated",
        };
    }

    try {
        const members = await prisma.organization.findFirst({
            where: {
                name: orgName,
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
        console.error("Failed to get organization members:", error);
        return {
            error: "Failed to get organization members",
        };
    }
}

export const updateOrgMemberRole =
    withOrgAuth(Role.ADMIN,
        async (organization, formData) => {
            const userId = formData?.get('userId') as string;
            const role = formData?.get('role') as string;

            if (!userId || !role) {
                throw new Error("Missing userId or role");
            }

            try {
                const member = await prisma.organizationMember.update({
                    where: {
                        organizationId_userId: {
                            organizationId: organization.id,
                            userId: userId,
                        },
                    },
                    data: {
                        role: role as Role,
                    },
                });
                return { success: true, member: member };
            } catch (error) {
                console.error("Failed to update organization member role:", error);
                return { error: "Failed to update organization member role" };
            }
        }
    )

export const getRequestForAccess = async (orgName: string) => {
    const session = await getSession();
    if (!session) {
        return {
            error: "Not authenticated",
        };
    }
    try {

        const requests = await prisma.organizationAccessRequest.findMany({
            where: {
                organization: {
                    name: orgName,
                }
            },
            select: {
                id: true,
                requestedByUser: { // Updated to use the correct relation name
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
        console.error("Failed to get organization access requests:", error);
        return {
            error: "Failed to get organization access requests",
        };
    }
}

export const approveOrgAccessRequest = withOrgAuth(Role.ADMIN, async (organization, formData) => {
    console.log(formData);
    
    const requestId = formData?.get('id') as string;
    if (!requestId) {
        throw new Error("Missing requestId");
    }
    try {
        prisma.$transaction(async () => {
            throw new Error("Transaction failed");
            await prisma.organizationAccessRequest.delete({
                where: {
                    id: requestId,
                },
            })
            await prisma.organizationMember.create({
                data: {
                    organization: {
                        connect: {
                            id: organization.id,
                        },
                    },
                    user: {
                        connect: {
                            id: organization.id,
                        },
                    },
                    role: "MEMBER",
                },
            })
        });
        return { success: true };
    } catch (error) {
    console.error("Failed to approve organization access request:", error);
    return { error: "Failed to approve organization access request" };
}
});