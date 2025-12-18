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
const NameCard = _ref => {
  var _address$, _address$2, _address$3, _address$4, _address$5, _address$6, _address$7, _address$8, _groupMessages, _groupMessages2, _groupMessages3, _address$9, _address$0, _address$1, _address$10;
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
    setGroupMessages,
    uniqueGroups = []
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
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  // Track which comment index is currently being deleted (null = none)
  const [deletingCommentIndex, setDeletingCommentIndex] = useState(null);

  // Country/State data for address edit (copied behavior from AddNewUser)
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [states, setStates] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryCode, setCountryCode] = useState("");
  const {
    useBreakpoint
  } = Grid;
  const [form] = Form.useForm();
  const screens = useBreakpoint();

  // Helper to ensure groupId is an array of strings
  const getGroupArrayValue = () => {
    if (Array.isArray(groupId)) {
      if (groupId.length === 0) return [];
      if (Array.isArray(groupId[0])) return groupId[0];
      return groupId;
    }
    return groupId ? [groupId] : [];
  };
  const [defaultValues] = useState({
    customerId: customerId || "",
    customerName: customerName || "",
    phoneNumber: phoneNumber || "",
    email: email || "",
    status: status || "",
    groupId: getGroupArrayValue(),
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

    // Fetch country/state data when drawer opens (also used for phone country code)
    if (nameCardDrawer) {
      fetchCountries();
    }
  }, [nameCardDrawer, membersPage]);

  // Fetch countries from restcountries API (copied logic from AddNewUser)
  const fetchCountries = async () => {
    if (countries.length > 0) return; // already loaded
    setLoadingCountries(true);
    try {
      var _defaultValues$addres;
      const response = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,idd,region,states");
      const data = await response.json();
      const sortedCountries = data.map(country => {
        var _country$idd, _country$idd2;
        return {
          name: country.name.common,
          code: country.cca2,
          dialCode: ((_country$idd = country.idd) === null || _country$idd === void 0 ? void 0 : _country$idd.root) + (((_country$idd2 = country.idd) === null || _country$idd2 === void 0 || (_country$idd2 = _country$idd2.suffixes) === null || _country$idd2 === void 0 ? void 0 : _country$idd2[0]) || ''),
          region: country.region,
          states: country.states || []
        };
      }).sort((a, b) => a.name.localeCompare(b.name));
      setCountries(sortedCountries);
      console.log("Countries loaded:", sortedCountries);

      // If this record already had a country selected, set it
      const initCountry = (_defaultValues$addres = defaultValues.address) === null || _defaultValues$addres === void 0 ? void 0 : _defaultValues$addres.country;
      if (initCountry) {
        const found = sortedCountries.find(c => c.name === initCountry);
        if (found) {
          setSelectedCountry(found);
          setCountryCode(found.dialCode || "");
          fetchStates(found.name);
        }
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    } finally {
      setLoadingCountries(false);
    }
  };
  const fetchStates = async countryName => {
    setLoadingStates(true);
    try {
      const response = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          country: countryName
        })
      });
      const data = await response.json();
      console.log("States response for", countryName, ":", data);
      if (data.data && data.data.states && Array.isArray(data.data.states)) {
        const statesList = data.data.states.map(state => ({
          name: state.name,
          code: state.state_code || state.name
        })).sort((a, b) => a.name.localeCompare(b.name));
        console.log("Parsed states:", statesList);
        setStates(statesList);
      } else {
        console.log("No states found for", countryName);
        setStates([]);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
      setStates([]);
    } finally {
      setLoadingStates(false);
    }
  };
  const handleCountryChange = value => {
    const selected = countries.find(c => c.name === value);
    if (selected) {
      setSelectedCountry(selected);
      setCountryCode(selected.dialCode || "");
      fetchStates(selected.name);
      // Reset nested state field
      form.setFieldsValue({
        address: {
          state: undefined
        }
      });
    }
  };
  useEffect(() => {
    // If countries are already loaded and drawer just opened, ensure state is synced
    if (nameCardDrawer && countries.length > 0) {
      var _defaultValues$addres2;
      const initCountry = (_defaultValues$addres2 = defaultValues.address) === null || _defaultValues$addres2 === void 0 ? void 0 : _defaultValues$addres2.country;
      if (initCountry) {
        const found = countries.find(c => c.name === initCountry);
        if (found) {
          setSelectedCountry(found);
          setCountryCode(found.dialCode || "");
          fetchStates(found.name);
        }
      }
    }
  }, [nameCardDrawer, countries]);
  const getDrawerWidth = () => {
    if (screens.xl) return 600;
    if (screens.lg) return 550;
    if (screens.md) return 500;
    if (screens.sm) return 300;
    return '100%';
  };
  const onFinish = values => {
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
        groupId: Array.isArray(values.groupId) ? values.groupId : values.groupId ? [values.groupId] : []
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
      setIsUpdating(true);
      console.log("Using entityId:", entityId);
      try {
        const membersPage_local = membersPage;
        const customerId_local = values.customerId;
        if (membersPage_local) {
          await updateMember(entityId, customerId_local, cleanCustomer);
        } else {
          await updateResource(entityId, customerId_local, cleanCustomer);
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
          groupId: Array.isArray(values.groupId) ? values.groupId : values.groupId ? [values.groupId] : [],
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
        "groupId": Array.isArray(groupId) ? groupId.length > 0 ? groupId : "" : groupId || "",
        "phoneNumber": phoneNumber,
        "comments": commentBody
      });
      Object.values(updatedRecord.subscriptions).forEach(sub => {
        delete sub.entityId;
        delete sub.id;
      });
      console.log("updatedRecord:", updatedRecord);
      const uploadComment = async () => {
        setIsAddingComment(true);
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
          if (membersPage) {
            await updateMember(entityId, customerId, recordToUpload);
          } else {
            await updateResource(entityId, customerId, recordToUpload);
          }
          console.log("✅ successfully added the comment");
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
        } finally {
          setIsAddingComment(false);
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
      "groupId": Array.isArray(groupId) ? groupId.length > 0 ? groupId : "" : groupId || "",
      "phoneNumber": phoneNumber,
      "comments": updatedComments
    });
    Object.values(updatedRecord.subscriptions).forEach(sub => {
      delete sub.entityId;
      delete sub.id;
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
            rest = _objectWithoutProperties(recordToUpload, _excluded3);
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
        setTimeout(() => setStatusModal({
          visible: false,
          type: "",
          title: "",
          message: ""
        }), 1500);

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
        setTimeout(() => setStatusModal({
          visible: false,
          type: "",
          title: "",
          message: ""
        }), 2000);
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
    width: getDrawerWidth(),
    onClose: () => {
      setNameCardDrawer(false);
      setNewComment("");
      const currentGroupKey = Array.isArray(groupId) ? groupId[0] : groupId;
      setGroupMessages(prev => _objectSpread(_objectSpread({}, prev), {}, {
        [currentGroupKey]: _objectSpread(_objectSpread({}, prev[currentGroupKey]), {}, {
          hasUnread: false
        })
      }));
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
      gridTemplateRows: "22px 18px 36px",
      columnGap: 16,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridRow: "1 / span 3"
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
      gridRow: "1 / span 3",
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
  }, phoneNumber), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 2,
      gridRow: 3,
      fontSize: 13,
      color: "#6b7280",
      lineHeight: "18px",
      overflow: "hidden",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical"
    }
  }, [address === null || address === void 0 || (_address$9 = address[0]) === null || _address$9 === void 0 ? void 0 : _address$9.street1, address === null || address === void 0 || (_address$0 = address[0]) === null || _address$0 === void 0 ? void 0 : _address$0.city, address === null || address === void 0 || (_address$1 = address[0]) === null || _address$1 === void 0 ? void 0 : _address$1.state, address === null || address === void 0 || (_address$10 = address[0]) === null || _address$10 === void 0 ? void 0 : _address$10.country].filter(Boolean).join(", ")))), /*#__PURE__*/React.createElement(Form, {
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
      required: true,
      message: 'Name is required'
    }, {
      pattern: /^[a-zA-Z][a-zA-Z0-9._]*$/,
      message: 'Name must start with a letter and can contain letters, numbers, underscores, and dots'
    }, {
      min: 7,
      message: 'Name should have at least 7 characters'
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Enter name (start with letter, min 7 chars)"
  }))), membersPage && /*#__PURE__*/React.createElement(Col, {
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
    placeholder: countryCode ? "".concat(countryCode, " - 10-digit number") : "Select country first",
    prefix: countryCode ? countryCode : undefined
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
  }, /*#__PURE__*/React.createElement(Select, {
    placeholder: !selectedCountry ? "Select a country first" : "Select a state/province",
    allowClear: true,
    disabled: !selectedCountry || states.length === 0,
    loading: loadingStates,
    showSearch: true,
    filterOption: (input, option) => {
      var _option$label;
      return ((_option$label = option === null || option === void 0 ? void 0 : option.label) !== null && _option$label !== void 0 ? _option$label : '').toLowerCase().includes(input.toLowerCase());
    },
    options: states.map(state => ({
      label: state.name,
      value: state.name
    })),
    onChange: () => form.validateFields([['address', 'state']])
  }))), /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: ["address", "country"],
    label: "Country",
    rules: [{
      required: true,
      message: 'Country is required'
    }]
  }, /*#__PURE__*/React.createElement(Select, {
    placeholder: "Select a country",
    onChange: value => handleCountryChange(value),
    allowClear: true,
    showSearch: true,
    loading: loadingCountries,
    filterOption: (input, option) => {
      var _option$label2;
      return ((_option$label2 = option === null || option === void 0 ? void 0 : option.label) !== null && _option$label2 !== void 0 ? _option$label2 : '').toLowerCase().includes(input.toLowerCase());
    },
    options: countries.map(country => ({
      label: country.name,
      value: country.name
    }))
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
    setNewComment: setNewComment,
    handleSend: handleSend,
    setData: setData,
    entityId: entityId,
    color: color
  })), /*#__PURE__*/React.createElement(Card, {
    title: "Group Messages (".concat(Array.isArray(groupId) ? groupId[0] : groupId, ")"),
    style: {
      margin: 16,
      borderRadius: 8
    }
  }, (_groupMessages$curren => {
    const currentGroupKey = Array.isArray(groupId) ? groupId[0] : groupId;
    return groupMessages !== null && groupMessages !== void 0 && (_groupMessages$curren = groupMessages[currentGroupKey]) !== null && _groupMessages$curren !== void 0 && (_groupMessages$curren = _groupMessages$curren.messages) !== null && _groupMessages$curren !== void 0 && _groupMessages$curren.length ? groupMessages[currentGroupKey].messages.map((msg, idx) => /*#__PURE__*/React.createElement(Card, {
      key: idx,
      size: "small",
      style: {
        marginBottom: 8,
        background: "#f0f8ff"
      }
    }, /*#__PURE__*/React.createElement(Typography.Text, {
      strong: true
    }, currentGroupKey), /*#__PURE__*/React.createElement("div", null, msg))) : /*#__PURE__*/React.createElement(Typography.Text, {
      type: "secondary"
    }, "No group messages yet");
  })()), /*#__PURE__*/React.createElement(Card, {
    title: "Comments",
    style: {
      margin: 16,
      borderRadius: 8
    }
  }, comments === null || comments === void 0 ? void 0 : comments.map((comment, index) => /*#__PURE__*/React.createElement(Badge.Ribbon, {
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
  }))))))), /*#__PURE__*/React.createElement(Card, {
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
    onClick: handleSend,
    loading: isAddingComment,
    disabled: isAddingComment
  }, "Send"))))), /*#__PURE__*/React.createElement(StatusModal, {
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