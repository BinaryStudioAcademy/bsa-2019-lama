const pageSteps = require('./../specs/authorization/authorization_PA');
const credentials = require('./../testdata');
const googleAuth = require('./../specs/authorization/Google Page/GooglePage_PA');
class HelpClass {

    switchToParent(parentGUID) {
        browser.switchToWindow(parentGUID);
    }

    switchToChild(parentGUID) {
        const allGUID = browser.getWindowHandles();
        console.log("Page title before Switching : " + browser.getTitle());
        console.log("Total Windows : " + allGUID.length);
        for (var i = 0; i < allGUID.length; i++) {
            if (allGUID[i] != parentGUID) {
                browser.switchToWindow(allGUID[i]);
                break;
            }
        }
    }

    loginWithDefaultUser() {
        browser.maximizeWindow();
        browser.url(credentials.appUrl);
        const parentGUID = browser.getWindowHandle();

        pageSteps.goToMainPage();
        pageSteps.loginWithGoogle();
        browser.pause(3000);
        const allGUID = browser.getWindowHandles();
        //parentGUID.switchToChild();
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
        //parentGUID.switchToChild();
    }
}

module.exports = new HelpClass;