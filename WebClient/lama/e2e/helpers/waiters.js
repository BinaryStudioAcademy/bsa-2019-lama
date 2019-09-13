class CustomWaits {
    forSpinner() {
        const spinner = $('spinner');
        spinner.waitForDisplayed(10000);
        spinner.waitForDisplayed(10000, true);

    }

    forNotificationToDisappear() {
        const notification = $('div.toast div');
        notification.waitForDisplayed(5000, true);
    }

    forNotificationToAppear() {
        const notification = $$('p.notifier__notification-message')[0];
        notification.waitForDisplayed(3000);
    }
}

module.exports = new CustomWaits;