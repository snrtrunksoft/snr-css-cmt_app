import React, { useEffect, useState } from "react";
import "./NameCard.css";
import { Badge, Button, Card, Col, Drawer, Form, Grid, Input, message, Row, Space, Select, Spin, Popconfirm, Typography, Avatar, Tag } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import maleAvatar from "./assets/male_avatar.jpg";
import TextArea from "antd/es/input/TextArea";
import StatusModal from "./StatusModal";
import { getSubscriptionPlans, deleteMember, deleteResource, updateMember, updateResource } from "./api/APIUtil";
import PunchCardsPage  from "./PunchCardsPage";
import dayjs from "dayjs";

const { Option } = Select;

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
    groupId,
    comments,
    subscriptions,
    commentBox, 
    setCommentBox,
    selectedGroup,
    groupMessages,
    setGroupMessages,
    uniqueGroups = []
    }) => {
    const [ isHovered, setIsHovered ] = useState(false);
    const [ newComment, setNewComment ] = useState("");
    const [ nameCardDrawer, setNameCardDrawer ] = useState(false);
    const [ isEditable, setIsEditable] = useState(false);
    const [ statusModal, setStatusModal ] = useState({ visible: false, type: "", title: "", message: "" });
    const [ subscriptionPlans, setSubscriptionPlans ] = useState([]);
    const [ loadingPlans, setLoadingPlans ] = useState(false);
    const [ isUpdating, setIsUpdating ] = useState(false);
    const [ isAddingComment, setIsAddingComment ] = useState(false);
    // Track which comment index is currently being deleted (null = none)
    const [ deletingCommentIndex, setDeletingCommentIndex ] = useState(null);

    // Country/State data for address edit (copied behavior from AddNewUser)
    const [countries, setCountries] = useState([]);
    const [loadingCountries, setLoadingCountries] = useState(false);
    const [states, setStates] = useState([]);
    const [loadingStates, setLoadingStates] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [countryCode, setCountryCode] = useState("");

    const { useBreakpoint } = Grid;
    const [ form ] = Form.useForm();
    const screens = useBreakpoint();

    // Helper to ensure groupId is an array of strings
    const getGroupArrayValue = () => {
      if (Array.isArray(groupId)) {
        if (groupId.length === 0) return [];
        if (Array.isArray(groupId[0])) return groupId[0];
        return groupId;
      }
      return groupId ? [groupId] : [];
    };

    const [defaultValues] = useState({
        customerId: customerId || "",
        customerName: customerName || "",
        phoneNumber: phoneNumber || "",
        email: email || "",
        status: status || "",
        groupId: getGroupArrayValue(),
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

    useEffect(() => {
        if (nameCardDrawer && membersPage) {
            setLoadingPlans(true);
            // Fetch subscription plans from API
            const fetchSubscriptionPlans = async () => {
                try {
                    const res = await getSubscriptionPlans(entityId);
                    setSubscriptionPlans(res);
                    console.log("Subscription Plans loaded from API:", res);
                } catch(error) {
                    console.log("Error fetching subscription plans:", error);
                } finally {
                    setLoadingPlans(false);
                }
            }
            fetchSubscriptionPlans();
        }

        // Fetch country/state data when drawer opens (also used for phone country code)
        if (nameCardDrawer) {
            fetchCountries();
        }
    }, [nameCardDrawer, membersPage]);

    // Fetch countries from restcountries API (copied logic from AddNewUser)
    const fetchCountries = async () => {
      if (countries.length > 0) return; // already loaded
      setLoadingCountries(true);
      try {
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,idd,region,states");
        const data = await response.json();
        const sortedCountries = data
          .map((country) => ({
            name: country.name.common,
            code: country.cca2,
            dialCode: country.idd?.root + (country.idd?.suffixes?.[0] || ''),
            region: country.region,
            states: country.states || []
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(sortedCountries);
        console.log("Countries loaded:", sortedCountries);

        // If this record already had a country selected, set it
        const initCountry = defaultValues.address?.country;
        if (initCountry) {
          const found = sortedCountries.find(c => c.name === initCountry);
          if (found) {
            setSelectedCountry(found);
            setCountryCode(found.dialCode || "");
            fetchStates(found.name);
          }
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoadingCountries(false);
      }
    };

    const fetchStates = async (countryName) => {
      setLoadingStates(true);
      try {
        const response = await fetch(`https://countriesnow.space/api/v0.1/countries/states`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: countryName })
        });
        const data = await response.json();
        console.log("States response for", countryName, ":", data);
        if (data.data && data.data.states && Array.isArray(data.data.states)) {
          const statesList = data.data.states
            .map((state) => ({ name: state.name, code: state.state_code || state.name }))
            .sort((a, b) => a.name.localeCompare(b.name));
          console.log("Parsed states:", statesList);
          setStates(statesList);
        } else {
          console.log("No states found for", countryName);
          setStates([]);
        }
      } catch (error) {
        console.error("Error fetching states:", error);
        setStates([]);
      } finally {
        setLoadingStates(false);
      }
    };

    const handleCountryChange = (value) => {
      const selected = countries.find((c) => c.name === value);
      if (selected) {
        setSelectedCountry(selected);
        setCountryCode(selected.dialCode || "");
        fetchStates(selected.name);
        // Reset nested state field
        form.setFieldsValue({ address: { state: undefined } });
      }
    };

    useEffect(() => {
      // If countries are already loaded and drawer just opened, ensure state is synced
      if (nameCardDrawer && countries.length > 0) {
        const initCountry = defaultValues.address?.country;
        if (initCountry) {
          const found = countries.find(c => c.name === initCountry);
          if (found) {
            setSelectedCountry(found);
            setCountryCode(found.dialCode || "");
            fetchStates(found.name);
          }
        }
      }
    }, [nameCardDrawer, countries]);

    const getDrawerWidth = () => {
        if (screens.xl) return 600;
        if (screens.lg) return 550;
        if (screens.md) return 500;
        if (screens.sm) return 300;
        return '100%';
    };
    const onFinish = (values) => {
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
            groupId: Array.isArray(values.groupId) ? values.groupId : (values.groupId ? [values.groupId] : []),
            ...(isMember && values.subscriptionPlanId && { subscriptionPlanId: values.subscriptionPlanId }),
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
        const { id, entityId: recordEntityId, ...cleanCustomer } = updatedRecord;
        console.log("Clean customer data:", cleanCustomer);
        console.log("entityId from props:", entityId);

        // ---------- STEP 3: API update ----------
        const updateNameCard = async () => {
            setIsUpdating(true);
            console.log("Using entityId:", entityId)
            try {
                const membersPage_local = membersPage;
                const customerId_local = values.customerId;
                
                if (membersPage_local) {
                    await updateMember(entityId, customerId_local, cleanCustomer);
                } else {
                    await updateResource(entityId, customerId_local, cleanCustomer);
                }

                if (membersPage) {
                    setData(updateLocalState);
                } else {
                    setResourceData(updateLocalState);
                }
                console.log(`✅ Successfully updated record`);
                setStatusModal({
                    visible: true,
                    type: "success",
                    title: "Updated Successfully",
                    message: `${membersPage ? "User" : "Resource"} has been updated successfully!`
                });
            } catch (error) {
                console.error("❌ Network or server error while updating record:", error);
                setStatusModal({
                    visible: true,
                    type: "error",
                    title: "Update Error",
                    message: "Network or server error occurred. Please try again."
                });
            } finally {
                setIsUpdating(false);
            }
            };
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
                groupId: Array.isArray(values.groupId) ? values.groupId : (values.groupId ? [values.groupId] : []),
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

        updateNameCard();
        };
    
    const addressKeys = Object.keys(address?.[0] ?? {});
    
    // Determine color based on status (moved before handleSend)
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
                "groupId" : Array.isArray(groupId) ? (groupId.length > 0 ? groupId : "") : (groupId || ""),
                "phoneNumber" : phoneNumber,
                "comments" : commentBody
            }
            Object.values(updatedRecord.subscriptions).forEach(sub => {
                delete sub.entityId;
                delete sub.id;
            });
            console.log("updatedRecord:", updatedRecord);

            const uploadComment = async () => {
            setIsAddingComment(true);
            try {
                // Create a clean copy before modifying
                let recordToUpload = { ...updatedRecord };

                // 🔹 Remove subscriptions if calling RESOURCES_API
                if (!membersPage) {
                const { subscriptions, ...rest } = recordToUpload;
                recordToUpload = rest;
                }
                console.log("Record:", recordToUpload);

                if (membersPage) {
                    await updateMember(entityId, customerId, recordToUpload);
                } else {
                    await updateResource(entityId, customerId, recordToUpload);
                }

                console.log("✅ successfully added the comment");
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
                setStatusModal({
                    visible: true,
                    type: "success",
                    title: "Comment Posted",
                    message: "Your comment has been posted successfully!"
                });
            } catch (error) {
                console.log("❌ unable to add Comment:", error);
                setStatusModal({
                    visible: true,
                    type: "error",
                    title: "Comment Error",
                    message: "Failed to post comment. Please try again."
                });
            } finally {
                setIsAddingComment(false);
            }
            };

            uploadComment();
            
        }
        setNewComment("");
    }
    const handleClear = () =>{
        setNewComment("");
    }

    const handleDeleteMember = async () => {
        try {
            setStatusModal({ visible: true, type: "loading", title: "Deleting...", message: "Please wait" });
            if (membersPage) {
                await deleteMember(entityId, customerId);
            } else {
                await deleteResource(entityId, customerId);
            }
            
            setStatusModal({ visible: true, type: "success", title: "Success", message: `${membersPage ? "Member" : "Resource"} deleted successfully` });
            
            // Update parent data
            if (membersPage) {
                setData(prev => prev.filter(item => item.id !== customerId));
            } else {
                setResourceData(prev => prev.filter(item => item.resourceId !== customerId));
            }
            
            setTimeout(() => {
                setNameCardDrawer(false);
                setStatusModal({ visible: false, type: "", title: "", message: "" });
            }, 1500);
        } catch (error) {
            console.error("Delete failed:", error);
            setStatusModal({ visible: true, type: "error", title: "Error", message: `Failed to delete ${membersPage ? "member" : "resource"}` });
        }
    }

    const handleDeleteComment = (commentId) => {
        const updatedComments = comments.filter((_, idx) => idx !== commentId);
        
        const updatedRecord = {
            ...(membersPage
                ? { customerName: customerName }
                : { resourceName: customerName }),
            "status": status,
            "address": address,
            "email": email,
            "subscriptions": subscriptions,
            "groupId": Array.isArray(groupId) ? (groupId.length > 0 ? groupId : "") : (groupId || ""),
            "phoneNumber": phoneNumber,
            "comments": updatedComments
        }
        
        Object.values(updatedRecord.subscriptions).forEach(sub => {
            delete sub.entityId;
            delete sub.id;
        });

        const deleteCommentAPI = async () => {
            // Indicate which comment index is being deleted so only that button shows loading
            setDeletingCommentIndex(commentId);
            try {
                let recordToUpload = { ...updatedRecord };
                if (!membersPage) {
                    const { subscriptions, ...rest } = recordToUpload;
                    recordToUpload = rest;
                }

                if (membersPage) {
                    await updateMember(entityId, customerId, recordToUpload);
                } else {
                    await updateResource(entityId, customerId, recordToUpload);
                }

                // Show both quick message and StatusModal for consistent UX
                message.success("Comment deleted successfully");
                setStatusModal({ visible: true, type: "success", title: "Comment Deleted", message: "Comment has been deleted successfully." });
                setTimeout(() => setStatusModal({ visible: false, type: "", title: "", message: "" }), 1500);

                // Update local state
                if (membersPage) {
                    setData(prev => 
                        prev.map(item => 
                            item.id === customerId 
                                ? { ...item, comments: updatedComments }
                                : item
                        )
                    );
                } else {
                    setResourceData(prev => 
                        prev.map(item => 
                            item.resourceId === customerId 
                                ? { ...item, comments: updatedComments }
                                : item
                        )
                    );
                }
            } catch (error) {
                console.error("Failed to delete comment:", error);
                message.error("Failed to delete comment");
                setStatusModal({ visible: true, type: "error", title: "Delete Error", message: "Failed to delete comment. Please try again." });
                setTimeout(() => setStatusModal({ visible: false, type: "", title: "", message: "" }), 2000);
            } finally {
                setDeletingCommentIndex(null);
            }
        }

        deleteCommentAPI();
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
                    <Badge 
                        count={
                          (selectedGroup === (Array.isArray(groupId) ? groupId[0] : groupId) && groupMessages?.[Array.isArray(groupId) ? groupId[0] : groupId]?.hasUnread) 
                            ? groupMessages[Array.isArray(groupId) ? groupId[0] : groupId]?.messages?.length 
                            : 0
                        }
                        overflowCount={99}
                        showZero={false}
                        style={{ 
                          backgroundColor: (selectedGroup === (Array.isArray(groupId) ? groupId[0] : groupId) && groupMessages?.[Array.isArray(groupId) ? groupId[0] : groupId]?.hasUnread) ? '#ff4d4f' : 'transparent'
                        }}
                        offset={[ -15, -5 ]}>
                        <div style={{width:'30px', height:'15px', backgroundColor:`${color}`,}}></div>
                    </Badge>
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
            width={getDrawerWidth()}
            onClose={() => {
                setNameCardDrawer(false);
                setNewComment("");
                const currentGroupKey = Array.isArray(groupId) ? groupId[0] : groupId;
                setGroupMessages(prev => ({
                ...prev,
                [currentGroupKey]: { ...prev[currentGroupKey], hasUnread: false }
                }));
            }}
            bodyStyle={{ background: "#f5f7fa", padding: 0 }}
            >
            {/* ================= NAME CARD ================= */}
            <Card
            bordered={false}
            style={{
                marginBottom: 12,
                borderRadius: 0,
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                padding: "12px 16px",
            }}
            bodyStyle={{ padding: 0 }}
            >
            <div
                style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr 120px",
                gridTemplateRows: "22px 18px 36px",
                columnGap: 16,
                alignItems: "center",
                }}
            >
                {/* Avatar */}
                <div style={{ gridRow: "1 / span 3" }}>
                <Avatar
                    src={maleAvatar}
                    size={64}
                    style={{ border: "2px solid #e5e7eb" }}
                />
                </div>

                {/* Name */}
                <Typography.Text
                strong
                style={{
                    gridColumn: 2,
                    gridRow: 1,
                    fontSize: 16,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
                >
                {customerName}
                </Typography.Text>

                {/* Actions */}
                <div
                style={{
                    gridColumn: 3,
                    gridRow: "1 / span 3",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    justifyContent: "center",
                }}
                >
                <Button size="small" type="primary" onClick={() => setIsEditable(true)}>
                    Edit
                </Button>

                <Popconfirm
                    title="Delete"
                    description={`Are you sure you want to delete this ${
                    membersPage ? "member" : "resource"
                    }?`}
                    onConfirm={handleDeleteMember}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{ danger: true }}
                >
                    <Button size="small" danger icon={<DeleteOutlined />}>
                    Delete
                    </Button>
                </Popconfirm>
                </div>

                {/* Phone */}
                <Typography.Text
                type="secondary"
                style={{
                    gridColumn: 2,
                    gridRow: 2,
                    fontSize: 13,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
                >
                {phoneNumber}
                </Typography.Text>

                {/* Address */}
                <div
                style={{
                    gridColumn: 2,
                    gridRow: 3,
                    fontSize: 13,
                    color: "#6b7280",
                    lineHeight: "18px",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                }}
                >
                {[ 
                    address?.[0]?.street1,
                    address?.[0]?.city,
                    address?.[0]?.state,
                    address?.[0]?.country,
                ]
                    .filter(Boolean)
                    .join(", ")}
                </div>
            </div>
            </Card>
            
            {/* ================= EDIT FORM ================= */}
            <Form
                hidden={!isEditable}
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Card title="Edit Details" style={{ margin: 16, borderRadius: 8 }}>
                <Row gutter={16}>
                    <Col span={12}>
                    <Form.Item name="customerId" label="Customer ID">
                        <Input readOnly />
                    </Form.Item>
                    </Col>

                    <Col span={12}>
                    <Form.Item name="customerName" label="Name" rules={[
                        { required: true, message: 'Name is required' },
                        { pattern: /^[a-zA-Z][a-zA-Z0-9._]*$/, message: 'Name must start with a letter and can contain letters, numbers, underscores, and dots' },
                        { min: 7, message: 'Name should have at least 7 characters' }
                    ]}>
                        <Input placeholder="Enter name (start with letter, min 7 chars)" />
                    </Form.Item>
                    </Col>

                    {membersPage && (
                    <Col span={12}>
                        <Form.Item name="email" label="Email" rules={[
                          { required: true, message: 'Email is required' },
                          { type: 'email', message: 'Please enter a valid email address' }
                        ]}>
                        <Input />
                        </Form.Item>
                    </Col>
                    )}

                    <Col span={12}>
                    <Form.Item name="phoneNumber" label="Phone" rules={[
                      { required: true, message: 'Phone number is required' },
                      { pattern: /^[0-9]{10}$/, message: 'Phone number should be exactly 10 digits' }
                    ]}>
                        <Input
                          maxLength={10}
                          placeholder={countryCode ? `${countryCode} - 10-digit number` : "Select country first"}
                          prefix={countryCode ? countryCode : undefined}
                        />
                    </Form.Item>
                    </Col>

                    <Col span={12}>
                    <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Status is required' }]}>
                        <Select placeholder="Select status">
                        <Option value="ACTIVE">ACTIVE</Option>
                        <Option value="IN_PROGRESS">IN_PROGRESS</Option>
                        <Option value="COMPLETED">COMPLETED</Option>
                        <Option value="CANCELLED">CANCELLED</Option>
                        </Select>
                    </Form.Item>
                    </Col>

                    <Col span={12}>
                    <Form.Item name="groupId" label="Group Name">
                        <Select
                            mode="multiple"
                            placeholder="Select one or more groups"
                            style={{ fontSize: "14px" }}
                            options={(uniqueGroups || []).map(g => ({ label: g, value: g }))}
                            allowClear
                        />
                    </Form.Item>
                    </Col>

                    {membersPage && (
                    <Col span={12}>
                        <Form.Item name="subscriptionPlanId" label="Subscription Plan">
                        <Spin spinning={loadingPlans}>
                            <Select placeholder="Select a plan">
                            {subscriptionPlans.map(plan => (
                                <Option key={plan.id} value={plan.id}>
                                {plan.id} - ${plan.price} ({plan.type})
                                </Option>
                            ))}
                            </Select>
                        </Spin>
                        </Form.Item>
                    </Col>
                    )}

                    <Col span={12}>
                    <Form.Item name={["address", "city"]} label="City" rules={[
                      { required: true, message: 'City is required' },
                      { pattern: /^[a-zA-Z\s]+$/, message: 'City should contain only letters' },
                      { min: 2, message: 'City name should have at least 2 characters' }
                    ]}>
                        <Input />
                    </Form.Item>
                    </Col>

                    <Col span={12}>
                    <Form.Item name={["address", "state"]} label="State/Province" rules={[{ required: true, message: 'State is required' }]}>
                        <Select
                          placeholder={!selectedCountry ? "Select a country first" : "Select a state/province"}
                          allowClear
                          disabled={!selectedCountry || states.length === 0}
                          loading={loadingStates}
                          showSearch
                          filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                          options={states.map((state) => ({ label: state.name, value: state.name }))}
                          onChange={() => form.validateFields([['address','state']])}
                        />
                    </Form.Item>
                    </Col>

                    <Col span={12}>
                    <Form.Item name={["address", "country"]} label="Country" rules={[{ required: true, message: 'Country is required' }]}>
                        <Select
                          placeholder="Select a country"
                          onChange={(value) => handleCountryChange(value)}
                          allowClear
                          showSearch
                          loading={loadingCountries}
                          filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                          options={countries.map((country) => ({ label: country.name, value: country.name }))}
                        />
                    </Form.Item>
                    </Col>

                    <Col span={24}>
                    <Form.Item name={["address", "street1"]} label="Street" rules={[
                      { required: true, message: 'Street is required' },
                      { min: 5, message: 'Street should have at least 5 characters' }
                    ]}>
                        <Input />
                    </Form.Item>
                    </Col>
                </Row>

                <Button type="primary" htmlType="submit" block loading={isUpdating} disabled={isUpdating}>
                    Save Changes
                </Button>
                </Card>
            </Form>

            {/* ================= PUNCH CARDS ================= */}
                {membersPage && (
                <Card
                    title="Punch Cards"
                    style={{
                    margin: "0 16px",
                    borderRadius: 8,
                    }}
                    bodyStyle={{ padding: 16 }}
                >
                    <PunchCardsPage
                    data={data}
                    customerId={customerId}
                    customerName={customerName}
                    setNewComment={setNewComment}
                    handleSend={handleSend}
                    setData={setData}
                    entityId={entityId}
                    color={color}
                    />
                </Card>
                )}


            {/* ================= GROUP MESSAGES ================= */}
            <Card
                title={`Group Messages (${Array.isArray(groupId) ? groupId[0] : groupId})`}
                style={{ margin: 16, borderRadius: 8 }}
            >
                {(() => {
                    const currentGroupKey = Array.isArray(groupId) ? groupId[0] : groupId;
                    return groupMessages?.[currentGroupKey]?.messages?.length ? (
                    groupMessages[currentGroupKey].messages.map((msg, idx) => (
                        <Card
                        key={idx}
                        size="small"
                        style={{ marginBottom: 8, background: "#f0f8ff" }}
                        >
                        <Typography.Text strong>{currentGroupKey}</Typography.Text>
                        <div>{msg}</div>
                        </Card>
                    ))
                    ) : (
                    <Typography.Text type="secondary">
                        No group messages yet
                    </Typography.Text>
                    );
                })()}
            </Card>

            {/* ================= COMMENTS ================= */}
            <Card title="Comments" style={{ margin: 16, borderRadius: 8 }}>
                {comments?.map((comment, index) => (
                <Badge.Ribbon
                    key={index}
                    text={comment.author}
                    color={color}
                >
                    <Card size="small" style={{ marginBottom: 12 }}>
                    <div>{comment.message}</div>

                    <div
                        style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 8,
                        fontSize: 11,
                        color: "#888",
                        }}
                    >
                        {/* <div style={{display: 'flex', alignItems: 'center', gap: 8}}> */}
                          <div>{dayjs(comment.date).format("YYYY-MM-DD HH:mm:ss")}</div>
                          {deletingCommentIndex === index ? (
                            <Typography.Text type="secondary" style={{ marginLeft: 8, fontStyle: 'italic' }}>Deleting...</Typography.Text>
                          ) : (
                            <Popconfirm
                              title="Delete comment?"
                              onConfirm={() => handleDeleteComment(index)}
                            >
                              <Button
                                type="text"
                                danger
                                size="small"
                                icon={<DeleteOutlined />}
                                loading={deletingCommentIndex === index}
                                disabled={deletingCommentIndex === index}
                              />
                            </Popconfirm>
                          )}
                        {/* </div> */}
                    </div>
                    </Card>
                </Badge.Ribbon>
                ))}
            </Card>

            {/* ================= ADD COMMENT ================= */}
            <Card style={{ margin: 16, borderRadius: 8 }}>
                <TextArea
                rows={3}
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                />

                <Row justify="end" style={{ marginTop: 12 }}>
                <Space>
                    <Button onClick={handleClear} disabled={isAddingComment}>Clear</Button>
                    <Button type="primary" onClick={handleSend} loading={isAddingComment} disabled={isAddingComment}>
                    Send
                    </Button>
                </Space>
                </Row>
            </Card>
            </Drawer>

            {/* Status Modal */}
            <StatusModal
                visible={statusModal.visible}
                type={statusModal.type}
                title={statusModal.title}
                message={statusModal.message}
                onClose={() => {
                    setStatusModal({ visible: false, type: "", title: "", message: "" });
                    if (statusModal.type === "success" && isEditable) {
                        setIsEditable(false);
                        setNameCardDrawer(false);
                    }
                }}
            />
        </div>
    );
};

export default NameCard;
