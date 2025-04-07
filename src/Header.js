import { Badge, Button, Card, Drawer, Menu, Space, Switch } from "antd";
import { CalendarTwoTone, HomeOutlined, InboxOutlined, LogoutOutlined, MenuOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import "./Header.css";

const Header = ({ 
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
    setTodosPage,
}) => {
    const [view, setView] = useState("Grid");
    const [handleInboxDrawer, setHandleInboxDrawer] = useState(false);
    const [menuDrawerVisible, setMenuDrawerVisible] = useState(false);

    const handleMenuClick = (key) => {
        setOpenCalendarPage(false);
        setResourcePage(false);
        setMembersPage(false);
        setTodosPage(false);
        setMenuDrawerVisible(false); // Close the menu drawer when an item is clicked

        if (key === "members") setMembersPage(true);
        if (key === "calendar") setOpenCalendarPage(true);
        if (key === "todos") setTodosPage(true);
    };

    return (
        <header className="header">
            <div className="header-left">
                <h1 style={{ color: '#FF5F09' }}>SNR&nbsp;</h1>
                <h1>CMT APP</h1>
            </div>
            <Button icon={<MenuOutlined />} onClick={() => setMenuDrawerVisible(true)} style={{ marginRight: 10 }} />
            <Drawer
                open={menuDrawerVisible}
                title="Menu"
                width="40%"
                onClose={() => setMenuDrawerVisible(false)}
            >
                <Menu mode="vertical" theme="light">
                    <Menu.Item key="members" icon={<HomeOutlined />} onClick={() => handleMenuClick("members")}>
                        Home
                    </Menu.Item>
                    <Menu.Item key="calendar" icon={<CalendarTwoTone />} onClick={() => handleMenuClick("calendar")}>
                        Calendar
                    </Menu.Item>
                    <Menu.Item key="todos" onClick={() => handleMenuClick("todos")}>
                        Todos
                    </Menu.Item>
                    <Menu.Item key="inbox" icon={<InboxOutlined />} onClick={() => { setHandleInboxDrawer(true); setMenuDrawerVisible(false); }}>
                        Inbox <Badge count={commentBox.length} offset={[10, -2]} />
                    </Menu.Item>
                    <Menu.SubMenu key="settings" title="Settings">
                        <Menu.Item key="view" onClick={() => {
                            setDataView(dataView === "grid" ? "table" : "grid");
                            setView(view === "Grid" ? "List" : "Grid");
                            setMenuDrawerVisible(false);
                        }}>
                            {view} View
                        </Menu.Item>
                        <Menu.Item key="dashboard">
                            Dashboard Off <Switch checked={hideDashboard} onClick={() => { setHideDashboard((prev) => !prev); setMenuDrawerVisible(false); }} />
                        </Menu.Item>
                    </Menu.SubMenu>
                    <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={() => setMenuDrawerVisible(false)}>
                        Logout
                    </Menu.Item>
                </Menu>
            </Drawer>
            <Drawer
                open={handleInboxDrawer}
                title="Inbox"
                width="40%"
                onClose={() => setHandleInboxDrawer(false)}
            >
                {commentBox.length === 0 ? (
                    <center><h2 style={{ color: '#9999' }}>Inbox is Empty..</h2></center>
                ) : (
                    commentBox.map((item, index) => (
                        <Space
                            key={index}
                            direction="vertical"
                            size="middle"
                            style={{ width: '100%' }}
                        >
                            <Badge.Ribbon text={item.comment[item.comment.length - 1].author} color={item.color}>
                                <Card title={item.customerName} size="small">
                                    {item.comment[item.comment.length - 1].message}
                                </Card>
                            </Badge.Ribbon>
                        </Space>
                    ))
                )}
            </Drawer>
        </header>
    );
};

export default Header;
