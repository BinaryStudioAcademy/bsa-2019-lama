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

        // const a = ($('input' [2]));
        // console.log(a);

        page.uploadPhotos.setValue(path);
        //page.uploadPhotos.setValue(path);
        page.uploadedPhotos.waitForDisplayed(3000);
    }
    savePhotos() {
        page.saveButton.waitForDisplayed(3000);
        page.saveButton.click();
    }
}
module.exports = new AlbumPageActions;