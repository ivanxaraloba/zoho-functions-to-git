export const NOTION_BITBUCKET_CREATE_PASSWORD_URL =
  'https://www.notion.so/arturloba/Bitbucket-Criar-Passwords-e2982ed9e03941a9a06a3926302686e7';

export const BUCKETS = {
  SETTINGS:
    'https://iiacktsxpvhavtrfsfsr.supabase.co/storage/v1/object/public/settings',
};

export const FUNCTIONS_CATEGORIES_LIST = [
  { label: 'CRM Fundamentals', value: 'crmfundamentals' },
  { label: 'Automation', value: 'automation' },
  { label: 'Button', value: 'button' },
  { label: 'Standalone', value: 'standalone' },
  { label: 'Related List', value: 'relatedlist' },
  { label: 'Scheduler', value: 'scheduler' },
  { label: 'Sales Signals', value: 'salessignals' },
];

export const FUNCTIONS_CATEGORIES_OBJ = {
  crmfundamentals: 'CRM Fundamentals',
  automation: 'Automation',
  button: 'Button',
  standalone: 'Standalone',
  relatedlist: 'Related List',
  scheduler: 'Scheduler',
  salessignals: 'Sales Signals',
};

export const APPLICATIONS = [
  { label: 'CRM', value: 'crm' },
  { label: 'Creator', value: 'creator' },
  { label: 'Recruit', value: 'recruit' },
];

export const DEPARMENTS = {
  FTE: 1,
  INTERNOS: 2,
};

export const LOGS_TYPES = ['success', 'error', 'warning', 'info'];

export const LOGS_TYPES_COLORS = {
  [LOGS_TYPES[0]]: '74, 222, 128',
  [LOGS_TYPES[1]]: '248, 113, 113',
  [LOGS_TYPES[2]]: '250, 204, 21',
  [LOGS_TYPES[3]]: '161, 161, 170',
};

export const CONFIG_FUNCTION_VARIABLE = {
  EXAMPLE: '[index]',
  REGEX: /\[index\]/g,
};

// export const CONFIG_FUNCTION_VARIABLE = {
//   EXAMPLE: '[var:VARIABLE1]',
//   REGEX: /\[var:([A-Z0-9_]+)\]/g,
// };


