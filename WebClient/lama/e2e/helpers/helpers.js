class WindowHandler {

    switchToParent(parentGUID) {
        browser.switchToWindow(parentGUID);
    }

    switchToChild(parentGUID) {
        const allGUID = browser.getWindowHandles();
        console.log("Page title before Switching : " + browser.getTitle());
        console.log("Total Windows : " + allGUID.length);
        for (var i = 0; i < allGUID.length; i++) {
            if (allGUID[i] != parentGUID) {
                browser.switchToWindow(allGUID[i]);
                break;
            }
        }
    }
}

module.exports = new WindowHandler;