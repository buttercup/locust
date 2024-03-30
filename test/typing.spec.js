const { expect } = require("chai");
const sinon = require("sinon");
const { typeIntoInput } = require("../dist/typing.js");

describe("typing", function () {
    describe("typeIntoInput", function () {
        beforeEach(function () {
            this.input = document.createElement("input");
            document.body.appendChild(this.input);
        });

        afterEach(function () {
            document.body.removeChild(this.input);
        });

        it("sets the input's value", async function () {
            expect(this.input.value).to.equal("");
            await typeIntoInput(this.input, "new value");
            expect(this.input.value).to.equal("new value");
        });

        it("fires the input's 'change' event", async function () {
            let entered = "";
            const work = new Promise((resolve) => {
                this.input.addEventListener(
                    "change",
                    (event) => {
                        entered = event.target.value;
                        resolve();
                    },
                    false
                );
            });
            await typeIntoInput(this.input, "123");
            await work;
            expect(entered).to.equal("123");
        });

        it("fires the input's 'input' event", async function () {
            let typed = "";
            const work = new Promise((resolve) => {
                this.input.addEventListener(
                    "input",
                    (event) => {
                        typed = event.data;
                        resolve();
                    },
                    false
                );
            });
            await typeIntoInput(this.input, "4");
            await work;
            expect(typed).to.equal("4");
        });
    });
});
