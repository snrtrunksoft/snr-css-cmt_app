import { Switch } from "antd";
import React from "react";
import "./Header.css";

const Header = ({ dropDownList, dataView, setDataView, setHideDashboard, hideDashboard }) =>{
    return(
        <header className="header">
            <div className="header-left">
                <h3>SNR CMT APP</h3>
            </div>
            <div className='header-right'>
                Status: {dropDownList}
                Switch View
                <Switch
                style={{margin:'0px 10px'}}  
                onClick={()=>{ dataView === "grid" ? setDataView("table") : setDataView("grid")}}
                ></Switch>
                Dashboard Off
                <Switch
                checked={hideDashboard}
                style={{margin:'0px 10px'}} 
                onClick={() => setHideDashboard((prev) => !prev)}
                >
                </Switch>
            </div>
        </header>
    );
};

export default Header;