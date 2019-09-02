const assert = require('assert');

const ProfileActions = require('./ProfilePage_pa');

const profileSteps = new ProfileActions();

const newFirstName = 'Lama';
const newLastName = 'Moore';
const newEmail = 'lamatest@gmail.com';

// describe('Profile', () => {
//     beforeEach(() => {
//         browser.maximizeWindow();
//         browser.url('');
//     });

    
    it('Should edit profile page', () => {
        
    profileSteps.moveToProfile();

    waitForSpinner();
    profileSteps.enterFirstName(newFirstName);
    profileSteps.enterLastName(newLastName);
    profileSteps.enterEmail(newEmail);
    profileSteps.uploadAvatar();
    profileSteps.deleteAvatar();
    profileSteps.saveChanges();

    waitForNotification();
    assert.equal(getNotificationText(), 'Changes Saved');
    assert.equal(profileSteps.getFirstName(), newFirstName);
    assert.equal(profileSteps.getLastName(), newLastName);
    assert.equal(profileSteps.getEmail(), newEmail);
   

    });
//});
