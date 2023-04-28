const path = require("path");
const ResolveTypeScriptPlugin = require("resolve-typescript-plugin");

const DIST = path.resolve(__dirname, "./dist");
const SOURCE = path.resolve(__dirname, "./source");
const DEV_SRC = path.resolve(__dirname, "./dev");
const INJECT_MODE = process.env.INJECT === "yes";

module.exports = {
    devtool: false,

    entry: path.join(INJECT_MODE ? DEV_SRC : SOURCE, "./index.ts"),

    mode: "development",

    output: {
        filename: "index.js",
        path: DIST,
        library: {
            name: "Locust",
            type: "umd"
        }
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: "ts-loader",
                    options: {
                        configFile: "tsconfig.test.json",
                        onlyCompileBundledFiles: true
                    }
                },
                exclude: /node_modules/,
                resolve: {
                    fullySpecified: false
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                },
                resolve: {
                    fullySpecified: false
                }
            }
        ]
    },

    resolve: {
        extensions: [".ts", ".js"],
        fallback: {
            crypto: false,
            fs: false,
            net: false
        },
        plugins: [
            // Handle .ts => .js resolution
            new ResolveTypeScriptPlugin()
        ]
    },

    target: "web"
};
