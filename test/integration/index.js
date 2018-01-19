const path = require("path");
const Nightmare = require("nightmare");
const TESTS = require("./test-forms.json");

const LOCUST_PATH = path.resolve(__dirname, "../../dist/locust.min.js");

function initialiseNightmare() {
    const nightmare = Nightmare({
        waitTimeout: 15000,
        gotoTimeout: 15000
    });
    return nightmare;
}

function testConfiguration(config, nightmare) {
    const { name, url, expectedFields } = config;
    console.log(` - Testing: ${name}`);
    if (!expectedFields) {
        throw new Error(`Invalid test: No expected fields provided`);
    }
    return nightmare
        .goto(url)
        .inject("js", LOCUST_PATH)
        .wait(500)
        .evaluate(function(expectedFields) {
            if (!window.Locust) {
                return "error:No global Locust variable found";
            }
            const target = window.Locust.getLoginTarget();
            if (!target) {
                return "error:No login targets found";
            }
            if (expectedFields.includes("username") && target.usernameFields.length === 0) {
                return "error:No username field found";
            }
            if (expectedFields.includes("password") && target.passwordFields.length === 0) {
                return "error:No password field found";
            }
            return "ok";
        }, expectedFields)
        .then(result => {
            if (result === "ok") {
            } else if (/^error:/.test(result)) {
                const message = result.replace(/^error:/, "");
                throw new Error(`Test failed: ${message}`);
            } else {
                throw new Error("Unknown error");
            }
        });
}

console.log("Running integration tests:");
let work = Promise.resolve();
const nightmare = initialiseNightmare();
TESTS.forEach(test => {
    work = work.then(() => testConfiguration(test, nightmare));
});
work
    .then(() => nightmare.end())
    .then(() => {
        console.log("Tests complete.");
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
