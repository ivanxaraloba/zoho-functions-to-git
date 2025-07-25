import type { Database as DB } from './database.types';

declare global {
  type Database = DB;
  type LogTable = DB['public']['Tables']['logs']['Row'];
  type FunctionTable = DB['public']['Tables']['functions']['Row'];
  type ProjectTable = DB['public']['Tables']['projects']['Row'];
  type DepartmentTable = DB['public']['Tables']['departments']['Row'];
  type CRMTable = DB['public']['Tables']['crm']['Row'];
  type RecruitTable = DB['public']['Tables']['recruit']['Row'];
  type CreatorTable = DB['public']['Tables']['creator']['Row'];
  type CreatorAppsTable = DB['public']['Tables']['creatorApps']['Row'];
  type CommitsTable = DB['public']['Tables']['commits']['Row'];
  type CRMFunctionsTable = DB['public']['Tables']['crmFunctions']['Row'];
  type Tables = DB['public']['Tables'];
}
