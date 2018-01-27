const [webpackConfig] = require("./webpack.config.js");

delete webpackConfig.entry;

module.exports = config => config.set({

    basePath: __dirname,

    browsers: ["Chrome"],

    captureTimeout: 60000,

    colors: true,

    exclude: [],

    files: [
        "source/index.js",
        "test/index.js",
        "test/unit/**/*.spec.js"
    ],

    frameworks: ["mocha", "chai", "sinon"],

    plugins: [
        require("karma-webpack"),
        require("karma-chrome-launcher"),
        require("karma-mocha"),
        require("karma-chai"),
        require("karma-sinon"),
        require("karma-spec-reporter")
    ],

    preprocessors: {
        "source/**/*.js": ["webpack"],
        "test/unit/index.js": ["webpack"],
        "test/unit/**/*.spec.js": ["webpack"]
    },

    reporters: ["spec", "progress"],

    singleRun: false,

    webpack: webpackConfig

});
