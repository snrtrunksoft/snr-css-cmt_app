import React, { useState } from "react";
import "./TodosPage.css";
import dayjs from "dayjs";

const TodosPage = ({sampleData}) =>{
    const [ currentDate, setCurrentDate ] = useState(dayjs());
    const colors = ["lightblue", "lightgreen", "pink",];
    
    return(
        <div className="list"> 
            <h2>{currentDate.date()} {currentDate.format("MMMM")}, {currentDate.format("YYYY")}</h2>
            {sampleData.map((prev,index) => prev.month === currentDate.format("MMMM") &&
            parseInt(prev.year) === parseInt(currentDate.format("YYYY")) &&
            parseInt(prev.date) === currentDate.date() ? 
            prev.events.map(item => item.from >= currentDate.hour() ?  
            <div key={index} className="list-item" style={{boxShadow:`0px 2px 5px ${colors[index % colors.length]}`}}>
                <span>{dayjs().hour(item.from).format("h A")} - {dayjs().hour(item.to).format("h A")}</span>
                <span>{item.title}</span>
            </div> : <div key={index} className="list-item" style={{boxShadow:`0px 2px 5px gray`}}>
                <span>{dayjs().hour(item.from).format("h A")} - {dayjs().hour(item.to).format("h A")}</span>
                <span>{item.title}</span>
            </div> ):"")}
        </div>
    );
};
export default TodosPage;