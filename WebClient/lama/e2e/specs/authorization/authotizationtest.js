const credentials = require('../../testdata');
const path = require('path');
//const wait = require('./../../helpers/waiters');
const pageSteps = require('./authorization_PA');
const googleAuth = require('./Google Page/GooglePage_PA');
const validate = require('../../helpers/validators');
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
        const parentGUID = browser.getWindowHandle();
        pageSteps.goToMainPage();
        pageSteps.loginWithGoogle();
        handleWindow.switchToChild(parentGUID);
        googleAuth.enterMail(credentials.googleEmail);
        googleAuth.enterPassword(credentials.googlePassword);
        browser.pause(5000);
        handleWindow.switchToParent(parentGUID);
        validate.successRedirectAfterLogin();
    })
})