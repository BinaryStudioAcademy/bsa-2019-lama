const path = require('path');
const pageMainSteps = require('./mainPage_PA');
const page = require('../../helpers/helpers');
const validate = require('../../helpers/validators');

describe('Album Page', () => {
    beforeEach(() => {
        page.loginWithDefaultUser();
    });

    afterEach(() => {
        browser.reloadSession();
    });

    it('should upload photo from main page', () => {
        pageMainSteps.putUploadPhotoButton();
        pageMainSteps.uploadPhoto(path.join(__dirname, './test3.jpg'));
        pageMainSteps.savePhoto();
        validate.successNotificationTextIs('Uploaded');
    })
})