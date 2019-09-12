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
}
module.exports = new MainPageActions;