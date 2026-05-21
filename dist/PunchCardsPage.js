function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button, Checkbox, message } from "antd";
import { createSubscription, updateSubscription, getMemberById } from "./api/APIUtil";
import { SwapOutlined } from "@ant-design/icons";
const getSubscriptionId = card => (card === null || card === void 0 ? void 0 : card.subscriptionId) || (card === null || card === void 0 ? void 0 : card.id);
const getSubscriptionKey = function (card) {
  let index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return getSubscriptionId(card) || [card === null || card === void 0 ? void 0 : card.memberId, card === null || card === void 0 ? void 0 : card.status, card === null || card === void 0 ? void 0 : card.purchasedDate, card === null || card === void 0 ? void 0 : card.completedDate, card === null || card === void 0 ? void 0 : card.totalNumberOfServices, card === null || card === void 0 ? void 0 : card.noOfServicesCompleted, card === null || card === void 0 ? void 0 : card.noOfServicesLeft, index].filter(Boolean).join("-");
};
const PunchCardsPage = _ref => {
  let {
    data,
    customerId,
    customerName,
    subscriptions: memberSubscriptions = [],
    setNewComment,
    handleSend,
    setData,
    entityId,
    color
  } = _ref;
  // ==================== STATE MANAGEMENT ====================
  const [flippedCards, setFlippedCards] = useState({});
  const [checkedServices, setCheckedServices] = useState({});
  const [subscriptionStatus, setSubscriptionStatus] = useState("ACTIVE");
  const [isLoading, setIsLoading] = useState(false);
  const [effectiveEntityId, setEffectiveEntityId] = useState(null);

  // ==================== EFFECTS ====================
  // Initialize entityId from localStorage
  useEffect(() => {
    if (entityId) {
      setEffectiveEntityId(entityId);
      return;
    }
    if (!effectiveEntityId && typeof window !== "undefined") {
      try {
        const storedId = localStorage.getItem("entityId");
        if (storedId) {
          setEffectiveEntityId(storedId);
          console.log("📍 PunchCardsPage using entityId from localStorage:", storedId);
        }
      } catch (e) {
        console.error("❌ Unable to read entityId from localStorage:", e);
      }
    }
  }, [effectiveEntityId, entityId]);

  // ==================== HELPER FUNCTIONS ====================
  // Get current member's subscriptions from parent data
  const getCurrentSubscriptions = useCallback(() => {
    if (Array.isArray(memberSubscriptions) && memberSubscriptions.length > 0) {
      return memberSubscriptions.map(subscription => _objectSpread(_objectSpread({}, subscription), {}, {
        subscriptionId: getSubscriptionId(subscription)
      }));
    }
    if (!data || data.length === 0 || !customerId) return [];
    const memberData = data.find(member => member.id === customerId);
    return ((memberData === null || memberData === void 0 ? void 0 : memberData.subscriptions) || []).map(subscription => _objectSpread(_objectSpread({}, subscription), {}, {
      subscriptionId: getSubscriptionId(subscription)
    }));
  }, [data, customerId, memberSubscriptions]);

  // Get filtered subscriptions based on status
  const punchCards = useMemo(() => {
    const subscriptions = getCurrentSubscriptions();
    return subscriptions.filter(card => card.status === subscriptionStatus);
  }, [getCurrentSubscriptions, subscriptionStatus]);
  const refreshMember = useCallback(async () => {
    const resolvedEntityId = entityId || effectiveEntityId;
    if (!resolvedEntityId || !customerId) return null;
    const refreshedMember = await getMemberById(resolvedEntityId, customerId);
    setData(prevMembers => prevMembers.map(member => member.id === customerId ? _objectSpread(_objectSpread({}, member), refreshedMember) : member));
    return refreshedMember;
  }, [customerId, effectiveEntityId, entityId, setData]);

  // ==================== CHECKBOX HANDLING ====================
  const handleCheckboxChange = useCallback((e, card, serviceIndex, cardIndex) => {
    const cardKey = getSubscriptionKey(card, cardIndex);
    const isChecked = e.target.checked;
    setCheckedServices(prev => {
      const currentSet = prev[cardKey] ? new Set(prev[cardKey]) : new Set();
      if (isChecked) {
        currentSet.add(serviceIndex);
      } else {
        currentSet.delete(serviceIndex);
      }
      const count = currentSet.size;
      const subscriptionId = getSubscriptionId(card);
      setNewComment(count > 0 ? "Subscription ID: ".concat(subscriptionId || "pending", ", Selected Cards: ").concat(count) : "");
      return _objectSpread(_objectSpread({}, prev), {}, {
        [cardKey]: currentSet
      });
    });
  }, [setNewComment]);
  const handleClearSelection = useCallback(cardId => {
    setCheckedServices(prev => _objectSpread(_objectSpread({}, prev), {}, {
      [cardId]: new Set()
    }));
    setNewComment("");
    console.log("🗑️ Cleared selection for card:", cardId);
  }, [setNewComment]);

  // ==================== SUBSCRIPTION OPERATIONS ====================
  const addNewSubscription = useCallback(async () => {
    const resolvedEntityId = entityId || effectiveEntityId;
    if (!customerId || !resolvedEntityId) {
      message.error("Missing required information");
      return;
    }
    setIsLoading(true);
    try {
      const newSub = {
        status: "ACTIVE",
        noOfServicesLeft: "10",
        noOfServicesCompleted: "0",
        totalNumberOfServices: "10",
        purchasedDate: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric'
        }).replace(/[, ]+/g, '-'),
        completedDate: "june-09-2026",
        memberId: customerId
      };
      const postData = await createSubscription(resolvedEntityId, newSub);
      const newSubscriptionWithId = _objectSpread(_objectSpread({}, newSub), {}, {
        subscriptionId: postData.subscriptionId || postData.id
      });
      console.log("✅ New subscription created:", newSubscriptionWithId);
      message.success("Subscription added successfully");

      // Update parent data
      setData(prevMembers => prevMembers.map(member => {
        if (member.id === customerId) {
          return _objectSpread(_objectSpread({}, member), {}, {
            subscriptions: [...(member.subscriptions || []), newSubscriptionWithId]
          });
        }
        return member;
      }));

      // Refresh member so embedded subscriptions stay in sync with the subscription API.
      try {
        await refreshMember();
        console.log("✅ Member updated with new subscription");
      } catch (err) {
        message.warning("Subscription was saved, but member refresh failed.");
      }
    } catch (error) {
      console.error("❌ Error creating subscription:", error);
      message.error("Failed to add subscription");
    } finally {
      setIsLoading(false);
    }
  }, [customerId, effectiveEntityId, entityId, refreshMember, setData]);
  const handleSave = useCallback(async (card, cardIndex) => {
    var _checkedServices$card;
    const cardKey = getSubscriptionKey(card, cardIndex);
    const checkedCount = ((_checkedServices$card = checkedServices[cardKey]) === null || _checkedServices$card === void 0 ? void 0 : _checkedServices$card.size) || 0;
    const resolvedEntityId = entityId || effectiveEntityId;
    if (!resolvedEntityId) {
      message.error("Missing required information");
      return;
    }
    if (checkedCount === 0) {
      message.warning("Please select at least one service");
      return;
    }
    setIsLoading(true);
    try {
      const cardId = getSubscriptionId(card);
      if (!cardId) {
        message.error("Missing subscription id in member data. Please refresh and try again.");
        return;
      }

      // Calculate updated values
      const newCompleted = parseInt(card.noOfServicesCompleted) + checkedCount;
      const newLeft = Math.max(0, parseInt(card.noOfServicesLeft) - checkedCount);
      const newStatus = newLeft === 0 ? "COMPLETED" : card.status;
      const updatedSubscriptionDetails = {
        noOfServicesCompleted: newCompleted.toString(),
        noOfServicesLeft: newLeft.toString(),
        totalNumberOfServices: card.totalNumberOfServices,
        purchasedDate: card.purchasedDate,
        completedDate: card.completedDate,
        status: newStatus,
        memberId: card.memberId || customerId
      };
      console.log("💾 Sending update:", updatedSubscriptionDetails);
      await updateSubscription(resolvedEntityId, cardId, updatedSubscriptionDetails);
      console.log("✅ Subscription updated from API");

      // Create updated card object
      const updatedCard = _objectSpread(_objectSpread({}, card), {}, {
        subscriptionId: cardId,
        noOfServicesCompleted: newCompleted,
        noOfServicesLeft: newLeft,
        status: newStatus
      });
      const updatedSubscriptions = getCurrentSubscriptions().map(subscription => getSubscriptionId(subscription) === cardId ? updatedCard : subscription);
      const subscriptionComment = "".concat(cardId, ": ").concat(checkedCount > 1 ? "".concat(checkedCount, " service(s)") : '1 service', " completed. ").concat(newLeft, " remaining.");
      try {
        await refreshMember();
      } catch (refreshError) {
        console.error("Failed to refresh member after subscription update:", refreshError);
        setData(prevMembers => prevMembers.map(member => {
          if (member.id === customerId) {
            return _objectSpread(_objectSpread({}, member), {}, {
              subscriptions: (member.subscriptions || []).map(sub => getSubscriptionId(sub) === cardId ? updatedCard : sub)
            });
          }
          return member;
        }));
      }
      try {
        await handleSend(subscriptionComment, {
          showStatus: false,
          subscriptionsOverride: updatedSubscriptions
        });
      } catch (commentError) {
        console.error("Subscription saved, but automatic comment failed:", commentError);
        message.warning("Subscription saved, but comment was not posted.");
      }

      // Clear checked services
      setCheckedServices(prev => _objectSpread(_objectSpread({}, prev), {}, {
        [cardKey]: new Set()
      }));
      setNewComment("");
      message.success("Subscription saved. ".concat(checkedCount, " service(s) recorded."));
      console.log("📝 UI updated with new card state:", updatedCard);
    } catch (error) {
      console.error("❌ Error saving subscription:", error);
      message.error("Failed to save services");
    } finally {
      setIsLoading(false);
      // handleSend();
    }
  }, [checkedServices, customerId, effectiveEntityId, entityId, getCurrentSubscriptions, refreshMember, setData, setNewComment, handleSend]);

  // ==================== UI INTERACTION ====================
  const toggleFlip = useCallback(cardId => {
    setFlippedCards(prev => _objectSpread(_objectSpread({}, prev), {}, {
      [cardId]: !prev[cardId]
    }));
  }, []);

  // ==================== RENDER ====================
  const renderCardContent = (card, cardIndex) => {
    const cardKey = getSubscriptionKey(card, cardIndex);
    const completedCount = Number(card.noOfServicesCompleted);
    const leftCount = Number(card.noOfServicesLeft);
    return /*#__PURE__*/React.createElement(React.Fragment, null, Array.from({
      length: completedCount
    }, (_, index) => /*#__PURE__*/React.createElement("div", {
      key: "completed-".concat(cardKey, "-").concat(index),
      className: "individualCards completed-card"
    }, /*#__PURE__*/React.createElement("span", {
      className: "card-label"
    }, "\u2713"))), Array.from({
      length: leftCount
    }, (_, index) => {
      var _checkedServices$card2;
      const isChecked = ((_checkedServices$card2 = checkedServices[cardKey]) === null || _checkedServices$card2 === void 0 ? void 0 : _checkedServices$card2.has(index)) || false;
      return /*#__PURE__*/React.createElement("div", {
        key: "remaining-".concat(cardKey, "-").concat(index),
        className: "individualCards uncompleted-card ".concat(isChecked ? 'checked-service' : '')
      }, /*#__PURE__*/React.createElement(Checkbox, {
        checked: isChecked,
        onChange: e => handleCheckboxChange(e, card, index, cardIndex),
        disabled: isLoading
      }));
    }));
  };
  const renderActionButtons = (card, cardIndex) => {
    var _checkedServices$card3;
    const cardKey = getSubscriptionKey(card, cardIndex);
    const checkedCount = ((_checkedServices$card3 = checkedServices[cardKey]) === null || _checkedServices$card3 === void 0 ? void 0 : _checkedServices$card3.size) || 0;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, checkedCount > 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: '8px'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      type: "primary",
      size: "small",
      onClick: () => handleSave(card, cardIndex),
      loading: isLoading,
      style: {
        backgroundColor: color,
        borderColor: color
      }
    }, "Save (", checkedCount, ")"), /*#__PURE__*/React.createElement(Button, {
      size: "small",
      onClick: () => handleClearSelection(cardKey),
      disabled: isLoading
    }, "Clear")) : /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement(Button, {
      className: "flip-btn",
      onClick: () => toggleFlip(cardKey),
      icon: /*#__PURE__*/React.createElement(SwapOutlined, null),
      disabled: isLoading,
      title: "View details"
    }));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "punch-cards-container",
    style: {
      padding: "0 16px 12px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 12,
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    type: subscriptionStatus === "ACTIVE" ? "primary" : "default",
    onClick: () => setSubscriptionStatus("ACTIVE"),
    size: "middle"
  }, "Active"), /*#__PURE__*/React.createElement(Button, {
    type: subscriptionStatus === "COMPLETED" ? "primary" : "default",
    onClick: () => setSubscriptionStatus("COMPLETED"),
    size: "middle"
  }, "Completed")), punchCards.length > 0 ? /*#__PURE__*/React.createElement("div", {
    className: "punch-cards-grid"
  }, punchCards.map((card, cardIndex) => {
    const cardKey = getSubscriptionKey(card, cardIndex);
    return /*#__PURE__*/React.createElement("div", {
      key: cardKey,
      className: "punch-card ".concat(flippedCards[cardKey] ? "flipped" : "")
    }, /*#__PURE__*/React.createElement("div", {
      className: "punch-card-inner"
    }, /*#__PURE__*/React.createElement("div", {
      className: "punch-card-front",
      style: {
        backgroundColor: color,
        borderColor: color
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "punch-card-header",
      style: {
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 600,
        lineHeight: "18px"
      }
    }, "Subscription Services"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        opacity: 0.85,
        marginTop: 2
      }
    }, card.noOfServicesCompleted, "/", card.totalNumberOfServices, " completed")), /*#__PURE__*/React.createElement("div", {
      className: "status-badge",
      style: {
        fontSize: 11,
        padding: "2px 8px",
        borderRadius: 12,
        backgroundColor: card.status === "COMPLETED" ? "#52c41a" : "#faad14",
        color: "#fff"
      }
    }, card.status)), /*#__PURE__*/React.createElement("div", {
      className: "punchCards"
    }, renderCardContent(card, cardIndex)), renderActionButtons(card, cardIndex)), /*#__PURE__*/React.createElement("div", {
      className: "punch-card-back"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flipped-content",
      style: {
        fontSize: 12,
        lineHeight: "18px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "detail-item",
      style: {
        fontWeight: 600
      }
    }, customerName), /*#__PURE__*/React.createElement("div", {
      className: "detail-item"
    }, "Purchased: ", card.purchasedDate), /*#__PURE__*/React.createElement("div", {
      className: "detail-item"
    }, "Expires: ", card.completedDate), /*#__PURE__*/React.createElement("div", {
      className: "detail-item"
    }, "Total: ", card.totalNumberOfServices), /*#__PURE__*/React.createElement("div", {
      className: "detail-item"
    }, "Completed: ", card.noOfServicesCompleted), /*#__PURE__*/React.createElement("div", {
      className: "detail-item",
      style: {
        color: "#ffd700",
        fontWeight: 600
      }
    }, "Remaining: ", card.noOfServicesLeft)), /*#__PURE__*/React.createElement(Button, {
      className: "flip-btn",
      onClick: () => toggleFlip(cardKey),
      icon: /*#__PURE__*/React.createElement(SwapOutlined, null),
      size: "small",
      style: {
        background: "rgba(255,255,255,0.2)",
        color: "#fff"
      },
      title: "View punch card"
    }))));
  })) : /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "24px 12px",
      color: "#999",
      fontSize: 13
    }
  }, "No ", subscriptionStatus.toLowerCase(), " subscriptions"), data && subscriptionStatus === "ACTIVE" && punchCards.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    type: "primary",
    size: "middle",
    onClick: addNewSubscription,
    loading: isLoading
  }, "+ Add Active Subscription")));
};
export default PunchCardsPage;