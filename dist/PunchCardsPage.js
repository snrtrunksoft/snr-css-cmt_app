function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { useState, useEffect } from "react";
import { Button, Checkbox, Col, Row, message } from "antd";
import { SUBSCRIPTIONS_API } from "./properties/EndPointProperties";
import { LoadingOutlined, SwapOutlined } from "@ant-design/icons";
const PunchCardsPage = _ref => {
  let {
    data,
    customerId,
    customerName,
    setNewComment,
    handleSend,
    subscriptions,
    color
  } = _ref;
  const [flippedCards, setFlippedCards] = useState({});
  const [punchCards, setPunchCards] = useState(subscriptions);
  const [isLoading, setIsLoading] = useState(false);
  const [checkedServices, setCheckedServices] = useState({});
  const [subscriptionStatus, setSubscriptionStatus] = useState("ACTIVE");
  const [effectiveEntityId, setEffectiveEntityId] = useState(null);
  useEffect(() => {
    if (!effectiveEntityId && typeof window !== "undefined") {
      try {
        const storedId = localStorage.getItem("entityId");
        if (storedId) {
          setEffectiveEntityId(storedId);
          console.log("PunchCardsPage using entityId from localStorage:", storedId);
        }
      } catch (e) {
        console.log("Unable to read entityId from localStorage in PunchCardsPage", e);
      }
    }
  }, [effectiveEntityId]);
  const handleCheckboxChange = (e, value, index) => {
    const cardId = value.id;
    const isChecked = e.target.checked;

    // Get current set or create new one
    let currentSet = checkedServices[cardId];
    if (!currentSet || !(currentSet instanceof Set)) {
      currentSet = new Set();
    } else {
      currentSet = new Set(currentSet); // Create a copy
    }

    // Add or remove index from the set
    if (isChecked) {
      currentSet.add(index);
    } else {
      currentSet.delete(index);
    }

    // Update state with new object
    const count = currentSet.size;
    setCheckedServices(prev => _objectSpread(_objectSpread({}, prev), {}, {
      [cardId]: currentSet
    }));
    setNewComment(count > 0 ? "Subscription ID: ".concat(cardId, ", Selected Cards: ").concat(count) : "");
  };
  const addNewSubscription = () => {
    setIsLoading(true);
    const updateSubscriptionData = async () => {
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
        const responce = await fetch(SUBSCRIPTIONS_API, {
          method: 'POST',
          headers: {
            "entityid": effectiveEntityId || "",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newSub)
        });
        const postData = await responce.json();
        const updatePostId = _objectSpread(_objectSpread({}, newSub), {}, {
          id: postData.subscriptionId
        });
        console.log("updated Subscription Data:", updatePostId);
        console.log("The new subscription:", newSub);
        setPunchCards(prev => [...prev, updatePostId]);
      } catch (error) {
        console.error("unable to update the record", error);
      } finally {
        setIsLoading(false);
      }
    };
    updateSubscriptionData();
  };
  const handleSave = value => {
    var _checkedServices$card;
    const cardId = value.id;
    const currentCheckedCount = ((_checkedServices$card = checkedServices[cardId]) === null || _checkedServices$card === void 0 ? void 0 : _checkedServices$card.size) || 0;
    console.log("💾 Saving - Card ID:", cardId, "Checked Count:", currentCheckedCount);
    console.log("Checked indices:", Array.from(checkedServices[cardId] || new Set()));

    // if (currentCheckedCount === 0) {
    //     message.warning("Please select at least one service to save");
    //     return;
    // }

    const updateSubscriptionsCheckboxes = async () => {
      console.log("helloooo");
      const updatedSubscriptionDetails = {
        "noOfServicesCompleted": (parseInt(value.noOfServicesCompleted) + currentCheckedCount).toString(),
        "noOfServicesLeft": Math.max(0, parseInt(value.noOfServicesLeft) - currentCheckedCount).toString(),
        "totalNumberOfServices": value.totalNumberOfServices,
        "purchasedDate": value.purchasedDate,
        "completedDate": value.completedDate,
        "status": Math.max(0, parseInt(value.noOfServicesLeft) - currentCheckedCount) === 0 ? "COMPLETED" : value.status,
        "memberId": value.memberId
      };
      console.log(updatedSubscriptionDetails);
      try {
        const response = await fetch(SUBSCRIPTIONS_API + value.id, {
          method: "PUT",
          headers: {
            "entityid": effectiveEntityId || "",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedSubscriptionDetails)
        });
        if (response.ok) {
          const data = await response.json();
          console.log("✅ subscriptions details updated:", data);
          message.success("Successfully saved ".concat(currentCheckedCount, " service(s)"));
          // Update punch cards
          setPunchCards(prevCards => prevCards.map(prev => {
            if (prev.id === cardId) {
              console.log("Updating card - Old completed:", prev.noOfServicesCompleted, "Adding:", currentCheckedCount);
              return _objectSpread(_objectSpread({}, prev), {}, {
                noOfServicesCompleted: parseInt(prev.noOfServicesCompleted) + currentCheckedCount,
                noOfServicesLeft: Math.max(0, parseInt(prev.noOfServicesLeft) - currentCheckedCount),
                status: Math.max(0, parseInt(prev.noOfServicesLeft) - currentCheckedCount) === 0 ? 'COMPLETED' : prev.status
              });
            }
            return prev;
          }));
        } else {
          throw new Error("HTTP error! status: ".concat(response.status));
        }
      } catch (error) {
        console.error("❌ unable to update the subscriptions:", error);
        message.error("Failed to save services");
      }
    };

    // Clear checked services FIRST before updating - with proper state
    console.log("Clearing checked services for card:", cardId);
    const newCheckedServices = _objectSpread({}, checkedServices);
    newCheckedServices[cardId] = new Set();
    setCheckedServices(newCheckedServices);
    updateSubscriptionsCheckboxes();
    handleSend();
  };
  const handleClearSelection = cardId => {
    setCheckedServices(prev => {
      const newState = _objectSpread({}, prev);
      newState[cardId] = new Set();
      console.log("🗑️ Cleared checkboxes for card:", cardId);
      console.log("Updated checkedServices:", newState);
      return newState;
    });
    setNewComment("");
  };
  const toggleFlip = cardId => {
    setFlippedCards(prev => _objectSpread(_objectSpread({}, prev), {}, {
      [cardId]: !prev[cardId]
    }));
  };
  const filterSubscriptions = punchCards.filter(card => card.status === subscriptionStatus);
  return /*#__PURE__*/React.createElement("div", {
    className: "punch-cards-container"
  }, data && /*#__PURE__*/React.createElement("h2", {
    style: {
      marginBottom: '20px',
      color: '#333'
    }
  }, "Punch Cards:"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    type: subscriptionStatus === 'ACTIVE' ? 'primary' : 'default',
    onClick: () => setSubscriptionStatus('ACTIVE'),
    size: "large"
  }, "Active Subscriptions"), /*#__PURE__*/React.createElement(Button, {
    type: subscriptionStatus === 'COMPLETED' ? 'primary' : 'default',
    onClick: () => setSubscriptionStatus('COMPLETED'),
    size: "large"
  }, "Completed Subscriptions")), filterSubscriptions && filterSubscriptions.length > 0 ? /*#__PURE__*/React.createElement("div", {
    className: "punch-cards-grid"
  }, filterSubscriptions.map(card => {
    var _checkedServices$card3, _checkedServices$card4;
    return /*#__PURE__*/React.createElement("div", {
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
      className: "punch-card-header"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      style: {
        margin: 0,
        fontSize: '1.2rem'
      }
    }, "Subscription Services"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '4px 0 0 0',
        fontSize: '0.9rem',
        opacity: 0.9
      }
    }, card.noOfServicesCompleted, "/", card.totalNumberOfServices, " Completed")), /*#__PURE__*/React.createElement("div", {
      className: "status-badge",
      style: {
        backgroundColor: card.status === 'COMPLETED' ? '#52c41a' : '#faad14',
        color: '#fff'
      }
    }, card.status)), /*#__PURE__*/React.createElement("div", {
      className: "punchCards"
    }, Array.from({
      length: Number(card.noOfServicesCompleted)
    }, (_, index) => /*#__PURE__*/React.createElement("div", {
      key: "done-".concat(index),
      className: "individualCards completed-card"
    }, /*#__PURE__*/React.createElement(Checkbox, {
      checked: true,
      disabled: true
    }), /*#__PURE__*/React.createElement("span", {
      className: "card-label"
    }, "\u2713"))), Array.from({
      length: Number(card.noOfServicesLeft)
    }, (_, index) => {
      var _checkedServices$card2;
      const isChecked = ((_checkedServices$card2 = checkedServices[card.id]) === null || _checkedServices$card2 === void 0 ? void 0 : _checkedServices$card2.has(index)) || false;
      return /*#__PURE__*/React.createElement("div", {
        key: "left-".concat(index),
        className: "individualCards uncompleted-card ".concat(isChecked ? 'checked-service' : '')
      }, /*#__PURE__*/React.createElement(Checkbox, {
        checked: isChecked,
        onChange: e => handleCheckboxChange(e, card, index)
      }));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, (((_checkedServices$card3 = checkedServices[card.id]) === null || _checkedServices$card3 === void 0 ? void 0 : _checkedServices$card3.size) || 0) > 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: '8px'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      type: "primary",
      size: "small",
      onClick: () => handleSave(card),
      style: {
        backgroundColor: color,
        borderColor: color
      }
    }, "Save (", (_checkedServices$card4 = checkedServices[card.id]) === null || _checkedServices$card4 === void 0 ? void 0 : _checkedServices$card4.size, ")"), /*#__PURE__*/React.createElement(Button, {
      size: "small",
      onClick: () => handleClearSelection(card.id)
    }, "Clear")) : /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement(Button, {
      className: "flip-btn",
      onClick: () => toggleFlip(card.id),
      icon: /*#__PURE__*/React.createElement(SwapOutlined, null),
      title: "View details"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "punch-card-back"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flipped-content"
    }, /*#__PURE__*/React.createElement("div", {
      className: "detail-item"
    }, /*#__PURE__*/React.createElement("strong", null, customerName)), /*#__PURE__*/React.createElement("div", {
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
        color: '#ffd700',
        fontWeight: 'bold'
      }
    }, "Remaining: ", card.noOfServicesLeft)), /*#__PURE__*/React.createElement(Button, {
      className: "flip-btn",
      onClick: () => toggleFlip(card.id),
      icon: /*#__PURE__*/React.createElement(SwapOutlined, null),
      style: {
        background: "rgba(255, 255, 255, 0.2)",
        color: "#fff"
      },
      title: "View punch card"
    }))));
  })) : /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '40px 20px',
      color: '#999'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '1.1rem'
    }
  }, "No ", subscriptionStatus.toLowerCase(), " subscriptions")), data && subscriptionStatus === 'ACTIVE' && punchCards.filter(prev => prev.status === "ACTIVE").length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginTop: '20px'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    type: "primary",
    size: "large",
    onClick: () => addNewSubscription(),
    loading: isLoading
  }, "+ Add Active Subscription")) : "");
};
export default PunchCardsPage;