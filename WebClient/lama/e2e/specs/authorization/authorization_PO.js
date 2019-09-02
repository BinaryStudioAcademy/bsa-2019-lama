class AuthorizationPage {
    get goToPhotos() { return $('div.content-container button.mat-flat-button') };
    get googleButton() { return $('a.button') };

};
module.exports = AuthorizationPage;