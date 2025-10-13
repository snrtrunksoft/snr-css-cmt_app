import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import CmtApp from './CmtApp';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from './LoginPage';

// ✅ Amplify Auth config
import { configureAuth } from './authConfig';
import localExports from './aws-exports-dev.local';

// If running in standalone mode, configure Amplify with local exports
if (process.env.REACT_APP_STANDALONE === "1") {
  configureAuth(localExports);
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(/*#__PURE__*/React.createElement(React.StrictMode, null, /*#__PURE__*/React.createElement(BrowserRouter, null, /*#__PURE__*/React.createElement(Routes, null, /*#__PURE__*/React.createElement(Route, {
  path: "/login",
  element: /*#__PURE__*/React.createElement(LoginPage, null)
}), /*#__PURE__*/React.createElement(Route, {
  path: "/*",
  element: /*#__PURE__*/React.createElement(ProtectedRoute, null, /*#__PURE__*/React.createElement(CmtApp, {
    entityId: "w_123"
  }))
})))));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();