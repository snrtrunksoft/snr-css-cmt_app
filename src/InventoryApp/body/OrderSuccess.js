import React from 'react';
import { Button, Result } from 'antd';

const OrderSuccess = ({switchView, resetCart, status, title, subTitle}) => {

  const handleClose = () => {
    resetCart(); // Reset the cart
    window.location.reload();
    switchView('home');
  };

  return (
    <Result
      switchView
      status={status}
      title={title}
      subTitle={subTitle}
      extra={[
        <Button type="primary" key="console" onClick={() => handleClose()}>
          Close
        </Button>,
        <Button key="buy" onClick={() => switchView('update-order')}>
          Make Updates
        </Button>,
      ]}
    />
  );
};

export default OrderSuccess;