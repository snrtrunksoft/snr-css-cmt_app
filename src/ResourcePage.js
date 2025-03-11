import React, { useEffect, useState } from "react";
import NameCard from "./NameCard";
import "./ResourcePage.css";
import { LoadingOutlined } from "@ant-design/icons";

const ResourcePage = ({ setDuplicateData, commentBox, setCommentBox }) =>{
    const [ data, setData ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);
    useEffect(() =>{
    console.log("initial loading, fetching resource data from the Database");
      const fetchingData = async() => {
        try{
          const Data = await fetch("https://yk216g0lxb.execute-api.us-east-2.amazonaws.com/resources");
          const fetchedData = await Data.json();
          console.log("fetching Resource Data from database is complete");
          console.log("Fetched Resource Data:",fetchedData);
          setData(fetchedData);
        }catch(error){
          console.log("fail in fetching resource Data");
          console.error("Error while fetching resource Data",error);
        }finally{
          setIsLoading(false);
        }
      }
      fetchingData();
  },[]);
    console.log("Resource:",data);
    return(
    <div className="resource-app">
        {isLoading ? (<h3><LoadingOutlined/> Loading....</h3>) : 
            <div className="resource-grid">
            {data.map((item)=>(
                <NameCard key={item.resourceId}
                    customerId={item.resourceId}
                    customerName={item.resourceName}
                    phoneNumber={item.phoneNumber}
                    address={item.address}
                    status={item.status}
                    comments={item.comments}
                    subscriptions={item.subscriptions}
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