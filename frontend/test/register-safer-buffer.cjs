const Module = require("module");
const path = require("path");

const stubPath = path.resolve(__dirname, "stubs/safer-buffer.js");

const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, parent, isMain, options) {
  if (request === "safer-buffer") {
    return stubPath;
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};
