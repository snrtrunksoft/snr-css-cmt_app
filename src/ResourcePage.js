import React, { useEffect, useState } from "react";
import NameCard from "./NameCard";
import "./ResourcePage.css";
import { LoadingOutlined } from "@ant-design/icons";

const ResourcePage = ({ resourceData,setDuplicateData, commentBox, setCommentBox }) =>{
    const [ isLoading, setIsLoading ] = useState(true);
    useEffect(() =>{
          setIsLoading(false);
    },[]);
    console.log("Resource:",resourceData);
    return(
    <div className="resource-app">
        {isLoading ? (<h3><LoadingOutlined/> Loading....</h3>) : 
            <div className="resource-grid">
            {resourceData.map((item)=>(
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
                />)
            )}
            </div>
        }
    </div>);
};
export default ResourcePage;