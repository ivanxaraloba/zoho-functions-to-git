export interface creatorApp {
  id: number;
  name: string;
  accordian: any;
  lastSync: any;
}

export interface Deparment {
  id: number;
  name: string;
}

export interface Project {
  id: number;
  name: string;
  username: string;
  domain: string;
  functions: any[];
  file?: any;
  departments: Deparment;
  crm?: {
    id: number;
    projectId: number;
    functions: any[];
    created_at: any;
    lastSync: any;
    config: {};
  };
  creator?: {
    id?: number;
    projectId: number;
    owner: string;
    config: {
      cookie: any;
      "user-agent": any;
    };
    created_at: any;
    creatorApps?: creatorApp[];
  };
  recruit?: {
    id: number;
    projectId: number;
    functions: any[];
    created_at: any;
    config: {};
    lastSync: string;
  };
}

export interface Function {
  name: string;
}

export interface User {
  id: string;
  profile: {
    id: string;
    bbUsername: string;
    bbPassword: string;
    created_at: string;
  } | null;
}
