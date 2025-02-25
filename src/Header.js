import { Badge, Button, Card, Drawer, Space, Switch } from "antd";
import { CalendarTwoTone, HomeOutlined, InboxOutlined, LogoutOutlined } from "@ant-design/icons";
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
    setOpenCalendarPage,
    setMembersPage,
    setResourcePage,
    setTodosPage,
    }) => {

    const [ view, setView ] = useState("Grid");
    const [ handleInboxDrawer, setHandleInboxDrawer ] = useState(false);
    
    
    return(
        <header className="header">
            <div className="header-left">
                <h1 style={{color:'#FF5F09'}}>SNR&nbsp;</h1>
                <h1>CMT APP</h1>
            </div>
            <div className='header-right'>
                <span className="header-icons">
                    <Button icon={<HomeOutlined />} style={{backgroundColor:'transparent',color: membersPage ? "#1677ff":""}} onClick={() => {setOpenCalendarPage(false);setResourcePage(false);setMembersPage(true);setTodosPage(false);}}></Button>
                    <Button icon={<CalendarTwoTone twoToneColor={openCalendarPage ? "" : "azure"}/>} style={{backgroundColor:'transparent'}} onClick={()=>{setOpenCalendarPage(true);setResourcePage(false);setMembersPage(false);setTodosPage(false);}}></Button>
                    <Button style={{fontSize:'20px',padding:'0px 0px',backgroundColor:'transparent',color: todosPage ? "#1677ff":""}} onClick={() => {setOpenCalendarPage(false);setResourcePage(false);setMembersPage(false);setTodosPage(true);}}>Todos</Button>
                    <Badge count={commentBox.length} offset={[-10,2]}>
                        <Button icon={<InboxOutlined/>}  style={{backgroundColor:'transparent',}} onClick={() => setHandleInboxDrawer(true)}></Button>
                    </Badge>
                </span>
                Status: {dropDownList}
                {view +" View"}
                <Switch
                    style={{margin:'0px 10px'}}
                    onClick={()=>{ 
                        dataView === "grid" ? setDataView("table") : setDataView("grid");
                        view === "Grid" ? setView("List") : setView("Grid")}}
                    >
                </Switch>
                Dashboard Off
                <Switch
                    checked={hideDashboard}
                    style={{margin:'0px 10px'}} 
                    onClick={() => setHideDashboard((prev) => !prev)}
                    >
                </Switch>
                <Button icon={<LogoutOutlined/>} style={{margin:"15px",backgroundColor:'inherit',color:'white'}}></Button>
            </div>
            <Drawer
                open={handleInboxDrawer}
                title="Inbox"
                width="40%"
                onClose={() => setHandleInboxDrawer(false)}
                >
                {commentBox.length === 0 ? (<center><h2 style={{color:'#9999'}}>Inbox is Empty..</h2></center>):commentBox.map((item,index) => (
                <Space
                    key={index}
                    direction="vertical"
                    size="middle"
                    style={{
                        width: '100%',
                    }}
                    >
                    <Badge.Ribbon text={item.comment[item.comment.length - 1].author} color={item.color}>
                        <Card title={item.customerName} size="small">
                        {item.comment[item.comment.length - 1].message}
                        </Card>
                    </Badge.Ribbon>
                </Space>
            ))}
            </Drawer>
        </header>
    );
};

export default Header;
