export const environment = {
  appUrl: 'jlz-portfolio.web.app',
  appCheckDebug: '4ad6c24e-aab2-40b5-9cd2-f7fe4291db01',
  secretService:
    'https://jzportfolioapp-wa22s5z3va-uc.a.run.app/api/v3/secrets',
  secretServiceLocal:
    'http://127.0.0.1:4001/jlz-portfolio/us-central1/jzPortfolioApp/api/v3/secrets',
  production: false,
  local: true,
  firebaseConfig: {
    apiKey: 'AIzaSyDuG6ojn89_8rvp4pSVpcmBwvT6D1zunQY',
    authDomain: 'jlz-portfolio.firebaseapp.com',
    projectId: 'jlz-portfolio',
    storageBucket: 'jlz-portfolio.appspot.com',
    messagingSenderId: '518070660509',
    appId: '1:518070660509:web:3c14202d7467504157d374',
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
import 'zone.js/plugins/zone-error'; // Included with Angular CLI.
