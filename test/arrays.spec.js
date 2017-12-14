import { dedupe } from "../source/arrays.js";

describe("arrays", function() {
    describe("dedupe", function() {
        it("removes duplicates", function() {
            expect(dedupe([1, 1, 2, 3, "4", "4", "5"])).to.deep.equal([1, 2, 3, "4", "5"]);
        });
    });
});
