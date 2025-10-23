import React from "react";
import "./AddNewUser.css";
import { Row, Col, Input, Select, Button, Form, Typography } from 'antd';
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
    onSubmit
  } = _ref;
  const [form] = Form.useForm();
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
  }, /*#__PURE__*/React.createElement(Input, null)))), /*#__PURE__*/React.createElement(Row, {
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
  }, "CANCELLED"))), /*#__PURE__*/React.createElement(Form.Item, null, /*#__PURE__*/React.createElement(Button, {
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