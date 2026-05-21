function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { useState, useEffect } from "react";
import "./AddNewUser.css";
import { Row, Col, Input, Select, Button, Form, Typography, Spin } from 'antd';
import { getSubscriptionPlans } from "./api/APIUtil";
const {
  Option
} = Select;
const {
  Title
} = Typography;
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

/**
 * Self-contained form:
 * - Owns its own state (no setter props from parent)
 * - Calls onSubmit(values) with all form values
 * - `mode`: "member" | "resource" (default "member")
 */
const AddNewUser = _ref => {
  let {
    mode = "member",
    form,
    onSubmit,
    entityId
  } = _ref;
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    const fetchSubscriptionPlans = async () => {
      setLoadingPlans(true);
      try {
        const response = await getSubscriptionPlans(entityId);
        setSubscriptionPlans(response);
        console.log("Subscription Plans loaded from API:", response);
      } catch (error) {
        console.error("Error fetching subscription plans:", error);
      } finally {
        setLoadingPlans(false);
      }
    };
    if (mode === "member") {
      fetchSubscriptionPlans();
    }
  }, [mode, entityId]);

  // useEffect(() => {
  //   if (mode === "member") {
  //     setLoadingPlans(true);
  //     // Simulate API call delay
  //     setTimeout(() => {
  //       setSubscriptionPlans(MOCK_SUBSCRIPTION_PLANS);
  //       console.log("Subscription Plans loaded from mock data:", MOCK_SUBSCRIPTION_PLANS);
  //       setLoadingPlans(false);
  //     }, 300);
  //   }
  // }, [mode]);

  const handleSubmit = async values => {
    if (!onSubmit) return;
    setIsSubmitting(true);
    try {
      var _values$firstName, _values$lastName;
      const sanitizedValues = _objectSpread(_objectSpread({}, values), {}, {
        firstName: ((_values$firstName = values.firstName) === null || _values$firstName === void 0 ? void 0 : _values$firstName.trim()) || "",
        lastName: ((_values$lastName = values.lastName) === null || _values$lastName === void 0 ? void 0 : _values$lastName.trim()) || ""
      });
      const result = onSubmit(sanitizedValues);
      // Await if the result is a promise
      if (result && typeof result.then === 'function') {
        await result;
      }
      // On success, reset fields
      form.resetFields();
    } catch (error) {
      // Allow parent to handle error, but we stop spinner
      console.error('Submit failed in AddNewUser:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '0 auto',
      padding: '0px 40px',
      borderRadius: '10px'
    }
  }, /*#__PURE__*/React.createElement(Title, {
    level: 2,
    style: {
      textAlign: 'center',
      color: '#007bff'
    }
  }, mode === "resource" ? "Add Resource" : "Add Member"), /*#__PURE__*/React.createElement(Form, {
    form: form,
    layout: "vertical",
    onFinish: handleSubmit,
    initialValues: {
      status: "ACTIVE"
    }
  }, /*#__PURE__*/React.createElement(Spin, {
    spinning: isSubmitting,
    tip: "Submitting..."
  }, /*#__PURE__*/React.createElement(Row, {
    gutter: 16
  }, /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "firstName",
    label: "Name",
    rules: [{
      validator: validateName
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Enter name (spaces allowed, min 7 chars)"
  }))), /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "lastName",
    label: "Last Name"
    // rules={[
    //   { required: true, message: 'Last name is required' },
    //   { pattern: /^[a-zA-Z\s]+$/, message: 'Last name should contain only letters' },
    //   { min: 2, message: 'Last name should have at least 2 characters' }
    // ]}
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Enter last name (letters only, min 2 chars)"
  })))), /*#__PURE__*/React.createElement(Form.Item, {
    name: "email",
    label: "Email",
    rules: [{
      required: true,
      message: 'Email is required'
    }, {
      type: 'email',
      message: 'Please enter a valid email address'
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    type: "email",
    placeholder: "Enter valid email address"
  })), /*#__PURE__*/React.createElement(Row, {
    gutter: 16
  }, /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "country",
    label: "Country",
    rules: [{
      required: true,
      message: 'Country is required'
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Enter country"
  }))), /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "phone",
    label: "Phone",
    rules: [{
      required: true,
      message: 'Phone number is required'
    }, {
      pattern: /^[0-9]{10}$/,
      message: 'Phone number should be exactly 10 digits'
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    type: "tel",
    placeholder: "Enter 10-digit phone number",
    maxLength: 10
  })))), /*#__PURE__*/React.createElement(Row, {
    gutter: 16
  }, /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "state",
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
    name: "houseNo",
    label: "House No.",
    rules: [{
      required: true,
      message: 'House number is required'
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Enter house/building number"
  })))), /*#__PURE__*/React.createElement(Row, {
    gutter: 16
  }, /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "city",
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
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Enter city name (letters only, min 2 chars)"
  }))), /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "pincode",
    label: "Pincode",
    rules: [{
      required: true,
      message: 'Pincode is required'
    }, {
      pattern: /^[0-9]{5,6}$/,
      message: 'Pincode should be 5-6 digits'
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Enter 5-6 digit pincode",
    maxLength: 6
  })))), /*#__PURE__*/React.createElement(Row, {
    gutter: 16
  }, /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "street1",
    label: "Street 1",
    rules: [{
      required: true,
      message: 'Street 1 is required'
    }, {
      min: 2,
      message: 'Street 1 should have at least 2 characters'
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Enter street 1"
  }))), /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "street2",
    label: "Street 2"
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Enter street 2"
  })))), /*#__PURE__*/React.createElement(Form.Item, {
    name: "status",
    label: "Status",
    rules: [{
      required: true,
      message: 'Status is required'
    }]
  }, /*#__PURE__*/React.createElement(Select, {
    placeholder: "Select a status"
  }, /*#__PURE__*/React.createElement(Option, {
    value: "ACTIVE"
  }, "ACTIVE"), /*#__PURE__*/React.createElement(Option, {
    value: "IN_PROGRESS"
  }, "IN_PROGRESS"), /*#__PURE__*/React.createElement(Option, {
    value: "COMPLETED"
  }, "COMPLETED"), /*#__PURE__*/React.createElement(Option, {
    value: "CANCELLED"
  }, "CANCELLED"))), mode === "member" && /*#__PURE__*/React.createElement(Form.Item, {
    name: "subscriptionPlanId",
    label: "Subscription Plan"
    // rules={[{ required: true, message: 'Subscription plan is required' }]}
  }, /*#__PURE__*/React.createElement(Select, {
    placeholder: "Select a subscription plan",
    loading: loadingPlans
  }, subscriptionPlans.map(plan => /*#__PURE__*/React.createElement(Option, {
    key: plan.id,
    value: plan.id
  }, plan.id, " - $", plan.price, " (", plan.type, ")")))), /*#__PURE__*/React.createElement(Form.Item, null, /*#__PURE__*/React.createElement(Button, {
    type: "primary",
    htmlType: "submit",
    block: true,
    style: {
      backgroundColor: '#ff5c5c',
      height: '45px',
      fontSize: '16px'
    },
    loading: isSubmitting,
    disabled: isSubmitting,
    "aria-busy": isSubmitting
  }, isSubmitting ? 'Submitting...' : 'SUBMIT')))));
};
export default AddNewUser;