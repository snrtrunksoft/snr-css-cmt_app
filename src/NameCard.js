import React, { useState } from "react";
import "./NameCard.css";
import { Badge, Button, Card, Drawer, Row, Space } from "antd";
import TextArea from "antd/es/input/TextArea";

const NameCard = ({ Id, Name, Phone, Age, address, Status, comments, setDuplicateData, commentBox, setCommentBox, }) => {
    const [ isHovered, setIsHovered ] = useState(false);
    const [ newComment, setNewComment ] = useState("");
    const [ nameCardDrawer, setNameCardDrawer ] = useState(false);
    const addressKeys = Object.keys(address);
    // console.log(addressKeys);
    const handleSend = () => {
        if(newComment){
            setDuplicateData(prevData =>
                prevData.map(prev =>
                    prev.id === Id ? {
                        ...prev,
                        Comments: [...prev.Comments, { 
                            commentID : parseInt(comments[comments.length - 1]["commentId"]) + 1,
                            commentMessage:newComment,
                            author:"TBD",
                        }]
                    } : prev)
            );
            const existingData = commentBox.findIndex((person) => person.Name === Name);

            if(existingData !== -1){
                setCommentBox(prevComments => 
                    prevComments.map((prev, index) =>
                        index === existingData
                            ? { ...prev, comment: [...prev.comment, {
                                commentId:prev.comment.length + 1,
                                commentMessage:newComment,
                                author:'TBD',
                            }] }
                            : prev
                    )
                );
            } else {
                setCommentBox(prevComments => [
                    ...prevComments,
                    { Name,color, comment: [{commentId:'1',commentMessage:newComment,author:'TBD'}] }
                ]);
            }
        }
        setNewComment("");
    }
    const handleClear = () =>{
        setNewComment("");
    }
    let color = "red";
    if(Status === "Complete"){
        color = "lightgreen";
    }
    if(Status === "New"){
        color = "pink";
    }
    if(Status === "In-progress"){
        color = "lightblue";
    }
    if(Status === "Cancelled"){
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
                    <h3>Name : { Name }</h3>
                    <div style={{width:'30px',height:'15px',backgroundColor:`${color}`,}}></div>
                </div>
                <p>Phone : { Phone }</p>
                <p>Address : { address["city"] }, { address["state"] }, { address['Country'] }.</p>
                <p>Status : { Status }</p>
            </div>
            <Drawer
                open={nameCardDrawer}
                title = <h2>{Name} Details</h2>
                width="40%"
                onClose={()=>{setNameCardDrawer(false);setNewComment("")}}
                >
                <div className="nameDrawer">
                    <span style={{display:'flex',alignItems:'center',justifyContent:'space-between',margin:'0',height:'30px'}}>
                        <h2>Name : { Name }, { Age }</h2>
                        <h2 style={{backgroundColor:`${color}`,borderRadius:'5px',padding:'0px 5px'}}>{Status}</h2>
                    </span>
                    <h3>Phone : { Phone }</h3>
                    <h3 style={{marginBottom:'-10px'}}>Address : </h3> <h3> { addressKeys.map((item,index) => <span key={index}>{address[item]}{ item !== "Country" ? "," : "." }<br/></span>)} </h3>
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
                                        <Card size="small">{comment["commentMessage"]}</Card>
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