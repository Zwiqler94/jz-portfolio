// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  appUrl: 'jlz-portfolio-dev.web.app',
  appCheckDebug: false,
  secretService:
    'https://us-central1-jlz-portfolio.cloudfunctions.net/secretService/api/v1/secrets',
  secretServiceLocal:
    'http://127.0.0.1:4001/jlz-portfolio/us-central1/secretService/api/v1/secrets',
  production: false,
  local: false,
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  firebaseConfig: {
    apiKey: 'AIzaSyDuG6ojn89_8rvp4pSVpcmBwvT6D1zunQY',
    authDomain: 'jlz-portfolio.firebaseapp.com',
    projectId: 'jlz-portfolio',
    storageBucket: 'jlz-portfolio.appspot.com',
    messagingSenderId: '518070660509',
    appId: '1:518070660509:web:9d2511d1a027342457d374',
    measurementId: 'G-CNT03XSD81',
  },
  recaptchaSiteKey: '6LdV5L8jAAAAAK1GaBQkmOq37fdxVQszw5x_iIV3',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
