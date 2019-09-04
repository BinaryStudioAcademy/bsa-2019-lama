const credentials = require('../../testdata');
const wait = require('./../../helpers/waiters');
const pageSteps = require('./authorization_PA');
const googleAuth = require('./Google Page/GooglePage_PA');
const validate = require('../../helpers/validators');

describe('Auth with Google', () => {
    beforeEach(() => {
        browser.maximizeWindow();
        browser.url(credentials.appUrl);
    });

    afterEach(() => {
        browser.reloadSession();
    });

    xit('should authorizate user', () => {
        const parentGUID = browser.getWindowHandle();
        pageSteps.goToMainPage();
        pageSteps.loginWithGoogle();

        browser.pause(5000);
        // get the All the session id of the browsers

        // винести в окрему функцію яку можна буде викликати а то в нас багато функціоналу з поп-ап вікнами
        const allGUID = browser.getWindowHandles();

        // pint the title of th epage
        console.log("Page title before Switching : " + browser.getTitle());
        console.log("Total Windows : " + allGUID.length);
        // iterate the values in the set
        for (var i = 0; i < allGUID.length; i++) {
            // one enter into if blobk if the GUID is not equal to parent window's GUID
            if (allGUID[i] != parentGUID) {
                // switch to the guid
                browser.switchToWindow(allGUID[i]);
                // break the loop
                break;
            }
        }
        // search on the google page
        googleAuth.enterMail(credentials.googleEmail);
        googleAuth.enterPassword(credentials.googlePassword);
        // print the title after switching
        console.log("Page title after Switching to google : " + browser.getTitle());
        browser.pause(5000);
        // close the browser
        //browser.close();
        // switch back to the parent window
        browser.switchToWindow(parentGUID);
        // print the title
        console.log("Page title after switching back to Parent: " + browser.getTitle());

        validate.successRedirectAfterLogin();
    })
})