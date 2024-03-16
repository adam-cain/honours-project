import { Role } from "@prisma/client";
import { getSession } from "../auth";
import prisma from "@/lib/prisma";
import { roleValue } from "./lib";
import { ActionFunction, WithTeamAuthReturnType } from "./types";
  
export function withTeamAuth(arg1: Role | ActionFunction, arg2?: ActionFunction): (team: string, formData: FormData | null, key: string | null) => Promise<WithTeamAuthReturnType> {
  let requiredRole: Role;
  let action: ActionFunction;

  if (typeof arg1 === "function") {
    requiredRole = Role.VIEW_ONLY; // Default role if not specified
    action = arg1;
  } else {
    requiredRole = arg1;
    action = arg2!;
  }

  return async (teamName: string, formData: FormData | null, key: string | null): Promise<WithTeamAuthReturnType> => {
    const session = await getSession();
    if (!session) {
      return { error: "Not authenticated" };
    }
    
    const team = await prisma.team.findUnique({
      where: { name: teamName },
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
      return { error: `Your current role (${memberRole}) does not grant you the necessary permissions (${requiredRole}) to perform this action` };
    }
    
    console.log("# Action permitted by team auth middleware");
    
    return action(team, formData, key);
  };
}