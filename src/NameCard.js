import React, { useState } from "react";
import "./NameCard.css";

const NameCard = ({ Name, Phone, Address, Status }) => {
    const [isHovered, setIsHovered] = useState(false);
    let color = "red";
    if(Status === "Complete"){
        color = "lightgreen";
    }
    if(Status === "New"){
        color = "pink";
    }
    if(Status === "In-progress"){
        color = "lightblue";
    }
    if(Status === "Cancelled"){
        color = "red";
    }
    return(
        <div>
            <div 
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)} 
                className="nameCard" 
                style={{
                    boxShadow: isHovered ? `0px 8px 20px ${color}` : `0px 0px 6px ${color}`,
                    transition:'box-shadow 0.3s ease'
                    }}>
                <h3>Name : { Name }</h3>
                <p>Phone : { Phone }</p>
                <p>Address : { Address }</p>
                <p>Status : { Status }</p>
            </div>
        </div>
    );
};

export default NameCard;