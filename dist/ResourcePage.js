"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _NameCard = _interopRequireDefault(require("./NameCard"));
require("./ResourcePage.css");
var _icons = require("@ant-design/icons");
var _antd = require("antd");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const ResourcePage = _ref => {
  let {
    resourceData,
    setDuplicateData,
    commentBox,
    setCommentBox
  } = _ref;
  const [isLoading, setIsLoading] = (0, _react.useState)(true);
  (0, _react.useEffect)(() => {
    setIsLoading(false);
  }, []);
  console.log("Resource:", resourceData);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "resource-app"
  }, isLoading ? /*#__PURE__*/_react.default.createElement("h3", null, /*#__PURE__*/_react.default.createElement(_icons.LoadingOutlined, null), " Loading....") : /*#__PURE__*/_react.default.createElement(_antd.Row, {
    className: "resource-grid",
    gutter: [12, 16]
  }, resourceData.map(item => /*#__PURE__*/_react.default.createElement(_antd.Col, {
    key: item.resourceId,
    xs: resourceData.length <= 1 ? 24 : 12,
    sm: resourceData.length <= 1 ? 24 : 12,
    md: resourceData.length <= 2 ? 20 : 8,
    lg: resourceData.length <= 2 ? 20 : 6,
    xl: resourceData.length <= 2 ? 20 : 6
  }, /*#__PURE__*/_react.default.createElement(_NameCard.default, {
    key: item.resourceId,
    customerId: item.resourceId,
    customerName: item.resourceName,
    phoneNumber: item.phoneNumber,
    address: item.address,
    status: item.status,
    comments: item.comments,
    subscriptions: "",
    setDuplicateData: setDuplicateData,
    commentBox: commentBox,
    setCommentBox: setCommentBox
  })))));
};
var _default = exports.default = ResourcePage;