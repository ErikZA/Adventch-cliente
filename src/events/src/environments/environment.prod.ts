const client_id = 'ce0b870b-110f-4691-b938-c2bab3f038fb';
const base_url = 'https://eventos.adven.tech';

export const environment = {
  production: true,
  name: 'prod',
  project: 'events',
  eventsApiUrl: 'https://api-eventos.adven.tech/api/events/v1',
  identityApiUrl: 'https://api-identity.adven.tech/api/identity/v1',
  identityApi: `https://login.adven.tech/oauth2/auth?client_id=${client_id}&redirect_url=${base_url}`
};
