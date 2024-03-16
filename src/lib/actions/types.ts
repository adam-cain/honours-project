import { Team } from '@prisma/client';

export type ActionFunction = (team: Team, formData: FormData | null, key: string | null) => Promise<any>;

export interface WithTeamAuthReturnType {
  error?: string;
  [key: string]: any; 
}