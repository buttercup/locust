const path = require("path");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

const DIST = path.resolve(__dirname, "./dist");
const SOURCE = path.resolve(__dirname, "./source");

const config = {
    entry: path.join(SOURCE, "./index.js"),

    output: {
        filename: "locust.js",
        path: DIST,
        library: "Locust",
        libraryTarget: "umd"
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: "babel-loader"
            }
        ]
    }
};

module.exports =
    process.env.NODE_ENV === "production"
        ? [
              config,
              Object.assign({}, config, {
                  output: {
                      filename: "locust.min.js",
                      path: DIST,
                      library: "Locust",
                      libraryTarget: "umd"
                  },
                  plugins: [new UglifyJSPlugin()]
              })
          ]
        : [config];
