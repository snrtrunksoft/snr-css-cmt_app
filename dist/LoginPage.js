// LoginPage.js
import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Navigate } from "react-router-dom";
export default function LoginPage() {
  return /*#__PURE__*/React.createElement(Authenticator, null, _ref => {
    let {
      user
    } = _ref;
    // once logged in, navigate to "/"
    return /*#__PURE__*/React.createElement(Navigate, {
      to: "/",
      replace: true
    });
  });
}