const GooglePage = require('./GooglePage_PO');
const page = new GooglePage();

class GoogleActions {
    enterMail(value) {
        page.userEmail.waitForDisplayed(8000);
        page.userEmail.clearValue();
        page.userEmail.setValue(value);
        page.nextButton.waitForDisplayed(5000);
        page.nextButton.click();
    }

    enterPassword(value) {
        page.userPassword.waitForDisplayed(5000);
        page.userPassword.clearValue();
        page.userPassword.setValue(value);
        page.nextButton1.waitForDisplayed(5000);
        page.nextButton1.click();
    }
}
module.exports = new GoogleActions;