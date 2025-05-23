"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
require("./NameCard.css");
var _antd = require("antd");
var _male_avatar = _interopRequireDefault(require("./assets/male_avatar.jpg"));
var _female_avatar = _interopRequireDefault(require("./assets/female_avatar.jpg"));
var _TextArea = _interopRequireDefault(require("antd/es/input/TextArea"));
var _icons = require("@ant-design/icons");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
  const [isHovered, setIsHovered] = (0, _react.useState)(false);
  const [newComment, setNewComment] = (0, _react.useState)("");
  const [nameCardDrawer, setNameCardDrawer] = (0, _react.useState)(false);
  const [punchCardsState, setPunchCardsState] = (0, _react.useState)("Complete");
  const [flipped, setFlipped] = (0, _react.useState)(false);
  const {
    useBreakpoint
  } = _antd.Grid;
  const screens = useBreakpoint();
  const getDrawerWidth = () => {
    if (screens.xl) return 600;
    if (screens.lg) return 550;
    if (screens.md) return 500;
    if (screens.sm) return 300;
    return '100%';
  };
  const toggleFlip = () => {
    setFlipped(prev => !prev);
  };
  const [punchCards, setPunchCards] = (0, _react.useState)(subscriptions);
  const [checkedCount, setCheckedCount] = (0, _react.useState)(0);
  const handleSave = value => {
    setPunchCards(prevCards => prevCards.map(prev => {
      if (prev.id === value.id) {
        const servicesLeft = Math.max(0, prev.noOfServicesLeft - checkedCount);
        if (servicesLeft === 0) {
          return _objectSpread(_objectSpread({}, prev), {}, {
            noOfServicesCompleted: parseInt(value.noOfServicesCompleted) + checkedCount,
            noOfServicesLeft: Math.max(0, prev.noOfServicesLeft - checkedCount),
            status: 'Complete'
          });
        }
        return _objectSpread(_objectSpread({}, prev), {}, {
          noOfServicesCompleted: parseInt(value.noOfServicesCompleted) + checkedCount,
          noOfServicesLeft: Math.max(0, prev.noOfServicesLeft - checkedCount)
        });
      }
      return prev;
    }));
    handleSend();
    setCheckedCount(0);
  };
  const handleCheckboxChange = (e, value) => {
    const count = e.target.checked ? checkedCount + 1 : checkedCount - 1;
    setCheckedCount(count);
    setNewComment(count > 0 ? "Subscription ID: " + value.id + ", selected Cards: " + count : "");
  };
  const filterActiveSubscription = punchCards !== "" ? punchCards.filter(prev => prev.status === "Active") : "";
  const addNewSubscription = () => {
    const updateSubscriptionData = async () => {
      try {
        const response = await fetch("https://kh9zku31eb.execute-api.us-east-1.amazonaws.com/dev/users/".concat(customerId));
        const customerData = await response.json();
        const newSub = {
          id: "TBD",
          status: "Active",
          noOfServicesLeft: "10",
          noOfServicesCompleted: "0",
          totalNumberOfServices: "10",
          purchasedDate: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
          }),
          completedDate: ""
        };
        console.log(customerData.subscriptions.length);
        const updatedCustomer = _objectSpread(_objectSpread({}, customerData), {}, {
          subscriptions: [...customerData.subscriptions, newSub] // appending new subscription
        });
        await fetch("https://kh9zku31eb.execute-api.us-east-1.amazonaws.com/dev/users/".concat(customerId), {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedCustomer)
        }).then(response => response.json()).then(data => console.log("updated Data:", data));
        setPunchCards(prev => [...prev, newSub]);
      } catch (error) {
        console.error("unable to update the record", error);
      }
    };
    updateSubscriptionData();
  };
  const addressKeys = Object.keys(address[0]);
  // console.log(addressKeys);
  const handleSend = () => {
    if (newComment) {
      setDuplicateData(prevData => prevData.map(prev => prev.id === customerId ? _objectSpread(_objectSpread({}, prev), {}, {
        comments: [...prev.comments, {
          commentID: parseInt(comments[comments.length - 1]["commentId"]) + 1,
          message: newComment,
          author: "TBD"
        }]
      }) : prev));
      const existingData = commentBox.findIndex(person => person.customerName === customerName);
      if (existingData !== -1) {
        setCommentBox(prevComments => prevComments.map((prev, index) => index === existingData ? _objectSpread(_objectSpread({}, prev), {}, {
          comment: [...prev.comment, {
            commentId: prev.comment.length + 1,
            message: newComment,
            author: 'TBD'
          }]
        }) : prev));
      } else {
        setCommentBox(prevComments => [...prevComments, {
          customerName,
          color,
          comment: [{
            commentId: '1',
            message: newComment,
            author: 'TBD'
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
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    className: "nameCard",
    onClick: () => setNameCardDrawer(true),
    style: {
      boxShadow: isHovered ? "0px 8px 20px ".concat(color) : "0px 0px 6px ".concat(color),
      transition: 'box-shadow 0.3s ease'
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/_react.default.createElement("h3", {
    style: {
      width: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, "Name : ", customerName), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      width: '30px',
      height: '15px',
      backgroundColor: "".concat(color)
    }
  })), /*#__PURE__*/_react.default.createElement("p", {
    style: {
      width: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, "Phone : ", phoneNumber), address.length > 0 && /*#__PURE__*/_react.default.createElement("p", {
    style: {
      width: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, "Address: ", address.map(prev => prev.city).join(', '), ", ", address.map(prev => prev.state).join(', '), ", ", address.map(prev => prev.country).join(', '), "."), /*#__PURE__*/_react.default.createElement("p", null, "Status : ", status)), /*#__PURE__*/_react.default.createElement(_antd.Drawer, {
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
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "nameDrawer"
  }, /*#__PURE__*/_react.default.createElement(_antd.Row, {
    className: "personalNameCard"
  }, /*#__PURE__*/_react.default.createElement(_antd.Col, {
    style: {
      padding: '5px',
      width: '40%'
    }
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _male_avatar.default,
    style: {
      width: '100%',
      height: '95%'
    }
  })), /*#__PURE__*/_react.default.createElement(_antd.Col, {
    style: {
      margin: '5px',
      width: '50%'
    }
  }, /*#__PURE__*/_react.default.createElement("h2", null, " ", customerName, " "), /*#__PURE__*/_react.default.createElement("h3", {
    style: {
      marginTop: '-10px'
    }
  }, phoneNumber), /*#__PURE__*/_react.default.createElement("h3", {
    style: {
      borderRadius: '5px',
      backgroundColor: 'lightgrey',
      padding: '5px',
      width: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, "Address : ", addressKeys.map((item, index) => /*#__PURE__*/_react.default.createElement("span", {
    key: index
  }, address[0][item], item !== "country" ? ", " : ".", item === "city" || item === "state" ? "" : /*#__PURE__*/_react.default.createElement("br", null)))))), /*#__PURE__*/_react.default.createElement("h2", null, "Punch cards:"), punchCards ? /*#__PURE__*/_react.default.createElement("div", {
    className: ""
  }, /*#__PURE__*/_react.default.createElement(_antd.Row, null, /*#__PURE__*/_react.default.createElement(_antd.Button, {
    onClick: () => {
      setFlipped(false);
      setPunchCardsState(prev => prev === "Complete" ? "Active" : "Complete");
    }
  }, "View ", punchCardsState), " \xA0"), punchCards.filter(card => card.status !== punchCardsState).map(card => /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_antd.Row, {
    key: card.id,
    className: "punch-card",
    style: {
      backgroundColor: "".concat(color)
    },
    gutter: [16, 16]
  }, /*#__PURE__*/_react.default.createElement(_antd.Col, {
    className: "punchCards",
    xs: 24,
    sm: 20,
    md: 24,
    lg: 20,
    xl: 20
  }, flipped ? /*#__PURE__*/_react.default.createElement(_antd.Row, {
    className: "flipped"
  }, /*#__PURE__*/_react.default.createElement("span", null, "name: ", customerName), /*#__PURE__*/_react.default.createElement("span", null, "purchased: ", card.purchasedDate), /*#__PURE__*/_react.default.createElement("span", null, "completed: ", card.completedDate), /*#__PURE__*/_react.default.createElement("span", null, "totalNumberOfService: ", card.totalNumberOfServices), /*#__PURE__*/_react.default.createElement("span", null, "noOfServicesLeft: ", card.noOfServicesLeft), /*#__PURE__*/_react.default.createElement("span", null, "noOfServicesCompleted: ", card.noOfServicesCompleted)) : Array.from({
    length: Number(card.noOfServicesCompleted)
  }, (_, index) => /*#__PURE__*/_react.default.createElement("div", {
    key: index,
    className: "individualCards"
  }, /*#__PURE__*/_react.default.createElement(_antd.Checkbox, {
    checked: true
  }))), Array.from({
    length: Number(card.noOfServicesLeft)
  }, (_, index) => index).reverse().map(index => /*#__PURE__*/_react.default.createElement("div", {
    key: index,
    hidden: flipped,
    className: !flipped ? "individualCards" : ""
  }, /*#__PURE__*/_react.default.createElement(_antd.Checkbox, {
    onChange: e => handleCheckboxChange(e, card)
  })))), /*#__PURE__*/_react.default.createElement(_antd.Col, {
    xs: 24,
    sm: 4,
    md: 24,
    lg: 2,
    xl: 2,
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/_react.default.createElement(_antd.Button, {
    onClick: () => toggleFlip(),
    icon: /*#__PURE__*/_react.default.createElement(_icons.SwapOutlined, null)
  }, "Flip"))), checkedCount ? /*#__PURE__*/_react.default.createElement(_antd.Row, {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/_react.default.createElement(_antd.Button, {
    type: "primary",
    onClick: () => handleSave(card)
  }, "Save")) : "")), /*#__PURE__*/_react.default.createElement("span", null, filterActiveSubscription.length === 0 ? /*#__PURE__*/_react.default.createElement("center", null, /*#__PURE__*/_react.default.createElement(_antd.Button, {
    style: {
      margin: '5px'
    },
    onClick: () => addNewSubscription()
  }, "Add Active Subscription")) : "")) : /*#__PURE__*/_react.default.createElement("center", null, /*#__PURE__*/_react.default.createElement("h3", {
    style: {
      color: 'red'
    }
  }, "No punch cards Available")), /*#__PURE__*/_react.default.createElement("h3", null, "Comments :"), /*#__PURE__*/_react.default.createElement(_antd.Row, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '20px'
    }
  }, comments.map((comment, index) => /*#__PURE__*/_react.default.createElement(_antd.Space, {
    key: index,
    direction: "vertical",
    size: "middle",
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/_react.default.createElement(_antd.Badge.Ribbon, {
    text: comment["author"],
    color: color
  }, /*#__PURE__*/_react.default.createElement(_antd.Card, {
    size: "small"
  }, comment["message"]))))), /*#__PURE__*/_react.default.createElement(_antd.Row, null, /*#__PURE__*/_react.default.createElement(_TextArea.default, {
    placeholder: "Enter your Comments",
    value: newComment,
    style: {
      fontSize: '18px'
    },
    onChange: e => setNewComment(e.target.value)
  }), /*#__PURE__*/_react.default.createElement(_antd.Row, {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: '10px'
    }
  }, /*#__PURE__*/_react.default.createElement(_antd.Button, {
    onClick: () => handleClear()
  }, "Clear"), /*#__PURE__*/_react.default.createElement(_antd.Button, {
    type: "primary",
    onClick: () => handleSend()
  }, "send"))))));
};
var _default = exports.default = NameCard;