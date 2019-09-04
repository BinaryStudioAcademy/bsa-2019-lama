const AuthorizationPage = require('../specs/authorization/authorization_PO');
const googleAuth = require('../specs/authorization/Google Page/GooglePage_PA');
const credentials = require('../testdata.json');
const pageSteps = require('../specs/authorization/authorization_PA');
const page = new AuthorizationPage();

function loginWithGoogle(browser) {
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
}

module.exports = {
    loginWithGoogle
}