import { Organization } from '@prisma/client';

export type ActionFunction = (organization: Organization, formData: FormData | null, key: string | null) => Promise<any>;

export interface WithOrgAuthReturnType {
  error?: string;
  [key: string]: any; 
}