import React from "react";
import "./AddNewUser.css";
import { Row, Col, Input, Select, Button, Form, Typography } from 'antd';

const { Option } = Select;
const { Title } = Typography;

/**
 * Self-contained form:
 * - Owns its own state (no setter props from parent)
 * - Calls onSubmit(values) with all form values
 * - `mode`: "member" | "resource" (default "member")
 */
const AddNewUser = ({ mode = "member", form, onSubmit }) => {

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