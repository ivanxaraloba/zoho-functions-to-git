
const logDefaults = {
  defaultType: 'info',
  defaultFunction: 'function_name',
  defaultNotes: 'note',
  validTypes: ['success', 'error', 'warning', 'info'],
};

export const logExamples = [
  {
    label: 'Deluge',
    code: (username: string) => `
  logMap = Map();
  logMap.put("projectUsername", "${username}");
  logMap.put("type","${logDefaults.defaultType}"); // valid types: [${logDefaults.validTypes.join(', ')}];
  logMap.put("function","${logDefaults.defaultFunction}");
  logMap.put("notes","${logDefaults.defaultNotes}");
  responseLog = postUrl("https://lobaadmin-zohofunctionstogit.vercel.app/api/logs", logMap.toString());
      `,
  },
  {
    label: 'Axios',
    code: (username: string) => `
  const logMap = {
    projectUsername: "${username}",
    type: "${logDefaults.defaultType}", // valid types: [${logDefaults.validTypes.join(', ')}]
    function: "${logDefaults.defaultFunction}",
    notes: "${logDefaults.defaultNotes}"
  };
  
  const response = await axios.post("https://lobaadmin-zohofunctionstogit.vercel.app/api/logs", logMap);
      `,
  },
  {
    label: 'Fetch',
    code: (username: string) => `
  const logMap = {
    projectUsername: "${username}",
    type: "${logDefaults.defaultType}", // valid types: [${logDefaults.validTypes.join(', ')}]
    function: "${logDefaults.defaultFunction}",
    notes: "${logDefaults.defaultNotes}"
  };
  
  const response = await fetch("https://lobaadmin-zohofunctionstogit.vercel.app/api/logs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(logMap),
  });
      `,
  },
];