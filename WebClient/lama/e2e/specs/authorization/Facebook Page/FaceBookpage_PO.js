class FBPage {
    get userEmail() { return $('input#email') }; 
    get userPassword() { return $('input#pass') }; 
    get enterButton() { return $('input#u_0_0') }
}

module.exports = FBPage;