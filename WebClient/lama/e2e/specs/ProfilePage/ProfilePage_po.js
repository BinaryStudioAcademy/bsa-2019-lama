class ProfilePage {

    get avatarIcon () {return $('a.profile img.is-rounded')}
    get firstNameInput () {return $('input#first-name')}
    get lastNameInput () {return $('input#last-name')}
    get emailInput () {return $('input#email')}
    get imageInput () {return $('div.user-photo-container input')}
    get deleteAvatarButton () {return $('button.is-black')}
    get saveButton () {return $('button.save-button')}
    get backButton () {return $('button.cancel-button')}
    get notification () {return $('.notifier__notification--success .notifier__notification-message')}
    get photoContainer () {return $('div.user-photo-container')}
    get avatarImage () {return $('.user-photo-container img.is-rounded')}

};

module.exports = ProfilePage;

