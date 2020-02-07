const path = require("path")
const monitorFileSize = require("../index")


monitorFileSize({
  srcDir: path.resolve(__dirname, "./src"),
  targetExtensions: ["jpg", "png"],
  warningSize: 100,
  limitSize: 500,
})
