function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Button, Checkbox, message } from "antd";
import { createSubscription, updateSubscription } from "./api/APIUtil";
import { SwapOutlined } from "@ant-design/icons";
const PunchCardsPage = _ref => {
  let {
    data,
    customerId,
    customerName,
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
  const prevSubscriptionIdsRef = useRef(new Set());

  // ==================== EFFECTS ====================
  // Initialize entityId from localStorage
  useEffect(() => {
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
  }, [effectiveEntityId]);

  // ==================== HELPER FUNCTIONS ====================
  // Get current member's subscriptions from parent data
  const getCurrentSubscriptions = useCallback(() => {
    if (!data || data.length === 0 || !customerId) return [];
    const memberData = data.find(member => member.id === customerId);
    return (memberData === null || memberData === void 0 ? void 0 : memberData.subscriptions) || [];
  }, [data, customerId]);

  // Get filtered subscriptions based on status
  const punchCards = useMemo(() => {
    const subscriptions = getCurrentSubscriptions();
    return subscriptions.filter(card => card.status === subscriptionStatus);
  }, [getCurrentSubscriptions, subscriptionStatus]);

  // ==================== CHECKBOX HANDLING ====================
  const handleCheckboxChange = useCallback((e, card, index) => {
    const cardId = card.id;
    const isChecked = e.target.checked;
    setCheckedServices(prev => {
      const currentSet = prev[cardId] ? new Set(prev[cardId]) : new Set();
      if (isChecked) {
        currentSet.add(index);
      } else {
        currentSet.delete(index);
      }
      const count = currentSet.size;
      setNewComment(count > 0 ? "Subscription ID: ".concat(cardId, ", Selected Cards: ").concat(count) : "");
      return _objectSpread(_objectSpread({}, prev), {}, {
        [cardId]: currentSet
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
    if (!customerId || !effectiveEntityId) {
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
      const postData = await createSubscription(effectiveEntityId, newSub);
      const newSubscriptionWithId = _objectSpread(_objectSpread({}, newSub), {}, {
        id: postData.subscriptionId
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
    } catch (error) {
      console.error("❌ Error creating subscription:", error);
      message.error("Failed to add subscription");
    } finally {
      setIsLoading(false);
    }
  }, [customerId, effectiveEntityId, setData]);
  const handleSave = useCallback(async card => {
    var _checkedServices$card;
    const cardId = card.id;
    const checkedCount = ((_checkedServices$card = checkedServices[cardId]) === null || _checkedServices$card === void 0 ? void 0 : _checkedServices$card.size) || 0;
    if (checkedCount === 0) {
      message.warning("Please select at least one service");
      return;
    }
    setIsLoading(true);
    try {
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
        memberId: card.memberId
      };
      console.log("💾 Sending update:", updatedSubscriptionDetails);
      await updateSubscription(effectiveEntityId, cardId, updatedSubscriptionDetails);
      console.log("✅ Subscription updated from API");

      // Create updated card object
      const updatedCard = _objectSpread(_objectSpread({}, card), {}, {
        noOfServicesCompleted: newCompleted,
        noOfServicesLeft: newLeft,
        status: newStatus
      });

      // Update parent data first
      setData(prevMembers => prevMembers.map(member => {
        if (member.id === customerId) {
          return _objectSpread(_objectSpread({}, member), {}, {
            subscriptions: (member.subscriptions || []).map(sub => sub.id === cardId ? updatedCard : sub)
          });
        }
        return member;
      }));

      // Clear checked services
      setCheckedServices(prev => _objectSpread(_objectSpread({}, prev), {}, {
        [cardId]: new Set()
      }));
      setNewComment("");
      message.success("Successfully saved ".concat(checkedCount, " service(s)"));
      console.log("📝 UI updated with new card state:", updatedCard);
    } catch (error) {
      console.error("❌ Error saving subscription:", error);
      message.error("Failed to save services");
    } finally {
      setIsLoading(false);
      handleSend();
    }
  }, [checkedServices, customerId, effectiveEntityId, setData, setNewComment, handleSend]);

  // ==================== UI INTERACTION ====================
  const toggleFlip = useCallback(cardId => {
    setFlippedCards(prev => _objectSpread(_objectSpread({}, prev), {}, {
      [cardId]: !prev[cardId]
    }));
  }, []);

  // ==================== RENDER ====================
  const renderCardContent = card => {
    const completedCount = Number(card.noOfServicesCompleted);
    const leftCount = Number(card.noOfServicesLeft);
    return /*#__PURE__*/React.createElement(React.Fragment, null, Array.from({
      length: completedCount
    }, (_, index) => /*#__PURE__*/React.createElement("div", {
      key: "completed-".concat(card.id, "-").concat(index),
      className: "individualCards completed-card"
    }, /*#__PURE__*/React.createElement(Checkbox, {
      checked: true,
      disabled: true
    }), /*#__PURE__*/React.createElement("span", {
      className: "card-label"
    }, "\u2713"))), Array.from({
      length: leftCount
    }, (_, index) => {
      var _checkedServices$card2;
      const isChecked = ((_checkedServices$card2 = checkedServices[card.id]) === null || _checkedServices$card2 === void 0 ? void 0 : _checkedServices$card2.has(index)) || false;
      return /*#__PURE__*/React.createElement("div", {
        key: "remaining-".concat(card.id, "-").concat(index),
        className: "individualCards uncompleted-card ".concat(isChecked ? 'checked-service' : '')
      }, /*#__PURE__*/React.createElement(Checkbox, {
        checked: isChecked,
        onChange: e => handleCheckboxChange(e, card, index),
        disabled: isLoading
      }));
    }));
  };
  const renderActionButtons = card => {
    var _checkedServices$card3;
    const checkedCount = ((_checkedServices$card3 = checkedServices[card.id]) === null || _checkedServices$card3 === void 0 ? void 0 : _checkedServices$card3.size) || 0;
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
      onClick: () => handleSave(card),
      loading: isLoading,
      style: {
        backgroundColor: color,
        borderColor: color
      }
    }, "Save (", checkedCount, ")"), /*#__PURE__*/React.createElement(Button, {
      size: "small",
      onClick: () => handleClearSelection(card.id),
      disabled: isLoading
    }, "Clear")) : /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement(Button, {
      className: "flip-btn",
      onClick: () => toggleFlip(card.id),
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
  }, punchCards.map(card => /*#__PURE__*/React.createElement("div", {
    key: card.id,
    className: "punch-card ".concat(flippedCards[card.id] ? "flipped" : "")
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
  }, renderCardContent(card)), renderActionButtons(card)), /*#__PURE__*/React.createElement("div", {
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
    onClick: () => toggleFlip(card.id),
    icon: /*#__PURE__*/React.createElement(SwapOutlined, null),
    size: "small",
    style: {
      background: "rgba(255,255,255,0.2)",
      color: "#fff"
    },
    title: "View punch card"
  })))))) : /*#__PURE__*/React.createElement("div", {
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