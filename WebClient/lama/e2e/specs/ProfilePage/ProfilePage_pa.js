const ProfilePage = require('./ProfilePage_po');
const profile = new ProfilePage();

class ProfileActions {

    moveToProfile() {
        profile.profilePage.waitForDisplayed(10000);
        profile.profilePage.moveTo();
    }

    enterFirstName(value) {
        profile.firstNameInput.waitForDisplayed(2000);
        profile.firstNameInput.clearValue();
        profile.firstNameInput.setValue(value);
    }

    enterLastName(value) {
        profile.lastNameInput.waitForDisplayed(2000);
        profile.lastNameInput.clearValue();
        profile.lastNameInput.setValue(value);
    }

    enterEmail(value) {
        profile.emailInput.waitForDisplayed(2000);
        profile.emailInput.clearValue();
        profile.emailInput.setValue(value);
    }

    uploadAvatar(path) {
        profile.imageInput.waitForDisplayed(2000);
        profile.imageInput.setValue(path);
    }

    deleteAvatar() {
        profile.deleteAvatarButton.waitForDisplayed(2000);
        profile.deleteAvatarButton.click();
    }

    saveChanges() {
        profile.saveButton.waitForDisplayed(2000);
        profile.saveButton.click();
    }

    moveToPreviousPage() {
        profile.backButton.waitForDisplayed(2000);
        profile.backButton.click();
    }

    getFirstName() {
        return profile.firstNameInput.getText();
    }

    getLastName() {
        return profile.lastNameInput.getText();
    }
    getEmail() {
        return profile.emailInput.getText();
    }
}

module.exports = ProfileActions;
