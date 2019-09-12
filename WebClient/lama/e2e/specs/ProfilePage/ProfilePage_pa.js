const ProfilePage = require('./ProfilePage_po');
const profile = new ProfilePage();

class ProfileActions {

    moveToProfile() {
        profile.avatarIcon.waitForDisplayed(10000);
        profile.avatarIcon.click();
    }

    enterFirstName(value) {
        profile.firstNameInput.waitForDisplayed(5000);
        profile.firstNameInput.clearValue();
        profile.firstNameInput.setValue(value);
    }

    enterLastName(value) {
        profile.lastNameInput.waitForDisplayed(2000);
        profile.lastNameInput.clearValue();
        profile.lastNameInput.setValue(value);
    }

    uploadAvatar(path) {
        browser.pause(5000)
        profile.imageInput.setValue(path);
    }

    deleteAvatar() {
        browser.pause(5000)
        profile.photoContainer.moveTo();
        browser.pause(1000);
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
        return profile.firstNameInput.getValue();
    }

    getLastName() {
        return profile.lastNameInput.getValue();
    }

    getAvatarPath() {
        return profile.imageInput.getValue();
    }

    getNotificationText() {
        return profile.notification.getText();
    }

    isEmailEnabled() {
       return profile.emailInput.isEnabled();
    }

    getImageSrc() {
        return profile.avatarImage.getAttribute('src');
    }
}

module.exports = ProfileActions;
