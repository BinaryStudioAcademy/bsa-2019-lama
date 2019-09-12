const page = require('./albumPage_PO');
class AlbumPageActions {
    openAlbumUploadModalWindow() {
        page.newAlbum.waitForDisplayed(5000);
        page.newAlbum.click();
    }
    setNameAlbum(value) {
        page.albumName.waitForDisplayed();
        page.albumName.clearValue();
        page.albumName.setValue(value);
    }
    uploadPhoto(path) {
        browser.pause(5000);
        page.uploadPhotos.setValue(path);
        page.uploadedPhotos.waitForDisplayed();
    }
    savePhotos() {
        page.saveButton.waitForDisplayed();
        page.saveButton.click();
    }
}
module.exports = new AlbumPageActions;