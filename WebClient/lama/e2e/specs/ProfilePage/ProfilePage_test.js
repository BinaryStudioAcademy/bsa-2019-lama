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

    // TODO: implement test
    it('Should upload new avatar', () => {
        profileSteps.moveToProfile();
        //waitForSpinner();

        const imagePath = 'C:\fakepath\appay-clipart-small[1].png';

        profileSteps.uploadAvatar(imagePath);
        console.log('---> AVATAR: ', profileSteps.getAvatarPath());
    });

    // TODO: implement test
    xit('Should delete avatar', () => {
        profileSteps.deleteAvatar();
    })
});
