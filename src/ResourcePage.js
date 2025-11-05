import React, { useEffect, useState } from "react";
import NameCard from "./NameCard";
import "./ResourcePage.css";
import "./NameCard.css";
import { LoadingOutlined } from "@ant-design/icons";
import { Button, Col, Grid, Modal, Row, Form } from "antd";
import AddNewUser from "./AddNewUser";
import { createResource } from "./api/APIUtil";

const { useBreakpoint } = Grid;

const ResourcePage = ({ resourceData, setResourceData, entityId, dataView, commentBox, setCommentBox }) =>{
    const [ isLoading, setIsLoading ] = useState(true);
    const [ addNewResourceModal, setAddNewResourceModal ] = useState(false);
    const [form] = Form.useForm();

    const screens = useBreakpoint();

    const colSize = resourceData.length <= 3 
    ? 24 / resourceData.length
    : 6;

    const handleAddNewResource = (values) => {
        const {
          firstName,
          lastName,
          phone,
          address,
          city,
          state,
          country,
          pincode,
          status = "ACTIVE",
        } = values;
      
        const newRecord = {
          resourceName: (firstName || "") + (lastName || ""),
          phoneNumber: phone,
          address: [{
            country: country || "",
            city: city || "",
            houseNo: "NA",
            street1: address || "NA",
            street2: "NA",
            pincode: pincode || "NA",
            state: state || ""
          }],
          status: status,
          comments: []
        };
      
        const addNewResource = async () => {
          try {
            const postData = await createResource(entityId, newRecord);
            console.log("new resource data:", newRecord);
            console.log("post New Resource Data:", postData);
            const updatedRecord = {
              ...newRecord,
              resourceId: (firstName || "").slice(0,3) + (postData.resourceId || "")
            };
            setResourceData(prev => [...prev, updatedRecord]);
          } catch (error) {
            console.log("unable to add new resource", error);
          } finally {
            setAddNewResourceModal(false);
          }
        };
        addNewResource();
    }

    useEffect(() => {
          setIsLoading(false);
    },[]);

    console.log("Resource:",resourceData);

    return(
    <div className="resource-app">
        {isLoading ? (<h3><LoadingOutlined/> Loading....</h3>) : 
            <>
            {dataView === "table" ? 
                <div className="table-wrapper">
                    {/* Header Row */}
                    <Row className="table-row table-header" >
                        <Col span={3} className="table-cell">ID</Col>
                        <Col span={5} className="table-cell">Name</Col>
                        <Col span={10} className="table-cell">Address</Col>
                        <Col span={6} className="table-cell">Phone Number</Col>
                    </Row>

                    {/* Data Rows */}
                    {resourceData.map((item, index) => (
                        <Row key={index} className="table-row">
                            <Col span={3} className="table-cell">{item.resourceId}</Col>
                            <Col span={5} className="table-cell">{item.resourceName}</Col>
                            <Col span={10} className="table-cell">
                                {[
                                    item.address?.[0]?.houseNo,
                                    item.address?.[0]?.street1,
                                    item.address?.[0]?.street2,
                                    item.address?.[0]?.city,
                                    item.address?.[0]?.state,
                                    item.address?.[0]?.country
                                    ].filter(Boolean).join(', ')}
                            </Col>
                            <Col span={6} className="table-cell">{item.phoneNumber}</Col>
                        </Row>
                    ))}
                    <Row className="table-row add-record-row">
                        <Col span={24} style={{margin:'10px'}}>
                        <center>
                            <Button style={{fontSize:'18px'}} onClick={() => setAddNewResourceModal(true)}>+ Add New Record</Button>
                        </center>
                        </Col>
                    </Row>
            </div> : 
                <Row className={`resource-grid ${screens.xs ? "mobile-grid-alignment" : "web-grid-alignment"}`} gutter={[16,16]}>
                    {resourceData.length !== 0 ? resourceData.map((item)=>(
                        <Col key={item.resourceId}
                            xs={20} 
                            md={12}
                            lg={colSize}
                            >
                                <NameCard key={item.resourceId}
                                    membersPage={false}
                                    entityId={entityId}
                                    resourceData={resourceData}
                                    setResourceData={setResourceData}
                                    customerId={item.resourceId}
                                    customerName={item.resourceName}
                                    phoneNumber={item.phoneNumber}
                                    address={item.address}
                                    status={item.status}
                                    comments={item.comments}
                                    subscriptions={""}
                                    commentBox = {commentBox}
                                    setCommentBox = {setCommentBox}
                                />
                        </Col>
                    )) : <h2>No NameCards Found...</h2>}
                    <Col xs={20} 
                        md={12}
                        lg={colSize}
                        className='nameCard'
                        onClick={()=> setAddNewResourceModal(true)}
                        style= {{
                        display:'flex',
                        alignItems:'center',
                        justifyContent:'center',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                        }}>
                        <Button style={{border:'transparent',fontSize:'40px'}}>+</Button>
                    </Col>
                </Row>}                
            </>
        }
        <Modal
              open={addNewResourceModal}
              onCancel={()=> {setAddNewResourceModal(false); form.resetFields();}}
              footer={null}
              >
                <AddNewUser
                  mode="resource"
                  form={form}
                  onSubmit={handleAddNewResource}
                />
            </Modal>
    </div>);
};
export default ResourcePage;