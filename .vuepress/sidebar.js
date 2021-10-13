const { createSideBarConfig } = require("./utils");
const JAVASCRIPT_PATH = "/blogs/javascript";
const REACT_PATH = "/blogs/react";
const OTHER_PATH = "/blogs/other";
const BROWSER_PATH = "/blogs/browser";

module.exports = {
  [JAVASCRIPT_PATH]: [createSideBarConfig("JS 基础", JAVASCRIPT_PATH)],
  [REACT_PATH]: [createSideBarConfig("react", REACT_PATH)],
  [OTHER_PATH]: [createSideBarConfig("其他", OTHER_PATH)],
  [BROWSER_PATH]: [createSideBarConfig("浏览器", BROWSER_PATH)],
};
