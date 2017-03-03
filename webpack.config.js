module.exports = {
    entry: __dirname + "/src/davinci-mathscript.js",
    output: {
        path: __dirname + "/dist",
        filename: "davinci-mathscript.js",
        libraryTarget: "umd",
        library: "Ms"
    }
}
