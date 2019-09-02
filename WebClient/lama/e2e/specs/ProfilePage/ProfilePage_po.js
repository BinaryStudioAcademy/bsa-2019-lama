class ProfilePage {

    get profilePage () {return $('a.image.is-48x48.profile')};
    get firstNameInput () {return $('input#first-name.ng-untouched.ng-pristine.ng-valid')};
    get lastNameInput () {return $('input#last-name.ng-untouched.ng-pristine.ng-valid')};
    get emailInput () {return $('input#email.ng-untouched.ng-pristine.ng-valid')};
    get imageInput () {return $('input#user-photo-upload')};
    get deleteAvatarButton () {return $('button.is-black')};
    get saveButton () {return $('button.save-button')};
    get backButton () {return $('button.cancel-button')}

};

module.exports = ProfilePage;

