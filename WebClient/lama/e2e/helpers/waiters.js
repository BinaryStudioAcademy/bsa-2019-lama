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

    forNotification() {
        const notification = $('.notifier__notification--success');
        notification.waitForDisplayed(5000);
    }

}

module.exports = new CustomWaits();