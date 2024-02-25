import { Role } from "@prisma/client";
import { getSession } from "../auth";
import prisma from "@/lib/prisma";
import { roleValue } from "./lib";
import { ActionFunction, WithOrgAuthReturnType } from "./types";
  
export function withOrgAuth(arg1: Role | ActionFunction, arg2?: ActionFunction): (org: string, formData: FormData | null, key: string | null) => Promise<WithOrgAuthReturnType> {
  let requiredRole: Role;
  let action: ActionFunction;

  if (typeof arg1 === "function") {
    requiredRole = Role.VIEW_ONLY; // Default role if not specified
    action = arg1;
  } else {
    requiredRole = arg1;
    action = arg2!;
  }

  return async (orgName: string, formData: FormData | null, key: string | null): Promise<WithOrgAuthReturnType> => {
    const session = await getSession();
    if (!session) {
      return { error: "Not authenticated" };
    }
    
    const organization = await prisma.organization.findUnique({
      where: { name: orgName },
      include: {
        members: {
          where: { userId: session.user.id },
        },
      },
    });

    if (!organization || organization.members.length === 0) {
      return { error: "Not authorized or organization does not exist" };
    }

    const memberRole = organization.members[0].role;
    
    if (roleValue(memberRole) < roleValue(requiredRole)) {
      return { error: `Your current role (${memberRole}) does not grant you the necessary permissions (${requiredRole}) to perform this action` };
    }
    
    console.log("# Action permitted by org auth middleware");
    
    return action(organization, formData, key);
  };
}