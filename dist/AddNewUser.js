function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { useState, useEffect } from "react";
import "./AddNewUser.css";
import { Row, Col, Input, Button, Form, Typography, Spin } from 'antd';
import { getSubscriptionPlans } from "./api/APIUtil";
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
  const [currentStep, setCurrentStep] = useState(0);
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

  const entityLabel = mode === "resource" ? "Resource" : "Member";
  const personalFields = ["firstName", "lastName", "email", "phone"];
  const addressFields = ["country", "state", "city", "pincode", "houseNo", "street1", "street2"];
  const allFields = [...personalFields, ...addressFields];
  const resetForm = () => {
    setCurrentStep(0);
    form.resetFields(allFields);
    form.setFields(allFields.map(name => ({
      name,
      value: undefined,
      errors: [],
      warnings: []
    })));
  };
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
      resetForm();
    } catch (error) {
      // Allow parent to handle error, but we stop spinner
      console.error('Submit failed in AddNewUser:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleNext = async () => {
    try {
      await form.validateFields(personalFields);
      form.setFields(addressFields.map(name => ({
        name,
        errors: []
      })));
      setCurrentStep(1);
      setTimeout(() => {
        form.setFields(addressFields.map(name => ({
          name,
          errors: []
        })));
      }, 0);
    } catch (error) {
      console.error("Step validation failed in AddNewUser:", error);
    }
  };
  const handleBack = () => {
    setCurrentStep(0);
  };
  const handleCreate = async () => {
    try {
      const values = await form.validateFields([...personalFields, ...addressFields]);
      await handleSubmit(values);
    } catch (error) {
      console.error("Create validation failed in AddNewUser:", error);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "add-new-user"
  }, /*#__PURE__*/React.createElement("div", {
    className: "add-new-user__header"
  }, /*#__PURE__*/React.createElement(Title, {
    level: 2,
    className: "add-new-user__title"
  }, "Add ", entityLabel), /*#__PURE__*/React.createElement("div", {
    className: "add-new-user__steps",
    "aria-label": "Form progress"
  }, /*#__PURE__*/React.createElement("span", {
    className: "add-new-user__step ".concat(currentStep === 0 ? "is-active" : "")
  }, "1. Personal"), /*#__PURE__*/React.createElement("span", {
    className: "add-new-user__step ".concat(currentStep === 1 ? "is-active" : "")
  }, "2. Address"))), /*#__PURE__*/React.createElement(Form, {
    form: form,
    layout: "vertical",
    className: "add-new-user__form",
    onSubmitCapture: event => event.preventDefault()
  }, /*#__PURE__*/React.createElement(Spin, {
    spinning: isSubmitting,
    tip: "Submitting..."
  }, currentStep === 0 && /*#__PURE__*/React.createElement("section", {
    className: "add-user-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "add-user-section__heading"
  }, /*#__PURE__*/React.createElement("h3", null, "Profile Information")), /*#__PURE__*/React.createElement(Row, {
    gutter: [18, 4]
  }, /*#__PURE__*/React.createElement(Col, {
    xs: 24,
    md: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "firstName",
    label: "Name",
    rules: [{
      validator: validateName
    }, {
      min: 2,
      message: 'Name should have at least 2 characters'
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Enter name"
  }))), /*#__PURE__*/React.createElement(Col, {
    xs: 24,
    md: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "lastName",
    label: "Last Name",
    rules: [{
      required: true,
      message: 'Last name is required'
    }, {
      pattern: /^[a-zA-Z0-9\s\-'.]+$/,
      message: 'Last name can contain letters, digits, spaces, hyphens, apostrophes, and dots'
    }, {
      min: 2,
      message: 'Last name should have at least 2 characters'
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Enter last name"
  }))), /*#__PURE__*/React.createElement(Col, {
    xs: 24,
    md: 12
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
  }, /*#__PURE__*/React.createElement(Input, {
    type: "email",
    placeholder: "name@example.com"
  }))), /*#__PURE__*/React.createElement(Col, {
    xs: 24,
    md: 12
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
    placeholder: "10-digit phone number",
    maxLength: 10
  }))))), currentStep === 1 && /*#__PURE__*/React.createElement("section", {
    className: "add-user-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "add-user-section__heading"
  }, /*#__PURE__*/React.createElement("h3", null, "Address Details")), /*#__PURE__*/React.createElement(Row, {
    gutter: [18, 4]
  }, /*#__PURE__*/React.createElement(Col, {
    xs: 24,
    md: 12
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
    xs: 24,
    md: 12
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
    xs: 24,
    md: 12
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
    placeholder: "Enter city"
  }))), /*#__PURE__*/React.createElement(Col, {
    xs: 24,
    md: 12
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
    placeholder: "5-6 digit pincode",
    maxLength: 6
  }))), /*#__PURE__*/React.createElement(Col, {
    xs: 24,
    md: 8
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "houseNo",
    label: "House No."
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "House/building"
  }))), /*#__PURE__*/React.createElement(Col, {
    xs: 24,
    md: 8
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
    placeholder: "Primary street"
  }))), /*#__PURE__*/React.createElement(Col, {
    xs: 24,
    md: 8
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "street2",
    label: "Street 2"
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Area, landmark, or suite"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "add-new-user__footer"
  }, currentStep === 1 && /*#__PURE__*/React.createElement(Button, {
    type: "default",
    htmlType: "button",
    className: "add-new-user__secondary",
    onClick: handleBack,
    disabled: isSubmitting
  }, "Back"), currentStep === 0 ? /*#__PURE__*/React.createElement(Button, {
    type: "primary",
    htmlType: "button",
    className: "add-new-user__submit",
    onClick: handleNext
  }, "Next") : /*#__PURE__*/React.createElement(Button, {
    type: "primary",
    htmlType: "button",
    className: "add-new-user__submit",
    onClick: handleCreate,
    loading: isSubmitting,
    disabled: isSubmitting,
    "aria-busy": isSubmitting
  }, isSubmitting ? 'Submitting...' : "Create ".concat(entityLabel))))));
};
export default AddNewUser;