class MainPage {
    get mainPage() { return $$('li')[0] };
    get albumPage() { return $$('li')[1] };
    get sharingPage() { return $$('li')[2] };
    get placesPage() { return $$('li')[3] };
    get categoriesPage() { return $$('li')[4] };
    get binPage() { return $$('li')[5] };
}

module.exports = new MainPage;