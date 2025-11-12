import React, { useEffect, useState } from "react";
import "./NameCard.css";
import { Badge, Button, Card, Col, Drawer, Form, Grid, Input, message, Row, Space } from "antd";
import maleAvatar from "./assets/male_avatar.jpg";
import TextArea from "antd/es/input/TextArea";
import { MEMBERS_API, RESOURCES_API } from "./properties/EndPointProperties";
import PunchCardsPage  from "./PunchCardsPage";
import dayjs from "dayjs";

const NameCard = ({ 
    membersPage,
    data,
    setData,
    entityId,
    resourceData,
    setResourceData,
    customerId, 
    customerName,
    email,
    phoneNumber, 
    address, 
    status,
    group,
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
        customerId: customerId || "",
        customerName: customerName || "",
        phoneNumber: phoneNumber || "",
        email: email || "",
        status: status || "",
        group: group || "",
        address: {
            houseNo: address?.[0]?.houseNo || "",
            street1: address?.[0]?.street1 || "",
            street2: address?.[0]?.street2 || "",
            city: address?.[0]?.city || "",
            state: address?.[0]?.state || "",
            country: address?.[0]?.country || "",
            pincode: address?.[0]?.pincode || "",
        },
    });

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
    const onFinish = (values) => {
        setIsEditable(false);
        console.log("form values:", values);

        // ---------- STEP 1: Find the correct data source ----------
        const filterData = membersPage
            ? data.find((prev) => prev.id === values.customerId)
            : resourceData.find((prev) => prev.resourceId === values.customerId);

        // ---------- STEP 2: Prepare updated record ----------
        const buildUpdatedRecord = (isMember) => ({
            ...filterData,
            ...(isMember
            ? { customerName: values.customerName, email: values.email }
            : { resourceName: values.customerName }),
            phoneNumber: values.phoneNumber,
            status: values.status,
            group: values.group,
            address: [
            {
                ...filterData.address?.[0],
                city: values.address?.city || filterData.address?.[0]?.city || "",
                state: values.address?.state || filterData.address?.[0]?.state || "",
                country: values.address?.country || filterData.address?.[0]?.country || "",
                street1: values.address?.street1 || filterData.address?.[0]?.street1 || "",
            },
            ],
        });

        const updatedRecord = buildUpdatedRecord(membersPage);

        // Remove unneeded keys before API call
        const { id, entityId, ...cleanCustomer } = updatedRecord;
        console.log("Clean customer data:", cleanCustomer);

        // ---------- STEP 3: API update ----------
        const updateNameCard = async () => {
            try {
                const response = await fetch(
                (membersPage ? MEMBERS_API : RESOURCES_API) + values.customerId,
                {
                    method: "PUT",
                    headers: {
                    entityid: entityId,
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify(cleanCustomer),
                }
                );

                const statusCode = response.status; // 🔹 capture status code
                const data = await response.json();

                if (!response.ok) {
                console.error(`❌ Failed to update record. Status: ${statusCode}`, data);
                message.error("Failed to update record");
                } else {
                console.log(`✅ Successfully updated record. Status: ${statusCode}`, data);
                message.success("Record updated successfully");
                }

            } catch (error) {
                console.error("❌ Network or server error while updating record:", error);
            }
            };

        updateNameCard();

        // ---------- STEP 4: Local state update ----------
        const updateLocalState = (prev) =>
            prev.map((customer) => {
            const matchKey = membersPage ? "id" : "resourceId";
            if (customer[matchKey] === values.customerId) {
                return {
                ...customer,
                ...(membersPage
                    ? { customerName: values.customerName }
                    : { resourceName: values.customerName }),
                phoneNumber: values.phoneNumber,
                status: values.status,
                group: values.group,
                address: [
                    {
                    ...customer.address?.[0],
                    city: values.address.city,
                    state: values.address.state,
                    country: values.address.country,
                    },
                ],
                };
            }
            return customer;
            });

        if (membersPage) {
            setData(updateLocalState);
        } else {
            setResourceData(updateLocalState);
        }
        };
    
    const addressKeys = Object.keys(address?.[0] ?? {});
    const handleSend = () => {
        const addTimeForComment = dayjs().format("YYYY-MM-DD HH:mm:ss.SSS");
        // console.log(addTimeForComment);
        if(newComment){
            const commentBody = [...comments, {
                "commentId" : parseInt(comments[comments.length - 1]?.commentId || 0) + 1,
                "author" : customerName,
                "message" : newComment,
                "date" : addTimeForComment
            }]
            const updatedRecord = {
                ...(membersPage
                ? { customerName: customerName }
                : { resourceName: customerName }),
                "status" : status,
                "address" : address,
                "email" : email,
                "subscriptions" : subscriptions,
                "phoneNumber" : phoneNumber,
                "comments" : commentBody
            }
            Object.values(updatedRecord.subscriptions).forEach(sub => {
                delete sub.entityId;
                delete sub.id;
            });
            console.log("updatedRecord:", updatedRecord);

            const uploadComment = async () => {
            try {
                // Create a clean copy before modifying
                let recordToUpload = { ...updatedRecord };

                // 🔹 Remove subscriptions if calling RESOURCES_API
                if (!membersPage) {
                const { subscriptions, ...rest } = recordToUpload;
                recordToUpload = rest;
                }
                console.log("Record:", recordToUpload);

                const response = await fetch(
                (membersPage ? MEMBERS_API : RESOURCES_API) + customerId,
                {
                    method: "PUT",
                    headers: {
                    entityid: entityId,
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify(recordToUpload),
                }
                );

                const data = await response.json();
                console.log("✅ successfully added the comment:", data);
            } catch (error) {
                console.log("❌ unable to add Comment:", error);
            }
            };

            uploadComment();

            if(membersPage) {
                setData(prevData =>
                    prevData.map(prev =>
                        prev.id === customerId ? {
                            ...prev,
                            comments: [...prev.comments, {
                                commentId : parseInt(comments[comments.length - 1]?.commentId || 0) + 1,
                                message: newComment,
                                author: customerName,
                                date: addTimeForComment
                            }]
                        } : prev)
                );
            } else {
                setResourceData(prevData =>
                    prevData.map(prev =>
                        prev.resourceId === customerId ? {
                            ...prev,
                            comments: [...prev.comments, {
                                commentId : parseInt(comments[comments.length - 1]?.commentId || 0) + 1,
                                message: newComment,
                                author: customerName,
                                date: addTimeForComment
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
                                commentId: parseInt(comments[comments.length - 1]?.commentId || 0) + 1,
                                message: newComment,
                                author: customerName,
                                date: addTimeForComment
                            }] }
                            : prev
                    )
                );
            } else {
                setCommentBox(prevComments => [
                    ...prevComments,
                    { customerName,color, comment: [{
                        commentId: parseInt(comments[comments.length - 1]?.commentId || 0) + 1,
                        message:newComment,
                        author:customerName,
                        date: addTimeForComment
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
                {Array.isArray(address) && address.length > 0 && (
                    <p
                        style={{
                        width: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        margin: 0,
                        }}
                    >
                        Address:&nbsp;
                        {address
                        .map(
                            (a) =>
                            [a.city, a.state, a.country].filter(Boolean).join(", ")
                        )
                        .join(" | ")}
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
                    <Form
                        hidden={!isEditable}
                        layout="vertical"
                        form={form}
                        onFinish={onFinish}
                        style={{
                            padding: '16px 24px',
                            maxWidth: 600,
                            margin: '0 auto',
                            background: '#fff',
                            borderRadius: 8,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                        }}
                        >
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
                            <Form.Item name="customerId" label="Customer ID">
                            <Input readOnly size="middle" />
                            </Form.Item>

                            <Form.Item name="customerName" label="Customer Name">
                            <Input size="middle" />
                            </Form.Item>

                            {membersPage && (
                            <Form.Item name="email" label="Email">
                                <Input size="middle" />
                            </Form.Item>
                            )}

                            <Form.Item name="phoneNumber" label="Phone">
                            <Input inputMode="numeric" pattern="[0-9]*" maxLength={10} size="middle" />
                            </Form.Item>

                            <Form.Item name="status" label="Status">
                            <Input size="middle" />
                            </Form.Item>

                            <Form.Item name="group" label="Group">
                            <Input size="middle" />
                            </Form.Item>

                            <Form.Item label="City" name={['address', 'city']}>
                            <Input size="middle" />
                            </Form.Item>

                            <Form.Item label="State" name={['address', 'state']}>
                            <Input size="middle" />
                            </Form.Item>

                            <Form.Item label="Country" name={['address', 'country']}>
                            <Input size="middle" />
                            </Form.Item>

                            <Form.Item
                            label="Street1"
                            name={['address', 'street1']}
                            style={{ gridColumn: '1 / -1' }}
                            >
                            <Input size="middle" />
                            </Form.Item>
                        </div>

                        <Form.Item style={{ marginTop: 16 }}>
                            <Button type="primary" htmlType="submit" block>
                            Save Changes
                            </Button>
                        </Form.Item>
                        </Form>
                        {membersPage && (
                            <PunchCardsPage
                                data={data}
                                customerId={customerId}
                                customerName={customerName}
                                setNewComment={setNewComment}
                                handleSend={handleSend}
                                subscriptions={subscriptions || []}
                                color={color} />
                        )}
                    <h3 style={{ marginTop: '30px', marginBottom: '15px' }}>Comments :</h3>
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
                                                {dayjs(comment['date']).format("YYYY-MM-DD HH:mm:ss")}
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
