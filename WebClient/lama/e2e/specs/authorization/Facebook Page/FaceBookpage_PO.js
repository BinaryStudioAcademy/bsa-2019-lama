class FBPage {
    get userEmail() { return $('input#email') }; //test236213
    get userPassword() { return $('input#pass') }; //136223
    get enterButton() { return $('input#u_0_0') }
}

module.exports = FBPage;