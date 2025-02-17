import React from "react";
import NameCard from "./NameCard";
import "./ResourcePage.css";

const ResourcePage = ({data,setDuplicateData,commentBox,setCommentBox}) =>{
    console.log("Resource:",data);
    return(
    <div className="resource-app">
        <div className="resource-grid">
            {data.map((item)=>(
                <NameCard key={item.customerId}
                    customerId={item.customerId}
                    customerName={item.customerName}
                    phoneNumber={item.phoneNumber}
                    address={item.address}
                    status={item.status}
                    comments={item.comments}
                    setDuplicateData={setDuplicateData}
                    commentBox = {commentBox}
                    setCommentBox = {setCommentBox}
                />)
            )}
            </div>
    </div>);
};
export default ResourcePage;