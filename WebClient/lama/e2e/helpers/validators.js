credentials = require('../testdata');
const assert = require('assert');
class AssertHelper {
    successRedirectAfterLogin(expectedUrl) {
        const actualUrl = browser.getUrl();
        assert.equal(actualUrl, credentials.expectedUrl, `Expected ${actualUrl} to be equal to ${expectedUrl}`);
    }

    errorNotificationTextIs(expectedText) {
        const notification = $$('p.notifier__notification-message')[0];
        const actualText = notification.getText();
        assert.equal(actualText, expectedText, `Expected ${actualText} to be equal to ${expectedText}`);
    }

    successNotificationTextIs(expectedText) {
        const notification = $$('p.notifier__notification-message')[0];
        const actualText = notification.getText()
        assert.equal(actualText, expectedText, `Expected ${actualText} to be equal to ${expectedText}`);
    }
}
module.exports = new AssertHelper;