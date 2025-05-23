"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
require("./AddNewNameCard.css");
var _antd = require("antd");
var _reactHookForm = require("react-hook-form");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const AddNewNameCard = _ref => {
  let {
    data,
    setNewRecordName,
    setNewRecordPhone,
    // setNewRecordAge,
    setNewRecordAddress,
    setNewRecordStatus,
    newRecordStatus,
    setIsAddNewNameCardModalOpen,
    handleAddNewNameCard
  } = _ref;
  const {
    register,
    reset
  } = (0, _reactHookForm.useForm)();
  const handleReset = () => {
    reset();
    setNewRecordName("");
    setNewRecordPhone("");
    // setNewRecordAge("")
    setNewRecordAddress("");
    setNewRecordStatus("New");
  };
  const dropDownList = /*#__PURE__*/_react.default.createElement("select", {
    value: newRecordStatus,
    style: {
      borderRadius: '5px',
      padding: '5px'
    },
    onChange: e => setNewRecordStatus(e.target.value)
  }, /*#__PURE__*/_react.default.createElement("option", {
    value: "New"
  }, "New"), /*#__PURE__*/_react.default.createElement("option", {
    value: "In-progress"
  }, "In-progress"), /*#__PURE__*/_react.default.createElement("option", {
    value: "Complete"
  }, "Complete"));
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("form", null, /*#__PURE__*/_react.default.createElement(_antd.Row, null, /*#__PURE__*/_react.default.createElement(_antd.Col, null, /*#__PURE__*/_react.default.createElement("h2", null, "Name : ")), /*#__PURE__*/_react.default.createElement(_antd.Col, null, /*#__PURE__*/_react.default.createElement("h2", null, /*#__PURE__*/_react.default.createElement("input", _extends({
    type: "text"
  }, register("name"), {
    onChange: e => {
      setNewRecordName(e.target.value);
    }
  }))))), /*#__PURE__*/_react.default.createElement(_antd.Row, null, /*#__PURE__*/_react.default.createElement(_antd.Col, null, /*#__PURE__*/_react.default.createElement("h2", null, "Phone : ")), /*#__PURE__*/_react.default.createElement(_antd.Col, null, /*#__PURE__*/_react.default.createElement("h2", null, /*#__PURE__*/_react.default.createElement("input", _extends({
    type: "number"
  }, register("phone"), {
    onChange: e => {
      setNewRecordPhone(e.target.value);
    }
  }))))), /*#__PURE__*/_react.default.createElement(_antd.Row, null, /*#__PURE__*/_react.default.createElement(_antd.Col, null, /*#__PURE__*/_react.default.createElement("h2", null, "Age : "))), /*#__PURE__*/_react.default.createElement(_antd.Row, null, /*#__PURE__*/_react.default.createElement(_antd.Col, null, /*#__PURE__*/_react.default.createElement("h2", null, "Address : ")), /*#__PURE__*/_react.default.createElement(_antd.Col, null, /*#__PURE__*/_react.default.createElement("h2", null, /*#__PURE__*/_react.default.createElement("input", _extends({}, register('Address'), {
    onChange: e => {
      setNewRecordAddress(e.target.value);
    }
  }))))), /*#__PURE__*/_react.default.createElement(_antd.Row, null, /*#__PURE__*/_react.default.createElement(_antd.Col, null, /*#__PURE__*/_react.default.createElement("h2", null, "Status : ")), /*#__PURE__*/_react.default.createElement(_antd.Col, null, /*#__PURE__*/_react.default.createElement("h2", null, dropDownList))), /*#__PURE__*/_react.default.createElement(_antd.Row, {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/_react.default.createElement(_antd.Button, {
    onClick: () => {
      handleReset();
      setIsAddNewNameCardModalOpen(false);
    },
    style: {
      margin: '0px 5px',
      border: '1px solid black',
      backgroundColor: 'transparent',
      color: "black"
    }
  }, "Cancel"), /*#__PURE__*/_react.default.createElement(_antd.Button, {
    type: "primary",
    onClick: () => {
      handleAddNewNameCard();
      handleReset();
    }
  }, "Add"))));
};
var _default = exports.default = AddNewNameCard;