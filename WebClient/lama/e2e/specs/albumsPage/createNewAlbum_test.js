const path = require('path');
const pageAlbumSteps = require('./albumPage_PA');
const pageMainSteps = require('../mainPage/mainPage_PA');
const page = require('../../helpers/helpers');
const credentials = require('../../testdata');
const validate = require('../../helpers/validators');

describe('Album Page', () => {
    beforeEach(() => {
        page.loginWithDefaultUser();
    });

    afterEach(() => {
        browser.reloadSession();
    });

    it('should create new album', () => {
        pageMainSteps.gotoAlbumPage();
        pageAlbumSteps.openAlbumUploadModalWindow();
        pageAlbumSteps.setNameAlbum(credentials.newAlbumName);
        browser.pause(5000);
        pageAlbumSteps.uploadPhoto(path.join(__dirname, './test2.jpg'));
        pageAlbumSteps.savePhotos();
        validate.successNotificationTextIs('Album created');
    })
})