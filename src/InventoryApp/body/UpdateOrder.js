import React from 'react';
import { Button, Result } from 'antd';

const UpdateOrder = ({ switchView, resetCart }) => {

  return (
    <Result
      status="warning"
      title="Page Under Construction"
      subTitle="Currently Update Order WIP"
      extra={[
        <Button type="primary" key="console" onClick={() => {resetCart(); switchView('home');}}>
          Go to Home
        </Button>
      ]}
    />
  );
};

export default UpdateOrder;