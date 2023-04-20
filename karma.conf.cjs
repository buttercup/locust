const [webpackConfig] = require("./webpack.config.cjs");

delete webpackConfig.entry;
delete webpackConfig.experiments;
delete webpackConfig.externalsType;
delete webpackConfig.output;
delete webpackConfig.resolve.plugins
webpackConfig.mode = "development";

module.exports = config => config.set({
    basePath: __dirname,

    browsers: [/*"ChromeHeadless",*/ "FirefoxHeadless"],

    captureTimeout: 15000,

    client: {
        mocha: {
            timeout: "10000"
        }
    },

    colors: true,

    customLaunchers: {
        ChromeHeadless: {
            base: "Chrome",
            flags: [
                "--headless",
                "--disable-gpu",
                "--remote-debugging-port=9222",
                "--no-sandbox"
            ]
        },
        FirefoxHeadless: {
            base: "Firefox",
            flags: ["-headless"]
        }
    },

    exclude: [],

    files: [
        { pattern: "source/index.ts" },
        { pattern: "test/index.js" },
        { pattern: "test/unit/**/*.spec.js" }
    ],

    frameworks: ["mocha", "chai", "sinon", "webpack"],

    plugins: [
        require("karma-webpack"),
        require("karma-chrome-launcher"),
        require("karma-firefox-launcher"),
        require("karma-mocha"),
        require("karma-chai"),
        require("karma-sinon"),
        require("karma-spec-reporter")
    ],

    preprocessors: {
        "source/**/*.ts": ["webpack"],
        "test/unit/index.js": ["webpack"],
        "test/unit/**/*.spec.js": ["webpack"]
    },

    reporters: ["spec", "progress"],

    singleRun: true,

    webpack: webpackConfig
});
