import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Menu, Drawer, Dropdown, Select } from 'antd';
import './OperationCategories.css';
import { MenuOutlined } from '@ant-design/icons';

const { Option } = Select;

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(()=> {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  },[]);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 920);
  };

  const handleCategoryClick = (category) => {
    setSelectedItemType(category);
    onCategorySelect(category); // Call the callback to update selectedCategory in parent
  };

  return (
    <div>
      {isMobile ?
      <Row>
        <Select
          placeholder="Select a category"
          style={{ width: '50%' }}
          value={selectedItemType}
          onChange={(value) => handleCategoryClick(value)}>
          {operationCategories.map((itemType) => (
            <Option
                type="default"
                value={itemType.id}
                style={{
                  textAlign: 'center',
                  backgroundColor: selectedItemType === itemType.id ? '#0582f7' : 'inherit',
                  color: selectedItemType === itemType.id ? '#fff' : 'inherit',
                  borderColor: selectedItemType === itemType.id ? '#52c41a' : 'inherit',
                }}
                size="large"
              >
                {itemType.name}
              </Option>))}
        </Select>
      </Row> :
      (<Row gutter={[16, 16]} justify="start" className="item-type-row">
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
        </Row>)}
    </div>
  );
};

export default OperationCategories;