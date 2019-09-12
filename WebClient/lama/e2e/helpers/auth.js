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
   
    const allGUID = browser.getWindowHandles();

    for (var i = 0; i < allGUID.length; i++) {
        if (allGUID[i] != parentGUID) {
            browser.switchToWindow(allGUID[i]);
            break;
        }
    }
    
    googleAuth.enterMail(credentials.googleEmail);
    googleAuth.enterPassword(credentials.googlePassword);
    browser.pause(5000);
    browser.switchToWindow(parentGUID);
}

module.exports = {
    loginWithGoogle
}