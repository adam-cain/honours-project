import { z } from "zod";

export const ConfigSchema = z.object({
    systemPrompt: z.string(),
    tools: z.record(z.object({
      description: z.string(),
      parameters: z.any(), // Adjust this based on your tool's parameter requirements
      render: z.function().args(z.any()).returns(z.any()), // Adjust based on your tool's render function signature
    })),
  });
  
export type Config = z.infer<typeof ConfigSchema>;