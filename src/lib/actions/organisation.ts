"use server"

import { getSession } from "../auth";
import prisma from "@/lib/prisma";

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
    console.log(org);
    
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