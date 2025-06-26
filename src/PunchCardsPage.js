import React, { useState } from "react";
import { Button, Checkbox, Col, Row } from "antd";
import { MEMBERS_API, SUBSCRIPTIONS_API } from "./properties/EndPointProperties";
import { LoadingOutlined, SwapOutlined } from "@ant-design/icons";

const PunchCardsPage = ({customerId, customerName, setNewComment, handleSend, subscriptions, color}) => {
    const [ flipped, setFlipped ] = useState(false);
    const [ punchCardsState, setPunchCardsState ] = useState("Complete");
    const [ checkedCount, setCheckedCount ] = useState(0);
    const [ punchCards, setPunchCards ] = useState(subscriptions);
    const [ isLoading, setIsLoading ] = useState(false);

    const handleCheckboxChange = (e,value) => {
        const count = e.target.checked ? checkedCount + 1 : checkedCount - 1;
        setCheckedCount(count);
        setNewComment(count > 0 ?"Subscription ID: "+value.id +", selected Cards: "+count:"");
    };

    const addNewSubscription = () => {
        setIsLoading(true);
        const updateSubscriptionData = async() =>{
            try{
                const newSub = {
                    status: "Active",
                    noOfServicesLeft: "10",
                    noOfServicesCompleted: "0",
                    totalNumberOfServices: "10",
                    purchasedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).replace(/[, ]+/g, '-'),
                    completedDate: "june-09-2026",
                    memberId: customerId
                    };
                const responce = await fetch(SUBSCRIPTIONS_API ,{
                    method:'POST',
                    headers: {
                        'entityid' : 'w_123',
                        "Content-Type" : "application/json",
                    },
                    body:JSON.stringify(newSub)
                })
                const postData = await responce.json();
                const updatePostId = {
                    ...postData,
                    id: postData.subscriptionId
                }
                console.log("updated Subscription Data:",updatePostId);
                console.log("The new subscription:",newSub);

                setPunchCards((prev) => [...prev, newSub]);
            }catch(error){
                console.error("unable to update the record",error);
            } finally {
                setIsLoading(false);
            }
        }
        updateSubscriptionData();
    };
    const handleSave = (value) => {
        const updateSubscriptionsCheckboxes = async () => {
            const updatedSubscriptionDetails = {
                    "noOfServicesCompleted": (parseInt(value.noOfServicesCompleted) + checkedCount).toString(),
                    "noOfServicesLeft": Math.max(0, value.noOfServicesLeft - checkedCount).toString(),
                    "totalNumberOfServices": value.totalNumberOfServices,
                    "purchasedDate": value.purchasedDate,
                    "completedDate": value.completedDate,
                    "status": Math.max(0, value.noOfServicesLeft - checkedCount) === 0 ? "Complete" : value.status,
                    "memberId": value.memberId
                }
            try{
                await fetch(SUBSCRIPTIONS_API + value.id,{
                    method : "PUT",
                    headers : {
                        'entityid' : 'w_123',
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify(updatedSubscriptionDetails)
                })
                .then(response => response.json())
                .then(data => console.log("subscriptions details updated:", updatedSubscriptionDetails))
            } catch(error) {
                console.log("unable to update the subscriptions:",error);
            }
        }
        updateSubscriptionsCheckboxes();

        setPunchCards((prevCards) =>
        prevCards.map((prev) => {
            if(prev.id === value.id) {
                return {
                    ...prev,
                    noOfServicesCompleted: parseInt(value.noOfServicesCompleted) + checkedCount,
                    noOfServicesLeft: Math.max(0, value.noOfServicesLeft - checkedCount),
                    status: Math.max(0, prev.noOfServicesLeft - checkedCount) === 0 ? 'Complete' :value.status
                }
                // const servicesLeft = Math.max(0, prev.noOfServicesLeft - checkedCount);
                // if(servicesLeft === 0){
                //     return {
                //         ...prev,
                //         noOfServicesCompleted: parseInt(value.noOfServicesCompleted) + checkedCount,
                //         noOfServicesLeft: Math.max(0, prev.noOfServicesLeft - checkedCount),
                //         status:'Complete'
                //     }
                // }
                // return {
                //     ...prev,
                //     noOfServicesCompleted: parseInt(value.noOfServicesCompleted) + checkedCount,
                //     noOfServicesLeft: Math.max(0, prev.noOfServicesLeft - checkedCount),
                // }
            } 
            return prev;
        }
        ));
        handleSend();
        setCheckedCount(0);
    };
    
    const filterActiveSubscription = punchCards !== "" ? punchCards.filter((prev) => prev.status === "Active") : "";

    const toggleFlip = () => {
        setFlipped((prev) => !prev);
    };
    
    return(
        <div className="" >
        {punchCards.length ?  <>
        <h2>Punch cards:</h2>
            <Row>
                <Button onClick={() => {setFlipped(false);setPunchCardsState((prev) => prev === "Complete" ? "Active": "Complete")}}>View {punchCardsState}</Button> &nbsp;
            </Row>
            {isLoading ? (<center style={{padding:'10px'}}><LoadingOutlined/>Loading...</center>)
            : punchCards.filter((card) => card.status !== punchCardsState)
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

                    {checkedCount ?<Row style={{display:'flex',alignItems:'center',justifyContent:'center'}}><Button type="primary" onClick={()=>handleSave(card)}>Save</Button></Row>:""}
                </div>
                ))}
                <span>{filterActiveSubscription.length === 0 ? 
                <center><Button style={{margin:'5px'}} onClick={() => addNewSubscription()}>Add Active Subscription</Button></center> : ""}</span>
        </>: ""}
        </div>);
}

export default PunchCardsPage;
