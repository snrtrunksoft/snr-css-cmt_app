// src/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { fetchAuthSession } from "aws-amplify/auth";
import React, { useEffect, useState } from "react";
export default function ProtectedRoute(_ref) {
  let {
    children
  } = _ref;
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  useEffect(() => {
    const check = async () => {
      try {
        var _session$tokens;
        const session = await fetchAuthSession();
        setIsAuthed(!!((_session$tokens = session.tokens) !== null && _session$tokens !== void 0 && _session$tokens.idToken));
      } catch (_unused) {
        setIsAuthed(false);
      }
      setIsChecking(false);
    };
    check();
  }, []);
  if (isChecking) return /*#__PURE__*/React.createElement("div", null, "Loading...");
  return isAuthed ? children : /*#__PURE__*/React.createElement(Navigate, {
    to: "/login",
    replace: true
  });
}