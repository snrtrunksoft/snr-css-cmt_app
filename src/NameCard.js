import React, { useState } from "react";
import "./NameCard.css";
import { Badge, Button, Card, Checkbox, Col, Drawer,Grid, Row, Space } from "antd";
import maleAvatar from "./assets/male_avatar.jpg";
import femaleAvatar from "./assets/female_avatar.jpg";
import TextArea from "antd/es/input/TextArea";
import { MEMBERS_API, RESOURCES_API } from "./properties/EndPointProperties";
import PunchCardsPage  from "./PunchCardsPage";
import { SwapOutlined } from "@ant-design/icons";

const NameCard = ({ 
    customerId, 
    customerName,
    phoneNumber, 
    address, 
    status, 
    comments,
    subscriptions,
    setDuplicateData, 
    commentBox, 
    setCommentBox,
    }) => {
    const [ isHovered, setIsHovered ] = useState(false);
    const [ newComment, setNewComment ] = useState("");
    const [ nameCardDrawer, setNameCardDrawer ] = useState(false);
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    const getDrawerWidth = () => {
        if (screens.xl) return 600;
        if (screens.lg) return 550;
        if (screens.md) return 500;
        if (screens.sm) return 300;
        return '100%';
    };
    
    const addressKeys = Object.keys(address[0]);
    // console.log(addressKeys);
    const handleSend = () => {
        if(newComment){
            const commentBody = [...comments, {
                "commentId" : parseInt(comments[comments.length - 1].commentId) + 1 || 1,
                "author" : customerName,
                "message" : newComment
            }]
            const updatedRecord = {
                "customerName" : customerName,
                "status" : status,
                "address" : address,
                "subscriptions" : subscriptions,
                "phoneNumber" : phoneNumber,
                "comments" : commentBody
            }
            console.log("updatedRecord:",updatedRecord);
            const uploadComment = async () => {
                try {
                    const response = await fetch(MEMBERS_API + customerId, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedRecord)
                    });
                    const data = await response.json();
                    console.log("successfully added the comment:", data);
                } catch(error) {
                    console.log("unbale to add Comment:",error);
                }
            }
            uploadComment();

            setDuplicateData(prevData =>
                prevData.map(prev =>
                    prev.id === customerId ? {
                        ...prev,
                        comments: [...prev.comments, {
                            commentId : parseInt(comments[comments.length - 1]["commentId"]) + 1 || 1,
                            message: newComment,
                            author: customerName,
                        }]
                    } : prev)
            );
            const existingData = commentBox.findIndex((person) => person.customerName === customerName);

            if(existingData !== -1){
                setCommentBox(prevComments => 
                    prevComments.map((prev, index) =>
                        index === existingData
                            ? { ...prev, comment: [...prev.comment, {
                                commentId: parseInt(comments[comments.length - 1]["commentId"]) + 1 || 1,
                                message: newComment,
                                author: customerName,
                            }] }
                            : prev
                    )
                );
            } else {
                setCommentBox(prevComments => [
                    ...prevComments,
                    { customerName,color, comment: [{
                        commentId:parseInt(comments[comments.length - 1]["commentId"]) + 1 || 1,
                        message:newComment,
                        author:customerName
                    }] }
                ]);
            }
        }
        setNewComment("");
    }
    const handleClear = () =>{
        setNewComment("");
    }
    let color = "red";
    if(status === "Complete"){
        color = "lightgreen";
    }
    if(status === "New"){
        color = "pink";
    }
    if(status === "In_Progress"){
        color = "lightblue";
    }
    if(status === "Cancelled"){
        color = "red";
    }
    return(
        <div>
            <div 
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="nameCard"
                onClick={()=>setNameCardDrawer(true)}
                style={{
                    boxShadow: isHovered ? `0px 8px 20px ${color}` : `0px 0px 6px ${color}`,
                    transition:'box-shadow 0.3s ease'
                    }}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <h3 style={{
                    width: '100%',overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace:'nowrap'
                    }}>Name : { customerName }</h3>
                    <div style={{width:'30px',height:'15px',backgroundColor:`${color}`,}}></div>
                </div>
                <p style={{
                    width: '100%',overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                    }}>Phone : { phoneNumber }</p>
                {address.length > 0 && (
                    <p style={{
                        width: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        Address: {address.map(prev => prev.city).join(', ')}, {address.map(prev => prev.state).join(', ')}, {address.map(prev => prev.country).join(', ')}.
                    </p>
                )}
                <p style={{
                        width: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>Status : { status }</p>
            </div>
            <Drawer
                open={nameCardDrawer}
                style={{backgroundColor:'whitesmoke'}}
                title={null}
                // closable={false}
                width= {getDrawerWidth()}
                onClose={()=>{setNameCardDrawer(false);setNewComment("")}}
                >
                <div className="nameDrawer">
                    <Row className="personalNameCard">
                        <Col style={{padding:'5px',width:'40%'}}>
                            <img src={maleAvatar} style={{width:'100%',height:'95%'}}/>
                        </Col>
                        <Col style={{margin:'5px',width:'50%'}}>
                            <h2> {customerName} </h2>
                            <h3 style={{marginTop:'-10px'}}>{ phoneNumber }</h3>
                            <h3 style={{
                                    borderRadius:'5px',
                                    backgroundColor:'lightgrey',
                                    padding:'5px',width:'100%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace:'nowrap'}}>
                                    Address : { addressKeys.map((item,index) => 
                                        <span key={index}>
                                            {address[0][item]}{ item !== "country" ? ", " : "." }
                                            {(item === "city") || (item === "state") ? "" : (<br/>) }
                                        </span>)}
                            </h3>
                        </Col>
                    </Row>
                        <PunchCardsPage
                            customerId={customerId}
                            customerName={customerName}
                            setNewComment={setNewComment}
                            handleSend={handleSend}
                            subscriptions={subscriptions}
                            color={color} />
                    <h3>Comments :</h3>
                    <Row style={{display:'flex',flexDirection:'column',marginBottom:'20px'}}>
                        {comments.map((comment,index) =>(
                            <Space 
                                key={index}
                                direction="vertical"
                                size="middle"
                                style={{
                                    width: '100%'}}>
                                    <Badge.Ribbon text={comment["author"]} color={color}>
                                        <Card size="small">{comment["message"]}</Card>
                                    </Badge.Ribbon>
                            </Space>
                        ))}
                    </Row>
                    <Row>
                        <TextArea
                            placeholder="Enter your Comments"
                            value={newComment}
                            style={{fontSize:'18px'}}
                            onChange={(e) => setNewComment(e.target.value)}
                        ></TextArea>
                        <Row style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%',padding:'10px'}}>
                            <Button onClick={()=>handleClear()}>Clear</Button>
                            <Button type="primary" onClick={() => handleSend()}>send</Button>
                        </Row>
                    </Row>
                </div>
            </Drawer>
        </div>
    );
};

export default NameCard;
