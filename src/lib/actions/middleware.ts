import { Role } from "@prisma/client";
import { getSession } from "../auth";
import prisma from "@/lib/prisma";
import { ActionFunction, WithTeamAuthReturnType } from "./types";
  

// type ActionFunction = (team: Team, formData: FormData | null, key: string | null) => Promise<any>;
// (alias) type Role = "OWNER" | "ADMIN" | "MEMBER" | "VIEW_ONLY"
// (alias) const Role: {
//   OWNER: "OWNER";
//   ADMIN: "ADMIN";
//   MEMBER: "MEMBER";
//   VIEW_ONLY: "VIEW_ONLY";
// }
// import Role

function roleValue(role: Role): number {
    const roleHierarchy = {
        VIEW_ONLY: 1,
        MEMBER: 2,
        ADMIN: 3,
        OWNER: 4,
    };

    return roleHierarchy[role];
}

export function withTeamAuth(arg1: Role | ActionFunction, arg2?: ActionFunction): (teamName: string, formData: FormData | null, key: string | null) => Promise<WithTeamAuthReturnType> {
  const requiredRole: Role = typeof arg1 === "function" ? "VIEW_ONLY" : arg1;
  const action: ActionFunction = typeof arg1 === "function" ? arg1 : arg2!;

  return async (teamName: string, formData: FormData | null, key: string | null): Promise<WithTeamAuthReturnType> => {
    const session = await getSession();
    if (!session) {
      return { error: "Not authenticated" };
    }

    const team = await prisma.team.findUnique({
      where: { name: decodeURIComponent(teamName) },
      include: {
        members: {
          where: { userId: session.user.id },
        },
      },
    });

    if (!team || team.members.length === 0) {
      return { error: "Not authorized or team does not exist" };
    }

    const memberRole = team.members[0].role;

    if (roleValue(memberRole) < roleValue(requiredRole)) {
      return {
        error: `Your current role (${memberRole}) does not grant you the necessary permissions (${requiredRole}) to perform this action`,
      };
    }

    console.log("# Action permitted by team auth middleware");

    return action(team, formData, key);
  };
}