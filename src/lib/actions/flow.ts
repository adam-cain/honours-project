"use server"

import prisma from "../prisma";

export const getFlow = async (team: string, flow: string) => {
    team = decodeURIComponent(team);
    flow = decodeURIComponent(flow);
    console.log(team, flow)
    // try {
    const flowData = await prisma.flow.findFirst({
        where: {
            team: {
                name: team
            },
            name: flow
        }
    });
    
    return flowData
    //     return { success: true, message: flowData };
    // } catch (e) {
    //     return { success: false, message: e };
    // }
}

export const getFlows = async (team: string) => {
    team = decodeURIComponent(team);
    const flows = await prisma.flow.findMany({
        where: {
            team: {
                name: team
            }
        }
    });
    return flows
}

export const createFlow = async (team: string, name: string, description: string) => {
    team = decodeURIComponent(team);
    const flowData = await prisma.flow.create({
        data: {
            name: name,
            description: description,
            team: {
                connect: {
                    name: team
                }
            }
        }
    });
    return flowData
}