import React from "react";
import MaintainLogo from "../../assets/illustration-maintenance.svg";
import "./ConstructionPage.css";

export const ConstructionPage= ()=>{
    return(
        <div className="contact-info" >
        <h3>This page is under construction</h3>
        <p className="p-info">Please check back later, or contact page admins for further help..!</p>
        <img src={MaintainLogo} alt="MaintainLogo" className="contact-image" style={{clipPath:"circle(50%)"}}/>
        </div>
    );
};