import React, { useState } from "react";
import "./NameCard.css";
import { Badge, Button, Card, Checkbox, Col, Drawer,Grid, Row, Space } from "antd";
import maleAvatar from "./assets/male_avatar.jpg";
import femaleAvatar from "./assets/female_avatar.jpg";
import TextArea from "antd/es/input/TextArea";
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
    const [ punchCardsState, setPunchCardsState ] = useState("Complete");
    const [ flipped, setFlipped ] = useState(false);
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    const getDrawerWidth = () => {
        if (screens.xl) return 600;
        if (screens.lg) return 550;
        if (screens.md) return 500;
        if (screens.sm) return 300;
        return '100%';
    };

    const toggleFlip = () => {
        setFlipped((prev) => !prev);
    };

    const [ punchCards, setPunchCards ] = useState(subscriptions);
    const [ checkedCount, setCheckedCount ] = useState(0);
    const handleSave = (value) => {
        setPunchCards((prevCards) =>
        prevCards.map((prev) => {
            if(prev.id === value.id) {
                const servicesLeft = Math.max(0, prev.noOfServicesLeft - checkedCount);
                if(servicesLeft === 0){
                    return {
                        ...prev,
                        noOfServicesCompleted: parseInt(value.noOfServicesCompleted) + checkedCount,
                        noOfServicesLeft: Math.max(0, prev.noOfServicesLeft - checkedCount),
                        status:'Complete'
                    }
                }
                return {
                    ...prev,
                    noOfServicesCompleted: parseInt(value.noOfServicesCompleted) + checkedCount,
                    noOfServicesLeft: Math.max(0, prev.noOfServicesLeft - checkedCount),
                }
            } 
            return prev;
        }
        ));
        handleSend();
        setCheckedCount(0);
    };

    const handleCheckboxChange = (e,value) => {
        const count = e.target.checked ? checkedCount + 1 : checkedCount - 1;
        setCheckedCount(count);
        setNewComment(count > 0 ?"Subscription ID: "+value.id +", selected Cards: "+count:"");
    };

    const filterActiveSubscription = punchCards !== "" ? punchCards.filter((prev) => prev.status === "Active") : "";

    const addNewSubscription = () => {
        
        const updateSubscriptionData = async() =>{
            try{
                const response = await fetch(`https://7mw76m35e8.execute-api.us-east-2.amazonaws.com/users/${customerId}`);
                const customerData = await response.json();
                const newSub = {
                    id: "TBD",
                    status: "Active",
                    noOfServicesLeft: "10",
                    noOfServicesCompleted: "0",
                    totalNumberOfServices: "10",
                    purchasedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                    completedDate: "",
                    };
                console.log(customerData.subscriptions.length);
                const updatedCustomer = {
                    ...customerData,
                    subscriptions: [...customerData.subscriptions, newSub], // appending new subscription
                };
                await fetch(`https://7mw76m35e8.execute-api.us-east-2.amazonaws.com/users/${customerId}`,{
                    method:'PUT',
                    headers: {
                        "Content-Type" : "application/json",
                    },
                    body:JSON.stringify(updatedCustomer)
                })
                .then(response => response.json())
                .then(data => console.log("updated Data:",data))
                setPunchCards((prev) => [...prev, newSub]);
            }catch(error){
                console.error("unable to update the record",error);
            }
        }
        updateSubscriptionData();
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
                    width:'100%',overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace:'nowrap'
                    }}>Name : { customerName }</h3>
                    <div style={{width:'30px',height:'15px',backgroundColor:`${color}`,}}></div>
                </div>
                <p style={{
                    width:'100%',overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace:'nowrap'
                    }}>Phone : { phoneNumber }</p>
                 <p style={{
                    width:'100%',overflow: 'hidden',
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
                    <h2>Punch cards:</h2>
                    {punchCards ? <div className="" >
                        <Row>
                            <Button onClick={() => {setFlipped(false);setPunchCardsState((prev) => prev === "Complete" ? "Active": "Complete")}}>View {punchCardsState}</Button> &nbsp;
                        </Row>
                        {punchCards.filter((card) => card.status !== punchCardsState)
                        .map((card) => (
                            <div>
                                <Row key={card.id} className="punch-card" style={{ backgroundColor: `${color}` }} gutter={[16, 16]}>
                                <Col
                                    className="punchCards"
                                    xs={24}
                                    sm={20}
                                    md={24}
                                    lg={20}
                                    xl={20}
                                >
                                    {flipped ? (
                                    <Row className="flipped">
                                        <span>name: {customerName}</span>
                                        <span>purchased: {card.purchasedDate}</span>
                                        <span>completed: {card.completedDate}</span>
                                        <span>totalNumberOfService: {card.totalNumberOfServices}</span>
                                        <span>noOfServicesLeft: {card.noOfServicesLeft}</span>
                                        <span>noOfServicesCompleted: {card.noOfServicesCompleted}</span>
                                    </Row>
                                    ) : (
                                    Array.from({ length: Number(card.noOfServicesCompleted) }, (_, index) => (
                                        <div key={index} className="individualCards">
                                        <Checkbox checked />
                                        </div>
                                    ))
                                    )}
                                    {Array.from({ length: Number(card.noOfServicesLeft) }, (_, index) => index)
                                    .reverse()
                                    .map((index) => (
                                        <div
                                        key={index}
                                        hidden={flipped}
                                        className={!flipped ? "individualCards" : ""}
                                        >
                                        <Checkbox onChange={(e) => handleCheckboxChange(e, card)} />
                                        </div>
                                    ))}
                                </Col>

                                <Col
                                    xs={24}
                                    sm={4}
                                    md={24}
                                    lg={2}
                                    xl={2}
                                    style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    }}
                                >
                                    <Button onClick={() => toggleFlip()} icon={<SwapOutlined />}>
                                    Flip
                                    </Button>
                                </Col>
                                </Row>

                                {checkedCount?<Row style={{display:'flex',alignItems:'center',justifyContent:'center'}}><Button type="primary" onClick={()=>handleSave(card)}>Save</Button></Row>:""}
                            </div>
                            ))}
                            <span>{filterActiveSubscription.length === 0 ? 
                            <center><Button style={{margin:'5px'}} onClick={() => addNewSubscription()}>Add Active Subscription</Button></center> : ""}</span>
                    </div> : <center><h3 style={{color:'red'}}>No punch cards Available</h3></center>}
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
