const fs = require('fs');
const color = require('./utils/colors')

let srcBase

const exclusionDirList = ['.DS_Store']

const modifyExtName = exts => {
  exts.forEach(ext => {
    if (ext.indexOf('.') !== -1)
      ext = "." + ext
  })
}

const complementOptions = opts => {
  if (opts.limitSize === undefined) {
    opts.limitSize = 300
  }
}

const isValidOpts = opts => {
  let isValid = true;
  const errTmpl = msg => {
    return color.red + msg + color.reset;
  }
  const mandatoryOptsKeys = [
    "srcDir"
  ]
  mandatoryOptsKeys.forEach(key => {
    if (!opts[key]) {
      console.log(errTmpl(`[MonitorFileSize]missing required option '${key}'`))
      isValid = false;
    }
  })

  if (opts.warningSize && opts.limitSize < opts.warningSize) {
    console.log(errTmpl(`[MonitorFileSize]'warningSize' must be less than 'limitSize'`))
    isValid = false;
  }

  return isValid;
}

const monitorFileSize = userOpts => {
  complementOptions(userOpts)
  if (!isValidOpts(userOpts)) return;

  opts = userOpts

  modifyExtName(opts.targetExtensions)

  srcBase = opts.srcDir

  traverseDir(fs.readdirSync(srcBase), srcBase)
}



const isToExcluded = dir => {
  return exclusionDirList.find(excl => dir.indexOf(excl) !== -1) !== undefined
}

const traverseDir = (dirNames, selfPath) => {

  dirNames.forEach(dirName => {

    const fullPath = `${selfPath}/${dirName}`

    if (exclusionDirList.indexOf(dirName) !== -1) return;

    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fs.readdirSync(fullPath), fullPath)
    } else {
      getFileSize(fullPath)
    }
  })
}

const getFileSize = fullPath => {
  const displayPath = fullPath.split(`${srcBase}/`).pop()
  const fileSizeByte = fs.statSync(fullPath).size

  warnIfExceedLimit(displayPath, fileSizeByte)
}

const warningTmpl = (path, fileSize, limit, type) => {
  if (type == "limit") {
    return color.red +
      "[MonitorFileSize] " +
      color.yellow +
      path +
      color.red +
      " is " +
      color.yellow +
      fileSize +
      color.red +
      ` , which exceeds ${limit}. This file can largely affects the site performance.` +
      color.reset
  }
  if (type == "warn") {
    return color.green +
      "[MonitorFileSize] " +
      color.yellow +
      path +
      color.green +
      " is " +
      color.yellow +
      fileSize +
      color.green +
      ` , which exceeds ${limit}.` +
      color.reset
  }

  return;
}

const warnIfExceedLimit = (path, fileSizeByte) => {

  const limitSize = opts.limitSize * 1000
  const warnSize = opts.warningSize * 1000

  let displayFileSize;
  if (fileSizeByte < 1000) {
    displayFileSize = `${fileSizeByte}B`
  } else if (1000 <= fileSizeByte && fileSizeByte < 1000000) {
    displayFileSize = `${Math.round(fileSizeByte / 100) / 10}KB`
  } else {
    displayFileSize = `${Math.round(fileSizeByte / 100000) / 10}MB`
  }


  if (limitSize < fileSizeByte) {
    console.log(warningTmpl(path, displayFileSize, `${opts.limitSize}KB`, 'limit'))
    return;
  }

  if (warnSize && warnSize < fileSizeByte && fileSizeByte < limitSize) {
    console.log(warningTmpl(path, displayFileSize, `${opts.warningSize}KB`, 'warn'))
  }
}


module.exports = monitorFileSize
