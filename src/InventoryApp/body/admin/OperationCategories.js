import React, { useState } from 'react';
import { Row, Col, Button } from 'antd';
import './OperationCategories.css';

const OperationCategories = ({ onCategorySelect }) => {
  const operationCategories = [
    { id: 'dashboards', name: 'Dashboards' },
    { id: 'categories', name: 'Categories' },
    { id: 'items', name: 'Items' },
    { id: 'viewOrders', name: 'View Orders' },
    { id: 'users', name: 'Users' },
    { id: 'help', name: 'Help? ContactUs' }
  ];

  const [selectedItemType, setSelectedItemType] = useState('dashboards');

  const handleCategoryClick = (category) => {
    setSelectedItemType(category);
    onCategorySelect(category); // Call the callback to update selectedCategory in parent
  };

  return (
    <Row gutter={[16, 16]} justify="center" className="item-type-row">
      {operationCategories.map((itemType) => (
        <Col key={itemType.id}>
          <Button
            type="default"
            onClick={() => handleCategoryClick(itemType.id)}
            style={{
              width: '220px',
              textAlign: 'center',
              backgroundColor: selectedItemType === itemType.id ? '#0582f7' : 'inherit',
              color: selectedItemType === itemType.id ? '#fff' : 'inherit',
              borderColor: selectedItemType === itemType.id ? '#52c41a' : 'inherit',
            }}
            size="large"
          >
            {itemType.name}
          </Button>
        </Col>
      ))}
    </Row>
  );
};

export default OperationCategories;