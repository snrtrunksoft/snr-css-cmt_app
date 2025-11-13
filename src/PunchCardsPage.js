import React, { useState, useEffect } from "react";
import { Button, Checkbox, Col, Row, message } from "antd";
import { SUBSCRIPTIONS_API } from "./properties/EndPointProperties";
import { LoadingOutlined, SwapOutlined } from "@ant-design/icons";

const PunchCardsPage = ({data, customerId, customerName, setNewComment, handleSend, subscriptions, color}) => {
    const [ flippedCards, setFlippedCards ] = useState({});
    const [ punchCards, setPunchCards ] = useState(subscriptions);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ checkedServices, setCheckedServices ] = useState({});
    const [ subscriptionStatus, setSubscriptionStatus ] = useState("ACTIVE");
    const [effectiveEntityId, setEffectiveEntityId] = useState(null);

    useEffect(() => {
      if (!effectiveEntityId && typeof window !== "undefined") {
        try {
          const storedId = localStorage.getItem("entityId");
          if (storedId) {
            setEffectiveEntityId(storedId);
            console.log("PunchCardsPage using entityId from localStorage:", storedId);
          }
        } catch (e) {
          console.log("Unable to read entityId from localStorage in PunchCardsPage", e);
        }
      }
    }, [effectiveEntityId]);

    const handleCheckboxChange = (e, value, index) => {
        const cardId = value.id;
        const isChecked = e.target.checked;
        
        // Get current set or create new one
        let currentSet = checkedServices[cardId];
        if (!currentSet || !(currentSet instanceof Set)) {
            currentSet = new Set();
        } else {
            currentSet = new Set(currentSet); // Create a copy
        }
        
        // Add or remove index from the set
        if (isChecked) {
            currentSet.add(index);
        } else {
            currentSet.delete(index);
        }
        
        // Update state with new object
        const count = currentSet.size;
        setCheckedServices(prev => ({
            ...prev,
            [cardId]: currentSet
        }));
        
        setNewComment(count > 0 ? `Subscription ID: ${cardId}, Selected Cards: ${count}` : "");
    };

    const addNewSubscription = () => {
        setIsLoading(true);
        const updateSubscriptionData = async() =>{
            try{
                const newSub = {
                    status: "ACTIVE",
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
                        "entityid" : effectiveEntityId || "",
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
        const cardId = value.id;
        const currentCheckedCount = checkedServices[cardId]?.size || 0;
        
        console.log("💾 Saving - Card ID:", cardId, "Checked Count:", currentCheckedCount);
        console.log("Checked indices:", Array.from(checkedServices[cardId] || new Set()));
        
        // if (currentCheckedCount === 0) {
        //     message.warning("Please select at least one service to save");
        //     return;
        // }

        const updateSubscriptionsCheckboxes = async () => {
            console.log("helloooo");
            const updatedSubscriptionDetails = {
                    "noOfServicesCompleted": (parseInt(value.noOfServicesCompleted) + currentCheckedCount).toString(),
                    "noOfServicesLeft": Math.max(0, parseInt(value.noOfServicesLeft) - currentCheckedCount).toString(),
                    "totalNumberOfServices": value.totalNumberOfServices,
                    "purchasedDate": value.purchasedDate,
                    "completedDate": value.completedDate,
                    "status": Math.max(0, parseInt(value.noOfServicesLeft) - currentCheckedCount) === 0 ? "COMPLETED" : value.status,
                    "memberId": value.memberId
                }
                console.log(updatedSubscriptionDetails);
            try{
                const response = await fetch(SUBSCRIPTIONS_API + value.id,{
                    method : "PUT",
                    headers : {
                        "entityid" : effectiveEntityId || "",
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify(updatedSubscriptionDetails)
                })
                
                if (response.ok) {
                    const data = await response.json();
                    console.log("✅ subscriptions details updated:", data);
                    message.success(`Successfully saved ${currentCheckedCount} service(s)`);
                    // Update punch cards
                    setPunchCards((prevCards) =>
                        prevCards.map((prev) => {
                            if(prev.id === cardId) {
                                console.log("Updating card - Old completed:", prev.noOfServicesCompleted, "Adding:", currentCheckedCount);
                                return {
                                    ...prev,
                                    noOfServicesCompleted: parseInt(prev.noOfServicesCompleted) + currentCheckedCount,
                                    noOfServicesLeft: Math.max(0, parseInt(prev.noOfServicesLeft) - currentCheckedCount),
                                    status: Math.max(0, parseInt(prev.noOfServicesLeft) - currentCheckedCount) === 0 ? 'COMPLETED' : prev.status
                                }
                            } 
                            return prev;
                        })
                    );
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } catch(error) {
                console.error("❌ unable to update the subscriptions:", error);
                message.error("Failed to save services");
            }
        }
        
        // Clear checked services FIRST before updating - with proper state
        console.log("Clearing checked services for card:", cardId);
        const newCheckedServices = { ...checkedServices };
        newCheckedServices[cardId] = new Set();
        setCheckedServices(newCheckedServices);
        
        updateSubscriptionsCheckboxes();
        handleSend();
    };
    
    const handleClearSelection = (cardId) => {
        setCheckedServices(prev => {
            const newState = { ...prev };
            newState[cardId] = new Set();
            console.log("🗑️ Cleared checkboxes for card:", cardId);
            console.log("Updated checkedServices:", newState);
            return newState;
        });
        setNewComment("");
    };

    const toggleFlip = (cardId) => {
        setFlippedCards(prev => ({
            ...prev,
            [cardId]: !prev[cardId]
        }));
    };
    
    const filterSubscriptions = punchCards.filter((card) => card.status === subscriptionStatus);
    
    return(
        <div className="punch-cards-container">
        {data && <h2 style={{ marginBottom: '20px', color: '#333' }}>Punch Cards:</h2>}
        
        {/* Subscription Status Toggle */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
            <Button 
                type={subscriptionStatus === 'ACTIVE' ? 'primary' : 'default'}
                onClick={() => setSubscriptionStatus('ACTIVE')}
                size="large"
            >
                Active Subscriptions
            </Button>
            <Button 
                type={subscriptionStatus === 'COMPLETED' ? 'primary' : 'default'}
                onClick={() => setSubscriptionStatus('COMPLETED')}
                size="large"
            >
                Completed Subscriptions
            </Button>
        </div>

        {filterSubscriptions && filterSubscriptions.length > 0 ? (
            <div className="punch-cards-grid">
            {filterSubscriptions.map((card) => (
                <div key={card.id} className={`punch-card ${flippedCards[card.id] ? "flipped" : ""}`}>
                <div className="punch-card-inner">
                    
                    {/* ---- FRONT ---- */}
                    <div className="punch-card-front" style={{ backgroundColor: color, borderColor: color }}>
                    <div className="punch-card-header">
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Subscription Services</h3>
                            <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
                                {card.noOfServicesCompleted}/{card.totalNumberOfServices} Completed
                            </p>
                        </div>
                        <div className="status-badge" style={{ 
                            backgroundColor: card.status === 'COMPLETED' ? '#52c41a' : '#faad14',
                            color: '#fff'
                        }}>
                            {card.status}
                        </div>
                    </div>
                    
                    <div className="punchCards">
                        {Array.from({ length: Number(card.noOfServicesCompleted) }, (_, index) => (
                        <div key={`done-${index}`} className="individualCards completed-card">
                            <Checkbox checked disabled />
                            <span className="card-label">✓</span>
                        </div>
                        ))}
                        {Array.from({ length: Number(card.noOfServicesLeft) }, (_, index) => {
                            const isChecked = checkedServices[card.id]?.has(index) || false;
                            return (
                            <div key={`left-${index}`} className={`individualCards uncompleted-card ${isChecked ? 'checked-service' : ''}`}>
                                <Checkbox 
                                    checked={isChecked}
                                    onChange={(e) => handleCheckboxChange(e, card, index)}
                                />
                            </div>
                            );
                        })}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {(checkedServices[card.id]?.size || 0) > 0 ? (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Button 
                                    type="primary" 
                                    size="small"
                                    onClick={() => handleSave(card)}
                                    style={{ backgroundColor: color, borderColor: color }}
                                >
                                    Save ({checkedServices[card.id]?.size})
                                </Button>
                                <Button 
                                    size="small"
                                    onClick={() => handleClearSelection(card.id)}
                                >
                                    Clear
                                </Button>
                            </div>
                        ) : (
                            <div></div>
                        )}
                        <Button 
                            className="flip-btn" 
                            onClick={() => toggleFlip(card.id)} 
                            icon={<SwapOutlined />}
                            title="View details"
                        />
                    </div>
                    </div>

                    {/* ---- BACK ---- */}
                    <div className="punch-card-back">
                    <div className="flipped-content">
                        <div className="detail-item">
                            <strong>{customerName}</strong>
                        </div>
                        <div className="detail-item">
                            Purchased: {card.purchasedDate}
                        </div>
                        <div className="detail-item">
                            Expires: {card.completedDate}
                        </div>
                        <div className="detail-item">
                            Total: {card.totalNumberOfServices}
                        </div>
                        <div className="detail-item">
                            Completed: {card.noOfServicesCompleted}
                        </div>
                        <div className="detail-item" style={{ color: '#ffd700', fontWeight: 'bold' }}>
                            Remaining: {card.noOfServicesLeft}
                        </div>
                    </div>
                    <Button
                        className="flip-btn"
                        onClick={() => toggleFlip(card.id)}
                        icon={<SwapOutlined />}
                        style={{ background: "rgba(255, 255, 255, 0.2)", color: "#fff" }}
                        title="View punch card"
                    />
                    </div>
                </div>
                </div>
            ))}
            </div>
        ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
                <p style={{ fontSize: '1.1rem' }}>No {subscriptionStatus.toLowerCase()} subscriptions</p>
            </div>
        )}

            {data && subscriptionStatus === 'ACTIVE' && punchCards.filter((prev) => prev.status === "ACTIVE").length === 0 ? 
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Button 
                        type="primary" 
                        size="large"
                        onClick={() => addNewSubscription()}
                        loading={isLoading}
                    >
                        + Add Active Subscription
                    </Button>
                </div> : ""}
        </div>);
}

export default PunchCardsPage;
