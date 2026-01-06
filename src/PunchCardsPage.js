import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Button, Checkbox, message } from "antd";
import { createSubscription, updateSubscription, updateMember, deleteSubscription } from "./api/APIUtil";
import { SwapOutlined } from "@ant-design/icons";

const PunchCardsPage = ({data, customerId, customerName, setNewComment, handleSend, setData, entityId, color}) => {
    // ==================== STATE MANAGEMENT ====================
    const [flippedCards, setFlippedCards] = useState({});
    const [checkedServices, setCheckedServices] = useState({});
    const [subscriptionStatus, setSubscriptionStatus] = useState("ACTIVE");
    const [isLoading, setIsLoading] = useState(false);
    const [effectiveEntityId, setEffectiveEntityId] = useState(null);
    const prevSubscriptionIdsRef = useRef(new Set());

    // ==================== EFFECTS ====================
    // Initialize entityId from localStorage
    useEffect(() => {
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
    }, [effectiveEntityId]);

    // ==================== HELPER FUNCTIONS ====================
    // Get current member's subscriptions from parent data
    const getCurrentSubscriptions = useCallback(() => {
        if (!data || data.length === 0 || !customerId) return [];
        const memberData = data.find(member => member.id === customerId);
        return memberData?.subscriptions || [];
    }, [data, customerId]);

    // Get filtered subscriptions based on status
    const punchCards = useMemo(() => {
        const subscriptions = getCurrentSubscriptions();
        return subscriptions.filter((card) => card.status === subscriptionStatus);
    }, [getCurrentSubscriptions, subscriptionStatus]);

    // ==================== CHECKBOX HANDLING ====================
    const handleCheckboxChange = useCallback((e, card, index) => {
        const cardId = card.id;
        const isChecked = e.target.checked;
        
        setCheckedServices(prev => {
            const currentSet = prev[cardId] ? new Set(prev[cardId]) : new Set();
            
            if (isChecked) {
                currentSet.add(index);
            } else {
                currentSet.delete(index);
            }
            
            const count = currentSet.size;
            setNewComment(count > 0 ? `Subscription ID: ${cardId}, Selected Cards: ${count}` : "");
            
            return {
                ...prev,
                [cardId]: currentSet
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
        if (!customerId || !effectiveEntityId) {
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

            const postData = await createSubscription(effectiveEntityId, newSub);
            
            const newSubscriptionWithId = {
                ...newSub,
                id: postData.subscriptionId
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

            // Also persist the updated member (with new subscriptions) to the server
            try {
                // Build a payload similar to NameCard's shape and snapshot previous subscriptions
                const member = (data || []).find(m => m.id === customerId) || {};
                const prevSubscriptions = member.subscriptions ? [...member.subscriptions] : [];
                const updatedSubscriptions = [...prevSubscriptions, newSubscriptionWithId];

                const recordToUpload = {
                    ...(member.customerName ? { customerName: member.customerName } : {}),
                    status: member.status,
                    address: member.address,
                    email: member.email,
                    subscriptions: updatedSubscriptions,
                    groupId: Array.isArray(member.groupId) ? member.groupId.filter(Boolean).flat() : member.groupId ? [member.groupId] : [],
                    // groupId: Array.isArray(member.groupId) ? (member.groupId.length > 0 ? member.groupId : "") : (member.groupId || ""),
                    phoneNumber: member.phoneNumber,
                    comments: member.comments || []
                };

                // Remove server-only fields from subscriptions
                recordToUpload.subscriptions.forEach(sub => {
                    delete sub.entityId;
                    // delete sub.id;
                });

                await updateMember(effectiveEntityId, customerId, recordToUpload);
                message.success("Member updated with new subscription");
                console.log("✅ Member updated with new subscription");
            } catch (err) {
                console.error("❌ Failed to update member with new subscription:", err);

                // Rollback local UI state
                setData(prev =>
                    prev.map(member =>
                        member.id === customerId
                            ? { ...member, subscriptions: (member.subscriptions || []).filter(sub => sub.id !== newSubscriptionWithId.id) }
                            : member
                    )
                );

                // Try to delete the created subscription on the server
                try {
                    await deleteSubscription(effectiveEntityId, newSubscriptionWithId.id);
                    console.log("🗑️ Deleted subscription on server due to member update failure");
                } catch (delErr) {
                    console.error("❌ Failed to delete subscription after rollback:", delErr);
                }

                message.error("Failed to save member. New subscription was rolled back.");
            }
        } catch (error) {
            console.error("❌ Error creating subscription:", error);
            message.error("Failed to add subscription");
        } finally {
            setIsLoading(false);
        }
    }, [customerId, effectiveEntityId, setData]);

    const handleSave = useCallback(async (card) => {
        const cardId = card.id;
        const checkedCount = checkedServices[cardId]?.size || 0;

        if (checkedCount === 0) {
            message.warning("Please select at least one service");
            return;
        }

        setIsLoading(true);

        try {
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
                memberId: card.memberId
            };

            console.log("💾 Sending update:", updatedSubscriptionDetails);

            await updateSubscription(effectiveEntityId, cardId, updatedSubscriptionDetails);
            
            console.log("✅ Subscription updated from API");

            // Create updated card object
            const updatedCard = {
                ...card,
                noOfServicesCompleted: newCompleted,
                noOfServicesLeft: newLeft,
                status: newStatus
            };

            // Update parent data first
            setData(prevMembers =>
                prevMembers.map(member => {
                    if (member.id === customerId) {
                        return {
                            ...member,
                            subscriptions: (member.subscriptions || []).map(sub =>
                                sub.id === cardId ? updatedCard : sub
                            )
                        };
                    }
                    return member;
                })
            );

            // Clear checked services
            setCheckedServices(prev => ({
                ...prev,
                [cardId]: new Set()
            }));

            setNewComment("");
            message.success(`Successfully saved ${checkedCount} service(s)`);
            console.log("📝 UI updated with new card state:", updatedCard);

        } catch (error) {
            console.error("❌ Error saving subscription:", error);
            message.error("Failed to save services");
        } finally {
            setIsLoading(false);
            // handleSend();
        }
    }, [checkedServices, customerId, effectiveEntityId, setData, setNewComment, handleSend]);

    // ==================== UI INTERACTION ====================
    const toggleFlip = useCallback((cardId) => {
        setFlippedCards(prev => ({
            ...prev,
            [cardId]: !prev[cardId]
        }));
    }, []);

    // ==================== RENDER ====================
    const renderCardContent = (card) => {
        const completedCount = Number(card.noOfServicesCompleted);
        const leftCount = Number(card.noOfServicesLeft);

        return (
            <>
                {/* Completed Services */}
                {Array.from({ length: completedCount }, (_, index) => (
                    <div 
                        key={`completed-${card.id}-${index}`} 
                        className="individualCards completed-card"
                    >
                        {/* <Checkbox checked disabled /> */}
                        <span className="card-label">✓</span>
                    </div>
                ))}

                {/* Remaining Services */}
                {Array.from({ length: leftCount }, (_, index) => {
                    const isChecked = checkedServices[card.id]?.has(index) || false;
                    return (
                        <div 
                            key={`remaining-${card.id}-${index}`}
                            className={`individualCards uncompleted-card ${isChecked ? 'checked-service' : ''}`}
                        >
                            <Checkbox
                                checked={isChecked}
                                onChange={(e) => handleCheckboxChange(e, card, index)}
                                disabled={isLoading}
                            />
                        </div>
                    );
                })}
            </>
        );
    };

    const renderActionButtons = (card) => {
        const checkedCount = checkedServices[card.id]?.size || 0;

        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {checkedCount > 0 ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => handleSave(card)}
                            loading={isLoading}
                            style={{ backgroundColor: color, borderColor: color }}
                        >
                            Save ({checkedCount})
                        </Button>
                        <Button
                            size="small"
                            onClick={() => handleClearSelection(card.id)}
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
                    onClick={() => toggleFlip(card.id)}
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
      {punchCards.map((card) => (
        <div
          key={card.id}
          className={`punch-card ${flippedCards[card.id] ? "flipped" : ""}`}
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
                {renderCardContent(card)}
              </div>

              {/* Actions */}
              {renderActionButtons(card)}
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
                onClick={() => toggleFlip(card.id)}
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
      ))}
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
