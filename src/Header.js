import { Switch } from "antd";
import React, { useState } from "react";
import "./Header.css";

const Header = ({ dropDownList, dataView, setDataView, setHideDashboard, hideDashboard }) =>{
    const [ view, setView ] = useState("Grid");
    return(
        <header className="header">
            <div className="header-left">
                <h1 style={{color:'#FF5F09'}}>SNR&nbsp;</h1>
                <h1>CMT APP</h1>
            </div>
            <div className='header-right'>
                Status: {dropDownList}
                {view +" View"}
                <Switch
                style={{margin:'0px 10px'}}
                onClick={()=>{ 
                    dataView === "grid" ? setDataView("table") : setDataView("grid");
                    view === "Grid" ? setView("List") : setView("Grid")}}
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