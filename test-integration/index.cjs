const path = require("node:path");
const fs = require("node:fs/promises");
const puppeteer = require("puppeteer");
const sleep = require("sleep-promise");
const TESTS = require("./test-forms.json");

const LOCUST_PATH = path.resolve(__dirname, "../dist/index.js");

async function initialiseBrowser() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109) Gecko/20100101 Firefox/112.0");
    await page.setBypassCSP(true);
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, "platform", { get: () => "Win32" });
        Object.defineProperty(navigator, "productSub", { get: () => "20100101" });
        Object.defineProperty(navigator, "vendor", { get: () => "" });
        Object.defineProperty(navigator, "oscpu", { get: () => "Windows NT 10.0; Win64; x64" });
    });
    page.on("pageerror", evt => console.error(evt));
    // page.on("console", evt => console.log("[page]", evt.text()));
    page.on("error", evt => console.error(evt));
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
    const waitForOTPQuery = expectedFields.otp || "body";
    console.log("   ↦ navigation");
    await page.goto(url);
    console.log("   ↦ idle");
    await Promise.race([
        new Promise(resolve => setTimeout(resolve, 5000)),
        page.waitForNetworkIdle()
    ]);
    await sleep(1000);
    await page.evaluate(() => {
        const clicker = document.querySelector("button[onclick*=runProject]");
        if (clicker) {
            clicker.click();
        }
    });
    console.log(`   ↦ username (${waitForUsernameQuery})`);
    await page.waitForSelector(waitForUsernameQuery);
    console.log(`   ↦ password (${waitForPasswordQuery})`);
    await page.waitForSelector(waitForPasswordQuery);
    console.log(`   ↦ otp (${waitForOTPQuery})`);
    await page.waitForSelector(waitForOTPQuery);
    await page.addScriptTag({
        content: jsContent
    });
    await sleep(500);
    // console.log(await page.evaluate(() => {
    //     return document.body.outerHTML;
    // }));
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
        if (expectedFields && expectedFields.otp) {
            const otpField = document.querySelector(expectedFields.otp);
            if (target.otpField !== otpField) {
                throw new Error(
                    `No OTP field found matching query: ${expectedFields.otp}`
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
