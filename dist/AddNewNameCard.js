function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from "react";
import "./AddNewNameCard.css";
import { Row, Col, Button } from "antd";
import { useForm } from "react-hook-form";
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
  } = useForm();
  const handleReset = () => {
    reset();
    setNewRecordName("");
    setNewRecordPhone("");
    // setNewRecordAge("")
    setNewRecordAddress("");
    setNewRecordStatus("New");
  };
  const dropDownList = /*#__PURE__*/React.createElement("select", {
    value: newRecordStatus,
    style: {
      borderRadius: '5px',
      padding: '5px'
    },
    onChange: e => setNewRecordStatus(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "New"
  }, "New"), /*#__PURE__*/React.createElement("option", {
    value: "In-progress"
  }, "In-progress"), /*#__PURE__*/React.createElement("option", {
    value: "Complete"
  }, "Complete"));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("form", null, /*#__PURE__*/React.createElement(Row, null, /*#__PURE__*/React.createElement(Col, null, /*#__PURE__*/React.createElement("h2", null, "Name : ")), /*#__PURE__*/React.createElement(Col, null, /*#__PURE__*/React.createElement("h2", null, /*#__PURE__*/React.createElement("input", _extends({
    type: "text"
  }, register("name"), {
    onChange: e => {
      setNewRecordName(e.target.value);
    }
  }))))), /*#__PURE__*/React.createElement(Row, null, /*#__PURE__*/React.createElement(Col, null, /*#__PURE__*/React.createElement("h2", null, "Phone : ")), /*#__PURE__*/React.createElement(Col, null, /*#__PURE__*/React.createElement("h2", null, /*#__PURE__*/React.createElement("input", _extends({
    type: "number"
  }, register("phone"), {
    onChange: e => {
      setNewRecordPhone(e.target.value);
    }
  }))))), /*#__PURE__*/React.createElement(Row, null, /*#__PURE__*/React.createElement(Col, null, /*#__PURE__*/React.createElement("h2", null, "Age : "))), /*#__PURE__*/React.createElement(Row, null, /*#__PURE__*/React.createElement(Col, null, /*#__PURE__*/React.createElement("h2", null, "Address : ")), /*#__PURE__*/React.createElement(Col, null, /*#__PURE__*/React.createElement("h2", null, /*#__PURE__*/React.createElement("input", _extends({}, register('Address'), {
    onChange: e => {
      setNewRecordAddress(e.target.value);
    }
  }))))), /*#__PURE__*/React.createElement(Row, null, /*#__PURE__*/React.createElement(Col, null, /*#__PURE__*/React.createElement("h2", null, "Status : ")), /*#__PURE__*/React.createElement(Col, null, /*#__PURE__*/React.createElement("h2", null, dropDownList))), /*#__PURE__*/React.createElement(Row, {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(Button, {
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
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    type: "primary",
    onClick: () => {
      handleAddNewNameCard();
      handleReset();
    }
  }, "Add"))));
};
export default AddNewNameCard;