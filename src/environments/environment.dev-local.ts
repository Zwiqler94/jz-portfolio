// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  appUrl: 'jlz-portfolio-dev.web.app',
  deployable: false,
  firebaseConfig: {
    apiKey: 'AIzaSyDuG6ojn89_8rvp4pSVpcmBwvT6D1zunQY',
    authDomain: 'jlz-portfolio.firebaseapp.com',
    projectId: 'jlz-portfolio',
    storageBucket: 'jlz-portfolio.appspot.com',
    messagingSenderId: '518070660509',
    appId: '1:518070660509:web:9d2511d1a027342457d374',
    measurementId: 'G-CNT03XSD81',
  },
  local: true,
  nasaAPIKey: 'vnfZmI8NbIb44DmpbbSAvlMhFz7Ipnyc1tq6xNLb',
  production: false,
  recaptchaSiteKey: '6LecuRElAAAAANlCdpdXoztAYRV48C8wEQPu-Ool',
  serviceOptions: {
    useServiceWorker: false,
    url: 'http://127.0.0.1:5001/jlz-portfolio/us-central1/jzPortfolioAppDev',
    postService:
      'http://127.0.0.1:5001/jlz-portfolio/us-central1/jzPortfolioAppDev/api/v4/posts',
    secretService:
      'http://127.0.0.1:5001/jlz-portfolio/us-central1/jzPortfolioAppDev/api/v4/secrets',
    previewService:
      'http://127.0.0.1:5001/jlz-portfolio/us-central1/jzPortfolioAppDev/api/v4/previews',
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
