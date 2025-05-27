function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { useState } from "react";
import { Button, Checkbox, Col, Row } from "antd";
import { MEMBERS_API, SUBSCRIPTIONS_API } from "../properties/EndPointProperties";
import { LoadingOutlined, SwapOutlined } from "@ant-design/icons";
const PunchCardsPage = _ref => {
  let {
    customerId,
    customerName,
    setNewComment,
    handleSend,
    subscriptions,
    color
  } = _ref;
  const [flipped, setFlipped] = useState(false);
  const [punchCardsState, setPunchCardsState] = useState("Complete");
  const [checkedCount, setCheckedCount] = useState(0);
  const [punchCards, setPunchCards] = useState(subscriptions);
  const [isLoading, setIsLoading] = useState(false);
  const handleCheckboxChange = (e, value) => {
    const count = e.target.checked ? checkedCount + 1 : checkedCount - 1;
    setCheckedCount(count);
    setNewComment(count > 0 ? "Subscription ID: " + value.id + ", selected Cards: " + count : "");
  };
  const addNewSubscription = () => {
    setIsLoading(true);
    const updateSubscriptionData = async () => {
      try {
        const newSub = {
          status: "Active",
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
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newSub)
        });
        const postData = await responce.json();
        const updatePostId = _objectSpread(_objectSpread({}, postData), {}, {
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
    const updateSubscriptionsCheckboxes = async () => {
      const updatedSubscriptionDetails = {
        "noOfServicesCompleted": (parseInt(value.noOfServicesCompleted) + checkedCount).toString(),
        "noOfServicesLeft": Math.max(0, value.noOfServicesLeft - checkedCount).toString(),
        "totalNumberOfServices": value.totalNumberOfServices,
        "purchasedDate": value.purchasedDate,
        "completedDate": value.completedDate,
        "status": Math.max(0, value.noOfServicesLeft - checkedCount) === 0 ? "Complete" : value.status,
        "memberId": value.memberId
      };
      try {
        await fetch(SUBSCRIPTIONS_API + value.id, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedSubscriptionDetails)
        }).then(response => response.json()).then(data => console.log("subscriptions details updated:", updatedSubscriptionDetails));
      } catch (error) {
        console.log("unable to update the subscriptions:", error);
      }
    };
    updateSubscriptionsCheckboxes();
    setPunchCards(prevCards => prevCards.map(prev => {
      if (prev.id === value.id) {
        return _objectSpread(_objectSpread({}, prev), {}, {
          noOfServicesCompleted: parseInt(value.noOfServicesCompleted) + checkedCount,
          noOfServicesLeft: Math.max(0, value.noOfServicesLeft - checkedCount),
          status: Math.max(0, prev.noOfServicesLeft - checkedCount) === 0 ? 'Complete' : value.status
        });
        // const servicesLeft = Math.max(0, prev.noOfServicesLeft - checkedCount);
        // if(servicesLeft === 0){
        //     return {
        //         ...prev,
        //         noOfServicesCompleted: parseInt(value.noOfServicesCompleted) + checkedCount,
        //         noOfServicesLeft: Math.max(0, prev.noOfServicesLeft - checkedCount),
        //         status:'Complete'
        //     }
        // }
        // return {
        //     ...prev,
        //     noOfServicesCompleted: parseInt(value.noOfServicesCompleted) + checkedCount,
        //     noOfServicesLeft: Math.max(0, prev.noOfServicesLeft - checkedCount),
        // }
      }
      return prev;
    }));
    handleSend();
    setCheckedCount(0);
  };
  const filterActiveSubscription = punchCards !== "" ? punchCards.filter(prev => prev.status === "Active") : "";
  const toggleFlip = () => {
    setFlipped(prev => !prev);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: ""
  }, /*#__PURE__*/React.createElement("h2", null, "Punch cards:"), /*#__PURE__*/React.createElement(Row, null, /*#__PURE__*/React.createElement(Button, {
    onClick: () => {
      setFlipped(false);
      setPunchCardsState(prev => prev === "Complete" ? "Active" : "Complete");
    }
  }, "View ", punchCardsState), " \xA0"), isLoading ? /*#__PURE__*/React.createElement("center", {
    style: {
      padding: '10px'
    }
  }, /*#__PURE__*/React.createElement(LoadingOutlined, null), "Loading...") : punchCards.filter(card => card.status !== punchCardsState).map(card => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Row, {
    key: card.id,
    className: "punch-card",
    style: {
      backgroundColor: "".concat(color)
    },
    gutter: [16, 16]
  }, /*#__PURE__*/React.createElement(Col, {
    className: "punchCards",
    xs: 24,
    sm: 20,
    md: 24,
    lg: 20,
    xl: 20
  }, flipped ? /*#__PURE__*/React.createElement(Row, {
    className: "flipped"
  }, /*#__PURE__*/React.createElement("span", null, "name: ", customerName), /*#__PURE__*/React.createElement("span", null, "purchased: ", card.purchasedDate), /*#__PURE__*/React.createElement("span", null, "completed: ", card.completedDate), /*#__PURE__*/React.createElement("span", null, "totalNumberOfService: ", card.totalNumberOfServices), /*#__PURE__*/React.createElement("span", null, "noOfServicesLeft: ", card.noOfServicesLeft), /*#__PURE__*/React.createElement("span", null, "noOfServicesCompleted: ", card.noOfServicesCompleted)) : Array.from({
    length: Number(card.noOfServicesCompleted)
  }, (_, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    className: "individualCards"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: true
  }))), Array.from({
    length: Number(card.noOfServicesLeft)
  }, (_, index) => index).reverse().map(index => /*#__PURE__*/React.createElement("div", {
    key: index,
    hidden: flipped,
    className: !flipped ? "individualCards" : ""
  }, /*#__PURE__*/React.createElement(Checkbox, {
    onChange: e => handleCheckboxChange(e, card)
  })))), /*#__PURE__*/React.createElement(Col, {
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
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: () => toggleFlip(),
    icon: /*#__PURE__*/React.createElement(SwapOutlined, null)
  }, "Flip"))), checkedCount ? /*#__PURE__*/React.createElement(Row, {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    type: "primary",
    onClick: () => handleSave(card)
  }, "Save")) : "")), /*#__PURE__*/React.createElement("span", null, filterActiveSubscription.length === 0 ? /*#__PURE__*/React.createElement("center", null, /*#__PURE__*/React.createElement(Button, {
    style: {
      margin: '5px'
    },
    onClick: () => addNewSubscription()
  }, "Add Active Subscription")) : ""));
};
export default PunchCardsPage;