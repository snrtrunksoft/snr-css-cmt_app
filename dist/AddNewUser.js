import React, { useState, useEffect } from "react";
import "./AddNewUser.css";
import { Row, Col, Input, Select, Button, Form, Typography, Spin } from 'antd';
const {
  Option
} = Select;
const {
  Title
} = Typography;

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
  useEffect(() => {
    if (mode === "member") {
      setLoadingPlans(true);
      // Simulate API call delay
      setTimeout(() => {
        setSubscriptionPlans(MOCK_SUBSCRIPTION_PLANS);
        console.log("Subscription Plans loaded from mock data:", MOCK_SUBSCRIPTION_PLANS);
        setLoadingPlans(false);
      }, 300);
    }
  }, [mode]);
  const handleSubmit = values => {
    onSubmit === null || onSubmit === void 0 || onSubmit(values);
    form.resetFields();
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
  }, /*#__PURE__*/React.createElement(Row, {
    gutter: 16
  }, /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "firstName",
    label: "Name",
    rules: [{
      required: true
    }]
  }, /*#__PURE__*/React.createElement(Input, null))), /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "lastName",
    label: "Last Name"
  }, /*#__PURE__*/React.createElement(Input, null)))), mode === "member" && /*#__PURE__*/React.createElement(Form.Item, {
    name: "email",
    label: "Email",
    rules: [{
      required: true,
      type: 'email'
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    type: "email"
  })), /*#__PURE__*/React.createElement(Row, {
    gutter: 16
  }, /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "phone",
    label: "Phone",
    rules: [{
      required: true
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    type: "number"
  }))), /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "address",
    label: "Address"
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "houseNo./street 1/street 2"
  })))), /*#__PURE__*/React.createElement(Row, {
    gutter: 16
  }, /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "pincode",
    label: "Pincode"
  }, /*#__PURE__*/React.createElement(Input, null))), /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "country",
    label: "Country",
    rules: [{
      required: true
    }]
  }, /*#__PURE__*/React.createElement(Input, null)))), /*#__PURE__*/React.createElement(Row, {
    gutter: 16
  }, /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "city",
    label: "City",
    rules: [{
      required: true
    }]
  }, /*#__PURE__*/React.createElement(Input, null))), /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "state",
    label: "State",
    rules: [{
      required: true
    }]
  }, /*#__PURE__*/React.createElement(Input, null)))), /*#__PURE__*/React.createElement(Form.Item, {
    name: "status",
    label: "Status"
  }, /*#__PURE__*/React.createElement(Select, null, /*#__PURE__*/React.createElement(Option, {
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
  }, /*#__PURE__*/React.createElement(Spin, {
    spinning: loadingPlans
  }, /*#__PURE__*/React.createElement(Select, {
    placeholder: "Select a subscription plan"
  }, subscriptionPlans.map(plan => /*#__PURE__*/React.createElement(Option, {
    key: plan.id,
    value: plan.id
  }, plan.id, " - $", plan.price, " (", plan.type, ")"))))), /*#__PURE__*/React.createElement(Form.Item, null, /*#__PURE__*/React.createElement(Button, {
    type: "primary",
    htmlType: "submit",
    block: true,
    style: {
      backgroundColor: '#ff5c5c',
      height: '45px',
      fontSize: '16px'
    }
  }, "SUBMIT"))));
};
export default AddNewUser;