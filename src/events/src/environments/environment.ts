// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const client_id = '37000d3a-fdd8-4a76-b898-442f41bcd36e';
const redirect_url = 'http://localhost:4200';
const base_url = 'http://localhost:4302';

export const environment = {
  production: false,
  name: 'dev',
  project: 'events',
  eventsApiUrl: 'https://localhost:5001/api/events/v1',
  identityApiUrl: 'http://localhost:5000/api/identity/v1',
  identityApi: `${redirect_url}/oauth2/auth?client_id=${client_id}&redirect_url=${base_url}`
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
