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
                throw new Error("No global Locust variable found");
            }
            const target = window.Locust.getLoginTarget();
            if (!target) {
                throw new Error("No login targets found");
            }
            if (expectedFields && expectedFields.username) {
                const usernameField = document.querySelector(expectedFields.username);
                if (target.usernameFields.includes(usernameField) !== true) {
                    throw new Error(`No username field found matching query: ${expectedFields.username}`);
                }
            }
            if (expectedFields && expectedFields.password) {
                const passwordField = document.querySelector(expectedFields.password);
                if (target.passwordFields.includes(passwordField) !== true) {
                    throw new Error(`No password field found matching query: ${expectedFields.password}`);
                }
            }
        }, expectedFields);
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
