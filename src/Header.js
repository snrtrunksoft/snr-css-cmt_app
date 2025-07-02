import { Badge, Button, Menu, Card, Drawer, Space, Switch, Modal, Row, Col } from "antd";
import { MenuOutlined, InboxOutlined, LogoutOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import "./Header.css";
import { getCurrentUser, signOut } from 'aws-amplify/auth'; // ✅ Auth import
import { useNavigate } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { IoIosGlobe } from "react-icons/io";
import { LuCalendar, LuListTodo  } from "react-icons/lu";

const Header = ({
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
          } catch {
            // setIsLoggedIn(false);
          }
        };
        checkLogin();
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  return (
    <header className="CMTheader">
      <div className="CMTheader-left">
        <h1 style={{ color: '#FF5F09' }}>SNR&nbsp;</h1>
        <h1>CMT APP</h1>
      </div>

      {isMobile ? (
        <>
          <Button
            icon={<MenuOutlined />}
            onClick={() => setMenuDrawerVisible(true)}
            style={{ marginRight: 10 }}
          />
          <Drawer
            open={menuDrawerVisible}
            title="Menu"
            width="60%"
            onClose={() => setMenuDrawerVisible(false)}
          >
            <Menu mode="vertical" theme="light">
              <Menu.Item key="Website" icon={<IoIosGlobe />} onClick={() => navigate('/')}>
                WebSite
              </Menu.Item>
              <Menu.Item key="members" icon={<FaUser />} onClick={() => handleMenuClick("members")}>
                Home
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
        <div className="CMTheader-right" >
          <span className="CMTheader-icons">
            <span className="icon-with-label">
              <Button icon={<IoIosGlobe />} onClick={() => navigate("/")} style={{backgroundColor: 'transparent'}}></Button>
              <span className="icon-label">WebSite</span>
            </span>
            <span className="icon-with-label">
              <Button icon={<FaUser />} style={{ backgroundColor: 'transparent', color: membersPage ? "#1677ff" : "" }} onClick={() => { setOpenCalendarPage(false); setResourcePage(false); setMembersPage(true); setTodosPage(false); }} />
              <span className="icon-label">Members</span>
            </span>

            <span className="icon-with-label">
              <Button icon={<LuCalendar />} style={{ backgroundColor: 'transparent', color: openCalendarPage ? "#1677ff" : "" }} onClick={() => { setOpenCalendarPage(true); setResourcePage(false); setMembersPage(false); setTodosPage(false); }} />
              <span className="icon-label">Calendar</span>
            </span>

            <div className="icon-with-label">
              <Button icon={<LuListTodo />} style={{ fontSize: '20px', padding: '0px', backgroundColor: 'transparent', color: todosPage ? "#1677ff" : "" }} onClick={() => { setOpenCalendarPage(false); setResourcePage(false); setMembersPage(false); setTodosPage(true); }}></Button>
              <span className="icon-label">Todos</span>
            </div>

            <div className="icon-with-label">
              <Badge count={commentBox.length} offset={[-10, 2]}>
                <Button icon={<InboxOutlined />} style={{ backgroundColor: 'transparent' }} onClick={() => setHandleInboxDrawer(true)} />
              </Badge>
              <span className="icon-label">Inbox</span>
            </div>
            <div className="icon-with-label">
              <Button icon={<LogoutOutlined />} onClick={() => setOpenConfirmationModal(true)} style={{ backgroundColor: 'inherit', color: 'white' }} />
              <span className="icon-label">Logout</span>
            </div>
          </span>
          
        </div>
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
