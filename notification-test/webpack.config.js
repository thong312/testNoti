const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    mode: 'development', // or 'production'
    externals: [nodeExternals()],
    plugins: [
        new NodePolyfillPlugin()
    ],
    resolve: {
        fallback: {
            "util": require.resolve("util/"),
            "events": require.resolve("events/")
        }
    },
    // Optionally, you may include other Webpack configuration settings here
};