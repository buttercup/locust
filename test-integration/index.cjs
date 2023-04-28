const path = require("node:path");
const fs = require("node:fs/promises");
const puppeteer = require("puppeteer");
const TESTS = require("./test-forms.json");

const LOCUST_PATH = path.resolve(__dirname, "../dist/index.js");

async function initialiseBrowser() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setBypassCSP(true);
    return [browser, page];
}

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
    console.log("   . navigation");
    await Promise.race([
        new Promise(resolve => setTimeout(resolve, 5000)),
        page.waitForNetworkIdle()
    ]);
    console.log("   . idle");
    await page.addScriptTag({
        content: jsContent
    });
    await page.waitForSelector(waitForUsernameQuery);
    console.log("   . username");
    await page.waitForSelector(waitForPasswordQuery);
    console.log("   . password");
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
            let timeout;
            await Promise.race([
                testConfiguration(test, browser, page),
                new Promise((resolve, reject) => {
                    timeout = setTimeout(() => reject(new Error("Timed out")), 30000);
                })
            ]);
            clearTimeout(timeout);
        } catch (err) {
            await browser.close();
            throw err;
        }
    }
    console.log("Tests complete.");
    await page.close();
    await browser.close();
})()
.catch(err => {
    console.error(err);
    setTimeout(() => {
        process.exit(1);
    }, 1000);
});
