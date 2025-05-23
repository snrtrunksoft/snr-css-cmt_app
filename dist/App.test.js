"use strict";

var _react = require("@testing-library/react");
var _App = _interopRequireDefault(require("./App"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
test('renders learn react link', () => {
  (0, _react.render)(/*#__PURE__*/React.createElement(_App.default, null));
  const linkElement = _react.screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});