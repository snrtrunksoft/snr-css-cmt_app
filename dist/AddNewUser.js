import React, { useState, useEffect } from "react";
import "./AddNewUser.css";
import { Row, Col, Input, Select, Button, Form, Typography, Spin } from 'antd';
import { getSubscriptionPlans, getCountries, getCountryStates } from "./api/APIUtil";
const {
  Option
} = Select;
const {
  Title
} = Typography;

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
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [states, setStates] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryCode, setCountryCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch countries on component mount
  useEffect(() => {
    fetchCountries();
  }, []);
  const fetchCountries = async () => {
    if (countries.length > 0) return; // already loaded
    setLoadingCountries(true);
    try {
      const sortedCountries = await getCountries();
      setCountries(sortedCountries);
      console.log("Countries loaded:", sortedCountries);
    } catch (error) {
      console.error("Error fetching countries:", error);
    } finally {
      setLoadingCountries(false);
    }
  };
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
  const handleCountryChange = value => {
    const selected = countries.find(c => c.name === value);
    if (selected) {
      setSelectedCountry(selected);
      setCountryCode(selected.dialCode || "");

      // Fetch states for selected country
      fetchStates(selected.name);

      // Reset state field
      form.setFieldsValue({
        state: undefined
      });
    }
  };
  const fetchStates = async countryName => {
    setLoadingStates(true);
    try {
      const statesList = await getCountryStates(countryName);
      console.log("Parsed states:", statesList);
      setStates(statesList);
    } catch (error) {
      console.error("Error fetching states:", error);
      setStates([]);
    } finally {
      setLoadingStates(false);
    }
  };

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
      const result = onSubmit(values);
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
  }, mode === "resource" ? "Add Resource" : "Registration"), /*#__PURE__*/React.createElement(Form, {
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
  })))), mode === "member" && /*#__PURE__*/React.createElement(Form.Item, {
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
  }, /*#__PURE__*/React.createElement(Select, {
    placeholder: "Select a country",
    onChange: handleCountryChange,
    allowClear: true,
    showSearch: true,
    loading: loadingCountries,
    filterOption: (input, option) => {
      var _option$label;
      return ((_option$label = option === null || option === void 0 ? void 0 : option.label) !== null && _option$label !== void 0 ? _option$label : '').toLowerCase().includes(input.toLowerCase());
    },
    options: countries.map(country => ({
      label: country.name,
      value: country.name
    }))
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
    placeholder: countryCode ? "".concat(countryCode, " - 10-digit number") : "Select country first",
    maxLength: 10,
    prefix: countryCode ? countryCode : undefined
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
  }, /*#__PURE__*/React.createElement(Select, {
    placeholder: !selectedCountry ? "Select a country first" : "Select a state/province",
    allowClear: true,
    disabled: !selectedCountry || states.length === 0,
    loading: loadingStates,
    showSearch: true,
    filterOption: (input, option) => {
      var _option$label2;
      return ((_option$label2 = option === null || option === void 0 ? void 0 : option.label) !== null && _option$label2 !== void 0 ? _option$label2 : '').toLowerCase().includes(input.toLowerCase());
    },
    options: states.map(state => ({
      label: state.name,
      value: state.name
    })),
    onChange: () => form.validateFields(['state'])
  }))), /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "address",
    label: "Address",
    rules: [{
      required: true,
      message: 'Address is required'
    }, {
      min: 5,
      message: 'Address should have at least 5 characters'
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "houseNo./street 1/street 2 (min 5 chars)"
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