"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _antd = require("antd");
var _icons = require("@ant-design/icons");
var _react = _interopRequireWildcard(require("react"));
require("./Header.css");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
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
  const [view, setView] = (0, _react.useState)("Grid");
  const [handleInboxDrawer, setHandleInboxDrawer] = (0, _react.useState)(false);
  const [menuDrawerVisible, setMenuDrawerVisible] = (0, _react.useState)(false);
  const [isMobile, setIsMobile] = (0, _react.useState)(false);
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 920);
  };
  (0, _react.useEffect)(() => {
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
  return /*#__PURE__*/_react.default.createElement("header", {
    className: "header"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "header-left"
  }, /*#__PURE__*/_react.default.createElement("h1", {
    style: {
      color: '#FF5F09'
    }
  }, "SNR\xA0"), /*#__PURE__*/_react.default.createElement("h1", null, "CMT APP")), isMobile ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_antd.Button, {
    icon: /*#__PURE__*/_react.default.createElement(_icons.MenuOutlined, null),
    onClick: () => setMenuDrawerVisible(true),
    style: {
      marginRight: 10
    }
  }), /*#__PURE__*/_react.default.createElement(_antd.Drawer, {
    open: menuDrawerVisible,
    title: "Menu",
    width: "60%",
    onClose: () => setMenuDrawerVisible(false)
  }, /*#__PURE__*/_react.default.createElement(_antd.Menu, {
    mode: "vertical",
    theme: "light"
  }, /*#__PURE__*/_react.default.createElement(_antd.Menu.Item, {
    key: "members",
    icon: /*#__PURE__*/_react.default.createElement(_icons.HomeOutlined, null),
    onClick: () => handleMenuClick("members")
  }, "Home"), /*#__PURE__*/_react.default.createElement(_antd.Menu.Item, {
    key: "calendar",
    icon: /*#__PURE__*/_react.default.createElement(_icons.CalendarTwoTone, null),
    onClick: () => handleMenuClick("calendar")
  }, "Calendar"), /*#__PURE__*/_react.default.createElement(_antd.Menu.Item, {
    key: "todos",
    onClick: () => handleMenuClick("todos")
  }, "Todos"), /*#__PURE__*/_react.default.createElement(_antd.Menu.Item, {
    key: "inbox",
    icon: /*#__PURE__*/_react.default.createElement(_icons.InboxOutlined, null),
    onClick: () => {
      setHandleInboxDrawer(true);
      setMenuDrawerVisible(false);
    }
  }, "Inbox ", /*#__PURE__*/_react.default.createElement(_antd.Badge, {
    count: commentBox.length,
    offset: [10, -2]
  })), /*#__PURE__*/_react.default.createElement(_antd.Menu.SubMenu, {
    key: "settings",
    title: "Settings"
  }, /*#__PURE__*/_react.default.createElement(_antd.Menu.Item, {
    key: "view",
    onClick: () => {
      setDataView(dataView === "grid" ? "table" : "grid");
      setView(view === "Grid" ? "List" : "Grid");
      setMenuDrawerVisible(false);
    }
  }, view, " View"), /*#__PURE__*/_react.default.createElement(_antd.Menu.Item, {
    key: "dashboard"
  }, "Dashboard Off", " ", /*#__PURE__*/_react.default.createElement(_antd.Switch, {
    checked: hideDashboard,
    onClick: () => {
      setHideDashboard(prev => !prev);
      setMenuDrawerVisible(false);
    }
  }))), /*#__PURE__*/_react.default.createElement(_antd.Menu.Item, {
    key: "logout",
    icon: /*#__PURE__*/_react.default.createElement(_icons.LogoutOutlined, null),
    onClick: () => setMenuDrawerVisible(false)
  }, "Logout")))) : /*#__PURE__*/_react.default.createElement("div", {
    className: "header-right"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "header-icons"
  }, /*#__PURE__*/_react.default.createElement(_antd.Button, {
    icon: /*#__PURE__*/_react.default.createElement(_icons.HomeOutlined, null),
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
  }), /*#__PURE__*/_react.default.createElement(_antd.Button, {
    icon: /*#__PURE__*/_react.default.createElement(_icons.CalendarTwoTone, {
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
  }), /*#__PURE__*/_react.default.createElement(_antd.Button, {
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
  }, "Todos"), /*#__PURE__*/_react.default.createElement(_antd.Badge, {
    count: commentBox.length,
    offset: [-10, 2]
  }, /*#__PURE__*/_react.default.createElement(_antd.Button, {
    icon: /*#__PURE__*/_react.default.createElement(_icons.InboxOutlined, null),
    style: {
      backgroundColor: 'transparent'
    },
    onClick: () => setHandleInboxDrawer(true)
  }))), /*#__PURE__*/_react.default.createElement("span", {
    hidden: openCalendarPage || todosPage || resourcePage
  }, "Status: ", dropDownList, " ", view + " View", /*#__PURE__*/_react.default.createElement(_antd.Switch, {
    style: {
      margin: '0px 10px'
    },
    onClick: () => {
      setDataView(dataView === "grid" ? "table" : "grid");
      setView(view === "Grid" ? "List" : "Grid");
    }
  }), "Dashboard Off", /*#__PURE__*/_react.default.createElement(_antd.Switch, {
    checked: hideDashboard,
    style: {
      margin: '0px 10px'
    },
    onClick: () => setHideDashboard(prev => !prev)
  })), /*#__PURE__*/_react.default.createElement(_antd.Button, {
    icon: /*#__PURE__*/_react.default.createElement(_icons.LogoutOutlined, null),
    style: {
      margin: "15px",
      backgroundColor: 'inherit',
      color: 'white'
    }
  })), /*#__PURE__*/_react.default.createElement(_antd.Drawer, {
    open: handleInboxDrawer,
    title: "Inbox",
    width: isMobile ? "90%" : "40%",
    onClose: () => setHandleInboxDrawer(false)
  }, commentBox.length === 0 ? /*#__PURE__*/_react.default.createElement("center", null, /*#__PURE__*/_react.default.createElement("h2", {
    style: {
      color: '#9999'
    }
  }, "Inbox is Empty..")) : commentBox.map((item, index) => /*#__PURE__*/_react.default.createElement(_antd.Space, {
    key: index,
    direction: "vertical",
    size: "middle",
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/_react.default.createElement(_antd.Badge.Ribbon, {
    text: item.comment[item.comment.length - 1].author,
    color: item.color
  }, /*#__PURE__*/_react.default.createElement(_antd.Card, {
    title: item.customerName,
    size: "small"
  }, item.comment[item.comment.length - 1].message))))));
};
var _default = exports.default = Header;