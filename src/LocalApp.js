import React, { useState } from "react";
import CmtApp from "./CmtApp";

const LocalApp = () => {
    // Group messaging - track unread status per group
    const [selectedGroup, setSelectedGroup] = useState("undefined");
    const [groupMessages, setGroupMessages] = useState({
    undefined : { messages: ["Hello Group!", "Meeting at 3 PM", "Please confirm"], hasUnread: true },
    group_2: { messages: ["Budget review needed", "Q4 planning"], hasUnread: true },
    group_3: { messages: ["Project update"], hasUnread: false },
    });
    return(
        <CmtApp selectedGroup={selectedGroup} groupMessages={groupMessages} setGroupMessages={setGroupMessages} />
    )
};

export default LocalApp;