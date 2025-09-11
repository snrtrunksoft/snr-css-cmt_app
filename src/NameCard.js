import React, { useEffect, useState } from "react";
import "./NameCard.css";
import { Badge, Button, Card, Col, Drawer, Form, Grid, Input, Row, Space } from "antd";
import maleAvatar from "./assets/male_avatar.jpg";
import TextArea from "antd/es/input/TextArea";
import { MEMBERS_API, RESOURCES_API } from "./properties/EndPointProperties";
import PunchCardsPage  from "./PunchCardsPage";

const NameCard = ({ 
    membersPage,
    data,
    setData,
    entityId,
    resourceData,
    setResourceData,
    customerId, 
    customerName,
    phoneNumber, 
    address, 
    status, 
    comments,
    subscriptions,
    commentBox, 
    setCommentBox,
    }) => {
    const [ isHovered, setIsHovered ] = useState(false);
    const [ newComment, setNewComment ] = useState("");
    const [ nameCardDrawer, setNameCardDrawer ] = useState(false);
    const [ isEditable, setIsEditable] = useState(false);
    const { useBreakpoint } = Grid;
    const [ form ] = Form.useForm();
    const screens = useBreakpoint();

    const [defaultValues] = useState({
        customerId : customerId,
        customerName: customerName,
        phoneNumber: phoneNumber,
        status: status,
        address: { ...address[0] }
    })

    useEffect(() => {
        form.setFieldsValue(defaultValues);
    },[form, defaultValues]);

    const getDrawerWidth = () => {
        if (screens.xl) return 600;
        if (screens.lg) return 550;
        if (screens.md) return 500;
        if (screens.sm) return 300;
        return '100%';
    };
    function onFinish(values) {
        setIsEditable(false);
        console.log("form values:", values);
        const filterData =  membersPage ? data.find((prev) => prev.id === values.customerId) : resourceData.find((prev) => prev.resourceId === values.customerId);
        const updated_member_name_record = {
            ...filterData,
            customerName : values.customerName,
            phoneNumber : values.phoneNumber,
            status : values.status,
            address : [{
                ...filterData.address?.[0],
                city : values.address.city,
                state : values.address.state,
                country : values.address.country
            }],
        };

        const updated_resource_name_record = {
            ...filterData,
            resourceName : values.customerName,
            phoneNumber : values.phoneNumber,
            status : values.status,
            address : [{
                ...filterData.address?.[0],
                city : values.address.city,
                state : values.address.state,
                country : values.address.country
            }],
        }
        const { id, entityId, ...cleanCustomer } = (membersPage ? updated_member_name_record : updated_resource_name_record);
        console.log(cleanCustomer);

        const updatedNameCard = async() => {
            try{
                await fetch((membersPage ? MEMBERS_API : RESOURCES_API) + values.customerId, {
                    method : "PUT",
                    headers : {
                        "entityid" : entityId,
                        "Content-Type" : "application/json"
                    },
                    body : JSON.stringify(cleanCustomer)
                })
                .then(responce => responce.json())
                .then(data => console.log("successfully updated the record", data))
            } catch(error) {
                console.log("error in updating the Name card", error);
            }
        };
        updatedNameCard();

        if(membersPage) {
            setData((prev) => {
                return prev.map((customer) => 
                    customer.id === values.customerId ?
                        {
                            ...customer,
                            customerName : values.customerName,
                            phoneNumber : values.phoneNumber,
                            status : values.status,
                            address : [{
                                ...customer.address?.[0],
                                city : values.address.city,
                                state : values.address.state,
                                country : values.address.country
                            }]
                        }   : customer)
                    })
        } else {
            setResourceData((prev) => {
                return prev.map((customer) => 
                    customer.resourceId === values.customerId ?
                        {
                            ...customer,
                            resourceName : values.customerName,
                            phoneNumber : values.phoneNumber,
                            status : values.status,
                            address : [{
                                ...customer.address?.[0],
                                city : values.address.city,
                                state : values.address.state,
                                country : values.address.country
                            }]
                        }   : customer)
            })
        }
    }
    
    const addressKeys = Object.keys(address?.[0] ?? {});
    const handleSend = () => {
        const addTimeForComment = new Date().toLocaleString();
        // console.log(addTimeForComment);
        if(newComment){
            const commentBody = [...comments, {
                "commentId" : parseInt(comments[comments.length - 1].commentId) + 1 || 1,
                "author" : customerName,
                "message" : newComment,
                "time" : addTimeForComment
            }]
            const updatedRecord = {
                "customerName" : customerName,
                "status" : status,
                "address" : address,
                "subscriptions" : subscriptions,
                "phoneNumber" : phoneNumber,
                "comments" : commentBody
            }
            Object.values(updatedRecord.subscriptions).forEach(sub => {
                delete sub.entityId;
                delete sub.id;
            });
            console.log("updatedRecord:",updatedRecord);
            const uploadComment = async () => {
                try {
                    const response = await fetch((membersPage ? MEMBERS_API : RESOURCES_API) + customerId, {
                    method: "PUT",
                    headers: {
                        "entityid" : entityId,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedRecord)
                    });
                    const data = await response.json();
                    console.log("successfully added the comment:", data);
                } catch(error) {
                    console.log("unable to add Comment:",error);
                }
            }
            uploadComment();

            if(membersPage) {
                setData(prevData =>
                    prevData.map(prev =>
                        prev.id === customerId ? {
                            ...prev,
                            comments: [...prev.comments, {
                                commentId : parseInt(comments[comments.length - 1]["commentId"]) + 1 || 1,
                                message: newComment,
                                author: customerName,
                                time: addTimeForComment
                            }]
                        } : prev)
                );
            } else {
                setResourceData(prevData =>
                    prevData.map(prev =>
                        prev.resourceId === customerId ? {
                            ...prev,
                            comments: [...prev.comments, {
                                commentId : parseInt(comments[comments.length - 1]["commentId"]) + 1 || 1,
                                message: newComment,
                                author: customerName,
                                time: addTimeForComment
                            }]
                        } : prev)
                );
            }
            
            const existingData = commentBox.findIndex((person) =>( membersPage ? person.customerName : person.resourceName) === customerName);

            if(existingData !== -1){
                setCommentBox(prevComments => 
                    prevComments.map((prev, index) =>
                        index === existingData
                            ? { ...prev, comment: [...prev.comment, {
                                commentId: parseInt(comments[comments.length - 1]["commentId"]) + 1 || 1,
                                message: newComment,
                                author: customerName,
                                time: addTimeForComment
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
                        author:customerName,
                        time: addTimeForComment
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
    if(status === "COMPLETED"){
        color = "lightgreen";
    }
    if(status === "ACTIVE"){
        color = "pink";
    }
    if(status === "IN_PROGRESS"){
        color = "lightblue";
    }
    if(status === "CANCELLED"){
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
                <div className="nameDrawer" style={{position:'relative'}}>
                    <Button
                        type="primary"
                        style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        zIndex: 1,
                        }}
                        onClick={() => setIsEditable(true)}
                    >
                        Edit
                    </Button>
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
                                    Address : { addressKeys?.map((item,index) => 
                                        <span key={index}>
                                            {address[0][item]}{ item !== "country" ? ", " : "." }
                                            {(item === "city") || (item === "state") ? "" : (<br/>) }
                                        </span>)}
                            </h3>
                        </Col>
                    </Row>
                    <Form hidden={!isEditable} layout="vertical" form={form} onFinish={onFinish} style={{padding:'20px'}}>
                        <Form.Item name="customerId" label="Customer Id">
                            <Input readOnly/>
                        </Form.Item>

                        <Form.Item name="customerName" label="Customer Name">
                            <Input />
                        </Form.Item>

                        <Form.Item name="phoneNumber" label="Phone">
                            <Input inputMode="numeric" pattern="[0-9]*" maxLength={10}/>
                        </Form.Item>

                        <Form.Item name="status" label="Status">
                            <Input />
                        </Form.Item>

                        <Form.Item label="City" name={['address', 'city']}>
                            <Input />
                        </Form.Item>

                        <Form.Item label="State" name={['address', 'state']}>
                            <Input />
                        </Form.Item>

                        <Form.Item label="Country" name={['address', 'country']}>
                            <Input />
                        </Form.Item>
                        <Form.Item style={{ marginTop: 24 }}>
                            <Button type="primary" htmlType="submit" block>
                                Save Changes
                            </Button>
                        </Form.Item>
                    </Form>
                        <PunchCardsPage
                            data={data}
                            customerId={customerId}
                            customerName={customerName}
                            setNewComment={setNewComment}
                            handleSend={handleSend}
                            subscriptions={subscriptions}
                            color={color} />
                    <h3>Comments :</h3>
                    <Row style={{display:'flex',flexDirection:'column',marginBottom:'20px'}}>
                        {comments?.map((comment,index) =>(
                            <Space 
                                key={index}
                                direction="vertical"
                                size="middle"
                                style={{
                                    width: '100%'}}>
                                    <Badge.Ribbon text={comment["author"]} color={color}>
                                        {/* <Card size="small">{comment["message"]}</Card> */}
                                        <Card size="small" style={{ position: 'relative', paddingBottom: '24px' }}>
                                            {comment["message"]}
                                            <div style={{
                                                position: 'absolute',
                                                bottom: '4px',
                                                right: '8px',
                                                fontSize: '11px',
                                                color: '#888'
                                            }}>
                                                {comment['time']}
                                            </div>
                                            </Card>
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
