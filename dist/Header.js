import { Badge, Button, Menu, Card, Drawer, Space, Switch, Modal, Row, Col } from "antd";
import { MenuOutlined, InboxOutlined, LogoutOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import "./Header.css";
import { getCurrentUser, signOut } from 'aws-amplify/auth'; // ✅ Auth import
import { useNavigate } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { IoIosGlobe } from "react-icons/io";
import { LuCalendar, LuListTodo } from "react-icons/lu";
import { HEADER_TITLE } from "./properties/properties";
import image from "./assets/logosnr.png";
const Header = _ref => {
  let {
    commentBox,
    membersPage,
    openCalendarPage,
    todosPage,
    resourcePage,
    setOpenCalendarPage,
    setMembersPage,
    setResourcePage,
    setTodosPage,
    setSelectedApp
  } = _ref;
  const [handleInboxDrawer, setHandleInboxDrawer] = useState(false);
  const [menuDrawerVisible, setMenuDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const navigate = useNavigate();
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 1030);
  };
  const handleLogout = async () => {
    await signOut();
    console.log("logout");
    // setIsLoggedIn(false);
    navigate('/');
  };
  useEffect(() => {
    const checkLogin = async () => {
      try {
        await getCurrentUser();
        // setIsLoggedIn(true);
      } catch (_unused) {
        // setIsLoggedIn(false);
      }
    };
    checkLogin();
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const handleMenuClick = key => {
    setOpenCalendarPage(false);
    setResourcePage(false);
    setMembersPage(false);
    setTodosPage(false);
    setMenuDrawerVisible(false);
    if (key === "members") setMembersPage(true);
    if (key === "calendar") setOpenCalendarPage(true);
    if (key === "todos") setTodosPage(true);
  };
  return /*#__PURE__*/React.createElement("header", {
    className: "CMTheader"
  }, /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: "logosnr",
    className: "app-logo"
  }), /*#__PURE__*/React.createElement("div", {
    className: "CMTheader-left",
    style: isMobile ? {
      padding: '0px'
    } : {}
  }, HEADER_TITLE), isMobile ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement(MenuOutlined, null),
    onClick: () => setMenuDrawerVisible(true),
    style: {
      marginRight: 10
    }
  }), /*#__PURE__*/React.createElement(Drawer, {
    open: menuDrawerVisible,
    title: "Menu",
    width: "60%",
    onClose: () => setMenuDrawerVisible(false)
  }, /*#__PURE__*/React.createElement(Menu, {
    mode: "vertical",
    theme: "light"
  }, /*#__PURE__*/React.createElement(Menu.Item, {
    key: "Home",
    icon: /*#__PURE__*/React.createElement(IoIosGlobe, null),
    onClick: () => navigate('/')
  }, "Home"), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "members",
    icon: /*#__PURE__*/React.createElement(FaUser, null),
    onClick: () => handleMenuClick("members")
  }, "Members"), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "calendar",
    icon: /*#__PURE__*/React.createElement(LuCalendar, null),
    onClick: () => handleMenuClick("calendar")
  }, "Calendar"), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "todos",
    icon: /*#__PURE__*/React.createElement(LuListTodo, null),
    onClick: () => handleMenuClick("todos")
  }, "Todos"), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "inbox",
    icon: /*#__PURE__*/React.createElement(InboxOutlined, null),
    onClick: () => {
      setHandleInboxDrawer(true);
      setMenuDrawerVisible(false);
    }
  }, "Inbox ", /*#__PURE__*/React.createElement(Badge, {
    count: commentBox.length,
    offset: [10, -2]
  })), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "logout",
    icon: /*#__PURE__*/React.createElement(LogoutOutlined, null),
    onClick: () => {
      setMenuDrawerVisible(false);
      setOpenConfirmationModal(true);
    }
  }, "Logout")))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Menu, {
    theme: "dark",
    mode: "horizontal",
    className: "app-menu",
    style: {
      backgroundColor: 'transparent'
    }
  }, /*#__PURE__*/React.createElement(Menu.Item, {
    key: "Home",
    icon: /*#__PURE__*/React.createElement(IoIosGlobe, null),
    onClick: () => navigate("/"),
    style: {
      backgroundColor: 'transparent'
    }
  }, "Home"), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "Members",
    icon: /*#__PURE__*/React.createElement(FaUser, null),
    onClick: () => {
      setOpenCalendarPage(false);
      setResourcePage(false);
      setMembersPage(true);
      setTodosPage(false);
    },
    style: {
      backgroundColor: 'transparent',
      color: membersPage ? '#1677ff' : ''
    }
  }, "Members"), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "Calendar",
    icon: /*#__PURE__*/React.createElement(LuCalendar, null),
    onClick: () => {
      setOpenCalendarPage(true);
      setResourcePage(false);
      setMembersPage(false);
      setTodosPage(false);
    },
    style: {
      backgroundColor: 'transparent',
      color: openCalendarPage ? '#1677ff' : ''
    }
  }, "Calendar"), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "Todos",
    icon: /*#__PURE__*/React.createElement(LuListTodo, null),
    onClick: () => {
      setOpenCalendarPage(false);
      setResourcePage(false);
      setMembersPage(false);
      setTodosPage(true);
    },
    style: {
      backgroundColor: 'transparent',
      color: todosPage ? '#1677ff' : ''
    }
  }, "Todos"), /*#__PURE__*/React.createElement(Badge, {
    count: commentBox.length,
    offset: [0, 0]
  }, /*#__PURE__*/React.createElement(Menu.Item, {
    key: "Inbox",
    icon: /*#__PURE__*/React.createElement(InboxOutlined, null),
    onClick: () => setHandleInboxDrawer(true),
    style: {
      backgroundColor: 'transparent'
    }
  }, "Inbox"))), /*#__PURE__*/React.createElement(Button, {
    onClick: () => setOpenConfirmationModal(true),
    style: {
      marginLeft: '10px',
      marginRight: '20px'
    }
  }, "Logout")), /*#__PURE__*/React.createElement(Drawer, {
    open: handleInboxDrawer,
    title: "Inbox",
    width: isMobile ? "90%" : "40%",
    onClose: () => setHandleInboxDrawer(false)
  }, commentBox.length === 0 ? /*#__PURE__*/React.createElement("center", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      color: '#9999'
    }
  }, "Inbox is Empty..")) : commentBox.map((item, index) => /*#__PURE__*/React.createElement(Space, {
    key: index,
    direction: "vertical",
    size: "middle",
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(Badge.Ribbon, {
    text: item.comment[item.comment.length - 1].author,
    color: item.color
  }, /*#__PURE__*/React.createElement(Card, {
    title: item.customerName,
    size: "small"
  }, item.comment[item.comment.length - 1].message, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: '4px',
      right: '8px',
      fontSize: '11px',
      color: '#888'
    }
  }, item.comment[item.comment.length - 1].time)))))), /*#__PURE__*/React.createElement(Modal, {
    open: openConfirmationModal,
    footer: null,
    onCancel: () => setOpenConfirmationModal(false)
  }, /*#__PURE__*/React.createElement(Row, {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(Col, null, /*#__PURE__*/React.createElement("h3", null, "Are you sure you want to logout..!")), /*#__PURE__*/React.createElement(Col, null, /*#__PURE__*/React.createElement(Button, {
    type: "primary",
    onClick: () => handleLogout()
  }, "Confirm"), " \xA0\xA0", /*#__PURE__*/React.createElement(Button, {
    onClick: () => setOpenConfirmationModal(false)
  }, "Cancel")))));
};
export default Header;