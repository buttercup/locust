const { expect } = require("chai");
const { LOGIN_BUTTON_ATTR, revealShySubmitButtons } = require("../dist/prepare.js");

describe("prepare", function () {
    describe("revealShySubmitButtons", function () {
        beforeEach(function () {
            this.container = document.createElement("div");
            this.container.innerHTML = `<button>Sign In</button>`;
        });

        it("sets 'yes' flag on 'shy' buttons", function () {
            revealShySubmitButtons(this.container);
            const button = this.container.getElementsByTagName("button")[0];
            expect(button.getAttribute(LOGIN_BUTTON_ATTR)).to.equal("yes");
        });

        it("sets 'no' flag on other buttons", function () {
            this.container.innerHTML = `<button>Clear Form</button>`;
            revealShySubmitButtons(this.container);
            const button = this.container.getElementsByTagName("button")[0];
            expect(button.getAttribute(LOGIN_BUTTON_ATTR)).to.equal("no");
        });
    });
});
