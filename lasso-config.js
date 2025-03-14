module.exports = {
    outputDir: __dirname + "/public/static",
    urlPrefix: "/static",
    fingerprintsEnabled: false,
    bundlingEnabled: true,
    minify: true,
    require: {
        transforms: [
            {
                transform: "lasso-marko",
                config: {}
            }
        ]
    }
};