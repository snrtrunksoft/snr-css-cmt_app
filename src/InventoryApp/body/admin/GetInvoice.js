import { Col, Divider, Row } from "antd";
import React from "react";

export const GetInvoice = ({ invoiceData }) => {
    return(
        <div>
            <Row style={{display:'flex',alignItems:'center',justifyContent:'center'}}><h2>Order Details</h2></Row>
            <Row gutter={[16, 16]} className="invoice-header">
                <Col span={4}><strong>OrderId</strong></Col>
                <Col span={5}><strong>PlacedBy</strong></Col>
                <Col span={5}><strong>Order status</strong></Col>
                <Col span={5}><strong>Amount</strong></Col>
                <Col span={4}><strong>Phone</strong></Col>
            </Row>
            <Divider type="horizontal" style={{backgroundColor:'black'}}></Divider>
            { invoiceData ? (<div>
                <Row key={invoiceData.id} gutter={[16, 16]} className="invoice-row-data">
                        <Col span={4}>
                            <p>{invoiceData.id}</p>
                        </Col>
                        <Col span={5}>
                            <p>{invoiceData.placedBy}</p>
                        </Col>
                        <Col span={5}>
                            <p>{invoiceData.status}</p>
                        </Col>
                        <Col span={5}>
                            <p>₹{invoiceData.totalAmount}</p>
                        </Col>
                        <Col span={5}>
                            <p>{invoiceData.phone}</p>
                        </Col>
                    </Row>
            </div>) : "No Data"}
        </div>
    );
};