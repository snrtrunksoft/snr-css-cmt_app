const _excluded = ["id", "entityId"],
  _excluded2 = ["subscriptions"],
  _excluded3 = ["subscriptions"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { useEffect, useState } from "react";
import "./NameCard.css";
import { Badge, Button, Card, Col, Drawer, Form, Grid, Input, message, Row, Space, Select, Spin, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import maleAvatar from "./assets/male_avatar.jpg";
import TextArea from "antd/es/input/TextArea";
import { MEMBERS_API, RESOURCES_API } from "./properties/EndPointProperties";
import StatusModal from "./StatusModal";
import { getSubscriptionPlans, deleteMember, deleteResource } from "./api/APIUtil";
import PunchCardsPage from "./PunchCardsPage";
import dayjs from "dayjs";

// Mock subscription plans data - replace with API call later
const MOCK_SUBSCRIPTION_PLANS = [{
  "price": 490.0,
  "noOfSubscriptions": 50.0,
  "entityId": "w_123",
  "id": "sub_21",
  "isActive": true,
  "type": "RECURRING"
}, {
  "price": 20.0,
  "noOfSubscriptions": 30.0,
  "entityId": "w_123",
  "id": "sub_22",
  "isActive": true,
  "type": "RECURRING"
}, {
  "createdDate": "2025-11-12 09:00:00.0",
  "price": 499.0,
  "entityId": "w_123",
  "noOfSubscriptions": 10.0,
  "updatedDate": "2025-11-12 10:30:00.0",
  "id": "sub_23",
  "isActive": true,
  "type": "ONETIME"
}, {
  "price": 390.0,
  "noOfSubscriptions": 50.0,
  "entityId": "w_123",
  "id": "sub_24",
  "isActive": true,
  "type": "RECURRING"
}];
const NameCard = _ref => {
  var _address$, _address$2, _address$3, _address$4, _address$5, _address$6, _address$7, _address$8, _groupMessages$groupI, _groupMessages$groupI2, _groupMessages$groupI3, _groupMessages$groupI4;
  let {
    membersPage,
    data,
    setData,
    entityId,
    resourceData,
    setResourceData,
    customerId,
    customerName,
    email,
    phoneNumber,
    address,
    status,
    groupId,
    comments,
    subscriptions,
    commentBox,
    setCommentBox,
    selectedGroup,
    groupMessages,
    setGroupMessages
  } = _ref;
  const [isHovered, setIsHovered] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [nameCardDrawer, setNameCardDrawer] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [statusModal, setStatusModal] = useState({
    visible: false,
    type: "",
    title: "",
    message: ""
  });
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const {
    useBreakpoint
  } = Grid;
  const [form] = Form.useForm();
  const screens = useBreakpoint();
  const [defaultValues] = useState({
    customerId: customerId || "",
    customerName: customerName || "",
    phoneNumber: phoneNumber || "",
    email: email || "",
    status: status || "",
    groupId: groupId || "",
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
  useEffect(() => {
    if (nameCardDrawer && membersPage) {
      setLoadingPlans(true);
      // Simulate API call delay
      setTimeout(() => {
        setSubscriptionPlans(MOCK_SUBSCRIPTION_PLANS);
        console.log("Subscription Plans loaded from mock data:", MOCK_SUBSCRIPTION_PLANS);
        setLoadingPlans(false);
      }, 300);
    }
  }, [nameCardDrawer, membersPage]);
  const getDrawerWidth = () => {
    if (screens.xl) return 600;
    if (screens.lg) return 550;
    if (screens.md) return 500;
    if (screens.sm) return 300;
    return '100%';
  };
  const onFinish = values => {
    setIsEditable(false);
    console.log("form values:", values);

    // ---------- STEP 1: Find the correct data source ----------
    const filterData = membersPage ? data.find(prev => prev.id === values.customerId) : resourceData.find(prev => prev.resourceId === values.customerId);

    // ---------- STEP 2: Prepare updated record ----------
    const buildUpdatedRecord = isMember => {
      var _filterData$address, _values$address, _filterData$address2, _values$address2, _filterData$address3, _values$address3, _filterData$address4, _values$address4, _filterData$address5;
      return _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, filterData), isMember ? {
        customerName: values.customerName,
        email: values.email
      } : {
        resourceName: values.customerName
      }), {}, {
        phoneNumber: values.phoneNumber,
        status: values.status,
        groupId: values.groupId
      }, isMember && values.subscriptionPlanId && {
        subscriptionPlanId: values.subscriptionPlanId
      }), {}, {
        address: [_objectSpread(_objectSpread({}, (_filterData$address = filterData.address) === null || _filterData$address === void 0 ? void 0 : _filterData$address[0]), {}, {
          city: ((_values$address = values.address) === null || _values$address === void 0 ? void 0 : _values$address.city) || ((_filterData$address2 = filterData.address) === null || _filterData$address2 === void 0 || (_filterData$address2 = _filterData$address2[0]) === null || _filterData$address2 === void 0 ? void 0 : _filterData$address2.city) || "",
          state: ((_values$address2 = values.address) === null || _values$address2 === void 0 ? void 0 : _values$address2.state) || ((_filterData$address3 = filterData.address) === null || _filterData$address3 === void 0 || (_filterData$address3 = _filterData$address3[0]) === null || _filterData$address3 === void 0 ? void 0 : _filterData$address3.state) || "",
          country: ((_values$address3 = values.address) === null || _values$address3 === void 0 ? void 0 : _values$address3.country) || ((_filterData$address4 = filterData.address) === null || _filterData$address4 === void 0 || (_filterData$address4 = _filterData$address4[0]) === null || _filterData$address4 === void 0 ? void 0 : _filterData$address4.country) || "",
          street1: ((_values$address4 = values.address) === null || _values$address4 === void 0 ? void 0 : _values$address4.street1) || ((_filterData$address5 = filterData.address) === null || _filterData$address5 === void 0 || (_filterData$address5 = _filterData$address5[0]) === null || _filterData$address5 === void 0 ? void 0 : _filterData$address5.street1) || ""
        })]
      });
    };
    const updatedRecord = buildUpdatedRecord(membersPage);

    // Remove unneeded keys before API call
    const {
        id,
        entityId: recordEntityId
      } = updatedRecord,
      cleanCustomer = _objectWithoutProperties(updatedRecord, _excluded);
    console.log("Clean customer data:", cleanCustomer);
    console.log("entityId from props:", entityId);

    // ---------- STEP 3: API update ----------
    const updateNameCard = async () => {
      console.log("Using entityId:", entityId);
      try {
        const response = await fetch((membersPage ? MEMBERS_API : RESOURCES_API) + values.customerId, {
          method: "PUT",
          headers: {
            entityid: entityId,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(cleanCustomer)
        });
        const statusCode = response.status; // 🔹 capture status code
        const data = await response.json();
        if (!response.ok) {
          console.error("\u274C Failed to update record. Status: ".concat(statusCode), data);
          setStatusModal({
            visible: true,
            type: "error",
            title: "Update Failed",
            message: "Failed to update record. Please try again."
          });
        } else {
          if (membersPage) {
            setData(updateLocalState);
          } else {
            setResourceData(updateLocalState);
          }
          console.log("\u2705 Successfully updated record. Status: ".concat(statusCode), data);
          setStatusModal({
            visible: true,
            type: "success",
            title: "Updated Successfully",
            message: "".concat(membersPage ? "User" : "Resource", " has been updated successfully!")
          });
        }
      } catch (error) {
        console.error("❌ Network or server error while updating record:", error);
        setStatusModal({
          visible: true,
          type: "error",
          title: "Update Error",
          message: "Network or server error occurred. Please try again."
        });
      }
    };
    // ---------- STEP 4: Local state update ----------
    const updateLocalState = prev => prev.map(customer => {
      const matchKey = membersPage ? "id" : "resourceId";
      if (customer[matchKey] === values.customerId) {
        var _customer$address;
        return _objectSpread(_objectSpread(_objectSpread({}, customer), membersPage ? {
          customerName: values.customerName
        } : {
          resourceName: values.customerName
        }), {}, {
          phoneNumber: values.phoneNumber,
          status: values.status,
          groupId: values.groupId,
          address: [_objectSpread(_objectSpread({}, (_customer$address = customer.address) === null || _customer$address === void 0 ? void 0 : _customer$address[0]), {}, {
            city: values.address.city,
            state: values.address.state,
            country: values.address.country
          })]
        });
      }
      return customer;
    });
    updateNameCard();
  };
  const addressKeys = Object.keys((_address$8 = address === null || address === void 0 ? void 0 : address[0]) !== null && _address$8 !== void 0 ? _address$8 : {});

  // Determine color based on status (moved before handleSend)
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
  const handleSend = () => {
    const addTimeForComment = dayjs().format("YYYY-MM-DD HH:mm:ss.SSS");
    // console.log(addTimeForComment);
    if (newComment) {
      var _comments;
      const commentBody = [...comments, {
        "commentId": parseInt(((_comments = comments[comments.length - 1]) === null || _comments === void 0 ? void 0 : _comments.commentId) || 0) + 1,
        "author": customerName,
        "message": newComment,
        "date": addTimeForComment
      }];
      const updatedRecord = _objectSpread(_objectSpread({}, membersPage ? {
        customerName: customerName
      } : {
        resourceName: customerName
      }), {}, {
        "status": status,
        "address": address,
        "email": email,
        "subscriptions": subscriptions,
        "groupId": groupId,
        "phoneNumber": phoneNumber,
        "comments": commentBody
      });
      Object.values(updatedRecord.subscriptions).forEach(sub => {
        delete sub.entityId;
        delete sub.id;
      });
      console.log("updatedRecord:", updatedRecord);
      const uploadComment = async () => {
        try {
          // Create a clean copy before modifying
          let recordToUpload = _objectSpread({}, updatedRecord);

          // 🔹 Remove subscriptions if calling RESOURCES_API
          if (!membersPage) {
            const {
                subscriptions
              } = recordToUpload,
              rest = _objectWithoutProperties(recordToUpload, _excluded2);
            recordToUpload = rest;
          }
          console.log("Record:", recordToUpload);
          const response = await fetch((membersPage ? MEMBERS_API : RESOURCES_API) + customerId, {
            method: "PUT",
            headers: {
              entityid: entityId,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(recordToUpload)
          });
          const data = await response.json();
          console.log("✅ successfully added the comment:", data);
          if (membersPage) {
            setData(prevData => prevData.map(prev => {
              var _comments2;
              return prev.id === customerId ? _objectSpread(_objectSpread({}, prev), {}, {
                comments: [...prev.comments, {
                  commentId: parseInt(((_comments2 = comments[comments.length - 1]) === null || _comments2 === void 0 ? void 0 : _comments2.commentId) || 0) + 1,
                  message: newComment,
                  author: customerName,
                  date: addTimeForComment
                }]
              }) : prev;
            }));
          } else {
            setResourceData(prevData => prevData.map(prev => {
              var _comments3;
              return prev.resourceId === customerId ? _objectSpread(_objectSpread({}, prev), {}, {
                comments: [...prev.comments, {
                  commentId: parseInt(((_comments3 = comments[comments.length - 1]) === null || _comments3 === void 0 ? void 0 : _comments3.commentId) || 0) + 1,
                  message: newComment,
                  author: customerName,
                  date: addTimeForComment
                }]
              }) : prev;
            }));
          }
          const existingData = commentBox.findIndex(person => (membersPage ? person.customerName : person.resourceName) === customerName);
          if (existingData !== -1) {
            setCommentBox(prevComments => prevComments.map((prev, index) => {
              var _comments4;
              return index === existingData ? _objectSpread(_objectSpread({}, prev), {}, {
                comment: [...prev.comment, {
                  commentId: parseInt(((_comments4 = comments[comments.length - 1]) === null || _comments4 === void 0 ? void 0 : _comments4.commentId) || 0) + 1,
                  message: newComment,
                  author: customerName,
                  date: addTimeForComment
                }]
              }) : prev;
            }));
          } else {
            setCommentBox(prevComments => {
              var _comments5;
              return [...prevComments, {
                customerName,
                color,
                comment: [{
                  commentId: parseInt(((_comments5 = comments[comments.length - 1]) === null || _comments5 === void 0 ? void 0 : _comments5.commentId) || 0) + 1,
                  message: newComment,
                  author: customerName,
                  date: addTimeForComment
                }]
              }];
            });
          }
          setStatusModal({
            visible: true,
            type: "success",
            title: "Comment Posted",
            message: "Your comment has been posted successfully!"
          });
        } catch (error) {
          console.log("❌ unable to add Comment:", error);
          setStatusModal({
            visible: true,
            type: "error",
            title: "Comment Error",
            message: "Failed to post comment. Please try again."
          });
        }
      };
      uploadComment();
    }
    setNewComment("");
  };
  const handleClear = () => {
    setNewComment("");
  };
  const handleDeleteMember = async () => {
    try {
      setStatusModal({
        visible: true,
        type: "loading",
        title: "Deleting...",
        message: "Please wait"
      });
      if (membersPage) {
        await deleteMember(entityId, customerId);
      } else {
        await deleteResource(entityId, customerId);
      }
      setStatusModal({
        visible: true,
        type: "success",
        title: "Success",
        message: "".concat(membersPage ? "Member" : "Resource", " deleted successfully")
      });

      // Update parent data
      if (membersPage) {
        setData(prev => prev.filter(item => item.id !== customerId));
      } else {
        setResourceData(prev => prev.filter(item => item.resourceId !== customerId));
      }
      setTimeout(() => {
        setNameCardDrawer(false);
        setStatusModal({
          visible: false,
          type: "",
          title: "",
          message: ""
        });
      }, 1500);
    } catch (error) {
      console.error("Delete failed:", error);
      setStatusModal({
        visible: true,
        type: "error",
        title: "Error",
        message: "Failed to delete ".concat(membersPage ? "member" : "resource")
      });
    }
  };
  const handleDeleteComment = commentId => {
    const updatedComments = comments.filter((_, idx) => idx !== commentId);
    const updatedRecord = _objectSpread(_objectSpread({}, membersPage ? {
      customerName: customerName
    } : {
      resourceName: customerName
    }), {}, {
      "status": status,
      "address": address,
      "email": email,
      "subscriptions": subscriptions,
      "groupId": groupId,
      "phoneNumber": phoneNumber,
      "comments": updatedComments
    });
    Object.values(updatedRecord.subscriptions).forEach(sub => {
      delete sub.entityId;
      delete sub.id;
    });
    const deleteCommentAPI = async () => {
      try {
        let recordToUpload = _objectSpread({}, updatedRecord);
        if (!membersPage) {
          const {
              subscriptions
            } = recordToUpload,
            rest = _objectWithoutProperties(recordToUpload, _excluded3);
          recordToUpload = rest;
        }
        const response = await fetch((membersPage ? MEMBERS_API : RESOURCES_API) + customerId, {
          method: "PUT",
          headers: {
            "entityid": entityId,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(recordToUpload)
        });
        if (response.ok) {
          message.success("Comment deleted successfully");
          // Update local state
          if (membersPage) {
            setData(prev => prev.map(item => item.id === customerId ? _objectSpread(_objectSpread({}, item), {}, {
              comments: updatedComments
            }) : item));
          } else {
            setResourceData(prev => prev.map(item => item.resourceId === customerId ? _objectSpread(_objectSpread({}, item), {}, {
              comments: updatedComments
            }) : item));
          }
        } else {
          throw new Error("HTTP error! status: ".concat(response.status));
        }
      } catch (error) {
        console.error("Failed to delete comment:", error);
        message.error("Failed to delete comment");
      }
    };
    deleteCommentAPI();
  };
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
  }, "Name : ", customerName), /*#__PURE__*/React.createElement(Badge, {
    count: selectedGroup === groupId && groupMessages !== null && groupMessages !== void 0 && (_groupMessages$groupI = groupMessages[groupId]) !== null && _groupMessages$groupI !== void 0 && _groupMessages$groupI.hasUnread ? (_groupMessages$groupI2 = groupMessages[groupId].messages) === null || _groupMessages$groupI2 === void 0 ? void 0 : _groupMessages$groupI2.length : 0,
    overflowCount: 99,
    showZero: false,
    style: {
      backgroundColor: selectedGroup === groupId && groupMessages !== null && groupMessages !== void 0 && (_groupMessages$groupI3 = groupMessages[groupId]) !== null && _groupMessages$groupI3 !== void 0 && _groupMessages$groupI3.hasUnread ? '#ff4d4f' : 'transparent'
    },
    offset: [-15, -5]
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '30px',
      height: '15px',
      backgroundColor: "".concat(color)
    }
  }))), /*#__PURE__*/React.createElement("p", {
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
      setGroupMessages(prev => _objectSpread(_objectSpread({}, prev), {}, {
        [groupId]: _objectSpread(_objectSpread({}, prev[groupId]), {}, {
          hasUnread: false
        })
      }));
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "nameDrawer",
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    type: "primary",
    style: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      zIndex: 1,
      display: 'flex',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    type: "primary",
    onClick: () => setIsEditable(true)
  }, "Edit"), /*#__PURE__*/React.createElement(Popconfirm, {
    title: "Delete",
    description: "Are you sure you want to delete this ".concat(membersPage ? 'member' : 'resource', "?"),
    onConfirm: handleDeleteMember,
    okText: "Yes",
    cancelText: "No",
    okButtonProps: {
      danger: true
    }
  }, /*#__PURE__*/React.createElement(Button, {
    danger: true,
    icon: /*#__PURE__*/React.createElement(DeleteOutlined, null)
  }, "Delete"))), /*#__PURE__*/React.createElement(Row, {
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
      padding: '16px 24px',
      maxWidth: 600,
      margin: '0 auto',
      background: '#fff',
      borderRadius: 8,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px 16px'
    }
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "customerId",
    label: "Customer ID"
  }, /*#__PURE__*/React.createElement(Input, {
    readOnly: true,
    size: "middle"
  })), /*#__PURE__*/React.createElement(Form.Item, {
    name: "customerName",
    label: "Customer Name"
  }, /*#__PURE__*/React.createElement(Input, {
    size: "middle"
  })), membersPage && /*#__PURE__*/React.createElement(Form.Item, {
    name: "email",
    label: "Email"
  }, /*#__PURE__*/React.createElement(Input, {
    size: "middle"
  })), /*#__PURE__*/React.createElement(Form.Item, {
    name: "phoneNumber",
    label: "Phone"
  }, /*#__PURE__*/React.createElement(Input, {
    inputMode: "numeric",
    pattern: "[0-9]*",
    maxLength: 10,
    size: "middle"
  })), /*#__PURE__*/React.createElement(Form.Item, {
    name: "status",
    label: "Status"
  }, /*#__PURE__*/React.createElement(Input, {
    size: "middle"
  })), /*#__PURE__*/React.createElement(Form.Item, {
    name: "groupId",
    label: "groupId"
  }, /*#__PURE__*/React.createElement(Input, {
    size: "middle"
  })), membersPage && /*#__PURE__*/React.createElement(Form.Item, {
    name: "subscriptionPlanId",
    label: "Subscription Plan"
  }, /*#__PURE__*/React.createElement(Spin, {
    spinning: loadingPlans
  }, /*#__PURE__*/React.createElement(Select, {
    placeholder: "Select a subscription plan",
    size: "middle"
  }, subscriptionPlans.map(plan => /*#__PURE__*/React.createElement(Select.Option, {
    key: plan.id,
    value: plan.id
  }, plan.id, " - $", plan.price, " (", plan.type, ")"))))), /*#__PURE__*/React.createElement(Form.Item, {
    label: "City",
    name: ['address', 'city']
  }, /*#__PURE__*/React.createElement(Input, {
    size: "middle"
  })), /*#__PURE__*/React.createElement(Form.Item, {
    label: "State",
    name: ['address', 'state']
  }, /*#__PURE__*/React.createElement(Input, {
    size: "middle"
  })), /*#__PURE__*/React.createElement(Form.Item, {
    label: "Country",
    name: ['address', 'country']
  }, /*#__PURE__*/React.createElement(Input, {
    size: "middle"
  })), /*#__PURE__*/React.createElement(Form.Item, {
    label: "Street1",
    name: ['address', 'street1'],
    style: {
      gridColumn: '1 / -1'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    size: "middle"
  }))), /*#__PURE__*/React.createElement(Form.Item, {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(Button, {
    type: "primary",
    htmlType: "submit",
    block: true
  }, "Save Changes"))), membersPage && /*#__PURE__*/React.createElement(PunchCardsPage, {
    data: data,
    customerId: customerId,
    customerName: customerName,
    setNewComment: setNewComment,
    handleSend: handleSend,
    subscriptions: subscriptions || [],
    setData: setData,
    entityId: entityId,
    color: color
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      marginTop: '30px',
      marginBottom: '15px'
    }
  }, "Group Messages (", groupId, ") :"), /*#__PURE__*/React.createElement(Row, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '20px'
    }
  }, (groupMessages === null || groupMessages === void 0 || (_groupMessages$groupI4 = groupMessages[groupId]) === null || _groupMessages$groupI4 === void 0 || (_groupMessages$groupI4 = _groupMessages$groupI4.messages) === null || _groupMessages$groupI4 === void 0 ? void 0 : _groupMessages$groupI4.length) > 0 ? groupMessages[groupId].messages.map((message, index) => /*#__PURE__*/React.createElement(Space, {
    key: index,
    direction: "vertical",
    size: "middle",
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    size: "small",
    style: {
      position: 'relative',
      paddingBottom: '24px',
      backgroundColor: '#f0f8ff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 'bold',
      marginBottom: '8px',
      color: '#0066cc'
    }
  }, groupId), message))) : /*#__PURE__*/React.createElement("p", {
    style: {
      color: '#888',
      fontStyle: 'italic'
    }
  }, "No group messages yet")), /*#__PURE__*/React.createElement("h3", {
    style: {
      marginTop: '30px'
    }
  }, "Comments :"), /*#__PURE__*/React.createElement(Row, {
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
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, comment["message"]), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: '4px',
      right: '8px',
      fontSize: '11px',
      color: '#888',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement(Popconfirm, {
    title: "Delete Comment",
    description: "Are you sure you want to delete this comment?",
    onConfirm: () => handleDeleteComment(index),
    okText: "Yes",
    cancelText: "No",
    okButtonProps: {
      danger: true
    }
  }, /*#__PURE__*/React.createElement(Button, {
    type: "text",
    danger: true,
    size: "small",
    icon: /*#__PURE__*/React.createElement(DeleteOutlined, null),
    style: {
      marginLeft: '8px'
    }
  })), dayjs(comment['date']).format("YYYY-MM-DD HH:mm:ss"))))))), /*#__PURE__*/React.createElement(Row, null, /*#__PURE__*/React.createElement(TextArea, {
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
  }, "send"))))), /*#__PURE__*/React.createElement(StatusModal, {
    visible: statusModal.visible,
    type: statusModal.type,
    title: statusModal.title,
    message: statusModal.message,
    onClose: () => {
      setStatusModal({
        visible: false,
        type: "",
        title: "",
        message: ""
      });
      if (statusModal.type === "success" && isEditable) {
        setIsEditable(false);
        setNameCardDrawer(false);
      }
    }
  }));
};
export default NameCard;