import React, { useState } from "react";
import "./NameCard.css";
import { Badge, Button, Card, Checkbox, Col, Drawer, Row, Space } from "antd";
import maleAvatar from "./assets/male_avatar.jpg";
import femaleAvatar from "./assets/female_avatar.jpg";
import TextArea from "antd/es/input/TextArea";

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
    const [ punchCards, setPunchCards ] = useState([
        {
            "id": "001",
            "status": "Complete",
            "noOfServicesLeft": "0",
            "noOfServicesCompleted": "10",
            "totalNumberOfServices": "10",
            "purchasedDate": "Mar-02-2023",
            "completedDate": "Feb-20-2024"
 
        },
        {
            "id": "002",
            "status": "Complete",
            "noOfServicesLeft": "0",
            "noOfServicesCompleted": "10",
            "totalNumberOfServices": "10",
            "purchasedDate": "Mar-30-2024",
            "completedDate": "Jan-20-2025"
 
        },
        {
            "id": "003",
            "status": "Active",
            "noOfServicesLeft": "9",
            "noOfServicesCompleted": "1",
            "totalNumberOfServices": "10",
            "purchasedDate": "Jan-30-2025"
        },
    ]);

    const [ checkedCount, setCheckedCount ] = useState(0);
    const handleSave = (value) => {
        setPunchCards((prevCards) =>
        prevCards.map((prev)=> 
            prev.id === value.id ? {
                ...prev,
                noOfServicesCompleted: parseInt(value.noOfServicesCompleted) + checkedCount,
                noOfServicesLeft: Math.max(0, prev.noOfServicesLeft - checkedCount),
            } : prev
        ));
        handleSend();
        setCheckedCount(0);
    };

    const handleCheckboxChange = (e,value) => {
        const count = e.target.checked ? checkedCount + 1 : checkedCount - 1;
        setCheckedCount(count);
        setNewComment(count > 0 ?"Subscription ID: "+value.id +", selected Cards: "+count:"");
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
                title={null}
                // closable={false}
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
                    <div className="" >
                        {punchCards.filter((card) => card.status === "Active")
                        .map((card) => (
                            <div key={card.id} className="punch-card">
                                <div className="punchCards" style={{backgroundColor:`${color}`}}>
                                    {Array.from({ length: Number(card.noOfServicesLeft) }, (_, index) => index)
                                    .reverse()
                                    .map((index) => (
                                        <div key={index} className="individualCards">
                                            {/* <div style={{width:'35px',backgroundColor:'pink',height:'25px'}}></div> */}
                                            <Checkbox onChange={(e)=>handleCheckboxChange(e,card)} width={50}></Checkbox>   
                                        </div>
                                    ))}
                                </div>
                                {checkedCount?<center style={{padding:'5px'}}><Button type="primary" onClick={()=>handleSave(card)}>Save</Button></center>:""}
                            </div>
                            ))}
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
