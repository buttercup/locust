const { expect } = require("chai");
const sinon = require("sinon");
const { fetchFormsWithInputs, sortFormElements } = require("../dist/inputs.js");
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
            fetchFormsWithInputs(() => true, this.queryEl);
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
            fetchFormsWithInputs(() => true, this.queryEl);
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
            const forms = fetchFormsWithInputs(() => true, this.queryEl);
            expect(forms).to.have.lengthOf(0);
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
