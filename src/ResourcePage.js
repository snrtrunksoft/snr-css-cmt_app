import React, { useEffect, useState } from "react";
import NameCard from "./NameCard";
import "./ResourcePage.css";
import "./NameCard.css";
import { LoadingOutlined } from "@ant-design/icons";
import { Button, Col, Grid, Modal, Row } from "antd";
import AddNewNameCard from "./AddNewNameCard";
import { RESOURCES_API } from "../properties/EndPointProperties";

const { useBreakpoint } = Grid;

const ResourcePage = ({ resourceData, setResourceData, setDuplicateData, dataView, commentBox, setCommentBox }) =>{
    const [ isLoading, setIsLoading ] = useState(true);
    const [ addNewResourceModal, setAddNewResourceModal ] = useState(false);
    const [ newRecordName, setNewRecordName ] = useState('');
    const [ newRecordLastName, setNewRecordLastName ] = useState('');
    const [ newRecordPhone, setNewRecordPhone ] = useState('');
    const [ newRecordAddress, setNewRecordAddress ] = useState('');
    const [ newRecordStatus, setNewRecordStatus ] = useState("Active");
    const [ newRecordCountry, setNewRecordCountry ] = useState("");
    const [ newRecordState, setNewRecordState ] = useState("");
    const [ newRecordCity, setNewRecordCity ] = useState("");

    const screens = useBreakpoint();

    const handleAddNewResource = () =>{
        const newRecord = {
            resourceName: newRecordName + newRecordLastName,
            phoneNumber: newRecordPhone,                                
            address: [{
                        "country": newRecordCountry,
                        "city": newRecordCity,
                        "houseNo": "",
                        "street1": newRecordAddress,
                        "street2": "",
                        "state": newRecordState
                    }],
            comments:[{
                        "author": newRecordName,
                        "commentId": "test id 101",
                        "message": "test comment 101"
                    }],
            status: newRecordStatus,
        }
        const addNewResource = async () => {
            try{
                const response = await fetch(RESOURCES_API, {
                    method:"POST",
                    headers: {
                    'Content-Type' : "application/json"
                    },
                    body:JSON.stringify(newRecord)
                })
                const postData = await response.json();
                console.log("post New Resource Data:",postData);
                const updatedRecord = {
                    ...newRecord,
                    resourceId: newRecordName.slice(0,3) + postData.resourceId
                }
                setResourceData(prev => [...prev,updatedRecord]);
            } catch (error){
                console.log("unable to add new member",error);
            }
        }
        addNewResource();
        setAddNewResourceModal(false);
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
                    <Row className="table-row table-header" style={{width:screens.xl || screens.lg ? '60vw' : ""}}>
                        <Col span={3} className="table-cell">ID</Col>
                        <Col span={5} className="table-cell">Name</Col>
                        <Col span={10} className="table-cell">Address</Col>
                        <Col span={6} className="table-cell">Phone Number</Col>
                    </Row>

                    {/* Data Rows */}
                    {resourceData.map((item, index) => (
                        <Row key={index} className="table-row" style={{width:screens.xl || screens.lg ? '60vw' : ""}}>
                            <Col span={3} className="table-cell">{item.resourceId}</Col>
                            <Col span={5} className="table-cell">{item.resourceName}</Col>
                            <Col span={10} className="table-cell">
                                {`${item.address[0].houseNo}, ${item.address[0].street1}, ${item.address[0].street2}, ${item.address[0].city}, ${item.address[0].state}, ${item.address[0].country}`}
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
                <Row className="resource-grid" gutter={[16,16]}>
                    {resourceData.map((item)=>(
                        <Col key={item.resourceId}
                            xs={resourceData.length <= 1 ? 24 : 12} 
                            sm={resourceData.length <= 1 ? 24 : 12} 
                            md={resourceData.length <= 2 ? 20 : 8}  
                            lg={resourceData.length <= 2 ? 20 : 6}
                            xl={resourceData.length <= 2 ? 20 : 6}>
                                <NameCard key={item.resourceId}
                                    customerId={item.resourceId}
                                    customerName={item.resourceName}
                                    phoneNumber={item.phoneNumber}
                                    address={item.address}
                                    status={item.status}
                                    comments={item.comments}
                                    subscriptions={""}
                                    setDuplicateData={setDuplicateData}
                                    commentBox = {commentBox}
                                    setCommentBox = {setCommentBox}
                                />
                        </Col>
                    ))}
                    <Col xs={resourceData.length <= 1 ? 24 : 12} 
                        sm={resourceData.length <= 1 ? 24 : 12} 
                        md={resourceData.length <= 2 ? 20 : 8}  
                        lg={resourceData.length <= 2 ? 20 : 6} 
                        xl={resourceData.length <= 2 ? 20 : 6}
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
              onCancel={()=> setAddNewResourceModal(false)}
              footer={null}
              >
              <AddNewNameCard
                setNewRecordName={setNewRecordName}
                setNewRecordLastName={setNewRecordLastName}
                setNewRecordPhone={setNewRecordPhone}
                setNewRecordAddress={setNewRecordAddress}
                setNewRecordCity={setNewRecordCity}
                setNewRecordState={setNewRecordState}
                setNewRecordCountry={setNewRecordCountry}
                setNewRecordStatus={setNewRecordStatus}
                newRecordStatus={newRecordStatus}
                handleAddNewResource={handleAddNewResource}
                resourcePage={true}
                />
            </Modal>
    </div>);
};
export default ResourcePage;