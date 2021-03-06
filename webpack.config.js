const path = require("path");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

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

const config = {
    entry: path.join(INJECT_MODE ? DEV_SRC : SOURCE, "./index.js"),

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
