export interface Environment {
  baseUrl: string;
  apiKey: string;
  projectId: string;
};

export function mkConfig(env: Environment) {
  return {
    apiKey: env.apiKey,
    authDomain: `${env.baseUrl}.firebaseapp.com`,
    databaseURL: `https://${env.baseUrl}.firebaseio.com`,
    projectId: env.projectId
  };
};
