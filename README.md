# filesize-monitor
npm package that checks filesize(in Byte) of specified directory and show warning message on terminal when it exceeds changable limit size.

## For what?
Even if you use auto-optimization tools (e.g. imagemin), sometimes they do not decrease filesize as you hope.
This npm package behaves like gatekeeper of your web service, which prevents that you release your web service with heavy resources without noticingg

## basic usage

```
npm install -D filesize-monitor
```

```js
const monitorFileSize = require("filesize-monitor")

//example
monitorFileSize({
  //write which directory to watch. default is "."
  srcDir: "./src",
  //write target file extensions to watch.
  targetExtensions: ["jpg", "png"],
  //write limit filesize in KB. It shows red colored warning message when size of a file exceeds this value. default is 500
  limitSize: 500,
  //write warning filesize in KB. It shows yellow colored warning message when size of a file exceeds this value. This value must be less than the value of "limitSize". default is undefined
  warningSize: 100,

})
```


## Still uncompleted.
This tool is quite new and not mature yet, so please inform any bugs, request of new features etc...
