import React, { useState, useEffect } from "react";
import "./AddNewUser.css";
import { Row, Col, Input, Button, Form, Typography, Spin } from 'antd';
import { getSubscriptionPlans } from "./api/APIUtil";

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
  const [currentStep, setCurrentStep] = useState(0);

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

  const entityLabel = mode === "resource" ? "Resource" : "Member";
  const personalFields = ["firstName", "lastName", "email", "phone"];
  const addressFields = ["country", "state", "city", "pincode", "houseNo", "street1", "street2"];
  const allFields = [...personalFields, ...addressFields];

  const resetForm = () => {
    setCurrentStep(0);
    form.resetFields(allFields);
    form.setFields(
      allFields.map((name) => ({
        name,
        value: undefined,
        errors: [],
        warnings: [],
      }))
    );
  };

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
      form.setFields(addressFields.map((name) => ({ name, errors: [] })));
      setCurrentStep(1);
      setTimeout(() => {
        form.setFields(addressFields.map((name) => ({ name, errors: [] })));
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

  return (
    <div className="add-new-user">
      <div className="add-new-user__header">
        <Title level={2} className="add-new-user__title">
          Add {entityLabel}
        </Title>
        <div className="add-new-user__steps" aria-label="Form progress">
          <span className={`add-new-user__step ${currentStep === 0 ? "is-active" : ""}`}>
            1. Personal
          </span>
          <span className={`add-new-user__step ${currentStep === 1 ? "is-active" : ""}`}>
            2. Address
          </span>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        className="add-new-user__form"
        onSubmitCapture={(event) => event.preventDefault()}
      >
        <Spin spinning={isSubmitting} tip="Submitting...">
          {currentStep === 0 && <section className="add-user-section">
            <div className="add-user-section__heading">
              <h3>Profile Information</h3>
            </div>
            <Row gutter={[18, 4]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="firstName"
                  label="Name"
                  rules={[
                    { validator: validateName },
                    { min: 2, message: 'Name should have at least 2 characters' }
                  ]}
                >
                  <Input placeholder="Enter name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="lastName"
                  label="Last Name"
                  rules={[
                    { required: true, message: 'Last name is required' },
                    { pattern: /^[a-zA-Z0-9\s\-'.]+$/, message: 'Last name can contain letters, digits, spaces, hyphens, apostrophes, and dots' },
                    { min: 2, message: 'Last name should have at least 2 characters' }
                  ]}
                >
                  <Input placeholder="Enter last name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Email is required' },
                    { type: 'email', message: 'Please enter a valid email address' }
                  ]}
                >
                  <Input type="email" placeholder="name@example.com" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="phone"
                  label="Phone"
                  rules={[
                    { required: true, message: 'Phone number is required' },
                    { pattern: /^[0-9]{10}$/, message: 'Phone number should be exactly 10 digits' }
                  ]}
                >
                  <Input type="tel" placeholder="10-digit phone number" maxLength={10} />
                </Form.Item>
              </Col>
            </Row>
          </section>}

          {currentStep === 1 && <section className="add-user-section">
            <div className="add-user-section__heading">
              <h3>Address Details</h3>
            </div>
            <Row gutter={[18, 4]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="country"
                  label="Country"
                  rules={[{ required: true, message: 'Country is required' }]}
                >
                  <Input placeholder="Enter country" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="state"
                  label="State/Province"
                  rules={[{ required: true, message: 'State is required' }]}
                >
                  <Input placeholder="Enter state/province" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="city"
                  label="City"
                  rules={[
                    { required: true, message: 'City is required' },
                    { pattern: /^[a-zA-Z\s]+$/, message: 'City should contain only letters' },
                    { min: 2, message: 'City name should have at least 2 characters' }
                  ]}
                >
                  <Input placeholder="Enter city" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="pincode"
                  label="Pincode"
                  rules={[
                    { required: true, message: 'Pincode is required' },
                    { pattern: /^[0-9]{5,6}$/, message: 'Pincode should be 5-6 digits' }
                  ]}
                >
                  <Input placeholder="5-6 digit pincode" maxLength={6} />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="houseNo" label="House No.">
                  <Input placeholder="House/building" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="street1"
                  label="Street 1"
                  rules={[
                    { required: true, message: 'Street 1 is required' },
                    { min: 2, message: 'Street 1 should have at least 2 characters' }
                  ]}
                >
                  <Input placeholder="Primary street" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="street2" label="Street 2">
                  <Input placeholder="Area, landmark, or suite" />
                </Form.Item>
              </Col>
            </Row>
          </section>}

          <div className="add-new-user__footer">
            {currentStep === 1 && (
              <Button
                type="default"
                htmlType="button"
                className="add-new-user__secondary"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                Back
              </Button>
            )}
            {currentStep === 0 ? (
              <Button
                type="primary"
                htmlType="button"
                className="add-new-user__submit"
                onClick={handleNext}
              >
                Next
              </Button>
            ) : (
              <Button
                type="primary"
                htmlType="button"
                className="add-new-user__submit"
                onClick={handleCreate}
                loading={isSubmitting}
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : `Create ${entityLabel}`}
              </Button>
            )}
          </div>
        </Spin>
      </Form>
    </div>
  );
};

export default AddNewUser;
