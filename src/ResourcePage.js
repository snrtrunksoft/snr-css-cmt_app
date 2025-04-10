import React, { useEffect, useState } from "react";
import NameCard from "./NameCard";
import "./ResourcePage.css";
import { LoadingOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";

const ResourcePage = ({ resourceData,setDuplicateData, commentBox, setCommentBox }) =>{
    const [ isLoading, setIsLoading ] = useState(true);
    useEffect(() =>{
          setIsLoading(false);
    },[]);
    console.log("Resource:",resourceData);
    return(
    <div className="resource-app">
        {isLoading ? (<h3><LoadingOutlined/> Loading....</h3>) : 
            <Row className="resource-grid" gutter={[12,16]}>
                {resourceData.map((item)=>(
                    <Col key={item.resourceId} xs={12} sm={12} md={8} lg={6} xl={6}>
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
            </Row>
        }
    </div>);
};
export default ResourcePage;