import React from 'react';
import { Row, Col } from 'antd';
import './TotalSummary.css'; // Custom CSS if needed

const TotalSummary = ({ totalPrice }) => {
  const taxRate = 8.25 / 100; // Tax rate is 8.25%
  const taxAmount = (totalPrice * taxRate).toFixed(2); // Calculate tax amount
  const grandTotal = (totalPrice + parseFloat(taxAmount)).toFixed(2); // Grand total is totalPrice + taxAmount

  return (
    <div >
      <Row gutter={[16, 16]} className="total-summary-row">
        <Col span={6}></Col>
        <Col span={6}></Col>
        <Col span={6}><strong>Items Sub Total:</strong></Col>
        <Col span={6}><strong>₹ {totalPrice.toFixed(2)}</strong></Col>
      </Row>
      <Row gutter={[16, 16]} className="total-summary-row">
        <Col span={6}></Col>
        <Col span={6}></Col>
        <Col span={6}><strong>Sales Tax (8.25%):</strong></Col>
        <Col span={6}><strong>₹ {taxAmount}</strong></Col>
      </Row>
      <Row gutter={[16, 16]} className="total-summary-row">
        <Col span={6}></Col>
        <Col span={6}></Col>
        <Col span={6}><strong>Grand Total:</strong></Col>
        <Col span={6}><strong>₹ {grandTotal}</strong></Col>
      </Row>
    </div>
  );
};

export default TotalSummary;