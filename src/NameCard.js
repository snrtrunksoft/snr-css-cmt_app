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
                        Comments: [...prev.Comments,newComment]
                    } : prev)
            );
            const existingData = commentBox.findIndex((person) => person.Name === Name);

            if(existingData !== -1){
                setCommentBox(prevComments => 
                    prevComments.map((prev, index) =>
                        index === existingData
                            ? { ...prev, comment: [...prev.comment, newComment] }
                            : prev
                    )
                );
            } else {
                setCommentBox(prevComments => [
                    ...prevComments,
                    { Name,color, comment: [newComment] }
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
                    <h2>Name : {Name}</h2>
                    <h3>Phone : { Phone }</h3>
                    <h3>Age : { Age }</h3>
                    <h3>Address : { addressKeys.map((item) => address[item] + ( item !== "Country" ? ", " :"."))}</h3>
                    <h3>Status : { Status }</h3>
                    <h3>Comments :</h3>
                    <Row style={{display:'flex',flexDirection:'column',marginBottom:'20px'}}>
                        {comments.map((comment) =>(
                            <Space 
                                direction="vertical"
                                size="middle"
                                style={{
                                    width: '100%'}}>
                                    <Badge.Ribbon text={Name} color={color}>
                                        <Card size="small">{comment}</Card>
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