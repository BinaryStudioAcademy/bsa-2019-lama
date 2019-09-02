class GooglePage {
    get userEmail() { return $('input[id=identifierId]') };
    get nextButton() { return $('div#identifierNext') };
    get userPassword() { return $('input.whsOnd.zHQkBf[type=password]') };
    get nextButton1() { return $('div#passwordNext') };
}
module.exports = GooglePage;