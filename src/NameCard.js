import React, { useState } from "react";
import "./NameCard.css";
import { Badge, Button, Card, Col, Drawer, Row, Space } from "antd";
import maleAvatar from "./assets/male_avatar.jpg";
import femaleAvatar from "./assets/female_avatar.jpg";
import TextArea from "antd/es/input/TextArea";
import { CalendarTwoTone } from "@ant-design/icons";

const NameCard = ({ 
    customerId, 
    customerName,
    phoneNumber, 
    address, 
    status, 
    comments,
    setDuplicateData, 
    commentBox, 
    setCommentBox,
    }) => {
    const [ isHovered, setIsHovered ] = useState(false);
    const [ newComment, setNewComment ] = useState("");
    const [ nameCardDrawer, setNameCardDrawer ] = useState(false);
    const [ punchCards, setPunchCards ] = useState([1,2,3,4,5,6]);
    const addNewPunchCArd = () =>{
        setPunchCards(prevData => [...prevData,parseInt(prevData.length + 1)]);
    };

    const addressKeys = Object.keys(address[0]);
    // console.log(addressKeys);
    const handleSend = () => {
        if(newComment){
            setDuplicateData(prevData =>
                prevData.map(prev =>
                    prev.customerId === customerId ? {
                        ...prev,
                        comments: [...prev.comments, { 
                            commentID : parseInt(comments[comments.length - 1]["commentId"]) + 1,
                            message:newComment,
                            author:"TBD",
                        }]
                    } : prev)
            );
            const existingData = commentBox.findIndex((person) => person.customerName === customerName);

            if(existingData !== -1){
                setCommentBox(prevComments => 
                    prevComments.map((prev, index) =>
                        index === existingData
                            ? { ...prev, comment: [...prev.comment, {
                                commentId:prev.comment.length + 1,
                                message:newComment,
                                author:'TBD',
                            }] }
                            : prev
                    )
                );
            } else {
                setCommentBox(prevComments => [
                    ...prevComments,
                    { customerName,color, comment: [{commentId:'1',message:newComment,author:'TBD'}] }
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
                    width:'200px',overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace:'nowrap'
                    }}>Name : { customerName }</h3>
                    <div style={{width:'30px',height:'15px',backgroundColor:`${color}`,}}></div>
                </div>
                <p>Phone : { phoneNumber }</p>
                 <p style={{
                    width:'200px',overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace:'nowrap'
                    }}>Address : { address.map(prev => prev.city) }, { address.map(prev => prev.state) }, { address.map(prev => prev.country) }.</p>
                <p>Status : { status }</p>
            </div>
            <Drawer
                open={nameCardDrawer}
                style={{backgroundColor:'whitesmoke'}}
                title = <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}><h2>{customerName} Details</h2><Button onClick={()=>{""}}><CalendarTwoTone/></Button></div>
                width="40%"
                onClose={()=>{setNameCardDrawer(false);setNewComment("")}}
                >
                <div className="nameDrawer">
                    <div className="personalNameCard">
                        <Row >
                            <Col style={{width:'35%',padding:'10px'}}>
                                <img src={maleAvatar} height={180} style={{borderRadius:"10px"}}/>
                            </Col>
                            <Col style={{width:'65%'}}>
                                <h2> {customerName} </h2>
                                <h3 style={{marginTop:'-10px'}}>{ phoneNumber }</h3>
                                <h3 style={{marginRight:"10px",borderRadius:'5px',backgroundColor:'lightgrey',padding:'5px'}}> Address : { addressKeys.map((item,index) => 
                                    <span key={index}>
                                        {address[0][item]}{ item !== "country" ? ", " : "." }
                                        {(item === "city") || (item === "state") ? "" : (<br/>) }
                                    </span>)}
                                </h3>
                            </Col>
                        </Row>
                    </div>
                    <h2>Punch cards:</h2>
                    <div className="punchCards" style={{backgroundColor:`${color}`}}>
                        {punchCards.map((card,index) => 
                        <div key={index} className="individualCards">
                        {card}
                        </div>)}
                        <span className="individualCards" onClick={()=>addNewPunchCArd()}>{"+"}</span>
                    </div>
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
