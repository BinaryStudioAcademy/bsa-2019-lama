// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    apiKey: "AIzaSyBORG9q0PWmWU7IZdO8sp1uv-unJSFdps0",
    authDomain: "lama-auth.firebaseapp.com",
    databaseURL: "https://lama-auth.firebaseio.com",
    projectId: "lama-auth",
    storageBucket: "",
    messagingSenderId: "363275556201",
    appId: "1:363275556201:web:52ab2e1fd986b9ca"
  },
  clientApiUrl:"http://localhost:4200",
  lamaApiUrl: "http://localhost:51286",
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
  production: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
