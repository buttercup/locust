import { fetchFormsWithInputs, setInputValue } from "../../source/inputs.js";

describe("inputs", function() {
    describe("fetchFormsWithInputs", function() {
        beforeEach(function() {
            this.forms = [];
            this.queryEl = {
                getElementsByTagName: sinon.stub().returns(this.forms)
            };
        });

        it("fetches forms by name", function() {
            fetchFormsWithInputs(this.queryEl);
            expect(this.queryEl.getElementsByTagName.calledWithExactly("form")).to.be.true;
            expect(this.queryEl.getElementsByTagName.calledOnce).to.be.true;
        });

        it("fetches elements under form", function() {
            const fakeForm = {
                querySelectorAll: sinon.stub().returns([])
            };
            this.forms.push(fakeForm);
            fetchFormsWithInputs(this.queryEl);
            expect(fakeForm.querySelectorAll.calledThrice).to.be.true;
        });

        it("filters forms without password fields", function() {
            const fakeForm = {
                querySelectorAll: sinon.stub().callsFake(function(query) {
                    if (/username/.test(query)) {
                        return {};
                    }
                    return [];
                })
            };
            this.forms.push(fakeForm);
            const forms = fetchFormsWithInputs(this.queryEl);
            expect(forms).to.have.lengthOf(0);
        });
    });

    describe("setInputValue", function() {
        beforeEach(function() {
            this.input = document.createElement("input");
            document.body.appendChild(this.input);
        });

        afterEach(function() {
            document.body.removeChild(this.input);
        });

        it("sets the input's value", function() {
            expect(this.input.value).to.equal("");
            setInputValue(this.input, "new value");
            expect(this.input.value).to.equal("new value");
        });

        it("fires the input's 'input' event", function() {
            return new Promise(resolve => {
                this.input.addEventListener(
                    "input",
                    event => {
                        expect(event.target.value).to.equal("123");
                        resolve();
                    },
                    false
                );
                setInputValue(this.input, "123");
            });
        });

        it("fires the input's 'change' event", function() {
            return new Promise(resolve => {
                this.input.addEventListener(
                    "change",
                    event => {
                        expect(event.target.value).to.equal("456");
                        resolve();
                    },
                    false
                );
                setInputValue(this.input, "456");
            });
        });
    });
});
