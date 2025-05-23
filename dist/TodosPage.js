"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
require("./TodosPage.css");
var _dayjs = _interopRequireDefault(require("dayjs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const TodosPage = _ref => {
  let {
    sampleData
  } = _ref;
  const [currentDate, setCurrentDate] = (0, _react.useState)((0, _dayjs.default)());
  const colors = ["lightblue", "lightgreen", "pink"];
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "list"
  }, /*#__PURE__*/_react.default.createElement("h2", null, /*#__PURE__*/_react.default.createElement("center", null, currentDate.date(), " ", currentDate.format("MMMM"), ", ", currentDate.format("YYYY"))), sampleData.map((prev, index) => prev.month === currentDate.format("MMMM") && parseInt(prev.year) === parseInt(currentDate.format("YYYY")) && parseInt(prev.date) === currentDate.date() ? prev.events.map(item => item.from >= currentDate.hour() ? /*#__PURE__*/_react.default.createElement("div", {
    key: index,
    className: "list-item",
    style: {
      boxShadow: "0px 2px 5px ".concat(colors[index % colors.length])
    }
  }, /*#__PURE__*/_react.default.createElement("span", null, (0, _dayjs.default)().hour(item.from).format("h A"), " - ", (0, _dayjs.default)().hour(item.to).format("h A")), /*#__PURE__*/_react.default.createElement("span", null, item.title)) : /*#__PURE__*/_react.default.createElement("div", {
    key: index,
    className: "list-item",
    style: {
      boxShadow: "0px 2px 5px gray"
    }
  }, /*#__PURE__*/_react.default.createElement("span", null, (0, _dayjs.default)().hour(item.from).format("h A"), " - ", (0, _dayjs.default)().hour(item.to).format("h A")), /*#__PURE__*/_react.default.createElement("span", null, item.title))) : ""));
};
var _default = exports.default = TodosPage;