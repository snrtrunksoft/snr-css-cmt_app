import React, { useState, useEffect } from "react";
import "./AddNewUser.css";
import { Row, Col, Input, Select, Button, Form, Typography, Spin } from 'antd';

const { Option } = Select;
const { Title } = Typography;

// Mock subscription plans data - replace with API call later
const MOCK_SUBSCRIPTION_PLANS = [
  {
    "price": 490.0,
    "noOfSubscriptions": 50.0,
    "entityId": "w_123",
    "id": "sub_21",
    "isActive": true,
    "type": "RECURRING"
  },
  {
    "price": 20.0,
    "noOfSubscriptions": 30.0,
    "entityId": "w_123",
    "id": "sub_22",
    "isActive": true,
    "type": "RECURRING"
  },
  {
    "createdDate": "2025-11-12 09:00:00.0",
    "price": 499.0,
    "entityId": "w_123",
    "noOfSubscriptions": 10.0,
    "updatedDate": "2025-11-12 10:30:00.0",
    "id": "sub_23",
    "isActive": true,
    "type": "ONETIME"
  },
  {
    "price": 390.0,
    "noOfSubscriptions": 50.0,
    "entityId": "w_123",
    "id": "sub_24",
    "isActive": true,
    "type": "RECURRING"
  }
];

/**
 * Self-contained form:
 * - Owns its own state (no setter props from parent)
 * - Calls onSubmit(values) with all form values
 * - `mode`: "member" | "resource" (default "member")
 */
const AddNewUser = ({ mode = "member", form, onSubmit, entityId }) => {
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

  const handleSubmit = (values) => {
    onSubmit?.(values);
    form.resetFields();
  };

  return (
    <div style={{ margin: '0 auto', padding: '0px 40px', borderRadius: '10px' }}>
      <Title level={2} style={{ textAlign: 'center', color: '#007bff' }}>
        {mode === "resource" ? "Add Resource" : "Registration"}
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ status: "ACTIVE" }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="firstName" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="lastName" label="Last Name">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {mode === "member" &&
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <Input type="email"/>
        </Form.Item>}

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="address" label="Address">
              <Input placeholder="houseNo./street 1/street 2" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="pincode" label="Pincode">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="country" label="Country" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="city" label="City" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="state" label="State" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="status" label="Status">
          <Select>
            <Option value="ACTIVE">ACTIVE</Option>
            <Option value="IN_PROGRESS">IN_PROGRESS</Option>
            <Option value="COMPLETED">COMPLETED</Option>
            <Option value="CANCELLED">CANCELLED</Option>
          </Select>
        </Form.Item>

        {mode === "member" && (
          <Form.Item name="subscriptionPlanId" label="Subscription Plan">
            <Spin spinning={loadingPlans}>
              <Select placeholder="Select a subscription plan">
                {subscriptionPlans.map((plan) => (
                  <Option key={plan.id} value={plan.id}>
                    {plan.id} - ${plan.price} ({plan.type})
                  </Option>
                ))}
              </Select>
            </Spin>
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" block style={{ backgroundColor: '#ff5c5c', height: '45px', fontSize: '16px' }}>
            SUBMIT
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddNewUser;