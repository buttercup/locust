const path = require("node:path");
const fs = require("node:fs/promises");
// const Nightmare = require("nightmare");
const puppeteer = require("puppeteer");
const TESTS = require("./test-forms.json");

const LOCUST_PATH = path.resolve(__dirname, "../dist/index.js");

async function initialiseBrowser() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setBypassCSP(true);
    return [browser, page];
}

// function initialiseNightmare() {
//     const nightmare = Nightmare({
//         waitTimeout: 15000,
//         gotoTimeout: 15000,
//         webPreferences: {
//             allowRunningInsecureContent: true,
//             nodeIntegration: false,
//             webSecurity: false
//         }
//     });
//     nightmare.useragent(
//         "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3015.0 Safari/537.36"
//     );
//     return nightmare;
// }

async function testConfiguration(config, browser, page) {
    const { name, url, expectedFields } = config;
    console.log(` - Testing: ${name}`);
    if (!expectedFields) {
        throw new Error(`Invalid test: No expected fields provided`);
    }
    const jsContent = await fs.readFile(LOCUST_PATH, "utf8");
    const waitForUsernameQuery = expectedFields.username || "body";
    const waitForPasswordQuery = expectedFields.password || "body";
    await page.goto(url);
    await page.waitForNetworkIdle();
    // await page.addScriptTag({ path: LOCUST_PATH });
    await page.addScriptTag({
        content: jsContent
    });
    await page.waitForSelector(waitForUsernameQuery);
    await page.waitForSelector(waitForPasswordQuery);
    await page.evaluate((expectedFields) => {
        if (!window.Locust) {
            throw new Error("No global Locust variable found");
        }
        const target = window.Locust.getLoginTarget();
        if (!target) {
            throw new Error("No login targets found");
        }
        if (expectedFields && expectedFields.username) {
            const usernameField = document.querySelector(expectedFields.username);
            if (target.usernameField !== usernameField) {
                throw new Error(
                    `No username field found matching query: ${expectedFields.username}`
                );
            }
        }
        if (expectedFields && expectedFields.password) {
            const passwordField = document.querySelector(expectedFields.password);
            if (target.passwordField !== passwordField) {
                throw new Error(
                    `No password field found matching query: ${expectedFields.password}`
                );
            }
        }
    }, expectedFields);
}

(async function() {
    console.log("Running integration tests:");
    const [browser, page] = await initialiseBrowser();
    for (const test of TESTS) {
        try {
            await Promise.race([
                testConfiguration(test, browser, page),
                new Promise((resolve, reject) => {
                    setTimeout(() => reject(new Error("Timed out")), 15000);
                })
            ]);
        } catch (err) {
            await browser.close();
            throw err;
        }
    }
    console.log("Tests complete.");
    await browser.close();
})()
.catch(err => {
    console.error(err);
    setTimeout(() => {
        process.exit(1);
    }, 1000);
});

// console.log("Running integration tests:");
// let work = Promise.resolve();
// const nightmare = initialiseNightmare();
// TESTS.forEach((test) => {
//     work = work.then(() => Promise.race([
//         testConfiguration(test, nightmare),
//         new Promise((resolve, reject) => {
//             setTimeout(() => reject(new Error("Timed out")), 15000);
//         })
//     ]));
// });
// work.then(() => nightmare.end())
//     .then(() => {
//         console.log("Tests complete.");
//     })
//     .catch((err) => {
//         console.error(err);
//         process.exit(1);
//     });
