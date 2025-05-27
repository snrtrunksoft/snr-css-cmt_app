import React from "react";
import "./AddNewNameCard.css";
import { Row, Col, Input, Select, Button, Checkbox, Form, Typography } from 'antd';
const {
  Option
} = Select;
const {
  Title,
  Text
} = Typography;
const AddNewNameCard = _ref => {
  let {
    setNewRecordName,
    setNewRecordLastName,
    setNewRecordPhone,
    setNewRecordAddress,
    setNewRecordCity,
    setNewRecordState,
    setNewRecordCountry,
    setNewRecordStatus,
    newRecordStatus,
    handleAddNewResource,
    handleAddNewNameCard,
    membersPage,
    resourcePage
  } = _ref;
  // const { register, reset } = useForm();

  const handleReset = () => {
    setNewRecordName("");
    setNewRecordLastName("");
    setNewRecordPhone("");
    setNewRecordAddress("");
    setNewRecordCity("");
    setNewRecordState("");
    setNewRecordCountry("");
    setNewRecordStatus("Active");
  };
  const [form] = Form.useForm();
  const handleSubmit = values => {
    if (membersPage) {
      handleAddNewNameCard();
    } else if (resourcePage) {
      handleAddNewResource();
    }
    console.log('Submitted:', values);
    form.resetFields();
    handleReset();
  };
  const dropDownList = /*#__PURE__*/React.createElement("select", {
    value: newRecordStatus,
    style: {
      borderRadius: '5px',
      padding: '5px'
    },
    onChange: e => setNewRecordStatus(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "Active"
  }, "Active"), /*#__PURE__*/React.createElement("option", {
    value: "In_Progress"
  }, "In_Progress"), /*#__PURE__*/React.createElement("option", {
    value: "Complete"
  }, "Complete"));
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
  }, "Registration"), /*#__PURE__*/React.createElement(Form, {
    form: form,
    layout: "vertical",
    onFinish: handleSubmit
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
  }, /*#__PURE__*/React.createElement(Input, {
    onChange: e => {
      setNewRecordName(e.target.value);
    }
  }))), /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "lastName",
    label: "Last Name"
  }, /*#__PURE__*/React.createElement(Input, {
    onChange: e => {
      setNewRecordLastName(e.target.value);
    }
  })))), /*#__PURE__*/React.createElement(Row, {
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
    type: "number",
    onChange: e => {
      setNewRecordPhone(e.target.value);
    }
  }))), /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "address",
    label: "Address"
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "houseNo./street 1/street 2",
    onChange: e => {
      setNewRecordAddress(e.target.value);
    }
  })))), /*#__PURE__*/React.createElement(Row, {
    gutter: 16
  }, /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "email",
    label: "Email"
  }, /*#__PURE__*/React.createElement(Input, null))), /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "country",
    label: "Country",
    rules: [{
      required: true
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    onChange: e => {
      setNewRecordCountry(e.target.value);
    }
  })))), /*#__PURE__*/React.createElement(Row, {
    gutter: 16
  }, /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "city",
    label: "City",
    rules: [{
      required: true
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    onChange: e => {
      setNewRecordCity(e.target.value);
    }
  }))), /*#__PURE__*/React.createElement(Col, {
    span: 12
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "state",
    label: "State",
    rules: [{
      required: true
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    onChange: e => {
      setNewRecordState(e.target.value);
    }
  })))), /*#__PURE__*/React.createElement(Form.Item, {
    name: "status"
  }, /*#__PURE__*/React.createElement("center", null, dropDownList)), /*#__PURE__*/React.createElement(Form.Item, null, /*#__PURE__*/React.createElement(Button, {
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
export default AddNewNameCard;