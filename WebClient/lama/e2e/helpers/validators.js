credentials = require('../testdata');
const assert = require('assert');
class AsserHelper {
    successRedirectAfterLogin(expectedUrl) {
        //const expectedUrl = credentials.expectedUrl;
        const actualUrl = browser.getUrl();
        assert.equal(actualUrl, credentials.expectedUrl, `Expected ${actualUrl} to be equal to ${expectedUrl}`);
    }
}

module.exports = new AsserHelper;