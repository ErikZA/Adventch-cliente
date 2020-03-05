// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// const client_id = '398b7981-6c29-4a27-b67b-6d6edf5548e9';
// const base_url = 'http://localhost:4302';

// export const environment = {
//   production: false,
//   name: 'dev',
//   project: 'events',
//   eventsApiUrl: 'http://localhost:5003/api/events/v1',
//   identityApiUrl: 'http://localhost:5000/api/identity/v1',
//   identityApi: `http://localhost:4200/oauth2/auth?client_id=${client_id}&redirect_url=${base_url}`
// };

const client_id = 'ce0b870b-110f-4691-b938-c2bab3f038fb';
const base_url = 'https://eventos.adven.tech/#/';

export const environment = {
  production: true,
  name: 'dev',
  project: 'events',
  eventsApiUrl: 'https://api-eventos.adven.tech/api/events/v1',
  identityApiUrl: 'https://api-identity.adven.tech/api/identity/v1',
  identityApi: `https://login.adven.tech/#/oauth2/auth?client_id=${client_id}&redirect_url=${base_url}`
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
