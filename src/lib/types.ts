import { ReactNode } from "react";

export type EditorCanvasTypes =
  | 'Condition'
  | 'AI'
  | 'Input'
  | 'Output'
  | 'Wait'
  | 'Script';

type MetaDataTypes = 'string' | 'number' | 'boolean' | 'object';

type InputMetaData = | {
  eventType: 'tool'
  parameters: {
    name: string
    description: string
    type: MetaDataTypes
  }[]
} | {
  eventType: 'webhook'
  parameters: {
    name: string
    type: MetaDataTypes
  }[]
} | {
  eventType: 'cron'
  cronString: string
};

type ConditionMetaData = {
  expression: string;
};

type AIMetaData = {
  model: string;
  parameters: {
    name: string;
    type: MetaDataTypes;
  }[];
};

type OutputMetaData = {
  target: string;
  format: string;
};

type WaitMetaData = {
  duration: number; // Duration in milliseconds
};

type ScriptMetaData = {
  script: string;
};

type EditorCanvasCardBase = {
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
};

export type EditorCanvasCardType = EditorCanvasCardBase & (
  | { type: 'Input', metadata: InputMetaData }
  | { type: 'Condition', metadata: ConditionMetaData }
  | { type: 'AI', metadata: AIMetaData }
  | { type: 'Output', metadata: OutputMetaData }
  | { type: 'Wait', metadata: WaitMetaData }
  | { type: 'Script', metadata: ScriptMetaData }
);

export type EditorNodeType = {
  id: string
  type: EditorCanvasCardType['type']
  position: {
    x: number
    y: number
  }
  data: EditorCanvasCardType
}

export type EditorNode = EditorNodeType

export type EditorActions =
  | {
    type: 'LOAD_DATA'
    payload: {
      elements: EditorNode[]
      edges: {
        id: string
        source: string
        target: string
      }[]
    }
  }
  | {
    type: 'UPDATE_METADATA'
    payload: {
      nodeId: string
      metadata: any
    }
  }
  | {
    type: 'UPDATE_NODE'
    payload: {
      elements: EditorNode[]
    }
  }
  | { type: 'REDO' }
  | { type: 'UNDO' }
  | {
    type: 'SELECTED_ELEMENT'
    payload: {
      nodeId: string
    }
  }

export type LayoutProps = {
  children: ReactNode;
};

export type DomainVerificationStatusProps =
  | "Valid Configuration"
  | "Invalid Configuration"
  | "Pending Verification"
  | "Domain Not Found"
  | "Unknown Error";

// From https://vercel.com/docs/rest-api/endpoints#get-a-project-domain
export interface DomainResponse {
  name: string;
  apexName: string;
  projectId: string;
  redirect?: string | null;
  redirectStatusCode?: (307 | 301 | 302 | 308) | null;
  gitBranch?: string | null;
  updatedAt?: number;
  createdAt?: number;
  /** `true` if the domain is verified for use with the project. If `false` it will not be used as an alias on this project until the challenge in `verification` is completed. */
  verified: boolean;
  /** A list of verification challenges, one of which must be completed to verify the domain for use on the project. After the challenge is complete `POST /projects/:idOrName/domains/:domain/verify` to verify the domain. Possible challenges: - If `verification.type = TXT` the `verification.domain` will be checked for a TXT record matching `verification.value`. */
  verification: {
    type: string;
    domain: string;
    value: string;
    reason: string;
  }[];
}

// From https://vercel.com/docs/rest-api/endpoints#get-a-domain-s-configuration
export interface DomainConfigResponse {
  /** How we see the domain's configuration. - `CNAME`: Domain has a CNAME pointing to Vercel. - `A`: Domain's A record is resolving to Vercel. - `http`: Domain is resolving to Vercel but may be behind a Proxy. - `null`: Domain is not resolving to Vercel. */
  configuredBy?: ("CNAME" | "A" | "http") | null;
  /** Which challenge types the domain can use for issuing certs. */
  acceptedChallenges?: ("dns-01" | "http-01")[];
  /** Whether or not the domain is configured AND we can automatically generate a TLS certificate. */
  misconfigured: boolean;
}

// From https://vercel.com/docs/rest-api/endpoints#verify-project-domain
export interface DomainVerificationResponse {
  name: string;
  apexName: string;
  projectId: string;
  redirect?: string | null;
  redirectStatusCode?: (307 | 301 | 302 | 308) | null;
  gitBranch?: string | null;
  updatedAt?: number;
  createdAt?: number;
  /** `true` if the domain is verified for use with the project. If `false` it will not be used as an alias on this project until the challenge in `verification` is completed. */
  verified: boolean;
  /** A list of verification challenges, one of which must be completed to verify the domain for use on the project. After the challenge is complete `POST /projects/:idOrName/domains/:domain/verify` to verify the domain. Possible challenges: - If `verification.type = TXT` the `verification.domain` will be checked for a TXT record matching `verification.value`. */
  verification?: {
    type: string;
    domain: string;
    value: string;
    reason: string;
  }[];
}

export type ValidationResult = {
  isValid: boolean;
  errorMessage: string;
};