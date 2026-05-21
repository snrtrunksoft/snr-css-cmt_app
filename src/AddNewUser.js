import React, { useState, useEffect } from "react";
import "./AddNewUser.css";
import { Row, Col, Input, Select, Button, Form, Typography, Spin } from 'antd';
import { getSubscriptionPlans } from "./api/APIUtil";

const { Option } = Select;
const { Title } = Typography;
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
const AddNewUser = ({ mode = "member", form, onSubmit, entityId }) => {
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSubscriptionPlans = async () => {
      setLoadingPlans(true);
      try{
        const response = await getSubscriptionPlans(entityId);
        setSubscriptionPlans(response);
        console.log("Subscription Plans loaded from API:", response);
      } catch(error) {
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

  const handleSubmit = async (values) => {
    if (!onSubmit) return;
    setIsSubmitting(true);
    try {
      const sanitizedValues = {
        ...values,
        firstName: values.firstName?.trim() || "",
        lastName: values.lastName?.trim() || "",
      };
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

  return (
    <div style={{ margin: '0 auto', padding: '0px 40px', borderRadius: '10px' }}>
      <Title level={2} style={{ textAlign: 'center', color: '#007bff' }}>
        {mode === "resource" ? "Add Resource" : "Add Member"}
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ status: "ACTIVE" }}
      >
        <Spin spinning={isSubmitting} tip="Submitting...">
        {/* Personal Information Section */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="firstName" 
              label="Name" 
              rules={[
                { validator: validateName }
              ]}
            >
              <Input placeholder="Enter name (spaces allowed, min 7 chars)" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="lastName" 
              label="Last Name"
              // rules={[
              //   { required: true, message: 'Last name is required' },
              //   { pattern: /^[a-zA-Z\s]+$/, message: 'Last name should contain only letters' },
              //   { min: 2, message: 'Last name should have at least 2 characters' }
              // ]}
            >
              <Input placeholder="Enter last name (letters only, min 2 chars)" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item 
          name="email" 
          label="Email" 
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Please enter a valid email address' }
          ]}
        >
          <Input type="email" placeholder="Enter valid email address"/>
        </Form.Item>

        {/* Contact Information Section */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="country" 
              label="Country" 
              rules={[
                { required: true, message: 'Country is required' }
              ]}
            >
              <Input placeholder="Enter country" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="phone" 
              label="Phone" 
              rules={[
                { required: true, message: 'Phone number is required' },
                { pattern: /^[0-9]{10}$/, message: 'Phone number should be exactly 10 digits' }
              ]}
            >
              <Input 
                type="tel" 
                placeholder="Enter 10-digit phone number" 
                maxLength={10}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="state" 
              label="State/Province" 
              rules={[
                { required: true, message: 'State is required' }
              ]}
            >
              <Input placeholder="Enter state/province" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="houseNo" 
              label="House No."
              rules={[
                { required: true, message: 'House number is required' }
              ]}
            >
              <Input placeholder="Enter house/building number" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="city" 
              label="City" 
              rules={[
                { required: true, message: 'City is required' },
                { pattern: /^[a-zA-Z\s]+$/, message: 'City should contain only letters' },
                { min: 2, message: 'City name should have at least 2 characters' }
              ]}
            >
              <Input placeholder="Enter city name (letters only, min 2 chars)" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="pincode" 
              label="Pincode"
              rules={[
                { required: true, message: 'Pincode is required' },
                { pattern: /^[0-9]{5,6}$/, message: 'Pincode should be 5-6 digits' }
              ]}
            >
              <Input placeholder="Enter 5-6 digit pincode" maxLength={6} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="street1" 
              label="Street 1"
              rules={[
                { required: true, message: 'Street 1 is required' },
                { min: 2, message: 'Street 1 should have at least 2 characters' }
              ]}
            >
              <Input placeholder="Enter street 1" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="street2" 
              label="Street 2"
            >
              <Input placeholder="Enter street 2" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Status is required' }]}>
          <Select placeholder="Select a status">
            <Option value="ACTIVE">ACTIVE</Option>
            <Option value="IN_PROGRESS">IN_PROGRESS</Option>
            <Option value="COMPLETED">COMPLETED</Option>
            <Option value="CANCELLED">CANCELLED</Option>
          </Select>
        </Form.Item>

        {mode === "member" && (
          <Form.Item 
            name="subscriptionPlanId" 
            label="Subscription Plan"
            // rules={[{ required: true, message: 'Subscription plan is required' }]}
          >
            <Select 
              placeholder="Select a subscription plan"
              loading={loadingPlans}
            >
              {subscriptionPlans.map((plan) => (
                <Option key={plan.id} value={plan.id}>
                  {plan.id} - ${plan.price} ({plan.type})
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" block style={{ backgroundColor: '#ff5c5c', height: '45px', fontSize: '16px' }} loading={isSubmitting} disabled={isSubmitting} aria-busy={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'SUBMIT'}
          </Button>
        </Form.Item>
        </Spin>
      </Form>
    </div>
  );
};

export default AddNewUser;
