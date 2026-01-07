import { Badge, Button, Menu, Card, Drawer, Space, Switch, Modal, Row, Col } from "antd";
import { MenuOutlined, InboxOutlined, LogoutOutlined } from "@ant-design/icons";
import React, { useState, useEffect, useCallback } from "react";
import "./Header.css";
import { fetchAuthSession, signOut } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { IoIosGlobe } from "react-icons/io";
import { LuCalendar, LuListTodo  } from "react-icons/lu";
import { HEADER_TITLE } from "./properties/properties";
import image from "./assets/logosnr.png";

const Header = ({
  tenantConfig,
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
  
  const [handleInboxDrawer, setHandleInboxDrawer] = useState(false);
  const [menuDrawerVisible, setMenuDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const navigate = useNavigate();

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 1030);
  };

  const handleLogout = async () => {
    try {
      setOpenConfirmationModal(false); // Close modal first
      try {
        localStorage.removeItem('entityId');
      } catch (_) {
        // ignore storage errors
      }
      await signOut();
      console.log("logout successful");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if signOut fails, ensure entityId is cleared
      try { localStorage.removeItem('entityId'); } catch (_) {}
    } finally {
      navigate('/login');
    }
  };

    useEffect(() => {
      const checkLogin = async () => {
        try {
          const session = await fetchAuthSession();
          if (!session.tokens?.idToken || !session.tokens?.accessToken) {
            throw new Error("No valid session tokens");
          }
          // Optionally log/inspect session
          // console.log("TenantId:", session.tokens.idToken.payload.tenantId);
        } catch (e) {
          console.log("No valid session, redirecting to login");
          navigate("/login");
        }
      };

      checkLogin();
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, [navigate]);

  const handleMenuClick = (key) => {
    setOpenCalendarPage(false);
    setResourcePage(false);
    setMembersPage(false);
    setTodosPage(false);
    setMenuDrawerVisible(false);

    if (key === "members") setMembersPage(true);
    if (key === "calendar") setOpenCalendarPage(true);
    if (key === "todos") setTodosPage(true);
  };

  function leftTitleWidth() {
    const width = window.innerWidth;
    if (width <= 400) return '140px';
    if (width <= 600) return '200px';
    if (width <= 900) return '300px';
    return 'auto';
  }

  return (
    <header className="inventory-header" role="banner">
      <div className="inventory-header-left-wrapper">
        <img src={tenantConfig?.logoPath || image} alt="logosnr" className="app-logo" />
        <div
          className="inventory-header-left"
          title={tenantConfig?.headerTitle || HEADER_TITLE}
          style={{ maxWidth: leftTitleWidth() }}
        >
          {tenantConfig?.headerTitle || HEADER_TITLE}
        </div>
      </div>

      {isMobile ? (
        <>
          <Button
            icon={<MenuOutlined />}
            onClick={() => setMenuDrawerVisible(true)}
            className="mobile-icon-btn"
            style={{marginRight:10}}
            size="middle"
          />
          <Drawer
            open={menuDrawerVisible}
            title="Menu"
            width="70%"
            onClose={() => setMenuDrawerVisible(false)}
          >
            <Menu mode="vertical" theme="light">
              <Menu.Item key="Home" icon={<IoIosGlobe />} onClick={() => navigate('/')}>
                Home
              </Menu.Item>
              <Menu.Item key="members" icon={<FaUser />} onClick={() => handleMenuClick("members")}>
                Members
              </Menu.Item>
              <Menu.Item key="calendar" icon={<LuCalendar />} onClick={() => handleMenuClick("calendar")}>
                Calendar
              </Menu.Item>
              <Menu.Item key="todos" icon={<LuListTodo />} onClick={() => handleMenuClick("todos")}>
                Todos
              </Menu.Item>
              <Menu.Item key="inbox" icon={<InboxOutlined />} onClick={() => { setHandleInboxDrawer(true); setMenuDrawerVisible(false); }}>
                Inbox <Badge count={commentBox.length} offset={[10, -2]} />
              </Menu.Item>
              
             
              <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={() => {setMenuDrawerVisible(false);setOpenConfirmationModal(true);}}>
                Logout
              </Menu.Item>
            </Menu>
          </Drawer>
        </>
      ) : (
        <>
        <Menu
          theme="dark"
          mode="horizontal"
          className="app-menu"
          style={{ backgroundColor: 'transparent' }}
        >
          <Menu.Item
            key="Home"
            icon={<IoIosGlobe />}
            onClick={() => navigate("/")}
            style={{ backgroundColor: 'transparent' }}
          >
            Home
          </Menu.Item>

          <Menu.Item
            key="members"
            icon={<FaUser />}
            onClick={() => { setOpenCalendarPage(false); setResourcePage(false); setMembersPage(true); setTodosPage(false); }}
            style={{
              backgroundColor: 'transparent',
              color: membersPage ? '#1677ff' : '',
            }}
          >
            Members
          </Menu.Item>

          <Menu.Item
            key="calendar"
            icon={<LuCalendar />}
            onClick={() => { setOpenCalendarPage(true); setResourcePage(false); setMembersPage(false); setTodosPage(false); }}
            style={{
              backgroundColor: 'transparent',
              color: openCalendarPage ? '#1677ff' : '',
            }}
          >
            Calendar
          </Menu.Item>

          <Menu.Item
            key="todos"
            icon={<LuListTodo />}
            onClick={() => { setOpenCalendarPage(false); setResourcePage(false); setMembersPage(false); setTodosPage(true); }}
            style={{
              backgroundColor: 'transparent',
              color: todosPage ? '#1677ff' : '',
            }}
          >
            Todos
          </Menu.Item>

          <Badge count={commentBox.length} offset={[0, 0]}>
            <Menu.Item
              key="inbox"
              icon={<InboxOutlined />}
              onClick={() => setHandleInboxDrawer(true)}
              style={{ backgroundColor: 'transparent' }}
            >
              Inbox
            </Menu.Item>
          </Badge>
        </Menu>
        <Button onClick={() => setOpenConfirmationModal(true)} style={{ marginLeft: '10px', marginRight: '20px' }}>Logout</Button>
        </>
      )}

      <Drawer
        open={handleInboxDrawer}
        title="Inbox"
        width={isMobile ? "90%" : "40%"}
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
                  <div style={{
                        position: 'absolute',
                        bottom: '4px',
                        right: '8px',
                        fontSize: '11px',
                        color: '#888'
                    }}>
                        {item.comment[item.comment.length - 1].time}
                    </div>
                </Card>
              </Badge.Ribbon>
            </Space>
          ))
        )}
      </Drawer>
      <Modal
        open={openConfirmationModal}
        footer={null}
        onCancel={() => setOpenConfirmationModal(false)}>
        <Row style={{display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
          <Col><h3>Are you sure you want to logout..!</h3></Col>
          <Col>
          <Button type="primary" onClick={() => handleLogout()}>Confirm</Button> &nbsp;&nbsp;
          <Button onClick={() => setOpenConfirmationModal(false)}>Cancel</Button>
          </Col>
        </Row>
      </Modal>
    </header>
  );
};

export default Header;
