import { Badge, Button, Card, Drawer, Modal, Space, Switch } from "antd";
import { CalendarTwoTone, InboxOutlined, LogoutOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import CalendarPage from "./CalendarPage";
import "./Header.css";

const Header = ({ dropDownList, dataView, setDataView, setHideDashboard, hideDashboard, commentBox, }) =>{

    const [ view, setView ] = useState("Grid");
    const [ handleInboxDrawer, setHandleInboxDrawer ] = useState(false);
    const [ openCalendarModal, setOpenCalendarModal ] = useState(false);
    
    return(
        <header className="header">
            <div className="header-left">
                <h1 style={{color:'#FF5F09'}}>SNR&nbsp;</h1>
                <h1>CMT APP</h1>
            </div>
            <div className='header-right'>
                <CalendarTwoTone 
                    twoToneColor="azure"
                    onClick={()=>setOpenCalendarModal(true)}
                    style={{fontSize:'32px',margin:'15px'}} 
                    />
                <div style={{padding:'0px 20px'}}>
                    <Badge count={commentBox.length}>
                        <Button icon={<InboxOutlined/>} style={{fontSize:'20px',backgroundColor:'inherit',color:'white'}} onClick={() => setHandleInboxDrawer(true)}></Button>
                    </Badge>
                </div>
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
                {commentBox.length === 0 ? (<center><h2 style={{color:'#9999'}}>Inbox is Empty..</h2></center>):commentBox.map((item) => (
                <Space
                    direction="vertical"
                    size="middle"
                    style={{
                        width: '100%',
                    }}
                    >
                    <Badge.Ribbon text={item.Name} color={item.color}>
                        <Card title={item.Name} size="small">
                        {item.comment[item.comment.length - 1]}
                        </Card>
                    </Badge.Ribbon>
                </Space>
            ))}
            </Drawer>
            <Modal 
                open={openCalendarModal}
                onClose={()=>setOpenCalendarModal(false)}
                onCancel={()=>setOpenCalendarModal(false)}
                footer={null}
                >
                <CalendarPage/>
            </Modal>
        </header>
    );
};

export default Header;