const _excluded = ["entityId", "id"],
  _excluded2 = ["id", "entityId"],
  _excluded3 = ["subscriptions"],
  _excluded4 = ["subscriptions"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import React, { useEffect, useMemo, useState } from "react";
import "./NameCard.css";
import { Badge, Button, Card, Col, Drawer, Form, Grid, Input, message, Row, Space, Select, Spin, Popconfirm, Typography, Avatar, Tag } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import maleAvatar from "./assets/male_avatar.jpg";
import TextArea from "antd/es/input/TextArea";
import StatusModal from "./StatusModal";
import { getSubscriptionPlans, deleteMember, deleteResource, updateMember, updateResource } from "./api/APIUtil";
import PunchCardsPage from "./PunchCardsPage";
import dayjs from "dayjs";
const {
  Option
} = Select;
const NAME_PATTERN = /^[a-zA-Z][a-zA-Z0-9._]*(?: +[a-zA-Z0-9._]+)*$/;
const validateName = (_, value) => {
  const trimmedValue = (value || "").trim();
  if (!trimmedValue) {
    return Promise.reject(new Error("Name is required"));
  }
  if (!NAME_PATTERN.test(trimmedValue)) {
    return Promise.reject(new Error("Name must start with a letter and can contain letters, numbers, spaces, underscores, and dots"));
  }
  if (trimmedValue.length < 7) {
    return Promise.reject(new Error("Name should have at least 7 characters"));
  }
  return Promise.resolve();
};
const STATUS_COLORS = {
  ACTIVE: "pink",
  COMPLETED: "lightgreen",
  IN_PROGRESS: "lightblue",
  CANCELLED: "red"
};
const EMPTY_STATUS_MODAL = {
  visible: false,
  type: "",
  title: "",
  message: ""
};
const normalizeGroupId = value => {
  if (Array.isArray(value)) {
    if (value.length === 0) return [];
    return Array.isArray(value[0]) ? value[0] : value;
  }
  return value ? [value] : [];
};
const getNextCommentId = function () {
  var _comments;
  let comments = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return parseInt(((_comments = comments[comments.length - 1]) === null || _comments === void 0 ? void 0 : _comments.commentId) || 0, 10) + 1;
};
const getRecordKey = isMember => isMember ? "id" : "resourceId";
const sanitizeSubscriptionsForMemberUpdate = function () {
  let subscriptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return Array.isArray(subscriptions) ? subscriptions.map(_ref => {
    let {
        entityId,
        id
      } = _ref,
      subscription = _objectWithoutProperties(_ref, _excluded);
    return subscription;
  }) : subscriptions;
};
const NameCard = _ref2 => {
  var _groupMessages, _groupMessages2, _groupMessages3, _address$8, _address$9, _address$0, _address$1;
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
    commentBox = [],
    setCommentBox,
    selectedGroup,
    groupMessages,
    setGroupMessages,
    uniqueGroups = []
  } = _ref2;
  const [isHovered, setIsHovered] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [nameCardDrawer, setNameCardDrawer] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [statusModal, setStatusModal] = useState(EMPTY_STATUS_MODAL);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  // Track which comment index is currently being deleted (null = none)
  const [deletingCommentIndex, setDeletingCommentIndex] = useState(null);
  const {
    useBreakpoint
  } = Grid;
  const [form] = Form.useForm();
  const screens = useBreakpoint();
  const defaultValues = useMemo(() => {
    var _address$, _address$2, _address$3, _address$4, _address$5, _address$6, _address$7;
    return {
      customerId: customerId || "",
      customerName: customerName || "",
      phoneNumber: phoneNumber || "",
      email: email || "",
      status: status || "",
      groupId: normalizeGroupId(groupId),
      address: {
        houseNo: (address === null || address === void 0 || (_address$ = address[0]) === null || _address$ === void 0 ? void 0 : _address$.houseNo) || "",
        street1: (address === null || address === void 0 || (_address$2 = address[0]) === null || _address$2 === void 0 ? void 0 : _address$2.street1) || "",
        street2: (address === null || address === void 0 || (_address$3 = address[0]) === null || _address$3 === void 0 ? void 0 : _address$3.street2) || "",
        city: (address === null || address === void 0 || (_address$4 = address[0]) === null || _address$4 === void 0 ? void 0 : _address$4.city) || "",
        state: (address === null || address === void 0 || (_address$5 = address[0]) === null || _address$5 === void 0 ? void 0 : _address$5.state) || "",
        country: (address === null || address === void 0 || (_address$6 = address[0]) === null || _address$6 === void 0 ? void 0 : _address$6.country) || "",
        pincode: (address === null || address === void 0 || (_address$7 = address[0]) === null || _address$7 === void 0 ? void 0 : _address$7.pincode) || ""
      }
    };
  }, [address, customerId, customerName, email, groupId, phoneNumber, status]);
  useEffect(() => {
    form.setFieldsValue(defaultValues);
  }, [form, defaultValues]);
  useEffect(() => {
    if (nameCardDrawer && membersPage) {
      setLoadingPlans(true);
      // Fetch subscription plans from API
      const fetchSubscriptionPlans = async () => {
        try {
          const res = await getSubscriptionPlans(entityId);
          setSubscriptionPlans(res);
          console.log("Subscription Plans loaded from API:", res);
        } catch (error) {
          console.log("Error fetching subscription plans:", error);
        } finally {
          setLoadingPlans(false);
        }
      };
      fetchSubscriptionPlans();
    }
  }, [entityId, nameCardDrawer, membersPage]);
  const getDrawerWidth = () => {
    if (screens.xl) return 600;
    if (screens.lg) return 550;
    if (screens.md) return 500;
    if (screens.sm) return 300;
    return '100%';
  };
  const onFinish = async values => {
    var _values$customerName;
    const trimmedCustomerName = ((_values$customerName = values.customerName) === null || _values$customerName === void 0 ? void 0 : _values$customerName.trim()) || "";

    // ---------- STEP 1: Find the correct data source ----------
    const filterData = membersPage ? data.find(prev => prev.id === values.customerId) : resourceData.find(prev => prev.resourceId === values.customerId);
    if (!filterData) {
      setStatusModal({
        visible: true,
        type: "error",
        title: "Update Error",
        message: "".concat(membersPage ? "User" : "Resource", " was not found. Please refresh and try again.")
      });
      return;
    }

    // ---------- STEP 2: Prepare updated record ----------
    const buildUpdatedRecord = isMember => {
      var _filterData$address, _values$address, _filterData$address2, _values$address2, _filterData$address3, _values$address3, _filterData$address4, _values$address4, _filterData$address5;
      return _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, filterData), isMember ? {
        customerName: trimmedCustomerName,
        email: values.email
      } : {
        resourceName: trimmedCustomerName,
        email: values.email
      }), {}, {
        phoneNumber: values.phoneNumber,
        status: values.status,
        groupId: normalizeGroupId(values.groupId)
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
      cleanCustomer = _objectWithoutProperties(updatedRecord, _excluded2);

    // ---------- STEP 3: API update ----------
    const updateNameCard = async () => {
      setIsUpdating(true);
      try {
        if (membersPage) {
          await updateMember(entityId, values.customerId, cleanCustomer);
        } else {
          await updateResource(entityId, values.customerId, cleanCustomer);
        }
        if (membersPage) {
          setData(updateLocalState);
        } else {
          setResourceData(updateLocalState);
        }
        console.log("\u2705 Successfully updated record");
        setStatusModal({
          visible: true,
          type: "success",
          title: "Updated Successfully",
          message: "".concat(membersPage ? "User" : "Resource", " has been updated successfully!")
        });
      } catch (error) {
        console.error("❌ Network or server error while updating record:", error);
        setStatusModal({
          visible: true,
          type: "error",
          title: "Update Error",
          message: "Network or server error occurred. Please try again."
        });
      } finally {
        setIsUpdating(false);
      }
    };
    // ---------- STEP 4: Local state update ----------
    const updateLocalState = prev => prev.map(customer => {
      const matchKey = getRecordKey(membersPage);
      if (customer[matchKey] === values.customerId) {
        var _customer$address;
        return _objectSpread(_objectSpread(_objectSpread({}, customer), membersPage ? {
          customerName: trimmedCustomerName
        } : {
          resourceName: trimmedCustomerName
        }), {}, {
          email: values.email,
          phoneNumber: values.phoneNumber,
          status: values.status,
          groupId: normalizeGroupId(values.groupId),
          address: [_objectSpread(_objectSpread({}, (_customer$address = customer.address) === null || _customer$address === void 0 ? void 0 : _customer$address[0]), {}, {
            city: values.address.city,
            state: values.address.state,
            country: values.address.country
          })]
        });
      }
      return customer;
    });
    await updateNameCard();
  };
  const color = STATUS_COLORS[status] || "red";
  const visibleComments = Array.isArray(comments) ? comments : [];
  const handleSend = async function (commentOverride) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const commentText = typeof commentOverride === "string" ? commentOverride : newComment;
    const {
      showStatus = true,
      subscriptionsOverride
    } = options;
    const addTimeForComment = dayjs().format("YYYY-MM-DD HH:mm:ss.SSS");
    const existingComments = visibleComments;
    const nextCommentId = getNextCommentId(existingComments);
    const trimmedComment = commentText.trim();
    if (trimmedComment) {
      const commentBody = [...existingComments, {
        "commentId": nextCommentId,
        "author": customerName,
        "message": trimmedComment,
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
        "subscriptions": sanitizeSubscriptionsForMemberUpdate(subscriptionsOverride || subscriptions),
        "groupId": normalizeGroupId(groupId).flat().filter(Boolean),
        "phoneNumber": phoneNumber,
        "comments": commentBody
      });
      const uploadComment = async () => {
        setIsAddingComment(true);
        try {
          let recordToUpload = _objectSpread({}, updatedRecord);

          // 🔹 Remove subscriptions if calling RESOURCES_API
          if (!membersPage) {
            const {
                subscriptions
              } = recordToUpload,
              rest = _objectWithoutProperties(recordToUpload, _excluded3);
            recordToUpload = rest;
          }
          if (membersPage) {
            await updateMember(entityId, customerId, recordToUpload);
          } else {
            await updateResource(entityId, customerId, recordToUpload);
          }
          console.log("✅ successfully added the comment");
          if (membersPage) {
            setData(prevData => prevData.map(prev => prev.id === customerId ? _objectSpread(_objectSpread({}, prev), {}, {
              comments: [...(prev.comments || []), {
                commentId: nextCommentId,
                message: trimmedComment,
                author: customerName,
                date: addTimeForComment
              }]
            }) : prev));
          } else {
            setResourceData(prevData => prevData.map(prev => prev.resourceId === customerId ? _objectSpread(_objectSpread({}, prev), {}, {
              comments: [...(prev.comments || []), {
                commentId: nextCommentId,
                message: trimmedComment,
                author: customerName,
                date: addTimeForComment
              }]
            }) : prev));
          }
          const existingData = commentBox.findIndex(person => (membersPage ? person.customerName : person.resourceName) === customerName);
          if (existingData !== -1) {
            setCommentBox(prevComments => prevComments.map((prev, index) => index === existingData ? _objectSpread(_objectSpread({}, prev), {}, {
              comment: [...prev.comment, {
                commentId: nextCommentId,
                message: trimmedComment,
                author: customerName,
                date: addTimeForComment
              }]
            }) : prev));
          } else {
            setCommentBox(prevComments => [...prevComments, {
              customerName,
              color,
              comment: [{
                commentId: nextCommentId,
                message: trimmedComment,
                author: customerName,
                date: addTimeForComment
              }]
            }]);
          }
          if (showStatus) {
            setStatusModal({
              visible: true,
              type: "success",
              title: "Comment Posted",
              message: "Your comment has been posted successfully!"
            });
          }
        } catch (error) {
          console.log("Unable to add comment:", error);
          if (showStatus) {
            setStatusModal({
              visible: true,
              type: "error",
              title: "Comment Error",
              message: "Failed to post comment. Please try again."
            });
          }
          throw error;
        } finally {
          setIsAddingComment(false);
        }
      };
      await uploadComment();
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
        setStatusModal(EMPTY_STATUS_MODAL);
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
    const updatedComments = visibleComments.filter((_, idx) => idx !== commentId);
    const updatedRecord = _objectSpread(_objectSpread({}, membersPage ? {
      customerName: customerName
    } : {
      resourceName: customerName
    }), {}, {
      "status": status,
      "address": address,
      "email": email,
      "subscriptions": sanitizeSubscriptionsForMemberUpdate(subscriptions),
      "groupId": normalizeGroupId(groupId).flat().filter(Boolean),
      "phoneNumber": phoneNumber,
      "comments": updatedComments
    });
    const deleteCommentAPI = async () => {
      // Indicate which comment index is being deleted so only that button shows loading
      setDeletingCommentIndex(commentId);
      try {
        let recordToUpload = _objectSpread({}, updatedRecord);
        if (!membersPage) {
          const {
              subscriptions
            } = recordToUpload,
            rest = _objectWithoutProperties(recordToUpload, _excluded4);
          recordToUpload = rest;
        }
        if (membersPage) {
          await updateMember(entityId, customerId, recordToUpload);
        } else {
          await updateResource(entityId, customerId, recordToUpload);
        }

        // Show both quick message and StatusModal for consistent UX
        message.success("Comment deleted successfully");
        setStatusModal({
          visible: true,
          type: "success",
          title: "Comment Deleted",
          message: "Comment has been deleted successfully."
        });
        setTimeout(() => setStatusModal(EMPTY_STATUS_MODAL), 1500);

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
      } catch (error) {
        console.error("Failed to delete comment:", error);
        message.error("Failed to delete comment");
        setStatusModal({
          visible: true,
          type: "error",
          title: "Delete Error",
          message: "Failed to delete comment. Please try again."
        });
        setTimeout(() => setStatusModal(EMPTY_STATUS_MODAL), 2000);
      } finally {
        setDeletingCommentIndex(null);
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
    count: selectedGroup === (Array.isArray(groupId) ? groupId[0] : groupId) && groupMessages !== null && groupMessages !== void 0 && (_groupMessages = groupMessages[Array.isArray(groupId) ? groupId[0] : groupId]) !== null && _groupMessages !== void 0 && _groupMessages.hasUnread ? (_groupMessages2 = groupMessages[Array.isArray(groupId) ? groupId[0] : groupId]) === null || _groupMessages2 === void 0 || (_groupMessages2 = _groupMessages2.messages) === null || _groupMessages2 === void 0 ? void 0 : _groupMessages2.length : 0,
    overflowCount: 99,
    showZero: false,
    style: {
      backgroundColor: selectedGroup === (Array.isArray(groupId) ? groupId[0] : groupId) && groupMessages !== null && groupMessages !== void 0 && (_groupMessages3 = groupMessages[Array.isArray(groupId) ? groupId[0] : groupId]) !== null && _groupMessages3 !== void 0 && _groupMessages3.hasUnread ? '#ff4d4f' : 'transparent'
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
  }, "Phone : ", phoneNumber), /*#__PURE__*/React.createElement("p", {
    style: {
      width: "100%",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      margin: 0
    }
  }, "Address:\xA0", Array.isArray(address) && address.length > 0 ? address.map(a => [a.city, a.state, a.country].filter(Boolean).join(", ")).join(" | ") : "Not Available"), /*#__PURE__*/React.createElement("p", {
    style: {
      width: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, "Status : ", status)), /*#__PURE__*/React.createElement(Drawer, {
    open: nameCardDrawer,
    width: getDrawerWidth(),
    onClose: () => {
      setNameCardDrawer(false);
      setNewComment("");
      const currentGroupKey = Array.isArray(groupId) ? groupId[0] : groupId;
      if (currentGroupKey) {
        setGroupMessages(prev => _objectSpread(_objectSpread({}, prev), {}, {
          [currentGroupKey]: _objectSpread(_objectSpread({}, (prev === null || prev === void 0 ? void 0 : prev[currentGroupKey]) || {}), {}, {
            hasUnread: false
          })
        }));
      }
    },
    bodyStyle: {
      background: "#f5f7fa",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(Card, {
    bordered: false,
    style: {
      marginBottom: 12,
      borderRadius: 0,
      boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
      padding: "12px 16px"
    },
    bodyStyle: {
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "80px 1fr 120px",
      gridTemplateRows: "22px 18px 18px 36px",
      columnGap: 16,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridRow: "1 / span 4"
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    src: maleAvatar,
    size: 64,
    style: {
      border: "2px solid #e5e7eb"
    }
  })), /*#__PURE__*/React.createElement(Typography.Text, {
    strong: true,
    style: {
      gridColumn: 2,
      gridRow: 1,
      fontSize: 16,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, customerName), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 3,
      gridRow: "1 / span 4",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "small",
    type: "primary",
    onClick: () => setIsEditable(true)
  }, "Edit"), /*#__PURE__*/React.createElement(Popconfirm, {
    title: "Delete",
    description: "Are you sure you want to delete this ".concat(membersPage ? "member" : "resource", "?"),
    onConfirm: handleDeleteMember,
    okText: "Yes",
    cancelText: "No",
    okButtonProps: {
      danger: true
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "small",
    danger: true,
    icon: /*#__PURE__*/React.createElement(DeleteOutlined, null)
  }, "Delete"))), /*#__PURE__*/React.createElement(Typography.Text, {
    type: "secondary",
    style: {
      gridColumn: 2,
      gridRow: 2,
      fontSize: 13,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, phoneNumber), /*#__PURE__*/React.createElement(Typography.Text, {
    type: "secondary",
    style: {
      gridColumn: 2,
      gridRow: 3,
      fontSize: 13,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, email || "No email"), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 2,
      gridRow: 4,
      fontSize: 13,
      color: "#6b7280",
      lineHeight: "18px",
      overflow: "hidden",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical"
    }
  }, [address === null || address === void 0 || (_address$8 = address[0]) === null || _address$8 === void 0 ? void 0 : _address$8.street1, address === null || address === void 0 || (_address$9 = address[0]) === null || _address$9 === void 0 ? void 0 : _address$9.city, address === null || address === void 0 || (_address$0 = address[0]) === null || _address$0 === void 0 ? void 0 : _address$0.state, address === null || address === void 0 || (_address$1 = address[0]) === null || _address$1 === void 0 ? void 0 : _address$1.country].filter(Boolean).join(", ")))), /*#__PURE__*/React.createElement(Form, {
    hidden: !isEditable,
    form: form,
    layout: "vertical",
    onFinish: onFinish
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Edit Details",
    style: {
      margin: 16,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement(Row, {
    gutter: 16
  }, /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "customerId",
    label: "Customer ID"
  }, /*#__PURE__*/React.createElement(Input, {
    readOnly: true
  }))), /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "customerName",
    label: "Name",
    rules: [{
      validator: validateName
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Enter name (spaces allowed, min 7 chars)"
  }))), /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "email",
    label: "Email",
    rules: [{
      required: true,
      message: 'Email is required'
    }, {
      type: 'email',
      message: 'Please enter a valid email address'
    }]
  }, /*#__PURE__*/React.createElement(Input, null))), /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "phoneNumber",
    label: "Phone",
    rules: [{
      required: true,
      message: 'Phone number is required'
    }, {
      pattern: /^[0-9]{10}$/,
      message: 'Phone number should be exactly 10 digits'
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    maxLength: 10,
    placeholder: "Enter 10-digit phone number"
  }))), /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "status",
    label: "Status",
    rules: [{
      required: true,
      message: 'Status is required'
    }]
  }, /*#__PURE__*/React.createElement(Select, {
    placeholder: "Select status"
  }, /*#__PURE__*/React.createElement(Option, {
    value: "ACTIVE"
  }, "ACTIVE"), /*#__PURE__*/React.createElement(Option, {
    value: "IN_PROGRESS"
  }, "IN_PROGRESS"), /*#__PURE__*/React.createElement(Option, {
    value: "COMPLETED"
  }, "COMPLETED"), /*#__PURE__*/React.createElement(Option, {
    value: "CANCELLED"
  }, "CANCELLED")))), /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "groupId",
    label: "Group Name"
  }, /*#__PURE__*/React.createElement(Select, {
    mode: "multiple",
    placeholder: "Select one or more groups",
    style: {
      fontSize: "14px"
    },
    options: (uniqueGroups || []).map(g => ({
      label: g,
      value: g
    })),
    allowClear: true
  }))), membersPage && /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "subscriptionPlanId",
    label: "Subscription Plan"
  }, /*#__PURE__*/React.createElement(Spin, {
    spinning: loadingPlans
  }, /*#__PURE__*/React.createElement(Select, {
    placeholder: "Select a plan"
  }, subscriptionPlans.map(plan => /*#__PURE__*/React.createElement(Option, {
    key: plan.id,
    value: plan.id
  }, plan.id, " - $", plan.price, " (", plan.type, ")")))))), /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: ["address", "city"],
    label: "City",
    rules: [{
      required: true,
      message: 'City is required'
    }, {
      pattern: /^[a-zA-Z\s]+$/,
      message: 'City should contain only letters'
    }, {
      min: 2,
      message: 'City name should have at least 2 characters'
    }]
  }, /*#__PURE__*/React.createElement(Input, null))), /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: ["address", "state"],
    label: "State/Province",
    rules: [{
      required: true,
      message: 'State is required'
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Enter state/province"
  }))), /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: ["address", "country"],
    label: "Country",
    rules: [{
      required: true,
      message: 'Country is required'
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Enter country"
  }))), /*#__PURE__*/React.createElement(Col, {
    span: 24
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: ["address", "street1"],
    label: "Street",
    rules: [{
      required: true,
      message: 'Street is required'
    }, {
      min: 5,
      message: 'Street should have at least 5 characters'
    }]
  }, /*#__PURE__*/React.createElement(Input, null)))), /*#__PURE__*/React.createElement(Button, {
    type: "primary",
    htmlType: "submit",
    block: true,
    loading: isUpdating,
    disabled: isUpdating
  }, "Save Changes"))), membersPage && /*#__PURE__*/React.createElement(Card, {
    title: "Punch Cards",
    style: {
      margin: "0 16px",
      borderRadius: 8
    },
    bodyStyle: {
      padding: 16
    }
  }, /*#__PURE__*/React.createElement(PunchCardsPage, {
    data: data,
    customerId: customerId,
    customerName: customerName,
    subscriptions: subscriptions,
    setNewComment: setNewComment,
    handleSend: handleSend,
    setData: setData,
    entityId: entityId,
    color: color
  })), /*#__PURE__*/React.createElement(Card, {
    title: "Comments",
    style: {
      margin: 16,
      borderRadius: 8
    }
  }, visibleComments.length > 0 ? visibleComments.map((comment, index) => /*#__PURE__*/React.createElement(Badge.Ribbon, {
    key: index,
    text: comment.author,
    color: color
  }, /*#__PURE__*/React.createElement(Card, {
    size: "small",
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, comment.message), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 8,
      fontSize: 11,
      color: "#888"
    }
  }, /*#__PURE__*/React.createElement("div", null, dayjs(comment.date).format("YYYY-MM-DD HH:mm:ss")), deletingCommentIndex === index ? /*#__PURE__*/React.createElement(Typography.Text, {
    type: "secondary",
    style: {
      marginLeft: 8,
      fontStyle: 'italic'
    }
  }, "Deleting...") : /*#__PURE__*/React.createElement(Popconfirm, {
    title: "Delete comment?",
    onConfirm: () => handleDeleteComment(index)
  }, /*#__PURE__*/React.createElement(Button, {
    type: "text",
    danger: true,
    size: "small",
    icon: /*#__PURE__*/React.createElement(DeleteOutlined, null),
    loading: deletingCommentIndex === index,
    disabled: deletingCommentIndex === index
  })))))) : /*#__PURE__*/React.createElement(Typography.Text, {
    type: "secondary"
  }, "No comments yet.")), /*#__PURE__*/React.createElement(Card, {
    style: {
      margin: 16,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement(TextArea, {
    rows: 3,
    placeholder: "Write a comment...",
    value: newComment,
    onChange: e => setNewComment(e.target.value)
  }), /*#__PURE__*/React.createElement(Row, {
    justify: "end",
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(Space, null, /*#__PURE__*/React.createElement(Button, {
    onClick: handleClear,
    disabled: isAddingComment
  }, "Clear"), /*#__PURE__*/React.createElement(Button, {
    type: "primary",
    onClick: () => handleSend(),
    loading: isAddingComment,
    disabled: isAddingComment
  }, "Send"))))), /*#__PURE__*/React.createElement(StatusModal, {
    visible: statusModal.visible,
    type: statusModal.type,
    title: statusModal.title,
    message: statusModal.message,
    onClose: () => {
      setStatusModal(EMPTY_STATUS_MODAL);
      if (statusModal.type === "success" && isEditable) {
        setIsEditable(false);
        setNameCardDrawer(false);
      }
    }
  }));
};
export default NameCard;