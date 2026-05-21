import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button, Checkbox, message } from "antd";
import { createSubscription, updateSubscription, getMemberById } from "./api/APIUtil";
import { SwapOutlined } from "@ant-design/icons";

const getSubscriptionId = (card) => card?.subscriptionId || card?.id;

const getSubscriptionKey = (card, index = 0) =>
    getSubscriptionId(card)
    || [
        card?.memberId,
        card?.status,
        card?.purchasedDate,
        card?.completedDate,
        card?.totalNumberOfServices,
        card?.noOfServicesCompleted,
        card?.noOfServicesLeft,
        index
    ].filter(Boolean).join("-");

const PunchCardsPage = ({data, customerId, customerName, subscriptions: memberSubscriptions = [], setNewComment, handleSend, setData, entityId, color}) => {
    // ==================== STATE MANAGEMENT ====================
    const [flippedCards, setFlippedCards] = useState({});
    const [checkedServices, setCheckedServices] = useState({});
    const [subscriptionStatus, setSubscriptionStatus] = useState("ACTIVE");
    const [isLoading, setIsLoading] = useState(false);
    const [effectiveEntityId, setEffectiveEntityId] = useState(null);

    // ==================== EFFECTS ====================
    // Initialize entityId from localStorage
    useEffect(() => {
        if (entityId) {
            setEffectiveEntityId(entityId);
            return;
        }

        if (!effectiveEntityId && typeof window !== "undefined") {
            try {
                const storedId = localStorage.getItem("entityId");
                if (storedId) {
                    setEffectiveEntityId(storedId);
                    console.log("📍 PunchCardsPage using entityId from localStorage:", storedId);
                }
            } catch (e) {
                console.error("❌ Unable to read entityId from localStorage:", e);
            }
        }
    }, [effectiveEntityId, entityId]);

    // ==================== HELPER FUNCTIONS ====================
    // Get current member's subscriptions from parent data
    const getCurrentSubscriptions = useCallback(() => {
        if (Array.isArray(memberSubscriptions) && memberSubscriptions.length > 0) {
            return memberSubscriptions.map((subscription) => ({
                ...subscription,
                subscriptionId: getSubscriptionId(subscription)
            }));
        }
        if (!data || data.length === 0 || !customerId) return [];
        const memberData = data.find(member => member.id === customerId);
        return (memberData?.subscriptions || []).map((subscription) => ({
            ...subscription,
            subscriptionId: getSubscriptionId(subscription)
        }));
    }, [data, customerId, memberSubscriptions]);

    // Get filtered subscriptions based on status
    const punchCards = useMemo(() => {
        const subscriptions = getCurrentSubscriptions();
        return subscriptions.filter((card) => card.status === subscriptionStatus);
    }, [getCurrentSubscriptions, subscriptionStatus]);

    const refreshMember = useCallback(async () => {
        const resolvedEntityId = entityId || effectiveEntityId;
        if (!resolvedEntityId || !customerId) return null;

        const refreshedMember = await getMemberById(resolvedEntityId, customerId);
        setData(prevMembers =>
            prevMembers.map(member =>
                member.id === customerId ? { ...member, ...refreshedMember } : member
            )
        );
        return refreshedMember;
    }, [customerId, effectiveEntityId, entityId, setData]);

    // ==================== CHECKBOX HANDLING ====================
    const handleCheckboxChange = useCallback((e, card, serviceIndex, cardIndex) => {
        const cardKey = getSubscriptionKey(card, cardIndex);
        const isChecked = e.target.checked;
        
        setCheckedServices(prev => {
            const currentSet = prev[cardKey] ? new Set(prev[cardKey]) : new Set();
            
            if (isChecked) {
                currentSet.add(serviceIndex);
            } else {
                currentSet.delete(serviceIndex);
            }
            
            const count = currentSet.size;
            const subscriptionId = getSubscriptionId(card);
            setNewComment(count > 0 ? `Subscription ID: ${subscriptionId || "pending"}, Selected Cards: ${count}` : "");
            
            return {
                ...prev,
                [cardKey]: currentSet
            };
        });
    }, [setNewComment]);

    const handleClearSelection = useCallback((cardId) => {
        setCheckedServices(prev => ({
            ...prev,
            [cardId]: new Set()
        }));
        setNewComment("");
        console.log("🗑️ Cleared selection for card:", cardId);
    }, [setNewComment]);

    // ==================== SUBSCRIPTION OPERATIONS ====================
    const addNewSubscription = useCallback(async () => {
        const resolvedEntityId = entityId || effectiveEntityId;

        if (!customerId || !resolvedEntityId) {
            message.error("Missing required information");
            return;
        }

        setIsLoading(true);
        try {
            const newSub = {
                status: "ACTIVE",
                noOfServicesLeft: "10",
                noOfServicesCompleted: "0",
                totalNumberOfServices: "10",
                purchasedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).replace(/[, ]+/g, '-'),
                completedDate: "june-09-2026",
                memberId: customerId
            };

            const postData = await createSubscription(resolvedEntityId, newSub);
            
            const newSubscriptionWithId = {
                ...newSub,
                subscriptionId: postData.subscriptionId || postData.id
            };

            console.log("✅ New subscription created:", newSubscriptionWithId);
            message.success("Subscription added successfully");

            // Update parent data
            setData(prevMembers =>
                prevMembers.map(member => {
                    if (member.id === customerId) {
                        return {
                            ...member,
                            subscriptions: [...(member.subscriptions || []), newSubscriptionWithId]
                        };
                    }
                    return member;
                })
            );

            // Refresh member so embedded subscriptions stay in sync with the subscription API.
            try {
                await refreshMember();
                console.log("✅ Member updated with new subscription");
            } catch (err) {
                message.warning("Subscription was saved, but member refresh failed.");
            }
        } catch (error) {
            console.error("❌ Error creating subscription:", error);
            message.error("Failed to add subscription");
        } finally {
            setIsLoading(false);
        }
    }, [customerId, effectiveEntityId, entityId, refreshMember, setData]);

    const handleSave = useCallback(async (card, cardIndex) => {
        const cardKey = getSubscriptionKey(card, cardIndex);
        const checkedCount = checkedServices[cardKey]?.size || 0;

        const resolvedEntityId = entityId || effectiveEntityId;
        if (!resolvedEntityId) {
            message.error("Missing required information");
            return;
        }

        if (checkedCount === 0) {
            message.warning("Please select at least one service");
            return;
        }

        setIsLoading(true);

        try {
            const cardId = getSubscriptionId(card);

            if (!cardId) {
                message.error("Missing subscription id in member data. Please refresh and try again.");
                return;
            }

            // Calculate updated values
            const newCompleted = parseInt(card.noOfServicesCompleted) + checkedCount;
            const newLeft = Math.max(0, parseInt(card.noOfServicesLeft) - checkedCount);
            const newStatus = newLeft === 0 ? "COMPLETED" : card.status;

            const updatedSubscriptionDetails = {
                noOfServicesCompleted: newCompleted.toString(),
                noOfServicesLeft: newLeft.toString(),
                totalNumberOfServices: card.totalNumberOfServices,
                purchasedDate: card.purchasedDate,
                completedDate: card.completedDate,
                status: newStatus,
                memberId: card.memberId || customerId
            };

            console.log("💾 Sending update:", updatedSubscriptionDetails);

            await updateSubscription(resolvedEntityId, cardId, updatedSubscriptionDetails);
            
            console.log("✅ Subscription updated from API");

            // Create updated card object
            const updatedCard = {
                ...card,
                subscriptionId: cardId,
                noOfServicesCompleted: newCompleted,
                noOfServicesLeft: newLeft,
                status: newStatus
            };
            const updatedSubscriptions = getCurrentSubscriptions().map((subscription) =>
                getSubscriptionId(subscription) === cardId ? updatedCard : subscription
            );
            const subscriptionComment = `${cardId}: ${checkedCount > 1 ? `${checkedCount} service(s)` : '1 service'} completed. ${newLeft} remaining.`;

            try {
                await refreshMember();
            } catch (refreshError) {
                console.error("Failed to refresh member after subscription update:", refreshError);
                setData(prevMembers =>
                    prevMembers.map(member => {
                        if (member.id === customerId) {
                            return {
                                ...member,
                                subscriptions: (member.subscriptions || []).map(sub =>
                                    getSubscriptionId(sub) === cardId ? updatedCard : sub
                                )
                            };
                        }
                        return member;
                    })
                );
            }

            try {
                await handleSend(subscriptionComment, {
                    showStatus: false,
                    subscriptionsOverride: updatedSubscriptions
                });
            } catch (commentError) {
                console.error("Subscription saved, but automatic comment failed:", commentError);
                message.warning("Subscription saved, but comment was not posted.");
            }

            // Clear checked services
            setCheckedServices(prev => ({
                ...prev,
                [cardKey]: new Set()
            }));

            setNewComment("");
            message.success(`Subscription saved. ${checkedCount} service(s) recorded.`);
            console.log("📝 UI updated with new card state:", updatedCard);

        } catch (error) {
            console.error("❌ Error saving subscription:", error);
            message.error("Failed to save services");
        } finally {
            setIsLoading(false);
            // handleSend();
        }
    }, [checkedServices, customerId, effectiveEntityId, entityId, getCurrentSubscriptions, refreshMember, setData, setNewComment, handleSend]);

    // ==================== UI INTERACTION ====================
    const toggleFlip = useCallback((cardId) => {
        setFlippedCards(prev => ({
            ...prev,
            [cardId]: !prev[cardId]
        }));
    }, []);

    // ==================== RENDER ====================
    const renderCardContent = (card, cardIndex) => {
        const cardKey = getSubscriptionKey(card, cardIndex);
        const completedCount = Number(card.noOfServicesCompleted);
        const leftCount = Number(card.noOfServicesLeft);

        return (
            <>
                {/* Completed Services */}
                {Array.from({ length: completedCount }, (_, index) => (
                    <div 
                        key={`completed-${cardKey}-${index}`} 
                        className="individualCards completed-card"
                    >
                        {/* <Checkbox checked disabled /> */}
                        <span className="card-label">✓</span>
                    </div>
                ))}

                {/* Remaining Services */}
                {Array.from({ length: leftCount }, (_, index) => {
                    const isChecked = checkedServices[cardKey]?.has(index) || false;
                    return (
                        <div 
                            key={`remaining-${cardKey}-${index}`}
                            className={`individualCards uncompleted-card ${isChecked ? 'checked-service' : ''}`}
                        >
                            <Checkbox
                                checked={isChecked}
                                onChange={(e) => handleCheckboxChange(e, card, index, cardIndex)}
                                disabled={isLoading}
                            />
                        </div>
                    );
                })}
            </>
        );
    };

    const renderActionButtons = (card, cardIndex) => {
        const cardKey = getSubscriptionKey(card, cardIndex);
        const checkedCount = checkedServices[cardKey]?.size || 0;

        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {checkedCount > 0 ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => handleSave(card, cardIndex)}
                            loading={isLoading}
                            style={{ backgroundColor: color, borderColor: color }}
                        >
                            Save ({checkedCount})
                        </Button>
                        <Button
                            size="small"
                            onClick={() => handleClearSelection(cardKey)}
                            disabled={isLoading}
                        >
                            Clear
                        </Button>
                    </div>
                ) : (
                    <div></div>
                )}
                <Button
                    className="flip-btn"
                    onClick={() => toggleFlip(cardKey)}
                    icon={<SwapOutlined />}
                    disabled={isLoading}
                    title="View details"
                />
            </div>
        );
    };
    
    return (
        <div className="punch-cards-container" style={{ padding: "0 16px 12px" }}>

  {/* ================= FILTER BUTTONS ================= */}
  <div
    style={{
      display: "flex",
      gap: 8,
      marginBottom: 12,
      justifyContent: "center",
    }}
  >
    <Button
      type={subscriptionStatus === "ACTIVE" ? "primary" : "default"}
      onClick={() => setSubscriptionStatus("ACTIVE")}
      size="middle"
    >
      Active
    </Button>

    <Button
      type={subscriptionStatus === "COMPLETED" ? "primary" : "default"}
      onClick={() => setSubscriptionStatus("COMPLETED")}
      size="middle"
    >
      Completed
    </Button>
  </div>

  {/* ================= CARDS GRID ================= */}
  {punchCards.length > 0 ? (
    <div className="punch-cards-grid">
      {punchCards.map((card, cardIndex) => {
        const cardKey = getSubscriptionKey(card, cardIndex);
        return (
        <div
          key={cardKey}
          className={`punch-card ${flippedCards[cardKey] ? "flipped" : ""}`}
        >
          <div className="punch-card-inner">

            {/* ========== FRONT ========== */}
            <div
              className="punch-card-front"
              style={{ backgroundColor: color, borderColor: color }}
            >
              {/* Header */}
              <div
                className="punch-card-header"
                style={{ marginBottom: 8 }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      lineHeight: "18px",
                    }}
                  >
                    Subscription Services
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      opacity: 0.85,
                      marginTop: 2,
                    }}
                  >
                    {card.noOfServicesCompleted}/{card.totalNumberOfServices} completed
                  </div>
                </div>

                <div
                  className="status-badge"
                  style={{
                    fontSize: 11,
                    padding: "2px 8px",
                    borderRadius: 12,
                    backgroundColor:
                      card.status === "COMPLETED" ? "#52c41a" : "#faad14",
                    color: "#fff",
                  }}
                >
                  {card.status}
                </div>
              </div>

              {/* Punch grid */}
              <div className="punchCards">
                {renderCardContent(card, cardIndex)}
              </div>

              {/* Actions */}
              {renderActionButtons(card, cardIndex)}
            </div>

            {/* ========== BACK ========== */}
            <div className="punch-card-back">
              <div
                className="flipped-content"
                style={{ fontSize: 12, lineHeight: "18px" }}
              >
                <div className="detail-item" style={{ fontWeight: 600 }}>
                  {customerName}
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

                <div
                  className="detail-item"
                  style={{ color: "#ffd700", fontWeight: 600 }}
                >
                  Remaining: {card.noOfServicesLeft}
                </div>
              </div>

              <Button
                className="flip-btn"
                onClick={() => toggleFlip(cardKey)}
                icon={<SwapOutlined />}
                size="small"
                style={{
                  background: "rgba(255,255,255,0.2)",
                  color: "#fff",
                }}
                title="View punch card"
              />
            </div>

          </div>
        </div>
      )})}
    </div>
  ) : (
    <div
      style={{
        textAlign: "center",
        padding: "24px 12px",
        color: "#999",
        fontSize: 13,
      }}
    >
      No {subscriptionStatus.toLowerCase()} subscriptions
    </div>
  )}

  {/* ================= ADD SUBSCRIPTION ================= */}
  {data &&
    subscriptionStatus === "ACTIVE" &&
    punchCards.length === 0 && (
      <div style={{ textAlign: "center", marginTop: 12 }}>
        <Button
          type="primary"
          size="middle"
          onClick={addNewSubscription}
          loading={isLoading}
        >
          + Add Active Subscription
        </Button>
      </div>
    )}
</div>
    );
}

export default PunchCardsPage;
