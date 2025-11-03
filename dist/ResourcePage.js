function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { useEffect, useState } from "react";
import NameCard from "./NameCard";
import "./ResourcePage.css";
import "./NameCard.css";
import { LoadingOutlined } from "@ant-design/icons";
import { Button, Col, Grid, Modal, Row, Form } from "antd";
import AddNewUser from "./AddNewUser";
import { createResource } from "./api/APIUtil";
const {
  useBreakpoint
} = Grid;
const ResourcePage = _ref => {
  let {
    resourceData,
    setResourceData,
    entityId,
    dataView,
    commentBox,
    setCommentBox
  } = _ref;
  const [isLoading, setIsLoading] = useState(true);
  const [addNewResourceModal, setAddNewResourceModal] = useState(false);
  const [form] = Form.useForm();
  const screens = useBreakpoint();
  const colSize = resourceData.length <= 3 ? 24 / resourceData.length : 6;
  const handleAddNewResource = values => {
    const {
      firstName,
      lastName,
      phone,
      address,
      city,
      state,
      country,
      pincode,
      status = "ACTIVE"
    } = values;
    const newRecord = {
      resourceName: (firstName || "") + (lastName || ""),
      phoneNumber: phone,
      address: [{
        country: country || "",
        city: city || "",
        houseNo: "NA",
        street1: address || "NA",
        street2: "NA",
        pincode: pincode || "NA",
        state: state || ""
      }],
      status: status,
      comments: []
    };
    const addNewResource = async () => {
      try {
        const postData = await createResource(entityId, newRecord);
        console.log("post New Resource Data:", postData);
        const updatedRecord = _objectSpread(_objectSpread({}, newRecord), {}, {
          resourceId: (firstName || "").slice(0, 3) + (postData.resourceId || "")
        });
        setResourceData(prev => [...prev, updatedRecord]);
      } catch (error) {
        console.log("unable to add new resource", error);
      } finally {
        setAddNewResourceModal(false);
      }
    };
    addNewResource();
  };
  useEffect(() => {
    setIsLoading(false);
  }, []);
  console.log("Resource:", resourceData);
  return /*#__PURE__*/React.createElement("div", {
    className: "resource-app"
  }, isLoading ? /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement(LoadingOutlined, null), " Loading....") : /*#__PURE__*/React.createElement(React.Fragment, null, dataView === "table" ? /*#__PURE__*/React.createElement("div", {
    className: "table-wrapper"
  }, /*#__PURE__*/React.createElement(Row, {
    className: "table-row table-header"
  }, /*#__PURE__*/React.createElement(Col, {
    span: 3,
    className: "table-cell"
  }, "ID"), /*#__PURE__*/React.createElement(Col, {
    span: 5,
    className: "table-cell"
  }, "Name"), /*#__PURE__*/React.createElement(Col, {
    span: 10,
    className: "table-cell"
  }, "Address"), /*#__PURE__*/React.createElement(Col, {
    span: 6,
    className: "table-cell"
  }, "Phone Number")), resourceData.map((item, index) => {
    var _item$address, _item$address2, _item$address3, _item$address4, _item$address5, _item$address6;
    return /*#__PURE__*/React.createElement(Row, {
      key: index,
      className: "table-row"
    }, /*#__PURE__*/React.createElement(Col, {
      span: 3,
      className: "table-cell"
    }, item.resourceId), /*#__PURE__*/React.createElement(Col, {
      span: 5,
      className: "table-cell"
    }, item.resourceName), /*#__PURE__*/React.createElement(Col, {
      span: 10,
      className: "table-cell"
    }, [(_item$address = item.address) === null || _item$address === void 0 || (_item$address = _item$address[0]) === null || _item$address === void 0 ? void 0 : _item$address.houseNo, (_item$address2 = item.address) === null || _item$address2 === void 0 || (_item$address2 = _item$address2[0]) === null || _item$address2 === void 0 ? void 0 : _item$address2.street1, (_item$address3 = item.address) === null || _item$address3 === void 0 || (_item$address3 = _item$address3[0]) === null || _item$address3 === void 0 ? void 0 : _item$address3.street2, (_item$address4 = item.address) === null || _item$address4 === void 0 || (_item$address4 = _item$address4[0]) === null || _item$address4 === void 0 ? void 0 : _item$address4.city, (_item$address5 = item.address) === null || _item$address5 === void 0 || (_item$address5 = _item$address5[0]) === null || _item$address5 === void 0 ? void 0 : _item$address5.state, (_item$address6 = item.address) === null || _item$address6 === void 0 || (_item$address6 = _item$address6[0]) === null || _item$address6 === void 0 ? void 0 : _item$address6.country].filter(Boolean).join(', ')), /*#__PURE__*/React.createElement(Col, {
      span: 6,
      className: "table-cell"
    }, item.phoneNumber));
  }), /*#__PURE__*/React.createElement(Row, {
    className: "table-row add-record-row"
  }, /*#__PURE__*/React.createElement(Col, {
    span: 24,
    style: {
      margin: '10px'
    }
  }, /*#__PURE__*/React.createElement("center", null, /*#__PURE__*/React.createElement(Button, {
    style: {
      fontSize: '18px'
    },
    onClick: () => setAddNewResourceModal(true)
  }, "+ Add New Record"))))) : /*#__PURE__*/React.createElement(Row, {
    className: "resource-grid ".concat(screens.xs ? "mobile-grid-alignment" : "web-grid-alignment"),
    gutter: [16, 16]
  }, resourceData.length !== 0 ? resourceData.map(item => /*#__PURE__*/React.createElement(Col, {
    key: item.resourceId,
    xs: 20,
    md: 12,
    lg: colSize
  }, /*#__PURE__*/React.createElement(NameCard, {
    key: item.resourceId,
    membersPage: false,
    entityId: entityId,
    resourceData: resourceData,
    setResourceData: setResourceData,
    customerId: item.resourceId,
    customerName: item.resourceName,
    phoneNumber: item.phoneNumber,
    address: item.address,
    status: item.status,
    comments: item.comments,
    subscriptions: "",
    commentBox: commentBox,
    setCommentBox: setCommentBox
  }))) : /*#__PURE__*/React.createElement("h2", null, "No NameCards Found..."), /*#__PURE__*/React.createElement(Col, {
    xs: 20,
    md: 12,
    lg: colSize,
    className: "nameCard",
    onClick: () => setAddNewResourceModal(true),
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    style: {
      border: 'transparent',
      fontSize: '40px'
    }
  }, "+")))), /*#__PURE__*/React.createElement(Modal, {
    open: addNewResourceModal,
    onCancel: () => {
      setAddNewResourceModal(false);
      form.resetFields();
    },
    footer: null
  }, /*#__PURE__*/React.createElement(AddNewUser, {
    mode: "resource",
    form: form,
    onSubmit: handleAddNewResource
  })));
};
export default ResourcePage;