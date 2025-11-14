import React from 'react';
import { Modal, Button } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

/**
 * StatusModal - Reusable component for displaying success/error feedback
 * 
 * Props:
 *  - visible: boolean - Whether the modal is open
 *  - type: "success" | "error" - Modal type
 *  - title: string - Modal title
 *  - message: string - Modal message
 *  - onClose: function - Callback when modal closes
 *  - onConfirm: function - Optional callback for custom confirm action
 */
const StatusModal = ({
  visible = false,
  type = "success",
  title = "",
  message = "",
  onClose = () => {},
  onConfirm = null,
  closeDrawer = false,
}) => {
  const isSuccess = type === "success";

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      handleClose();
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isSuccess ? (
            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px' }} />
          ) : (
            <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: '20px' }} />
          )}
          <span>{title}</span>
        </div>
      }
      open={visible}
      onCancel={handleClose}
      footer={[
        <Button
          key="ok"
          type={isSuccess ? "primary" : "default"}
          onClick={handleConfirm}
        >
          OK
        </Button>,
      ]}
      centered
    >
      <p style={{ fontSize: '14px', margin: '16px 0', lineHeight: '1.6' }}>
        {message}
      </p>
    </Modal>
  );
};

export default StatusModal;
