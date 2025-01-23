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
  recaptchaSiteKey: '6LecuRElAAAAANlCdpdXoztAYRV48C8wEQPu-Ool',
  serviceOptions: {
    useServiceWorker: true,
    productionServices: true,
    url: 'https://us-central1-jlz-portfolio.cloudfunctions.net/jzPortfolioApp',
    secretService:
      'https://us-central1-jlz-portfolio.cloudfunctions.net/jzPortfolioApp/api/v3/secrets',
    postService:
      'https://us-central1-jlz-portfolio.cloudfunctions.net/jzPortfolioApp/api/v3/posts',
    previewService:
      'http://127.0.0.1:5001/jlz-portfolio/us-central1/jzPortfolioAppDev/api/v4/previews',
  },
};
