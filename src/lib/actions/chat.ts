// "use s"
// import { getSession } from "next-auth/react";
// import { withOrgAuth } from "@/lib/auth";
// import { Organization } from "@prisma/client";
// import prisma from "../prisma";

// export const getOrgChats = withOrgAuth(async (_: FormData, organization: Organization) => {
//     const session = await getSession();
//     if (!session) {
//         return {
//             error: "Not authenticated",
//         };
//     }

//     const chats = await prisma.chat.findMany({
//         where: {
//             organizationId: organization.id,
//         },
//     });

//     return orgs;
// })

// export const getOrgChats = async (organization: Organization) => {
//     const session = await getSession();
//     if (!session) {
//         return {
//             error: "Not authenticated",
//         };
//     }

//     const chats = await prisma.chat.findMany({
//         where: {
//             organizationId: organization.id,
//         },
//     });

//     return chats;
// }