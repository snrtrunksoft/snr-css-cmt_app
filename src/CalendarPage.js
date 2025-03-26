import React, { useState, useEffect } from "react";
import "./CalendarPage.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button, Col, Divider, Dropdown, Menu, Modal, Pagination, Row, TimePicker } from "antd";
import dayjs from "dayjs";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarPage = ({ sampleData, setSampleData, duplicateData, resourceData}) => {
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
  const [currentHour, setCurrentHour] = useState(dayjs().hour());
  const [ calendarUserId, setCalendarUserId ]  = useState(null);
  const [ selectedMemberId, setSelectedMemberId ] = useState("");
  const [ selectedResourceId, setSelectedResourceId ] = useState("");
  const [ openAppointment, setOpenAppoinment ] = useState(false);  
  const [ bookSameSlot, setBookSameSlot ] = useState(false);

  const [ allEventsOnDay, setAllEventsOnDay ] = useState(Object.fromEntries(
      Array.from({ length: 24 }, (_, i) => [
        i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`,
        3
      ])
    )
);

  const decrement = () => {
    setAllEventsOnDay(prev => ({
      ...prev,
      [timeSlot]:Math.max(0,(prev[timeSlot] || 0) - 1)
    }));
  }

  useEffect(() => {
    const updateHour = () => {
      setCurrentHour(dayjs().hour());
    };

    updateHour();
    const interval = setInterval(updateHour, 3600000);
    return () => clearInterval(interval);
  }, []);

  console.log("allEventsOnDay:",allEventsOnDay);
  console.log("time Slot:",timeSlot);

  useEffect(()=>{
    setOpenAppoinment(sampleData.some(prev => 
      prev.month === monthName && 
      parseInt(prev.year) === currentDate.getFullYear() &&
      parseInt(prev.date) === (weekEventDate !== null ? weekEventDate : currentDate.getDate()) &&
      prev.events.some(item => item.from <= dayjs(timeSlot,"h A").format("HH") &&
        dayjs(timeSlot,"h A").format("HH") < item.to ? true : false )));
      },[currentDate,timeSlot])
  console.log("openAppointment:",openAppointment);

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

  let valueToSet = "";

  const filteredEvents = sampleData.flatMap(prev =>
    prev.month === monthName &&
    parseInt(prev.year) === currentDate.getFullYear() &&
    parseInt(prev.date) === (weekEventDate !== null ? weekEventDate : currentDate.getDate())
      ? prev.events.filter(item => {
          if (item.from <= dayjs(timeSlot, "h A").format("HH") && dayjs(timeSlot, "h A").format("HH") < item.to) {
            valueToSet = item;
            return true;
          }
          return false;
        })
      : []
  );
  console.log("filteredEvents:",filteredEvents);
  console.log("selected Event Item:",valueToSet);

  const [ currentPage, setCurrentPage ] = useState(1);
  const itemsForPage = 1;
  const startIndex = (currentPage - 1) * itemsForPage;
  const paginateEvents = filteredEvents.slice(startIndex,startIndex + itemsForPage);

  const handleCalendarEvent = () => {

    const eventDetails = {
      memberId:selectedMemberId,
      resourceId:selectedResourceId,
      date:currentDate.getDate().toString(),
      month:monthName,
      year:currentDate.getFullYear().toString(),
      title: eventTitle,
      from: fromTimeSlot,
      to: toTimeSlot,
      notes: eventNotes,
    };

    const updateEventSlot = async () =>{
      try{
        await fetch(`https://ipl9c1zvee.execute-api.us-east-2.amazonaws.com/event/${filteredEvents[currentPage - 1].id}`,{
          method: "PUT",
          headers: {
            "Content-Type" : "application/json"
          },
          body:JSON.stringify(eventDetails)
        })
        .then(responce  => responce.json())
        .then(data => console.log("updated event data:",data))
        setSampleData(prev =>
          prev.map(day => ({
            ...day,
            events:day.events.map(event =>
              event.id === filteredEvents[currentPage - 1].id ? { ...event,...eventDetails}: event
            )
          })
          ))
      }catch(error){
        console.log("unable to update the record",error);
      }
    };

    const addEventSlot = async () =>{
        try{
          const response = await fetch("https://ipl9c1zvee.execute-api.us-east-2.amazonaws.com/event/",{
            method:"POST",
            headers:{
              'Content-Type' : "application/json"
            },
            body:JSON.stringify(eventDetails)
          })
          const postData = await response.json();
          console.log("postData:",postData);
          const updatedRecord = {
            ...eventDetails,
            id:postData.eventId
          }
          console.log("new event record:",updatedRecord);
          decrement();
          const newEventRecord = {
            month:currentDate.toLocaleDateString("default",{month:"long"}),
            year:currentDate.getFullYear().toString(),
            userId:"ABC10!",
            date: (weekEventDate !== null ? weekEventDate : currentDate.getDate()).toString(),
            events : [updatedRecord,]
          };
          setSampleData((prevData) => {
            if (prevData.month === monthName && parseInt(prevData.date) === (weekEventDate !== null ? weekEventDate : currentDate.getDate())) {
              return {
                ...prevData,
                  events: [...(prevData.events || []),updatedRecord].sort(
                    (a, b) => a.from - b.from
                  ),
              };
            }
            return [...prevData,newEventRecord];
          }
        );
        }catch(error){
          console.log("unable to create new event:",error);
        }
      };

    if(valueToSet !== "" && bookSameSlot){
      updateEventSlot();
    }else{
      if(allEventsOnDay[timeSlot] >=1){
        addEventSlot();
        console.log("slot is available");
      }else{
        console.log("slot is not available");
      }
    }
    console.log(eventDetails);
    handleCloseEventSlot();
  };

  const deleteEvent = () =>{
    const deleteExistingEvent = async() => {
      try{
        await fetch(`https://ipl9c1zvee.execute-api.us-east-2.amazonaws.com/event/${filteredEvents[currentPage - 1].id}`,{
          method: "DELETE",
          headers: {
            "Content-Type" : "application/json"
          }
        })
        .then(responce => responce.json())
        .then(data => console.log("Deleted event Successfully",data))
        setSampleData((prevData) => 
        prevData.map(prev => ({
          ...prev,
          events: prev.events.filter(event => event.id !== filteredEvents[currentPage - 1].id)
        })));
      }catch(error){
        console.log("unable to delete Event",error);
      }
    }
    deleteExistingEvent();
  }

  console.log("sample Data:",sampleData);

  const handleCloseEventSlot = () =>{
    setOpenEventSlot(false);
    setSelectedMemberId("");
    setSelectedResourceId("");
    setEventTitle("");
    setEventNotes("");
    setTimeSlot("");  
  };

  const handleMembersDropDown = (value) => {
    setSelectedMemberId(value);
  };

  const handleResourceDropDown = (value) => {
    setSelectedResourceId(value);
  };

  const handleMembersMenu = (e) => {
    setSelectedMemberId(e.domEvent.target.textContent);
  };

  const filterMembers = duplicateData.filter((prev) => prev.customerName.toLowerCase().includes(selectedMemberId.toLowerCase()));
  const membersMenu = (
  <Menu onClick={handleMembersMenu}>
    {filterMembers.map((prev) => (<Menu.Item key={prev.customerId}>{prev.customerName}</Menu.Item>))}
  </Menu>);

  const handleResourceMenu = (e) => {
    setSelectedResourceId(e.domEvent.target.textContent);
  }

  const filterResources = resourceData.filter((prev) => prev.resourceName.toLowerCase().includes(selectedResourceId.toLowerCase()));
  const resourceMenu = (
  <Menu onClick={handleResourceMenu}>
    {filterResources.map((prev) =>(<Menu.Item key={prev.resourceId}>{prev.resourceName}</Menu.Item>))}
  </Menu>);

  const handleUpdateExistingEventDetails = (event) => {
    setOpenAppoinment(false);
    setSelectedMemberId(event.memberId);
    setSelectedResourceId(event.resourceId);
    setEventTitle(event.title);
    setEventNotes(event.notes);
    setFromTimeSlot(fromTimeSlot);
    setToTimeSlot(toTimeSlot);
  };

  const dropDownList = (
    <select 
      value={calendarUserId}
      onChange={(e) => setCalendarUserId(e.target.value)}
      style={{borderRadius:'5px',padding:'5px',fontSize:'15px',position:'absolute',left:'35px',top:'215px',outline:'none'}}>
      <option value="All">All</option>
      {resourceData.map(prevData => 
      <option>{prevData.resourceName}</option>)}
    </select>
  );


    const handleDailyCalendarEvent = (time) =>{
      setWeekEventDate(null);
      setOpenEventSlot(true);
      setTimeSlot(time === 0 ? "12 AM" : time < 12 ? `${time} AM` : time === 12 ? "12 PM" : `${time - 12} PM`);
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <Row hidden={!CalendarPage} style={{display:'flex',alignItems:'center',justifyContent:'center',}}>
          {dropDownList}
        </Row>
        <Row style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <Col style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                <Button onClick={() => setCurrentDate(new Date())}><h3>Today</h3></Button> &nbsp;&nbsp;
                <Button onClick={ handlePrev }><ChevronLeft/></Button> &nbsp;
                <Button onClick={ handleNext }><ChevronRight/></Button>
            </Col>
            <Col>
              <h2 hidden={openDailyCalendar}>{formattedDate}, {currentDate.getFullYear()}</h2>
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
        <h2 hidden={!openDailyCalendar}>{formattedDate}, {currentDate.getFullYear()}</h2>
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
            <div className="event-column" style={{ position: "relative" }}>
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} 
                  className="event-slot"
                  style={sampleData.some(prev => 
                  prev.month === monthName && 
                  parseInt(prev.year) === currentDate.getFullYear() && 
                  parseInt(prev.date) === currentDate.getDate() &&
                  prev.events.some(item => (item.from <= i && i < item.to))
                  ) ? {backgroundColor:'orange',borderRight:'2px solid gray',borderLeft:"2px solid gray",
                  borderBottom:sampleData.some(prev => 
                  prev.month === monthName && 
                  parseInt(prev.year) === currentDate.getFullYear() && 
                  parseInt(prev.date) === currentDate.getDate() &&
                  prev.events.some(item => i === item.to - 1)) ? "1px solid gray" :"1px solid transparent",
                  } :{}}
                  onClick={() => handleDailyCalendarEvent(i)}
                  >
                  {sampleData.map(prev => {
                    if(
                      prev.month === monthName &&
                      parseInt(prev.year) === currentDate.getFullYear() &&
                      parseInt(prev.date) === currentDate.getDate()
                    ){
                      return prev.events.map(item => {
                        const midpoint = Math.floor((item.from + item.to) / 2);
                        return i === midpoint ? item.title + ", " : "";
                      });
                    }
                    return "";
                  })}
                    {currentHour === i && (
                      <div
                        className="current-time-line"
                        style={{
                          position: "absolute",
                          left: 0,
                          width: "100%",
                          height: "2px",
                          backgroundColor: "violet",
                          top: 35,
                        }}
                      />
                    )}
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
                <div style={{position:'relative'}}>
                  <div hidden={weekdays[index]!=="Sun"} style={{position:"absolute",left:'-80px',width:'80px'}} className="week-days">
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
                            style={sampleData.some(prev =>
                              prev.month === monthName &&
                              parseInt(prev.year) === currentDate.getFullYear() &&
                              parseInt(prev.date) === day.getDate() &&
                              prev.events.some(item =>
                              (item.from <= dayjs(hour,"h A").format("HH")
                              && dayjs(hour,"h A").format("HH") < item.to)))
                              ? {backgroundColor:'orange',
                              borderBottom:sampleData.some(prev =>
                              prev.month === monthName &&
                              parseInt(prev.year) === currentDate.getFullYear() &&
                              parseInt(prev.date) === day.getDate() &&
                              prev.events.some(item => dayjs(hour,"h A").format("HH") == item.to - 1)) ? "1px solid gray" : "1px solid transparent"
                              } : {}}
                            onClick={() => {setOpenEventSlot(true);setTimeSlot(hour);setWeekEventDate(day.getDate());}}
                          >
                          {sampleData.map((prev) => {
                            if (
                              prev.month === monthName &&
                              parseInt(prev.year) === currentDate.getFullYear() &&
                              parseInt(prev.date) === day.getDate()
                            ) {
                              return prev.events.map((item) => {
                                const fromTime = parseInt(item.from, 10);
                                const toTime = parseInt(item.to, 10);
                                const midpoint = Math.floor((fromTime + toTime) / 2); // Midpoint calculation

                                return dayjs(hour, "h A").format("HH") == midpoint ? item.title : ""; // Show only at midpoint
                              });
                            }
                            return "";
                          })}
                          {currentHour == dayjs(hour, "h A").format("HH") && (
                            <div
                              className="current-time-line"
                              style={{
                                position: "absolute",
                                left: 0,
                                width: "100%",
                                height: "2px",
                                backgroundColor: "violet",
                                top: 30,
                              }}
                            />
                          )}
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
         title={timeSlot +" Slot"}
         onCancel={handleCloseEventSlot}
         footer={openAppointment ? 
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <Button disabled={allEventsOnDay[timeSlot] === 0 } onClick={() => {valueToSet = "";setBookSameSlot(false);setOpenAppoinment(false);}}>Book new Event</Button>
                    <Button onClick={()=> {handleUpdateExistingEventDetails(filteredEvents[currentPage - 1]);setBookSameSlot(true)}}>update</Button>
                    <Button danger onClick={()=> deleteEvent()}>Delete</Button>
                  </div> : <div>
                      <Button type="primary" onClick={handleCalendarEvent}>Ok</Button>
                    </div>}
         >
          <div>
            {!openAppointment ? 
            <div style={{display:'flex',textAlign:'left',flexDirection:'column'}}>
              <Row>
                <Dropdown overlay={membersMenu} trigger={["click"]}>
                  <input
                    style={{outline:'none',borderRadius:'5px',padding:'5px',fontSize:'15px',fontWeight:'bold',marginRight:'5px'}}
                    placeholder="Search for members"
                    value={selectedMemberId}
                    onChange={(e)=> handleMembersDropDown(e.target.value)}></input>
                </Dropdown>
                <Dropdown overlay={resourceMenu} trigger={["click"]}>
                  <input
                    style={{outline:'none',borderRadius:'5px',padding:'5px',fontSize:'15px',fontWeight:'bold'}}
                    placeholder="Search for resource"
                    value={selectedResourceId}
                    onChange={(e)=> handleResourceDropDown(e.target.value)}></input>
                </Dropdown>
              </Row>
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
                {paginateEvents.map(item => (
                  <center key={item.title}>
                    <h2 onClick={() => {handleUpdateExistingEventDetails(filteredEvents[currentPage - 1]);setBookSameSlot(true)}}>{item.title}</h2>
                  </center>
                ))}
              <Pagination
                current={currentPage}
                pageSize={itemsForPage}
                onChange={page => setCurrentPage(page)}
                total={filteredEvents.length}
                showSizeChanger={false}
                simple={true}
                style={{ marginTop: "10px", textAlign: "center" }}>
              </Pagination>
            </div>}
          </div>
         </Modal>
    </div>
  );
};

export default CalendarPage;
