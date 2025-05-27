import React from "react";
import "./AddNewNameCard.css";
import { Row, Col, Input, Select, Button, Checkbox, Form, Typography } from 'antd';

const { Option } = Select;
const { Title, Text } = Typography;

const AddNewNameCard = ({ 
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
    }) => {

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

    const handleSubmit = (values) => {
        if (membersPage){
            handleAddNewNameCard();
        } else if (resourcePage){
            handleAddNewResource();
        }
        console.log('Submitted:', values);
        form.resetFields();
        handleReset();
    };

    const dropDownList = (
        <select
            value={newRecordStatus}
            style={{borderRadius:'5px',padding:'5px'}}
            onChange={(e) => setNewRecordStatus(e.target.value)}
            >
            <option value="Active">Active</option>
            <option value="In_Progress">In_Progress</option>
            <option value="Complete">Complete</option>
        </select>
    );

    return(
        <div style={{
            margin: '0 auto',
            padding: '0px 40px',
            borderRadius: '10px',
            }}>
            <Title level={2} style={{ textAlign: 'center', color: '#007bff' }}>
                Registration
            </Title>

            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name="firstName" label="Name" rules={[{ required: true }]}>
                        <Input onChange={(e) => {setNewRecordName(e.target.value)}}/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="lastName" label="Last Name">
                        <Input onChange={(e) => {setNewRecordLastName(e.target.value)}}/>
                    </Form.Item>
                </Col>
                </Row>

                <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                    <Input type="number" onChange={(e) => {setNewRecordPhone(e.target.value)}}/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="address" label="Address">
                    <Input placeholder="houseNo./street 1/street 2" onChange={(e) => {setNewRecordAddress(e.target.value)}}/>
                    </Form.Item>
                </Col>
                </Row>

                <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name="email" label="Email">
                    <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="country" label="Country" rules={[{ required: true }]}>
                    <Input onChange={(e) => {setNewRecordCountry(e.target.value)}}/>
                    </Form.Item>
                </Col>
                </Row>

                <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name="city" label="City" rules={[{ required: true }]}>
                    <Input onChange={(e) => {setNewRecordCity(e.target.value)}}/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="state" label="State" rules={[{ required: true }]}>
                    <Input onChange={(e) => {setNewRecordState(e.target.value)}}/>
                    </Form.Item>
                </Col>
                </Row>

                <Form.Item name="status" >
                    <center>{dropDownList}</center>
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

export default AddNewNameCard;