//const path = require('path');
const pageAlbumSteps = require('./albumPage_PA');
const pageMainSteps = require('../mainPage/mainPage_PA');
const googleAuth = require('./../authorization/Google Page/GooglePage_PA');
const handleWindow = require('../../helpers/helpers');
const credentials = require('../../testdata');
const validate = require('../../helpers/validators');
const pageSteps = require('./../authorization/authorization_PA');

describe('Album Page', () => {
    beforeEach(() => {
        browser.maximizeWindow();
        browser.url(credentials.appUrl);
        const parentGUID = browser.getWindowHandle();
        pageSteps.goToMainPage();
        pageSteps.loginWithGoogle();
        handleWindow.switchToChild(parentGUID);
        googleAuth.enterMail(credentials.googleEmail);
        googleAuth.enterPassword(credentials.googlePassword);
        browser.pause(5000);
        handleWindow.switchToParent(parentGUID);
    });

    afterEach(() => {
        browser.reloadSession();
    });

    it('should create new album', () => {
        pageMainSteps.gotoAlbumPage();
        pageAlbumSteps.openAlbumUploadModalWindow();
        pageAlbumSteps.setNameAlbum(credentials.newAlbumName);
        browser.pause(5000);
        pageAlbumSteps.uploadPhoto(__dirname, ['./test1.jpg, ./test2.jpg, ./test3.jpg']);
        pageAlbumSteps.savePhotos();
        validate.successNotificationTextIs();
    })
})