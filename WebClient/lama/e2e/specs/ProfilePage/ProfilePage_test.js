const assert = require('assert');
const { loginWithGoogle } = require('../../helpers/auth');
const credencial = require('../../testdata.json');
const wait = require('../../helpers/waiters');
const random = Math.floor(Math.random() * 1000000);
const ProfileActions = require('./ProfilePage_pa');
const profileSteps = new ProfileActions();
const newFirstName = `Lama-${random}`;
const newLastName = `Moore-${random}`;
const notificationText = 'Changes Saved';
const imagePath = 'C:\\Users\\VLADOS\\Downloads\\appay-clipart-small[1].png';


describe('Profile', () => {
    beforeEach(() => {
        browser.maximizeWindow();
        browser.url(credencial.appUrl);
        loginWithGoogle(browser);
    });
    
    xit('Should edit profile page', () => {
        profileSteps.moveToProfile();

        profileSteps.enterFirstName(newFirstName);
        profileSteps.enterLastName(newLastName);
        profileSteps.saveChanges();

        wait.forNotification();
        assert.equal(profileSteps.getNotificationText(), notificationText);
        assert.equal(profileSteps.getFirstName(), newFirstName);
        assert.equal(profileSteps.getLastName(), newLastName);
        assert.equal(profileSteps.isEmailEnabled(), false); 
    });

    xit('Should upload new avatar', () => {
        profileSteps.moveToProfile();
        const oldPath = profileSteps.getAvatarPath();
        profileSteps.uploadAvatar(imagePath);
        profileSteps.saveChanges();
        const newPath = profileSteps.getAvatarPath();
        
        assert.notEqual(oldPath, newPath);

    });

    it('Should delete avatar', () => {
        profileSteps.moveToProfile();
        profileSteps.uploadAvatar(imagePath);
        const oldSrc = profileSteps.getImageSrc();
        profileSteps.deleteAvatar();
        profileSteps.saveChanges();
        const newSrc = profileSteps.getImageSrc();

        assert.notEqual(oldSrc, newSrc);
    })
});
