const _excluded = ["id", "entityId"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { useEffect, useState } from "react";
import "./NameCard.css";
import { Badge, Button, Card, Col, Drawer, Form, Grid, Input, Row, Space } from "antd";
import maleAvatar from "./assets/male_avatar.jpg";
import TextArea from "antd/es/input/TextArea";
import { MEMBERS_API, RESOURCES_API } from "./properties/EndPointProperties";
import PunchCardsPage from "./PunchCardsPage";
import dayjs from "dayjs";
const NameCard = _ref => {
  var _address$, _address$2, _address$3, _address$4, _address$5, _address$6, _address$7, _address$8;
  let {
    membersPage,
    data,
    setData,
    entityId,
    resourceData,
    setResourceData,
    customerId,
    customerName,
    phoneNumber,
    address,
    status,
    comments,
    subscriptions,
    commentBox,
    setCommentBox
  } = _ref;
  const [isHovered, setIsHovered] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [nameCardDrawer, setNameCardDrawer] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const {
    useBreakpoint
  } = Grid;
  const [form] = Form.useForm();
  const screens = useBreakpoint();
  const [defaultValues] = useState({
    customerId: customerId || "",
    customerName: customerName || "",
    phoneNumber: phoneNumber || "",
    status: status || "",
    address: {
      houseNo: (address === null || address === void 0 || (_address$ = address[0]) === null || _address$ === void 0 ? void 0 : _address$.houseNo) || "",
      street1: (address === null || address === void 0 || (_address$2 = address[0]) === null || _address$2 === void 0 ? void 0 : _address$2.street1) || "",
      street2: (address === null || address === void 0 || (_address$3 = address[0]) === null || _address$3 === void 0 ? void 0 : _address$3.street2) || "",
      city: (address === null || address === void 0 || (_address$4 = address[0]) === null || _address$4 === void 0 ? void 0 : _address$4.city) || "",
      state: (address === null || address === void 0 || (_address$5 = address[0]) === null || _address$5 === void 0 ? void 0 : _address$5.state) || "",
      country: (address === null || address === void 0 || (_address$6 = address[0]) === null || _address$6 === void 0 ? void 0 : _address$6.country) || "",
      pincode: (address === null || address === void 0 || (_address$7 = address[0]) === null || _address$7 === void 0 ? void 0 : _address$7.pincode) || ""
    }
  });
  useEffect(() => {
    form.setFieldsValue(defaultValues);
  }, [form, defaultValues]);
  const getDrawerWidth = () => {
    if (screens.xl) return 600;
    if (screens.lg) return 550;
    if (screens.md) return 500;
    if (screens.sm) return 300;
    return '100%';
  };
  function onFinish(values) {
    var _filterData$address, _filterData$address2;
    setIsEditable(false);
    console.log("form values:", values);
    const filterData = membersPage ? data.find(prev => prev.id === values.customerId) : resourceData.find(prev => prev.resourceId === values.customerId);
    const updated_member_name_record = _objectSpread(_objectSpread({}, filterData), {}, {
      customerName: values.customerName,
      phoneNumber: values.phoneNumber,
      status: values.status,
      address: [_objectSpread(_objectSpread({}, (_filterData$address = filterData.address) === null || _filterData$address === void 0 ? void 0 : _filterData$address[0]), {}, {
        city: values.address.city,
        state: values.address.state,
        country: values.address.country
      })]
    });
    const updated_resource_name_record = _objectSpread(_objectSpread({}, filterData), {}, {
      resourceName: values.customerName,
      phoneNumber: values.phoneNumber,
      status: values.status,
      address: [_objectSpread(_objectSpread({}, (_filterData$address2 = filterData.address) === null || _filterData$address2 === void 0 ? void 0 : _filterData$address2[0]), {}, {
        city: values.address.city,
        state: values.address.state,
        country: values.address.country
      })]
    });
    const _ref2 = membersPage ? updated_member_name_record : updated_resource_name_record,
      {
        id,
        entityId
      } = _ref2,
      cleanCustomer = _objectWithoutProperties(_ref2, _excluded);
    console.log(cleanCustomer);
    const updatedNameCard = async () => {
      try {
        await fetch((membersPage ? MEMBERS_API : RESOURCES_API) + values.customerId, {
          method: "PUT",
          headers: {
            "entityid": entityId,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(cleanCustomer)
        }).then(responce => responce.json()).then(data => console.log("successfully updated the record", data));
      } catch (error) {
        console.log("error in updating the Name card", error);
      }
    };
    updatedNameCard();
    if (membersPage) {
      setData(prev => {
        return prev.map(customer => {
          var _customer$address;
          return customer.id === values.customerId ? _objectSpread(_objectSpread({}, customer), {}, {
            customerName: values.customerName,
            phoneNumber: values.phoneNumber,
            status: values.status,
            address: [_objectSpread(_objectSpread({}, (_customer$address = customer.address) === null || _customer$address === void 0 ? void 0 : _customer$address[0]), {}, {
              city: values.address.city,
              state: values.address.state,
              country: values.address.country
            })]
          }) : customer;
        });
      });
    } else {
      setResourceData(prev => {
        return prev.map(customer => {
          var _customer$address2;
          return customer.resourceId === values.customerId ? _objectSpread(_objectSpread({}, customer), {}, {
            resourceName: values.customerName,
            phoneNumber: values.phoneNumber,
            status: values.status,
            address: [_objectSpread(_objectSpread({}, (_customer$address2 = customer.address) === null || _customer$address2 === void 0 ? void 0 : _customer$address2[0]), {}, {
              city: values.address.city,
              state: values.address.state,
              country: values.address.country
            })]
          }) : customer;
        });
      });
    }
  }
  const addressKeys = Object.keys((_address$8 = address === null || address === void 0 ? void 0 : address[0]) !== null && _address$8 !== void 0 ? _address$8 : {});
  const handleSend = () => {
    const addTimeForComment = dayjs().format("YYYY-MM-DD HH:mm:ss.SSS");
    // console.log(addTimeForComment);
    if (newComment) {
      const commentBody = [...comments, {
        "commentId": parseInt(comments[comments.length - 1].commentId) + 1 || 1,
        "author": customerName,
        "message": newComment,
        "date": addTimeForComment
      }];
      const updatedRecord = {
        "customerName": customerName,
        "status": status,
        "address": address,
        "subscriptions": subscriptions,
        "phoneNumber": phoneNumber,
        "comments": commentBody
      };
      Object.values(updatedRecord.subscriptions).forEach(sub => {
        delete sub.entityId;
        delete sub.id;
      });
      console.log("updatedRecord:", updatedRecord);
      const uploadComment = async () => {
        try {
          const response = await fetch((membersPage ? MEMBERS_API : RESOURCES_API) + customerId, {
            method: "PUT",
            headers: {
              "entityid": entityId,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedRecord)
          });
          const data = await response.json();
          console.log("successfully added the comment:", data);
        } catch (error) {
          console.log("unable to add Comment:", error);
        }
      };
      uploadComment();
      if (membersPage) {
        setData(prevData => prevData.map(prev => prev.id === customerId ? _objectSpread(_objectSpread({}, prev), {}, {
          comments: [...prev.comments, {
            commentId: parseInt(comments[comments.length - 1]["commentId"]) + 1 || 1,
            message: newComment,
            author: customerName,
            date: addTimeForComment
          }]
        }) : prev));
      } else {
        setResourceData(prevData => prevData.map(prev => prev.resourceId === customerId ? _objectSpread(_objectSpread({}, prev), {}, {
          comments: [...prev.comments, {
            commentId: parseInt(comments[comments.length - 1]["commentId"]) + 1 || 1,
            message: newComment,
            author: customerName,
            date: addTimeForComment
          }]
        }) : prev));
      }
      const existingData = commentBox.findIndex(person => (membersPage ? person.customerName : person.resourceName) === customerName);
      if (existingData !== -1) {
        setCommentBox(prevComments => prevComments.map((prev, index) => index === existingData ? _objectSpread(_objectSpread({}, prev), {}, {
          comment: [...prev.comment, {
            commentId: parseInt(comments[comments.length - 1]["commentId"]) + 1 || 1,
            message: newComment,
            author: customerName,
            date: addTimeForComment
          }]
        }) : prev));
      } else {
        setCommentBox(prevComments => [...prevComments, {
          customerName,
          color,
          comment: [{
            commentId: parseInt(comments[comments.length - 1]["commentId"]) + 1 || 1,
            message: newComment,
            author: customerName,
            date: addTimeForComment
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
  if (status === "COMPLETED") {
    color = "lightgreen";
  }
  if (status === "ACTIVE") {
    color = "pink";
  }
  if (status === "IN_PROGRESS") {
    color = "lightblue";
  }
  if (status === "CANCELLED") {
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
  }, "Phone : ", phoneNumber), Array.isArray(address) && address.length > 0 && /*#__PURE__*/React.createElement("p", {
    style: {
      width: "100%",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      margin: 0
    }
  }, "Address:\xA0", address.map(a => [a.city, a.state, a.country].filter(Boolean).join(", ")).join(" | ")), /*#__PURE__*/React.createElement("p", {
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
    className: "nameDrawer",
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    type: "primary",
    style: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      zIndex: 1
    },
    onClick: () => setIsEditable(true)
  }, "Edit"), /*#__PURE__*/React.createElement(Row, {
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
  }, "Address : ", addressKeys === null || addressKeys === void 0 ? void 0 : addressKeys.map((item, index) => /*#__PURE__*/React.createElement("span", {
    key: index
  }, address[0][item], item !== "country" ? ", " : ".", item === "city" || item === "state" ? "" : /*#__PURE__*/React.createElement("br", null)))))), /*#__PURE__*/React.createElement(Form, {
    hidden: !isEditable,
    layout: "vertical",
    form: form,
    onFinish: onFinish,
    style: {
      padding: '20px'
    }
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "customerId",
    label: "Customer Id"
  }, /*#__PURE__*/React.createElement(Input, {
    readOnly: true
  })), /*#__PURE__*/React.createElement(Form.Item, {
    name: "customerName",
    label: "Customer Name"
  }, /*#__PURE__*/React.createElement(Input, null)), /*#__PURE__*/React.createElement(Form.Item, {
    name: "phoneNumber",
    label: "Phone"
  }, /*#__PURE__*/React.createElement(Input, {
    inputMode: "numeric",
    pattern: "[0-9]*",
    maxLength: 10
  })), /*#__PURE__*/React.createElement(Form.Item, {
    name: "status",
    label: "Status"
  }, /*#__PURE__*/React.createElement(Input, null)), /*#__PURE__*/React.createElement(Form.Item, {
    label: "City",
    name: ['address', 'city']
  }, /*#__PURE__*/React.createElement(Input, null)), /*#__PURE__*/React.createElement(Form.Item, {
    label: "State",
    name: ['address', 'state']
  }, /*#__PURE__*/React.createElement(Input, null)), /*#__PURE__*/React.createElement(Form.Item, {
    label: "Country",
    name: ['address', 'country']
  }, /*#__PURE__*/React.createElement(Input, null)), /*#__PURE__*/React.createElement(Form.Item, {
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(Button, {
    type: "primary",
    htmlType: "submit",
    block: true
  }, "Save Changes"))), /*#__PURE__*/React.createElement(PunchCardsPage, {
    data: data,
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
  }, comments === null || comments === void 0 ? void 0 : comments.map((comment, index) => /*#__PURE__*/React.createElement(Space, {
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
    size: "small",
    style: {
      position: 'relative',
      paddingBottom: '24px'
    }
  }, comment["message"], /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: '4px',
      right: '8px',
      fontSize: '11px',
      color: '#888'
    }
  }, dayjs(comment['date']).format("YYYY-MM-DD HH:mm:ss"))))))), /*#__PURE__*/React.createElement(Row, null, /*#__PURE__*/React.createElement(TextArea, {
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