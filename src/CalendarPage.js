import React, { useState, useEffect } from "react";
import "./CalendarPage.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button, Col, Divider, Modal, Row, TimePicker } from "antd";
import dayjs from "dayjs";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarPage = () => {
  const [ currentDate, setCurrentDate] = useState(new Date());
  const [ openWeekCalendar, setOpenWeekCalendar ] = useState(false);
  const [ openMonthCalendar, setOpenMonthCalendar ] = useState(true);
  const [ openDailyCalendar, setOpenDailyCalendar ] = useState(false);
  const [ days, setDays ] = useState([]);
  const [ openEventSlot, setOpenEventSlot ] = useState(false);
  const [ timeSlot, setTimeSlot ] = useState(null);
  const [ eventTitle, setEventTitle ] = useState('');
  const [ eventNotes, setEventNotes ] = useState('');
  const [ fromTimeSlot, setFromTimeSlot ] = useState(null);
  const [ toTimeSlot, setToTimeSlot ] = useState(null);
  const [ weekEventDate, setWeekEventDate ] = useState(null);

  const [ sampleData, setSampleData ] = useState([
        {
            "month": "March",
            "year": 2025,
            "userId": "ABC123",
            "1": {
              events:[]
            },
            "2": {
              events:[]
            },
            "3": {
              events:[]
            },
            "4": {
              events:[]
            },
            "5": {
              events:[]
            },
            "19":{
              events:[]
            },
            "10": {
                "isCalendarFull": false,
                "noOfEvents": 3,
                events: [
                    {
                        "title": "Appointment 1",
                        "from": 0,
                        "to": 1,
                        "notes": "appointment for dentist",
                    },
                    {
                        "title": "Appointment 2",
                        "from": 13,
                        "to": 18,
                        "notes": "appointment for dentist",
                    },
                ]
            }
        },
        {
          "month": "January",
            "year": 2025,
            "userId": "ABC133",
            "1": {
              events:[
                  {
                    "title": "Appointment 1",
                    "from": 0,
                    "to": 1,
                    "notes": "appointment for dentist",
                    },
                    {
                      "title": "Appointment 2",
                      "from": 13,
                      "to": 18,
                      "notes": "appointment for dentist",
                    },
              ]
            },
        }
      ]);


  const hours = Array.from({ length: 12 }, (_, i) => `${i === 0 ? 12 : i} AM`)
    .concat(Array.from({ length: 12 }, (_, i) => `${i === 0 ? 12 : i} PM`));

  const monthName = currentDate.toLocaleDateString("defult",{month:"long"});

  console.log("Hours Array:",hours);
  console.log("current year:",currentDate.getFullYear());

   const formattedDate = openDailyCalendar ? currentDate.toLocaleDateString("default", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }) : currentDate.toLocaleString("default", { month: "long" });

  console.log("formatted Date:",formattedDate);

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

  const getStartOfWeek = (date) => {
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - date.getDay());
    return startDate;
  };
    useEffect(() => {
      const format24Hour = dayjs(timeSlot,"h A").hour();
      setFromTimeSlot(format24Hour);
      setToTimeSlot(format24Hour + 1);
    },[timeSlot]);

  const getWeekDays = () => {
    const startOfWeek = getStartOfWeek(currentDate);
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  };

  const handlePrev = () => {
    if(openMonthCalendar){
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    }else if(openWeekCalendar){
      setCurrentDate((prev) => {
        const newDate = new Date(prev);
        newDate.setDate(prev.getDate() - 7); 
        return newDate;
      });
    }else{
      setCurrentDate((prev) =>{
        const newDate = new Date(prev);
        newDate.setDate(prev.getDate() - 1);
        return newDate;
      });
    }
  };

  const handleNext = () => {
    if(openMonthCalendar){
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    }else if(openWeekCalendar){
      setCurrentDate((prev) => {
        const newDate = new Date(prev);
        newDate.setDate(prev.getDate() + 7);
        return newDate;
      });
    }else{
      setCurrentDate((prev) =>{
        const newDate = new Date(prev);
        newDate.setDate(prev.getDate() + 1);
        return newDate;
      });
    }
  };

  const handleCalendarEvent = () => {
    const newEventRecord = {
      month:currentDate.toLocaleDateString("default",{month:"long"}),
      year:currentDate.getFullYear(),
      userId:"ABC10!",
      [weekEventDate !== null ? weekEventDate : currentDate.getDate()] : {
        events : [{
                  "title": eventTitle,
                  "from": fromTimeSlot,
                  "to": toTimeSlot,
                  "notes": eventNotes,
                  },
                ]
        },
    };
    setSampleData(prev => prev.month === monthName && prev.year === currentDate.getFullYear() ? 
    (weekEventDate !== null ? prev.weekEventDate : prev.currentDate.getDate()) ? {[( weekEventDate !== null ? weekEventDate : currentDate.getDate())] : {events: [...prev,{
      "title": eventTitle,
      "from": fromTimeSlot,
      "to": toTimeSlot,
      "notes": eventNotes,
    }]}} : 
    {[( weekEventDate !== null ? weekEventDate : currentDate.getDate())] : {
      events : [{
                "title": eventTitle,
                "from": fromTimeSlot,
                "to": toTimeSlot,
                "notes": eventNotes,
                },]},}
     : [...prev,newEventRecord]);
    console.log(newEventRecord);
    handleCloseEventSlot();
  };

  const handleCloseEventSlot = () =>{
    setOpenEventSlot(false);
    setEventTitle("");
    setEventNotes("");
  };

   const openAppointment = sampleData.some(prev => 
    prev.month === monthName && 
    prev.year === currentDate.getFullYear() &&
    prev[ weekEventDate !== null ? weekEventDate : currentDate.getDate()] ?
    prev[ weekEventDate !== null ? weekEventDate : currentDate.getDate()].events.some(item => item.from <= dayjs(timeSlot,"h A").format("HH") && dayjs(timeSlot,"h A").format("HH") <= item.to ? true : false ) : false );

    console.log("openAppointment:",openAppointment);

    const handleDailyCalendarEvent = (time) =>{
      setWeekEventDate(null);
      setOpenEventSlot(true);
      setTimeSlot(time === 0 ? "12 AM" : time < 12 ? `${time} AM` : time === 12 ? "12 PM" : `${time - 12} PM`);
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <Row style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <Col style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                <Button onClick={() => setCurrentDate(new Date())}><h3>Today</h3></Button> &nbsp;&nbsp;
                <Button onClick={ handlePrev }><ChevronLeft/></Button> &nbsp;
                <Button onClick={ handleNext }><ChevronRight/></Button>
            </Col>
            <Col>
                <Button onClick={()=>{setOpenDailyCalendar(true);setOpenWeekCalendar(false);setOpenMonthCalendar(false)}}
                style={{backgroundColor: openDailyCalendar ? "lightBlue" :"" }}><h3>Daily</h3></Button> &nbsp;
                <Button onClick={()=>{setOpenWeekCalendar(true);setOpenDailyCalendar(false);setOpenMonthCalendar(false);}}
                style={{backgroundColor: openWeekCalendar ? "lightBlue" :"" }}><h3>Week</h3></Button> &nbsp;
                <Button onClick={()=>{setOpenMonthCalendar(true);setOpenWeekCalendar(false);setOpenDailyCalendar(false);}}
                style={{backgroundColor: openMonthCalendar ? "lightBlue" :"" }}><h3>Month</h3></Button>
            </Col>
        </Row>
        <Divider type="horizontal"></Divider>
        <h2 >{formattedDate}, {currentDate.getFullYear()}</h2>
      </div>
      {(openMonthCalendar) ? (
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
              onClick={() => {setOpenMonthCalendar(false);setOpenDailyCalendar(true);setCurrentDate((prev) => new Date(prev.setDate(item.day)));}}
              style={{backgroundColor:(
                currentDate.getFullYear() === new Date().getFullYear() &&
                currentDate.getMonth() === new Date().getMonth() &&
                item.day === new Date().getDate() &&
                item.type === "current"
                 ) ? "lightblue" : ""}}
              >{item.day}</div>
          </div>
        ))}
      </div>
        ):(openDailyCalendar ? (
           <div className="day-view">
            <div className="time-column">
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="time-slot">
                  {i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`}
                </div>
              ))}
            </div>
            <div className="event-column">
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} 
                className="event-slot"
                style={sampleData.some(prev => 
                prev.month === monthName && 
                prev.year === currentDate.getFullYear() && 
                prev[currentDate.getDate()] &&
                prev[currentDate.getDate()].events.some(item => (item.from <= i && i <= item.to))
                ) ? {backgroundColor:'orange',borderBottom:'1px solid transparent',borderRight:'2px solid gray',borderLeft:"2px solid gray",
                borderTop:sampleData.some(prev => 
                prev.month === monthName && 
                prev.year === currentDate.getFullYear() && 
                prev[currentDate.getDate()] &&
                prev[currentDate.getDate()].events.some(item => i === item.from)
                ) ? 'solid gray' : "transparent",
                marginTop: sampleData.some(prev => 
                prev.month === monthName && 
                prev.year === currentDate.getFullYear() && 
                prev[currentDate.getDate()] &&
                prev[currentDate.getDate()].events.some(item => i === item.from)
                ) ? '-2px' : "",
                borderBottom:sampleData.some(prev => 
                prev.month === monthName && 
                prev.year === currentDate.getFullYear() && 
                prev[currentDate.getDate()] &&
                prev[currentDate.getDate()].events.some(item => i === item.to)
                ) ? 'solid gray' : "transparent",
                } :{}}
                onClick={() => handleDailyCalendarEvent(i)}
                >
                {sampleData.map(prev => {
                  if (
                    prev.month === monthName &&
                    prev.year === currentDate.getFullYear() &&
                    prev[currentDate.getDate()]
                  ) {
                    return prev[currentDate.getDate()].events.map(item => {
                      const midpoint = Math.ceil((item.from + item.to) / 2);
                      return i === midpoint ? item.title : "";
                    });
                  }
                  return "";
                })}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid-container header1" style={{display:'flex'}}>
            {getWeekDays().map((day, index) => (
              <div key={index}>
                <div 
                  className="grid-header-item"
                  style={{backgroundColor:(
                  currentDate.getFullYear() === new Date().getFullYear() &&
                  currentDate.getMonth() === new Date().getMonth() &&
                  day.getDate() === new Date().getDate()
                  ) ? "lightblue" : "",
                  opacity: day.getMonth() !== currentDate.getMonth() ? 0.5 : 1, 
                  pointerEvents: day.getMonth() !== currentDate.getMonth() ? "none" : "auto" 
                  }}
                >
                  <span className="day-name">{weekdays[index]}</span> &nbsp;
                  <span className="day-number">{day.getDate()}</span>
                </div>
                <div>
                  <div hidden={weekdays[index]!=="Sun"} style={{position:"absolute",left:'177px',width:'80px'}} className="week-days">
                  <div className="time-section" style={{borderBottom:'1px solid gray',backgroundColor:"#ececec"}}>all-day</div>
                    {hours.map((hour, index) => (
                      <div key={index} className="time-section" style={{backgroundColor:"#ececec"}}>
                        {hour}
                      </div>
                    ))}
                  </div>
                  <div 
                    className="week-days"
                    style={currentDate.getFullYear() === new Date().getFullYear() &&
                    currentDate.getMonth() === new Date().getMonth() &&
                    day.getDate() === new Date().getDate() ?
                    { border:'2px solid gray',marginTop:'-1px'}:{}}
                      >
                      <div className="time-section" style={{borderBottom:'1px solid gray'}}></div>
                    {hours.map((hour, index) => (
                      <div key={index} className="time-section"
                        style={{backgroundColor:sampleData.some(prev =>
                          prev.month === monthName &&
                          prev.year === currentDate.getFullYear() &&
                          prev[day.getMonth() === currentDate.getMonth() ? day.getDate() : -1] &&
                          prev[day.getDate()].events.some(item =>
                          (item.from <= dayjs(hour,"h A").format("HH")
                          && dayjs(hour,"h A").format("HH") <= item.to)))
                          ? "orange": "",borderBottom:sampleData.some(prev =>
                          prev.month === monthName &&
                          prev.year === currentDate.getFullYear() &&
                          prev[day.getMonth() === currentDate.getMonth() ? day.getDate() : -1] &&
                          prev[day.getDate()].events.some(item =>
                          (item.from <= dayjs(hour,"h A").format("HH")
                          && dayjs(hour,"h A").format("HH") <= item.to))) ? "1px solid orange":"",
                          opacity: day.getMonth() !== currentDate.getMonth() ? 0.5 : 1,
                          pointerEvents: day.getMonth() !== currentDate.getMonth() ? "none" : "auto"
                          }}
                        onClick={() => {setOpenEventSlot(true);setTimeSlot(hour);setWeekEventDate(day.getDate());}}
                      >
                      {sampleData.map(prev => prev.month === monthName &&
                        prev.year === currentDate.getFullYear() &&
                        prev[day.getMonth() === currentDate.getMonth() ? day.getDate() : -1] &&
                        prev[day.getDate()].events.map(item =>
                        (item.from <= dayjs(hour,"h A").format("HH") &&
                          dayjs(hour,"h A").format("HH") <= item.to) ? item.title :""))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          )
        )}
        <Modal
         open={openEventSlot}
         onCancel={handleCloseEventSlot}
         onOk={handleCalendarEvent}
         title={timeSlot +" Slot"}>
          <div>
            {!openAppointment ? 
            <div style={{display:'flex',textAlign:'left',flexDirection:'column'}}>
              <h2>Title :<input style={{border:'transparent',outline:'none',borderBottom:'3px solid purple',fontSize:'20px',marginLeft:'10px'}}
                  onChange={(e)=>setEventTitle(e.target.value)}
                  value={eventTitle}
                  /></h2>
                  <h2>Notes :<input style={{border:'transparent',outline:'none',borderBottom:'3px solid purple',fontSize:'20px',marginLeft:'10px'}}
                  onChange={(e)=>setEventNotes(e.target.value)}
                  value={eventNotes}
                  /></h2>
                  <h3>From :<TimePicker 
                                format="h A"
                                value={Number.isInteger(fromTimeSlot) ? dayjs().hour(fromTimeSlot) : fromTimeSlot}
                                onChange={(e) => setFromTimeSlot(e.hour())}
                                needConfirm={false}
                                /> &nbsp;&nbsp;
                      To :<TimePicker
                                format="h A"
                                value={Number.isInteger(toTimeSlot) ? dayjs().hour(toTimeSlot) : toTimeSlot}
                                onChange={(e) => setToTimeSlot(e.hour())}
                                needConfirm={false}
                                /></h3>
            </div> : <div style={{display:'flex',textAlign:'left',flexDirection:'column'}}>
              <center><h2>{sampleData.map(prev =>
              prev.month === monthName &&
              prev.year === currentDate.getFullYear() &&
              prev[weekEventDate !== null ? weekEventDate : currentDate.getDate()] &&
              prev[weekEventDate !== null ? weekEventDate : currentDate.getDate()].events.map(item => 
              item.from <= dayjs(timeSlot,"h A").format("HH") &&
              dayjs(timeSlot,"h A").format("HH") <= item.to ? item.title : "") 
              )}</h2></center>
            </div>}
          </div>
         </Modal>
    </div>
  );
};

export default CalendarPage;