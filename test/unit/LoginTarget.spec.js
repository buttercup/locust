import LoginTarget from "../../source/LoginTarget.js";

describe("LoginTarget", function() {
    beforeEach(function() {
        this.target = new LoginTarget();
    });

    it("implements event emitter methods", function() {
        expect(this.target)
            .to.have.property("emit")
            .that.is.a("function");
        expect(this.target)
            .to.have.property("on")
            .that.is.a("function");
        expect(this.target)
            .to.have.property("once")
            .that.is.a("function");
    });
});
