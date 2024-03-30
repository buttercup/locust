const { expect } = require("chai");
const sinon = require("sinon");
const { LoginTarget } = require("../dist/LoginTarget.js");
const { typeIntoInput } = require("../dist/typing.js");

describe("LoginTarget", function () {
    beforeEach(function () {
        this.target = new LoginTarget();
    });

    it("implements event emitter methods", function () {
        expect(this.target).to.have.property("emit").that.is.a("function");
        expect(this.target).to.have.property("on").that.is.a("function");
        expect(this.target).to.have.property("once").that.is.a("function");
    });

    it("fires events when username inputs are updated", async function () {
        let currentValue = "";
        this.target.usernameField = document.createElement("input");
        this.target.on("valueChanged", (info) => {
            if (info.type === "username") {
                currentValue = info.value;
            }
        });
        await typeIntoInput(this.target.usernameField, "user5644");
        expect(currentValue).to.equal("user5644");
    });

    it("specifies event source as 'fill' when set using the setter method", async function () {
        let source = "";
        this.target.usernameField = document.createElement("input");
        this.target.on("valueChanged", (info) => {
            if (info.type === "username") {
                source = info.source;
            }
        });
        await typeIntoInput(this.target.usernameField, "user5644");
        expect(source).to.equal("fill");
    });

    it("specifies event source as 'keypress' when set updating the input", function () {
        let source = "";
        this.target.usernameField = document.createElement("input");
        this.target.on("valueChanged", (info) => {
            if (info.type === "username") {
                source = info.source;
            }
        });
        this.target.usernameField.value = "user5655";
        this.target.usernameField.dispatchEvent(new Event("input"));
        this.target.usernameField.dispatchEvent(new Event("change"));
        expect(source).to.equal("keypress");
    });

    it("fires events when the submit button is clicked", function () {
        let formSubmitted = 0;
        this.target.on("formSubmitted", (info) => {
            if (info.source === "submitButton") {
                formSubmitted += 1;
            }
        });
        const button = (this.target.submitButton = document.createElement("button"));
        button.type = "button";
        button.click();
        expect(formSubmitted).to.equal(1);
    });

    it("fires events when the form is submitted", function () {
        let formSubmitted = 0;
        this.target.on("formSubmitted", (info) => {
            if (info.source === "form") {
                formSubmitted += 1;
            }
        });
        const fakeForm = {
            addEventListener: sinon.spy()
        };
        this.target.form = fakeForm;
        expect(fakeForm.addEventListener.calledWith("submit")).to.be.true;
        expect(fakeForm.addEventListener.calledOnce).to.be.true;
        const eventListener = fakeForm.addEventListener.firstCall.args[1];
        // Simulate submit
        eventListener();
        expect(formSubmitted).to.equal(1);
    });

    it("fires events when password inputs are updated", async function () {
        let currentValue = "";
        this.target.passwordField = document.createElement("input");
        this.target.on("valueChanged", (info) => {
            if (info.type === "password") {
                currentValue = info.value;
            }
        });
        await typeIntoInput(this.target.passwordField, "pass!3233 5");
        expect(currentValue).to.equal("pass!3233 5");
    });

    describe("calculateScore", function () {
        it("returns 0 if no items are set", function () {
            expect(this.target.calculateScore()).to.equal(0);
        });

        it("returns a higher score if a username field exists", function () {
            this.target.usernameField = document.createElement("input");
            expect(this.target.calculateScore()).to.be.above(0);
        });

        it("returns a higher score if a password field exists", function () {
            this.target.passwordField = document.createElement("input");
            expect(this.target.calculateScore()).to.be.above(0);
        });

        it("returns a higher score if both inputs exist", function () {
            this.target.passwordField = document.createElement("input");
            const singleFieldScore = this.target.calculateScore();
            this.target.usernameField = document.createElement("input");
            expect(this.target.calculateScore()).to.be.above(singleFieldScore);
        });
    });

    describe("login", function () {
        beforeEach(function () {
            this.target.usernameField = this.username = document.createElement("input");
            this.target.passwordField = this.password = document.createElement("input");
            sinon.stub(this.target, "submit");
        });

        it("sets the values of the inputs", function () {
            return this.target.login("myUsername", "myPassword").then(() => {
                expect(this.username.value).to.equal("myUsername");
                expect(this.password.value).to.equal("myPassword");
            });
        });

        it("submits the form", function () {
            return this.target.login("myUsername", "myPassword").then(() => {
                expect(this.target.submit.calledOnce).to.be.true;
            });
        });
    });

    describe("submit", function () {
        beforeEach(function () {
            this.target.submitButton = this.submitButton = document.createElement("input");
            sinon.stub(this.submitButton, "click");
        });

        it("clicks the submit button", function () {
            return this.target.submit().then(() => {
                expect(this.submitButton.click.calledOnce).to.be.true;
            });
        });
    });
});
