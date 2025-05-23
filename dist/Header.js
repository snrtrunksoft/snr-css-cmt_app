import { Badge, Button, Menu, Card, Drawer, Space, Switch } from "antd";
import { CalendarTwoTone, MenuOutlined, HomeOutlined, InboxOutlined, LogoutOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import "./Header.css";
const Header = _ref => {
  let {
    dropDownList,
    dataView,
    setDataView,
    setHideDashboard,
    hideDashboard,
    commentBox,
    membersPage,
    openCalendarPage,
    todosPage,
    resourcePage,
    setOpenCalendarPage,
    setMembersPage,
    setResourcePage,
    setTodosPage
  } = _ref;
  const [view, setView] = useState("Grid");
  const [handleInboxDrawer, setHandleInboxDrawer] = useState(false);
  const [menuDrawerVisible, setMenuDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 920);
  };
  useEffect(() => {
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
    className: "header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "header-left"
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      color: '#FF5F09'
    }
  }, "SNR\xA0"), /*#__PURE__*/React.createElement("h1", null, "CMT APP")), isMobile ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
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
    key: "members",
    icon: /*#__PURE__*/React.createElement(HomeOutlined, null),
    onClick: () => handleMenuClick("members")
  }, "Home"), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "calendar",
    icon: /*#__PURE__*/React.createElement(CalendarTwoTone, null),
    onClick: () => handleMenuClick("calendar")
  }, "Calendar"), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "todos",
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
  })), /*#__PURE__*/React.createElement(Menu.SubMenu, {
    key: "settings",
    title: "Settings"
  }, /*#__PURE__*/React.createElement(Menu.Item, {
    key: "view",
    onClick: () => {
      setDataView(dataView === "grid" ? "table" : "grid");
      setView(view === "Grid" ? "List" : "Grid");
      setMenuDrawerVisible(false);
    }
  }, view, " View"), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "dashboard"
  }, "Dashboard Off", " ", /*#__PURE__*/React.createElement(Switch, {
    checked: hideDashboard,
    onClick: () => {
      setHideDashboard(prev => !prev);
      setMenuDrawerVisible(false);
    }
  }))), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "logout",
    icon: /*#__PURE__*/React.createElement(LogoutOutlined, null),
    onClick: () => setMenuDrawerVisible(false)
  }, "Logout")))) : /*#__PURE__*/React.createElement("div", {
    className: "header-right"
  }, /*#__PURE__*/React.createElement("span", {
    className: "header-icons"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement(HomeOutlined, null),
    style: {
      backgroundColor: 'transparent',
      color: membersPage ? "#1677ff" : ""
    },
    onClick: () => {
      setOpenCalendarPage(false);
      setResourcePage(false);
      setMembersPage(true);
      setTodosPage(false);
    }
  }), /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement(CalendarTwoTone, {
      twoToneColor: openCalendarPage ? "" : "azure"
    }),
    style: {
      backgroundColor: 'transparent'
    },
    onClick: () => {
      setOpenCalendarPage(true);
      setResourcePage(false);
      setMembersPage(false);
      setTodosPage(false);
    }
  }), /*#__PURE__*/React.createElement(Button, {
    style: {
      fontSize: '20px',
      padding: '0px 0px',
      backgroundColor: 'transparent',
      color: todosPage ? "#1677ff" : ""
    },
    onClick: () => {
      setOpenCalendarPage(false);
      setResourcePage(false);
      setMembersPage(false);
      setTodosPage(true);
    }
  }, "Todos"), /*#__PURE__*/React.createElement(Badge, {
    count: commentBox.length,
    offset: [-10, 2]
  }, /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement(InboxOutlined, null),
    style: {
      backgroundColor: 'transparent'
    },
    onClick: () => setHandleInboxDrawer(true)
  }))), /*#__PURE__*/React.createElement("span", {
    hidden: openCalendarPage || todosPage || resourcePage
  }, "Status: ", dropDownList, " ", view + " View", /*#__PURE__*/React.createElement(Switch, {
    style: {
      margin: '0px 10px'
    },
    onClick: () => {
      setDataView(dataView === "grid" ? "table" : "grid");
      setView(view === "Grid" ? "List" : "Grid");
    }
  }), "Dashboard Off", /*#__PURE__*/React.createElement(Switch, {
    checked: hideDashboard,
    style: {
      margin: '0px 10px'
    },
    onClick: () => setHideDashboard(prev => !prev)
  })), /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement(LogoutOutlined, null),
    style: {
      margin: "15px",
      backgroundColor: 'inherit',
      color: 'white'
    }
  })), /*#__PURE__*/React.createElement(Drawer, {
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
  }, item.comment[item.comment.length - 1].message))))));
};
export default Header;