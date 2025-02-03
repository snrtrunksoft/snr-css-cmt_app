import React from "react";
import "./NameCard.css";

const NameCard = ({ Name, Phone, Address, Status }) => {
    return(
        <div>
            <div className="nameCard">
                <h3>Name : { Name }</h3>
                <p>Phone : { Phone }</p>
                <p>Address : { Address }</p>
                <p>Status : { Status }</p>
            </div>
        </div>)
}

export default NameCard;