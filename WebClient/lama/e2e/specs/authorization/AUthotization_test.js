const credentials = require('../../testdata');
const wait = require('./../../helpers/waiters');
const pageSteps = require('./authorization_PA');
const googleAuth = require('./Google Page/GooglePage_PA');
const validate = require('../../helpers/validators');
const parentGUID = browser.getWindowHandle();
const handleWindow = require('../../helpers/helpers');

describe('Auth with Google', () => {
    beforeEach(() => {
        browser.maximizeWindow();
        browser.url(credentials.appUrl);
    });

    afterEach(() => {
        browser.reloadSession();
    });

    it('should authorizate user', () => {
        // const parentGUID = browser.getWindowHandle();
        pageSteps.goToMainPage();
        pageSteps.loginWithGoogle();

        browser.pause(5000);
        handleWindow.switchToChild(parentGUID);
        console.log("Page title after Switching : " + browser.getTitle());
        browser.pause(5000);
        // get the All the session id of the browsers

        // винести в окрему функцію яку можна буде викликати а то в нас багато функціоналу з поп-ап вікнами
        // const allGUID = browser.getWindowHandles();

        // // pint the title of th epage
        // console.log("Page title before Switching : " + browser.getTitle());
        // console.log("Total Windows : " + allGUID.length);
        // // iterate the values in the set
        // for (var i = 0; i < allGUID.length; i++) {
        //     // one enter into if blobk if the GUID is not equal to parent window's GUID
        //     if (allGUID[i] != parentGUID) {
        //         // switch to the guid
        //         browser.switchToWindow(allGUID[i]);
        //         // break the loop
        //         break;
        //     }
        // }
        // // search on the google page
        googleAuth.enterMail(credentials.googleEmail);
        googleAuth.enterPassword(credentials.googlePassword);
        browser.pause(5000);
        handleWindow.switchToParent(parentGUID);
        //browser.switchToWindow(parentGUID);
        validate.successRedirectAfterLogin();
    })
})