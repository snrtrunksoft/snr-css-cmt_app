import React, { useEffect, useState } from "react";
import NameCard from "./NameCard";
import "./ResourcePage.css";
import { LoadingOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
const ResourcePage = _ref => {
  let {
    resourceData,
    setDuplicateData,
    commentBox,
    setCommentBox
  } = _ref;
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(false);
  }, []);
  console.log("Resource:", resourceData);
  return /*#__PURE__*/React.createElement("div", {
    className: "resource-app"
  }, isLoading ? /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement(LoadingOutlined, null), " Loading....") : /*#__PURE__*/React.createElement(Row, {
    className: "resource-grid",
    gutter: [12, 16]
  }, resourceData.map(item => /*#__PURE__*/React.createElement(Col, {
    key: item.resourceId,
    xs: resourceData.length <= 1 ? 24 : 12,
    sm: resourceData.length <= 1 ? 24 : 12,
    md: resourceData.length <= 2 ? 20 : 8,
    lg: resourceData.length <= 2 ? 20 : 6,
    xl: resourceData.length <= 2 ? 20 : 6
  }, /*#__PURE__*/React.createElement(NameCard, {
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
export default ResourcePage;