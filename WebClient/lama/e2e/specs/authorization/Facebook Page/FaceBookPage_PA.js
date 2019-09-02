const FBPage = require('./FaceBookpage_PO');
const page = new FBPage();

class FBActions {
    enterMail(value) {
        page.userEmail.waitForDisplayed(5000);
        page.userEmail.clearValue();
        page.userEmail.setValue(value);
    }

    enterPassword(value) {
        page.userPassword.waitForDisplayed(5000);
        page.userPassword.clearValue();
        page.userPassword.setValue(value);

        page.enterButton.waitForDisplayed(5000);
        page.enterButton.click();
    }
}
module.exports = new FBActions;