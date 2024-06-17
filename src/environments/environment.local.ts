export const environment = {
  appCheckDebug: '4ad6c24e-aab2-40b5-9cd2-f7fe4291db01',
  appUrl: 'jlz-portfolio.web.app',
  deployable: false,
  firebaseConfig: {
    apiKey: 'AIzaSyDuG6ojn89_8rvp4pSVpcmBwvT6D1zunQY',
    authDomain: 'jlz-portfolio.firebaseapp.com',
    projectId: 'jlz-portfolio',
    storageBucket: 'jlz-portfolio.appspot.com',
    messagingSenderId: '518070660509',
    appId: '1:518070660509:web:3c14202d7467504157d374',
    measurementId: 'G-CNT03XSD81',
  },
  local: true,
  nasaAPIKey: 'vnfZmI8NbIb44DmpbbSAvlMhFz7Ipnyc1tq6xNLb',
  production: false,
  recaptchaSiteKey: '6LecuRElAAAAANlCdpdXoztAYRV48C8wEQPu-Ool',
  serviceOptions: {
    useServiceWorker: false,
    productionServices: false,
    postService:
      'http://127.0.0.1:5001/jlz-portfolio/us-central1/jzPortfolioAppDev/api/v3/posts',
    secretService:
      'http://127.0.0.1:5001/jlz-portfolio/us-central1/jzPortfolioAppDev/api/v3/secrets',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/plugins/zone-error'; // Included with Angular CLI.
