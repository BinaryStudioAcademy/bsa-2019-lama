export const environment = {
  firebase: {
    apiKey: 'AIzaSyBORG9q0PWmWU7IZdO8sp1uv-unJSFdps0',
    authDomain: 'lama-auth.firebaseapp.com',
    databaseURL: 'https://lama-auth.firebaseio.com',
    projectId: 'lama-auth',
    storageBucket: '',
    messagingSenderId: '363275556201',
    appId: '1:363275556201:web:52ab2e1fd986b9ca'
  },
  clientApiUrl: 'http://bsa2019-lama.westeurope.cloudapp.azure.com',
  lamaApiUrl: 'http://bsa2019-lama.westeurope.cloudapp.azure.com:5000',
  photoEditing:
  {
    crop:
    {
      cropMinWidth: 128,
      cropMinHeight: 128
    }
  },
  compressionOptions: {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
  },
  production: true
};
