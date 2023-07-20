export const environment = {
  appCheckDebug: false,
  appUrl: 'jlz-portfolio.web.app',
  deployable: true,
  firebaseConfig: {
    apiKey: 'AIzaSyDuG6ojn89_8rvp4pSVpcmBwvT6D1zunQY',
    authDomain: 'jlz-portfolio.firebaseapp.com',
    projectId: 'jlz-portfolio',
    storageBucket: 'jlz-portfolio.appspot.com',
    messagingSenderId: '518070660509',
    appId: '1:518070660509:web:3c14202d7467504157d374',
    measurementId: 'G-YSKMGT15LP',
  },
  local: false,
  nasaAPIKey: 'vnfZmI8NbIb44DmpbbSAvlMhFz7Ipnyc1tq6xNLb',
  production: true,
  recaptchaSiteKey: '6LdV5L8jAAAAAK1GaBQkmOq37fdxVQszw5x_iIV3',
  serviceOptions: {
    userServiceWorker: true,
    productionServices: true,
    postService: 'https://jzportfolioapp-wa22s5z3va-uc.a.run.app/api/v3/posts',
    secretService:
      'https://jzportfolioapp-wa22s5z3va-uc.a.run.app/api/v3/secrets',
  },
};
