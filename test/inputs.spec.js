const { expect } = require("chai");
const sinon = require("sinon");
const { fetchFormsWithInputs, setInputValue, sortFormElements } = require("../dist/inputs.js");
const { FORM_QUERIES } = require("../dist/inputPatterns.js");

describe("inputs", function () {
    describe("fetchFormsWithInputs", function () {
        beforeEach(function () {
            this.forms = [];
            const qsaStub = sinon.stub();
            qsaStub.returns([]).onFirstCall().returns(this.forms);
            this.queryEl = {
                querySelectorAll: qsaStub
            };
        });

        it("fetches forms by name", function () {
            fetchFormsWithInputs(this.queryEl);
            expect(this.queryEl.querySelectorAll.calledWithExactly(FORM_QUERIES.join(","))).to.be
                .true;
            expect(this.queryEl.querySelectorAll.calledOnce).to.be.true;
        });

        it("fetches elements under form", function () {
            const fakeForm = {
                elements: [],
                querySelectorAll: sinon.stub().returns([]),
                tagName: "form"
            };
            this.forms.push(fakeForm);
            fetchFormsWithInputs(this.queryEl);
            expect(fakeForm.querySelectorAll.callCount).to.be.at.least(3);
        });

        it("filters forms without password fields", function () {
            const fakeForm = {
                elements: [],
                querySelectorAll: sinon.stub().callsFake(function (query) {
                    if (/username/.test(query)) {
                        return {};
                    }
                    return [];
                }),
                tagName: "form"
            };
            this.forms.push(fakeForm);
            const forms = fetchFormsWithInputs(this.queryEl);
            expect(forms).to.have.lengthOf(0);
        });
    });

    describe("setInputValue", function () {
        beforeEach(function () {
            this.input = document.createElement("input");
            document.body.appendChild(this.input);
        });

        afterEach(function () {
            document.body.removeChild(this.input);
        });

        it("sets the input's value", function () {
            expect(this.input.value).to.equal("");
            setInputValue(this.input, "new value");
            expect(this.input.value).to.equal("new value");
        });

        it("fires the input's 'input' event", function () {
            return new Promise((resolve) => {
                this.input.addEventListener(
                    "input",
                    (event) => {
                        expect(event.target.value).to.equal("123");
                        resolve();
                    },
                    false
                );
                setInputValue(this.input, "123");
            });
        });

        it("fires the input's 'change' event", function () {
            return new Promise((resolve) => {
                this.input.addEventListener(
                    "change",
                    (event) => {
                        expect(event.target.value).to.equal("456");
                        resolve();
                    },
                    false
                );
                setInputValue(this.input, "456");
            });
        });
    });

    describe("sortFormElements", function () {
        beforeEach(function () {
            this.username1 = document.createElement("input");
            this.username2 = document.createElement("input");
            this.username2.setAttribute("type", "email");
            this.usernames = [this.username1, this.username2];
        });

        it("throws if no type is provided", function () {
            expect(() => {
                sortFormElements(this.usernames);
            }).to.throw(/Type is invalid/i);
        });

        it("sorts username inputs correctly", function () {
            const sorted = sortFormElements(this.usernames, "username");
            expect(sorted[0]).to.equal(this.username2);
            expect(sorted[1]).to.equal(this.username1);
        });
    });
});
