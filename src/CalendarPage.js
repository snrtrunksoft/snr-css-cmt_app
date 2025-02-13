import React, { useState, useEffect } from "react";
import "./CalendarPage.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button, Col, Divider, Row } from "antd";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarPage = () => {
  const [ currentDate, setCurrentDate] = useState(new Date());
  const [ days, setDays ] = useState([]);

  useEffect(() => {
    generateCalendar();
  }, [currentDate]);

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const prevMonthDays = new Date(year, month, 0).getDate(); 

    let tempDays = [];

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      tempDays.push({ day: prevMonthDays - i, type: "prev" });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      tempDays.push({ day: i, type: "current" });
    }

    let nextMonthDays = 1;
    while (tempDays.length % 7 !== 0) {
      tempDays.push({ day: nextMonthDays++, type: "next" });
    }

    setDays(tempDays);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <Row style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <Col style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                <Button onClick={() => setCurrentDate(new Date())}>Today</Button> &nbsp;&nbsp;
                <Button onClick={handlePrevMonth}><ChevronLeft/></Button> &nbsp;
                <Button onClick={handleNextMonth}><ChevronRight/></Button>
            </Col>
            <Col>
                <Button>Week</Button> &nbsp;
                <Button>Month</Button>
            </Col>
        </Row>
        <Divider type="horizontal"></Divider>
        <h2>
          {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
        </h2>
      </div>

      <div className="grid-container header1">
        {weekdays.map((day, index) => (
          <div key={index} className="grid-header-item">
            {day}
          </div>
        ))}

        {days.map((item, index) => (
          <div key={index}>
            <div 
              className={item.type === "current" ? "grid-item":"disabled"}
              style={{backgroundColor:(
                currentDate.getFullYear() === new Date().getFullYear() &&
                currentDate.getMonth() === new Date().getMonth() &&
                item.day === new Date().getDate()
                 ) ? "lightblue" : "" }}
              >{item.day}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarPage;
