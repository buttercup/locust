const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const ResolveTypeScriptPlugin = require("resolve-typescript-plugin");

const DIST = path.resolve(__dirname, "./dist");
const SOURCE = path.resolve(__dirname, "./source");
const DEV_SRC = path.resolve(__dirname, "./dev");
const INJECT_MODE = process.env.INJECT === "yes";

if (INJECT_MODE) {
    console.log("Running injection-script build...");
    console.log("Inject the following:");
    console.log(
        `(function() { var s = document.createElement("script"); s.src="http://localhost:8081/locust.js"; document.body.appendChild(s); })()`
    );
}

const generateConfig = () => ({
    entry: path.join(INJECT_MODE ? DEV_SRC : SOURCE, "./index.js"),

    experiments: {
        outputModule: true
    },

    externalsType: "module",

    mode: "development",

    output: {
        filename: "index.js",
        path: DIST,
        library: {
            type: "module"
        },
        environment: {
            module: true
        }
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
                resolve: {
                    fullySpecified: false
                }
            }
        ]
    },

    resolve: {
        extensions: [".ts", ".js"],
        fallback: {
            fs: false,
            net: false
        },
        plugins: [
            // Handle .ts => .js resolution
            new ResolveTypeScriptPlugin()
        ]
    },

    target: "web"
});

module.exports =
    process.env.NODE_ENV === "production"
        ? [
              Object.assign({}, generateConfig(), {
                  mode: "production",
                  optimization: {
                      minimize: true,
                      minimizer: [
                          new TerserPlugin({
                              exclude: /\/node_modules/,
                              parallel: true
                          })
                      ]
                  },
                  output: {
                      filename: "index.js",
                      path: DIST,
                      library: {
                        type: "module"
                      },
                      environment: {
                        module: true
                      }
                  }
              })
          ]
        : [config];
