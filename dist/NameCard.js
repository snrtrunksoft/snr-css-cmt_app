function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { useState } from "react";
import "./NameCard.css";
import { Badge, Button, Card, Checkbox, Col, Drawer, Grid, Row, Space } from "antd";
import maleAvatar from "./assets/male_avatar.jpg";
import femaleAvatar from "./assets/female_avatar.jpg";
import TextArea from "antd/es/input/TextArea";
import { MEMBERS_API, RESOURCES_API } from "../properties/EndPointProperties";
import PunchCardsPage from "./PunchCardsPage";
import { SwapOutlined } from "@ant-design/icons";
const NameCard = _ref => {
  let {
    customerId,
    customerName,
    phoneNumber,
    address,
    status,
    comments,
    subscriptions,
    setDuplicateData,
    commentBox,
    setCommentBox
  } = _ref;
  const [isHovered, setIsHovered] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [nameCardDrawer, setNameCardDrawer] = useState(false);
  const {
    useBreakpoint
  } = Grid;
  const screens = useBreakpoint();
  const getDrawerWidth = () => {
    if (screens.xl) return 600;
    if (screens.lg) return 550;
    if (screens.md) return 500;
    if (screens.sm) return 300;
    return '100%';
  };
  const addressKeys = Object.keys(address[0]);
  // console.log(addressKeys);
  const handleSend = () => {
    if (newComment) {
      const commentBody = [...comments, {
        "commentId": parseInt(comments[comments.length - 1].commentId) + 1 || 1,
        "author": customerName,
        "message": newComment
      }];
      const updatedRecord = {
        "customerName": customerName,
        "status": status,
        "address": address,
        "subscriptions": subscriptions,
        "phoneNumber": phoneNumber,
        "comments": commentBody
      };
      console.log("updatedRecord:", updatedRecord);
      const uploadComment = async () => {
        try {
          const response = await fetch(MEMBERS_API + customerId, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedRecord)
          });
          const data = await response.json();
          console.log("successfully added the comment:", data);
        } catch (error) {
          console.log("unbale to add Comment:", error);
        }
      };
      uploadComment();
      setDuplicateData(prevData => prevData.map(prev => prev.id === customerId ? _objectSpread(_objectSpread({}, prev), {}, {
        comments: [...prev.comments, {
          commentId: parseInt(comments[comments.length - 1]["commentId"]) + 1 || 1,
          message: newComment,
          author: customerName
        }]
      }) : prev));
      const existingData = commentBox.findIndex(person => person.customerName === customerName);
      if (existingData !== -1) {
        setCommentBox(prevComments => prevComments.map((prev, index) => index === existingData ? _objectSpread(_objectSpread({}, prev), {}, {
          comment: [...prev.comment, {
            commentId: parseInt(comments[comments.length - 1]["commentId"]) + 1 || 1,
            message: newComment,
            author: customerName
          }]
        }) : prev));
      } else {
        setCommentBox(prevComments => [...prevComments, {
          customerName,
          color,
          comment: [{
            commentId: parseInt(comments[comments.length - 1]["commentId"]) + 1 || 1,
            message: newComment,
            author: customerName
          }]
        }]);
      }
    }
    setNewComment("");
  };
  const handleClear = () => {
    setNewComment("");
  };
  let color = "red";
  if (status === "Complete") {
    color = "lightgreen";
  }
  if (status === "New") {
    color = "pink";
  }
  if (status === "In_Progress") {
    color = "lightblue";
  }
  if (status === "Cancelled") {
    color = "red";
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    className: "nameCard",
    onClick: () => setNameCardDrawer(true),
    style: {
      boxShadow: isHovered ? "0px 8px 20px ".concat(color) : "0px 0px 6px ".concat(color),
      transition: 'box-shadow 0.3s ease'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      width: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, "Name : ", customerName), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '30px',
      height: '15px',
      backgroundColor: "".concat(color)
    }
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      width: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, "Phone : ", phoneNumber), address.length > 0 && /*#__PURE__*/React.createElement("p", {
    style: {
      width: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, "Address: ", address.map(prev => prev.city).join(', '), ", ", address.map(prev => prev.state).join(', '), ", ", address.map(prev => prev.country).join(', '), "."), /*#__PURE__*/React.createElement("p", {
    style: {
      width: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, "Status : ", status)), /*#__PURE__*/React.createElement(Drawer, {
    open: nameCardDrawer,
    style: {
      backgroundColor: 'whitesmoke'
    },
    title: null
    // closable={false}
    ,
    width: getDrawerWidth(),
    onClose: () => {
      setNameCardDrawer(false);
      setNewComment("");
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "nameDrawer"
  }, /*#__PURE__*/React.createElement(Row, {
    className: "personalNameCard"
  }, /*#__PURE__*/React.createElement(Col, {
    style: {
      padding: '5px',
      width: '40%'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: maleAvatar,
    style: {
      width: '100%',
      height: '95%'
    }
  })), /*#__PURE__*/React.createElement(Col, {
    style: {
      margin: '5px',
      width: '50%'
    }
  }, /*#__PURE__*/React.createElement("h2", null, " ", customerName, " "), /*#__PURE__*/React.createElement("h3", {
    style: {
      marginTop: '-10px'
    }
  }, phoneNumber), /*#__PURE__*/React.createElement("h3", {
    style: {
      borderRadius: '5px',
      backgroundColor: 'lightgrey',
      padding: '5px',
      width: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, "Address : ", addressKeys.map((item, index) => /*#__PURE__*/React.createElement("span", {
    key: index
  }, address[0][item], item !== "country" ? ", " : ".", item === "city" || item === "state" ? "" : /*#__PURE__*/React.createElement("br", null)))))), /*#__PURE__*/React.createElement(PunchCardsPage, {
    customerId: customerId,
    customerName: customerName,
    setNewComment: setNewComment,
    handleSend: handleSend,
    subscriptions: subscriptions,
    color: color
  }), /*#__PURE__*/React.createElement("h3", null, "Comments :"), /*#__PURE__*/React.createElement(Row, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '20px'
    }
  }, comments.map((comment, index) => /*#__PURE__*/React.createElement(Space, {
    key: index,
    direction: "vertical",
    size: "middle",
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(Badge.Ribbon, {
    text: comment["author"],
    color: color
  }, /*#__PURE__*/React.createElement(Card, {
    size: "small"
  }, comment["message"]))))), /*#__PURE__*/React.createElement(Row, null, /*#__PURE__*/React.createElement(TextArea, {
    placeholder: "Enter your Comments",
    value: newComment,
    style: {
      fontSize: '18px'
    },
    onChange: e => setNewComment(e.target.value)
  }), /*#__PURE__*/React.createElement(Row, {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: '10px'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: () => handleClear()
  }, "Clear"), /*#__PURE__*/React.createElement(Button, {
    type: "primary",
    onClick: () => handleSend()
  }, "send"))))));
};
export default NameCard;