const page = require('./mainPage_PO');

class MainPageActions {
    gotoMainPage() {
        page.mainPage.waitForDisplayed(3000);
        page.mainPage.click();
    }
    gotoAlbumPage() {
        page.albumPage.waitForDisplayed(3000);
        page.albumPage.click();
    }
    gotoSharingPage() {
        page.sharingPage.waitForDisplayed(3000);
        page.sharingPage.click();
    }
    gotoPlacesPage() {
        page.placesPage.waitForDisplayed(3000);
        page.placesPage.click();
    }
    gotoCategoriesPage() {
        page.categoriesPage.waitForDisplayed(3000);
        page.categoriesPage.click();
    }
    gotoBinPage() {
        page.binPage.waitForDisplayed(3000);
        page.binPage.click();
    }

    putUploadPhotoButton() {
        page.uploadPhotoButton.waitForDisplayed(3000);
        page.uploadPhotoButton.click();
    }

    uploadPhoto(path) {
        browser.pause(1000);
        // page.uploadPhotoInput.waitForDisplayed(7000);
        page.uploadPhotoInput.setValue(path);
        page.uploadedPhoto.waitForDisplayed(3000);
    }

    savePhoto() {
        page.saveButton.waitForDisplayed(5000);
        page.saveButton.click();
    }

}
module.exports = new MainPageActions;