import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import CmtApp from './CmtApp';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

// ✅ Amplify Auth config
import { configureAuth } from './authConfig';
import localExports from './aws-exports-dev.local';

// If running in standalone mode, configure Amplify with local exports
if (process.env.REACT_APP_STANDALONE === "1") {
  configureAuth(localExports);
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(/*#__PURE__*/React.createElement(React.StrictMode, null, /*#__PURE__*/React.createElement(BrowserRouter, null, /*#__PURE__*/React.createElement(CmtApp, null))));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();