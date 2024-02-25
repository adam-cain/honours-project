import { Role } from "@prisma/client";

export function roleValue(role: Role): number {
    const roleHierarchy = {
        VIEW_ONLY: 1,
        MEMBER: 2,
        ADMIN: 3,
        OWNER: 4,
    };

    return roleHierarchy[role];
}