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

    // enterEmail(value) {
    //     profile.emailInput.waitForDisplayed(2000);
    //     profile.emailInput.clearValue();
    //     profile.emailInput.setValue(value);
    // }

    uploadAvatar(path) {
        profile.imageInput.waitForDisplayed(2000);
        // profile.imageInput.setValue(path);
        profile.imageInput.sendKeys(path);
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
        return profile.firstNameInput.getValue();
    }

    getLastName() {
        return profile.lastNameInput.getValue();
    }

    // getEmail() {
    //     return profile.emailInput.getText();
    // }

    getAvatarPath() {
        return profile.imageInput.value;
    }

    getNotificationText() {
        return profile.notification.getText();
    }

    isEmailEnabled() {
       return profile.emailInput.isEnabled();
    }
}

module.exports = ProfileActions;
