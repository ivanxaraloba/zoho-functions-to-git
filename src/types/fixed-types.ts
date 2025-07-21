export interface IFunctionCrmRaw {
    updatedTime: number;
    workflow: {
        name: string;
        namespace: string;
        params: Array<{
            name: string;
            type: string;
        }>;
        returnType: string;
    };
    rest_api: Array<{
        active: boolean;
        type: string;
        url: string;
    }>;
    isCRMV1TaskPresent: boolean;
    description: string | null;
    language: string;
    source: string;
    display_name: string;
    associated_place: Array<{
        module: string;
        name: string;
        _type: string;
        id: number;
        status: boolean;
    }>;
    api_name: string;
    createdTime: number;
    id: string;
    category: string;
    config: boolean;
    tasks: {
        external_tasks: boolean;
        params: string[];
        integrations: Array<{
            service: string;
            function: string;
            display_name: string;
        }>;
    };
}


export interface IFunctionCrm {
    return_type: string;
    modified_on: string;
    updatedTime: string;
    workflow: string;
    rest_api: {
        active: boolean;
        type: string;
        url: string;
    }[];
    description: string | null;
    language: string;
    source: string;
    display_name: string;
    params: {
        name: string;
        type: string;
    }[];
    script: string;
    associated_place: {
        module: string;
        name: string;
        _type: string;
        isOldDataNeeded: boolean;
        arguments: {
            name: string;
            value: string;
        }[];
        id: number;
        status: boolean;
    }[];
    api_name: string;
    modified_by: string;
    name: string;
    nameSpace: string;
    id: string;
    category: string;
    config: boolean;
    tasks: {
        webhooks: {
            method: string;
            connection: string;
            url: string;
        }[];
        external_tasks: boolean;
        params: string[];
        integrations: {
            service: string;
            function: string;
            display_name: string;
            connection?: string;
        }[];
    };
    connections: {
        connectionLinkName: string;
        userAccess: string;
        connectionName: string;
        scopes: string[];
        connectedServiceId: string;
        serviceName: string;
        isUserDefinedService: string;
    }[];
}

export interface IBitbucketRepository {
    type: string;
    full_name: string;
    links: {
        self: { href: string };
        html: { href: string };
        avatar: { href: string };
        pullrequests: { href: string };
        commits: { href: string };
        forks: { href: string };
        watchers: { href: string };
        branches: { href: string };
        tags: { href: string };
        downloads: { href: string };
        source: { href: string };
        clone: Array<{
            name: string;
            href: string;
        }>;
        hooks: { href: string };
    };
    name: string;
    slug: string;
    description: string;
    scm: string;
    website: string | null;
    owner: {
        display_name: string;
        links: {
            self: { href: string };
            avatar: { href: string };
            html: { href: string };
        };
        type: string;
        uuid: string;
        username: string;
    };
    workspace: {
        type: string;
        uuid: string;
        name: string;
        slug: string;
        links: {
            avatar: { href: string };
            html: { href: string };
            self: { href: string };
        };
    };
    is_private: boolean;
    project: {
        type: string;
        key: string;
        uuid: string;
        name: string;
        links: {
            self: { href: string };
            html: { href: string };
            avatar: { href: string };
        };
    };
    fork_policy: string;
    created_on: string;
    updated_on: string;
    size: number;
    language: string;
    uuid: string;
    mainbranch: {
        name: string;
        type: string;
    };
    override_settings: {
        default_merge_strategy: boolean;
        branching_model: boolean;
    };
    parent: null;
    enforced_signed_commits: boolean | null;
    has_issues: boolean;
    has_wiki: boolean;
}
