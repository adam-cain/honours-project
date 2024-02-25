"use server"
import { Organization, Role } from "@prisma/client";
import { getSession } from "../auth";
import prisma from "@/lib/prisma";
import { withOrgAuth } from "./middleware";

export const createOrganisation = async (formData: FormData) => {
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
        const org = await prisma.organization.create({
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

        return org;
    } catch (error) {
        console.log(error);

        return {
            error: "An error occurred while creating the organization",
        };
    }
}

export const getUserOrganisations = async () => {
    const session = await getSession();
    if (!session) {
        return {
            error: "Not authenticated",
        };
    }

    const orgs = await prisma.organization.findMany({
        where: {
            members: {
                some: {
                    userId: session.user.id,
                },
            },
        },
    });

    return orgs;
}

export const getOrganisation = async (orgName: string) => {
    const org = await prisma.organization.findUnique({
        where: {
            name: orgName,
        },
    });
    return org;
}

export const hasOrgPermission = async (orgName: string) => {
    const session = await getSession();
    if (session) {
        const org = await prisma.organization.findUnique({
            where: {
                name: orgName,
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

        if (org && org.members.length > 0) {
            return true;
        }
    }
    return false
}

export const getOrgChats = async (organization: Organization) => {
    const session = await getSession();
    if (!session) {
        return {
            error: "Not authenticated",
        };
    }

    const chats = await prisma.chat.findMany({
        where: {
            organizationId: organization.id,
        },
    });

    return chats;
}

export const getOrgMembers = async (organization: Organization) => {
    const session = await getSession();
    if (!session) {
        return {
            error: "Not authenticated",
        };
    }

    prisma.user
    const members = await prisma.organization.findFirst({
        where: {
            id: organization.id,
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


    return { members: [] };
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
                throw new Error("Failed to update organization member role");
            }
        }
    )

export const userHasViewOnlyPerm = withOrgAuth(Role.VIEW_ONLY, async () => {
    return { success: true };
});

export const userHasMemberPerm = withOrgAuth(Role.MEMBER, async () => {
    return { success: true };
});

export const userHasAdminPerm = withOrgAuth(Role.ADMIN, async () => {
    return { success: true };
});

export const userHasOwnerPerm = withOrgAuth(Role.OWNER, async () => {
    return { success: true };
});