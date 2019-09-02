const AuthorizationPage = require('./authorization_PO');
const page = new AuthorizationPage();

class AuthorizationActions {
    goToMainPage() {
        page.goToPhotos.waitForDisplayed(5000);
        page.goToPhotos.click();
    }
    loginWithGoogle() {
        page.googleButton.waitForDisplayed(5000);
        page.googleButton.click();
    }
}

module.exports = new AuthorizationActions;