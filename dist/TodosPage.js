import React, { useState } from "react";
import "./TodosPage.css";
import dayjs from "dayjs";
const TodosPage = _ref => {
  let {
    sampleData
  } = _ref;
  const [currentDate, setCurrentDate] = useState(dayjs());
  const colors = ["lightblue", "lightgreen", "pink"];
  return /*#__PURE__*/React.createElement("div", {
    className: "list"
  }, /*#__PURE__*/React.createElement("h2", null, /*#__PURE__*/React.createElement("center", null, currentDate.date(), " ", currentDate.format("MMMM"), ", ", currentDate.format("YYYY"))), sampleData.map((prev, index) => prev.month === currentDate.format("MMMM") && parseInt(prev.year) === parseInt(currentDate.format("YYYY")) && parseInt(prev.date) === currentDate.date() ? prev.events.map(item => item.from >= currentDate.hour() ? /*#__PURE__*/React.createElement("div", {
    key: index,
    className: "list-item",
    style: {
      boxShadow: "0px 2px 5px ".concat(colors[index % colors.length])
    }
  }, /*#__PURE__*/React.createElement("span", null, dayjs().hour(item.from).format("h A"), " - ", dayjs().hour(item.to).format("h A")), /*#__PURE__*/React.createElement("span", null, item.title)) : /*#__PURE__*/React.createElement("div", {
    key: index,
    className: "list-item",
    style: {
      boxShadow: "0px 2px 5px gray"
    }
  }, /*#__PURE__*/React.createElement("span", null, dayjs().hour(item.from).format("h A"), " - ", dayjs().hour(item.to).format("h A")), /*#__PURE__*/React.createElement("span", null, item.title))) : ""));
};
export default TodosPage;