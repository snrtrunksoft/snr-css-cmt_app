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
const StatusModal = _ref => {
  let {
    visible = false,
    type = "success",
    title = "",
    message = "",
    onClose = () => {},
    onConfirm = null,
    closeDrawer = false
  } = _ref;
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
  return /*#__PURE__*/React.createElement(Modal, {
    title: /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }
    }, isSuccess ? /*#__PURE__*/React.createElement(CheckCircleOutlined, {
      style: {
        color: '#52c41a',
        fontSize: '20px'
      }
    }) : /*#__PURE__*/React.createElement(ExclamationCircleOutlined, {
      style: {
        color: '#ff4d4f',
        fontSize: '20px'
      }
    }), /*#__PURE__*/React.createElement("span", null, title)),
    open: visible,
    onCancel: handleClose,
    footer: [/*#__PURE__*/React.createElement(Button, {
      key: "ok",
      type: isSuccess ? "primary" : "default",
      onClick: handleConfirm
    }, "OK")],
    centered: true
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '14px',
      margin: '16px 0',
      lineHeight: '1.6'
    }
  }, message));
};
export default StatusModal;