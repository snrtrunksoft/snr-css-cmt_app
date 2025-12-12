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
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [states, setStates] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryCode, setCountryCode] = useState("");

  // Fetch countries on component mount
  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    setLoadingCountries(true);
    try {
      const response = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,idd,region,states");
      const data = await response.json();
      
      // Sort countries by name
      const sortedCountries = data
        .map((country) => ({
          name: country.name.common,
          code: country.cca2,
          dialCode: country.idd?.root + (country.idd?.suffixes?.[0] || ''),
          region: country.region,
          states: country.states || []
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
      
      setCountries(sortedCountries);
      console.log("Countries loaded:", sortedCountries);
    } catch (error) {
      console.error("Error fetching countries:", error);
    } finally {
      setLoadingCountries(false);
    }
  };

  const handleCountryChange = (value) => {
    const selected = countries.find((c) => c.name === value);
    if (selected) {
      setSelectedCountry(selected);
      setCountryCode(selected.dialCode || "");
      
      // Fetch states for selected country
      fetchStates(selected.name);
      
      // Reset state field
      form.setFieldsValue({ state: undefined });
    }
  };

  const fetchStates = async (countryName) => {
    setLoadingStates(true);
    try {
      const response = await fetch(`https://countriesnow.space/api/v0.1/countries/states`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ country: countryName })
      });
      const data = await response.json();
      
      console.log("States response for", countryName, ":", data);
      
      if (data.data && data.data.states && Array.isArray(data.data.states)) {
        const statesList = data.data.states
          .map((state) => ({
            name: state.name,
            code: state.state_code || state.name
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        
        console.log("Parsed states:", statesList);
        setStates(statesList);
      } else {
        // If no states available, set empty
        console.log("No states found for", countryName);
        setStates([]);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
      setStates([]);
    } finally {
      setLoadingStates(false);
    }
  };

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
        {/* Personal Information Section */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="firstName" 
              label="Name" 
              rules={[
                { required: true, message: 'Name is required' },
                { pattern: /^[a-zA-Z][a-zA-Z0-9._]*$/, message: 'Name must start with a letter and can contain letters, numbers, underscores, and dots' },
                { min: 7, message: 'Name should have at least 7 characters' }
              ]}
            >
              <Input placeholder="Enter name (start with letter, min 7 chars)" />
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

        {mode === "member" &&
        <Form.Item 
          name="email" 
          label="Email" 
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Please enter a valid email address' }
          ]}
        >
          <Input type="email" placeholder="Enter valid email address"/>
        </Form.Item>}

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
              <Select 
                placeholder="Select a country" 
                onChange={handleCountryChange}
                allowClear
                showSearch
                loading={loadingCountries}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={countries.map((country) => ({
                  label: country.name,
                  value: country.name
                }))}
              />
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
                placeholder={countryCode ? `${countryCode} - 10-digit number` : "Select country first"} 
                maxLength={10}
                prefix={countryCode ? countryCode : undefined}
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
              <Select 
                placeholder={!selectedCountry ? "Select a country first" : "Select a state/province"}
                allowClear
                disabled={!selectedCountry || states.length === 0}
                loading={loadingStates}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={states.map((state) => ({
                  label: state.name,
                  value: state.name
                }))}
                onChange={() => form.validateFields(['state'])}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="address" 
              label="Address"
              rules={[
                { required: true, message: 'Address is required' },
                { min: 5, message: 'Address should have at least 5 characters' }
              ]}
            >
              <Input placeholder="houseNo./street 1/street 2 (min 5 chars)" />
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
            rules={[{ required: true, message: 'Subscription plan is required' }]}
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
          <Button type="primary" htmlType="submit" block style={{ backgroundColor: '#ff5c5c', height: '45px', fontSize: '16px' }}>
            SUBMIT
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddNewUser;