import React, { useState, useEffect } from "react";
import "./CalendarPage.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CALENDAR_API, EVENTS_API, RECURRING_CALENDAR_API } from "./properties/EndPointProperties";

import { Button, Checkbox, Col, Divider, Dropdown, Select, Menu, Modal, Pagination, Row, TimePicker, Grid } from "antd";

import dayjs from "dayjs";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const { useBreakpoint } = Grid;

const CalendarPage = ({ sampleData, setSampleData, duplicateData, resourceData}) => {
  const [ currentDate, setCurrentDate] = useState(new Date());
  const [ openWeekCalendar, setOpenWeekCalendar ] = useState(true);
  const [ openMonthCalendar, setOpenMonthCalendar ] = useState(false);
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
  const [ calendarUserId, setCalendarUserId ]  = useState("All");
  const [ selectedMemberId, setSelectedMemberId ] = useState("");
  const [ selectedResourceId, setSelectedResourceId ] = useState("");
  const [ openAppointment, setOpenAppointment ] = useState(false);
  const [ bookSameSlot, setBookSameSlot ] = useState(false);
  const [ resourceCalendar, setResourceCalendar ] = useState([]);
  const [ newErrors, setNewErrors ] = useState({});
  const [ memberDropDown, setMemberDropDown ] = useState(false);
  const [ resourceDropDown, setResourceDropDown ] = useState(false);
  const [ recurring, setRecurring ] = useState(false);
  const [ frequencyOfEvent, setFrequencyOfEvent ] = useState("noRecurring");
  const [ weeklyDayRecurring, setWeeklyDayRecurring ] = useState("");
  const [ monthlyRecurring, setMonthlyRecurring ] = useState(dayjs().date());
  const [ recurringAllCalendar, setRecurringAllCalendar ] = useState([]);
  const [ recurringResourceCalendar, setRecurringResourceCalendar ] = useState([]);

  useEffect(() => {
    const fetchRecurringCalendar = async() => {
      try{
        const responce = await fetch(RECURRING_CALENDAR_API + "All/recurring/", {
          method: "GET",
          headers:{
            "entityid" : "w_123",
            "Content-Type" : "application/json"
          }
        });
        const recurringCalendarData = await responce.json();
        console.log("recurringCalendarData:", recurringCalendarData);
        setRecurringAllCalendar(recurringCalendarData);
      } catch(error) {
        console.log("unable to fetch the Recurring All Calendar:", error)
      }
    }
    fetchRecurringCalendar();
  }, [])
  
  const screens = useBreakpoint();
  
  useEffect(() => {
    if (!screens.lg && !screens.xl) {
      setOpenWeekCalendar(false);
      setOpenMonthCalendar(true);
    } else {
      setOpenWeekCalendar(true);
      setOpenMonthCalendar(false);
    }
  }, [screens.lg, screens.xl]);

  const validateFields = () => {
    let fieldError = {};
    if (!selectedMemberId) fieldError.selectedMemberId = "please enter member Id";
    if (!selectedResourceId) fieldError.selectedResourceId = "please enter resource Id";
    if (!eventTitle) fieldError.eventTitle = "Title required...!";
    setNewErrors(fieldError);
    return Object.keys(fieldError).length === 0;
  };

  useEffect(() => {
    const updateHour = () => {
      setCurrentHour(dayjs().hour());
    };

    updateHour();
    const interval = setInterval(updateHour, 3600000);
    return () => clearInterval(interval);
  }, []);

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

  useEffect(() => {

    if(calendarUserId !== "Select Member" && calendarUserId !== "Select Resource" ){
      const fetchMembersCalendar = async () => {
        try {
          const memberData = await fetch(CALENDAR_API + calendarUserId 
            + "/month/" + currentDate.toLocaleString("default", { month: "long" })
            + "/year/" + currentDate.getFullYear(), {
              method : "GET",
              headers : {
                "entityid" : "w_123",
                "Content-Type" : "application/json"
              }
            })
            const responce = await memberData.json();
            console.log("Filtered Calendar:", responce);
            if(calendarUserId === "All"){
              setSampleData(responce); 
            } else {
              setResourceCalendar(responce);
            }
        } catch(error) {
          console.log("fetching the monthly calendar:", error);
        }  try {
            const responce = await fetch(RECURRING_CALENDAR_API + calendarUserId + "/recurring/", {
              method : "GET",
              headers : {
                "entityid" : "w_123",
                "Content-Type" : "application/json"
              }
            });
            const recurringResourceData = await responce.json();
            console.log("recurringResourceData:", recurringResourceData)
            setRecurringResourceCalendar(recurringResourceData);
          } catch(error) {
            console.log("unable to fetch the Recurring Resource Calendar:", error);
          }
      }
      fetchMembersCalendar();
    }
  }, [calendarUserId, currentDate]);

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

  const hour24 = parseInt(dayjs(timeSlot, "h A").format("HH"), 10);

  const filteredEvents = 
    (calendarUserId !== "All" &&
      calendarUserId !== "Select Member" &&
      calendarUserId !== "Select Resource" &&
      Array.isArray(resourceCalendar))
      ? resourceCalendar.flatMap(prev => {
          const isMatchingDay =
            prev.month === monthName &&
            parseInt(prev.year) === currentDate.getFullYear() &&
            parseInt(prev.date) === (weekEventDate !== null ? weekEventDate : currentDate.getDate());

          if (!isMatchingDay) return [];

          return prev.events?.filter(event => {
            const isUserMatch =
              event.memberId === calendarUserId || event.resourceId === calendarUserId;

            const isInTimeRange =
              event.from <= hour24 && hour24 < event.to;

            if (isUserMatch && isInTimeRange) {
              valueToSet = event;
              return true;
            }

            return false;
          }) ?? [];
      })
    : sampleData.flatMap(prev => prev.month === monthName &&
    parseInt(prev.year) === currentDate.getFullYear() &&
    parseInt(prev.date) === (weekEventDate !== null ? weekEventDate : currentDate.getDate()) ? "" : ""
  );
  console.log("filteredEvents:",filteredEvents);
  console.log("selected Event Item:",valueToSet);

  const [ currentPage, setCurrentPage ] = useState(1);
  const itemsForPage = 1;
  const startIndex = (currentPage - 1) * itemsForPage;
  const paginateEvents = filteredEvents.slice(startIndex,startIndex + itemsForPage);
  const { Option } = Select;

  const handleCalendarEvent = () => {

    const eventDetails = {
      memberId:selectedMemberId,
      resourceId:selectedResourceId,
      date: monthlyRecurring.toString(),
      month:monthName,
      year:currentDate.getFullYear().toString(),
      title: eventTitle,
      from: fromTimeSlot.toString(),
      to: toTimeSlot.toString(),
      notes: eventNotes,
      isRecurring: recurring,
      frequency: frequencyOfEvent,

      // day: frequencyOfEvent === "weekly" ? weeklyDayRecurring : ""

    };

    const updateEventSlot = async () =>{
      try{
        await fetch(EVENTS_API + `${filteredEvents[currentPage - 1].id}`,{
          method: "PUT",
          headers: {
            "entityid" : "w_123",
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
          const response = await fetch(EVENTS_API, {
            method: "POST",
            headers: {
              'entityid' : 'w_123',
              'Content-Type' : "application/json"
            },
            body:JSON.stringify(eventDetails)
          })
          const postData = await response.json();
          console.log("postData:",postData);
          const updatedRecord = {
            ...eventDetails,
            id: postData.eventId
          }
          console.log("new event record:",updatedRecord);

          const selectedDate = (weekEventDate ?? currentDate.getDate()).toString();
          const selectedMonth = currentDate.toLocaleDateString("default", { month: "long" });
          const selectedYear = currentDate.getFullYear().toString();
          const eventHour = parseInt(dayjs(timeSlot, "h A").format("HH"), 10);
          const hourKey = `hour_${eventHour}`;

          let existingRecord = sampleData.find(item =>
            item.date === selectedDate &&
            item.month === selectedMonth &&
            item.year === selectedYear
          );

          if (existingRecord) {
            if (!Array.isArray(existingRecord.allEvents[hourKey])) {
              existingRecord.allEvents[hourKey] = [];
            }

            if (!existingRecord.allEvents[hourKey].includes(selectedResourceId)) {
              existingRecord.allEvents[hourKey].push(selectedResourceId);
            }
          } else {
            const allHours = Array.from({ length: 24 }, (_, i) => `hour_${i}`);
            const allEvents = allHours.reduce((acc, key) => {
              acc[key] = [];
              return acc;
            }, {});

            allEvents[hourKey] = [selectedResourceId];
          
          const newEventRecord = {
            month: currentDate.toLocaleDateString("default",{month:"long"}),
            year: currentDate.getFullYear().toString(),
            id: `All_${selectedMonth}_${selectedYear}_Day${selectedDate}`,
            date: (weekEventDate !== null ? weekEventDate : currentDate.getDate()).toString(),
            allEvents
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
            return [...prevData, newEventRecord];
          });
        }
        } catch (error){
          console.log("unable to create new event:",error);
        }
      };
    if (!selectedMemberId || !selectedResourceId || !eventTitle){
      validateFields();
    } else {
      if (valueToSet !== "" && bookSameSlot){
        updateEventSlot();
      } else {
          addEventSlot();
      }
    handleCloseEventSlot();
    }
  };

  const deleteEvent = () =>{
    const deleteExistingEvent = async() => {
      try{
        await fetch(EVENTS_API + `${filteredEvents[currentPage - 1].id}`,{
          method: "DELETE",
          headers: {
            'entityid' : 'w_123',
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
      } catch (error){
        console.log("unable to delete Event",error);
      }
    }
    deleteExistingEvent();
  }

  const handleCloseEventSlot = () => {
    setOpenEventSlot(false);
    setSelectedMemberId("");
    setSelectedResourceId("");
    setEventTitle("");
    setEventNotes("");
    setTimeSlot("");
    setRecurring(false);
    setFrequencyOfEvent("noRecurring");
    setWeeklyDayRecurring("");
    setMonthlyRecurring("");
    setNewErrors({});
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
  console.log("filterMembers",filterMembers.map(prev => prev.customerName));

  const membersMenu = (
  <Menu onClick={handleMembersMenu}>
    {filterMembers.map((prev,index) => (<Menu.Item key={index}>{prev.customerName}</Menu.Item>))}
  </Menu>);

  const handleResourceMenu = (e) => {
    setSelectedResourceId(e.domEvent.target.textContent);
  }

  const filterResources = resourceData.filter((prev) => prev.resourceName.toLowerCase().includes(selectedResourceId.toLowerCase()));

  const hour = parseInt(dayjs(timeSlot, "h A").format("HH"), 10);
  const hourKey = `hour_${hour}`;
  const matchingDay = sampleData.find(
      item =>
        (openWeekCalendar ? parseInt(item.date) === weekEventDate : parseInt(item.date) === currentDate.getDate()) &&
        item.month === monthName &&
        parseInt(item.year) === currentDate.getFullYear()
    );

    // Step 2: Get booked names in that hour
    const recurringDayOfWeek = openWeekCalendar ? dayjs(weekEventDate).format("dddd") : dayjs(currentDate.getDate()).format('dddd');
    const recurringEvents = recurringAllCalendar?.AllEvents?.[recurringDayOfWeek]?.[hourKey]?? [];
    const bookedNames = matchingDay?.allEvents?.[hourKey] ?? [];

    // Step 3: Filter out booked members
    const filterOutAvailableResource = filterResources
      .map(m => m.resourceName)
      .filter(name => ![...bookedNames,...recurringEvents].includes(name));
      
  console.log("filterOutAvailableResource:",filterOutAvailableResource);
  const resourceMenu = (
  <Menu onClick={handleResourceMenu}>
    {filterOutAvailableResource.map((prev,index) =>(<Menu.Item key={index}>{prev}</Menu.Item>))}
  </Menu>);

  const handleUpdateExistingEventDetails = (event) => {
    setOpenAppointment(false);
    setSelectedMemberId(event.memberId);
    setSelectedResourceId(event.resourceId);
    setEventTitle(event.title);
    setEventNotes(event.notes);
    setFromTimeSlot(fromTimeSlot);
    setFrequencyOfEvent(event.frequencyOfEvent);
    setWeeklyDayRecurring(event.weeklyDayRecurring);
    setMonthlyRecurring(event.monthlyRecurring);
    setToTimeSlot(toTimeSlot);
  };

  const dropDownList = (
    <select 
      value={calendarUserId}
      disabled={calendarUserId === "All"}
      onChange={(e) => setCalendarUserId(e.target.value)}
      style={{borderRadius:'5px',padding:'5px',fontSize:'15px',outline:'none'}}>
      <option>{calendarUserId}</option>
      {resourceDropDown ? resourceData.map(prevData => 
      <option>{prevData.resourceName}</option>) : 
      duplicateData.map(prevData => 
      <option>{prevData.customerName}</option>)}
    </select>
  );

  const handleDailyCalendarEvent = (time) => {
    time = (time === 0 ? "12 AM" : time < 12 ? `${time} AM` : time === 12 ? "12 PM" : `${time - 12} PM`);
      setWeekEventDate(null);
      setMonthlyRecurring(currentDate.getDate());
      setOpenEventSlot(true);
      setTimeSlot(time);
  }

  const handleWeeklyCalendarEvent = (hour,date) => {
      setOpenEventSlot(true);
      setTimeSlot(hour);
      const dayFormat = dayjs(date).format('dddd');
      setWeekEventDate(date.getDate());
      setWeeklyDayRecurring(dayFormat);
      setMonthlyRecurring(date.getDate());
    }
  
  const handleDropDown = (value) => {
    setResourceDropDown(false);
    setMemberDropDown(false);
    setCalendarUserId("");
    if (value === "members"){
      setMemberDropDown(true);
      setCalendarUserId("Select Member");
    } else if (value === "resource") {
      setResourceDropDown(true);
      setCalendarUserId("Select Resource");
    } else if (value === "All") {
      setCalendarUserId("All");
    }
  }
  useEffect(() => {
    if(frequencyOfEvent !== "noRecurring"){
      setRecurring(true);
    } else {
      setRecurring(false);
    }
  },[ frequencyOfEvent ])

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <Row hidden={!CalendarPage} className="filterCalendar" gutter={[8, 8]} style={{ marginBottom: '20px' }}>
          <Col
            xs={24}
            sm={12}
            md={8}
            style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}
          >
            <Checkbox checked={memberDropDown} onClick={() => handleDropDown("members")}>Member</Checkbox>
            <Checkbox checked={resourceDropDown} onClick={() => handleDropDown("resource")}>Resource</Checkbox>
            <Checkbox checked={calendarUserId === "All"} onClick={() => handleDropDown("All")}>Availability</Checkbox>
          </Col>

          <Col
            xs={24}
            sm={12}
            md={16}
            style={{ padding: '10px 0' }}
          >
            {dropDownList}
          </Col>
        </Row>
        <Row style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:'40px'}}>
            <Col>
                <Button onClick={() => setCurrentDate(new Date())}><h3>Today</h3></Button> &nbsp;
            </Col>
            <Col>
                <Button onClick={()=>{setOpenDailyCalendar(true);setOpenWeekCalendar(false);setOpenMonthCalendar(false)}}
                style={{backgroundColor: openDailyCalendar ? "lightBlue" :"" }}><h3>Daily</h3></Button> &nbsp;
                {screens.lg &&
                <span>
                  <Button onClick={()=>{setOpenWeekCalendar(true);setOpenDailyCalendar(false);setOpenMonthCalendar(false);}}
                  style={{backgroundColor: openWeekCalendar ? "lightBlue" :"" }}><h3>Week</h3></Button> &nbsp;
                </span>}
                <Button onClick={()=>{setOpenMonthCalendar(true);setOpenWeekCalendar(false);setOpenDailyCalendar(false);}}
                style={{backgroundColor: openMonthCalendar ? "lightBlue" :"" }}><h3>Month</h3></Button>
            </Col>
        </Row>
        <Divider type="horizontal"></Divider>
      </div>
      <Row style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'-20px'}}>
          <Button onClick={ handlePrev }><ChevronLeft/></Button>
          <h2 hidden={!openDailyCalendar}>{formattedDate}, {currentDate.getFullYear()}</h2>
          <h2 hidden={openDailyCalendar}>{formattedDate}, {currentDate.getFullYear()}</h2>
          <Button onClick={ handleNext }><ChevronRight/></Button>
        </Row>
      {(openMonthCalendar) ? (
          <div className="calendar-grid">
            {weekdays.map((day, index) => (
              <div key={index} className="grid-header-item">
                {day}
              </div>
            ))}

            {days.map((item, index) => (
              <div key={index} className={item.type === "current" ? "grid-item" : "disabled"}
                onClick={() => {
                  setOpenMonthCalendar(false);
                  setOpenDailyCalendar(true);
                  setCurrentDate((prev) => new Date(prev.setDate(item.day)));
                }}
                style={{
                  backgroundColor:
                    currentDate.getFullYear() === new Date().getFullYear() &&
                    currentDate.getMonth() === new Date().getMonth() &&
                    item.day === new Date().getDate() &&
                    item.type === "current"
                      ? "lightblue"
                      : "",
                }}
              >
                {item.day}
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
              {Array.from({ length: 24 }, (_, i) => {
                const hourKey = `hour_${i}`;
                const weekday = dayjs(currentDate).format("dddd");
                const dailySampleEvents = sampleData.flatMap(day => {
                    const isMatchingDay =
                      day.date === currentDate.getDate().toString() &&
                      day.month === monthName &&
                      parseInt(day.year) === currentDate.getFullYear();

                    if (!isMatchingDay) return [];

                    const hourEvents = day.allEvents?.[hourKey] ?? [];

                    return hourEvents;
                  });
                const dailyRecurringEvents = recurringAllCalendar?.AllEvents?.[weekday]?.[hourKey]?? [];
                const resourceCalendarEvents = resourceCalendar.flatMap(prev => prev.events.filter(item => {
                  // For non-daily recurring events, check the month/year/date too
                  return prev.month === monthName &&
                    parseInt(prev.year) === currentDate.getFullYear() &&
                    parseInt(prev.date) === currentDate.getDate() &&
                    item.from <= i && i < item.to;
                }))
                const dayOfWeekCaps = weekday.toUpperCase();
                const matchingEventsSlot = recurringResourceCalendar[dayOfWeekCaps]?.[hourKey] || [];
                const recurringResourceEvents = matchingEventsSlot.filter(item => {
                  if (item.isRecurring) {
                    if (item.frequency === "daily") {
                      return item.from <= i && i < item.to;
                    } else if (item.frequency === "weekly") {
                        return item.days === weekday &&
                        item.from <= i && i < item.to;
                    } else if (item.frequency === "monthly") {
                        return item.date === currentDate.getDate().toString() &&
                        item.from <= i && i < item.to;
                    }
                  }
                  return false;
                });

                const eventsAtTimeSlot = (calendarUserId !== "All" && calendarUserId !== "Select Member" && calendarUserId !== "Select Resource") ? 
                [...resourceCalendarEvents,...recurringResourceEvents] : [...dailySampleEvents,...dailyRecurringEvents];
                let backgroundColor = "";
                if (eventsAtTimeSlot.length < parseInt(resourceData.length / 2)) backgroundColor = "green";
                else if (eventsAtTimeSlot.length >= resourceData.length) backgroundColor = "red";
                else backgroundColor = "orangered";

                return (
                  <div key={i} 
                    className="event-slot"
                    style={eventsAtTimeSlot.length > 0
                    ? {backgroundColor, borderRight:'2px solid gray',borderLeft:"2px solid gray",
                    borderBottom: ((calendarUserId === "All" || calendarUserId === "Select Member" || calendarUserId === "Select Resource" )
                      ? sampleData.some(prev => {
                          const isMatchingDay =
                            prev.date === currentDate.getDate().toString() &&
                            prev.month === monthName &&
                            parseInt(prev.year) === currentDate.getFullYear();

                          if (!isMatchingDay && !dailyRecurringEvents) return false;

                          const currentHourKey = `hour_${i}`;
                          const nextHourKey = `hour_${i + 1}`;

                          const currentBooked = prev.allEvents?.[currentHourKey]?.length > 0;
                          const nextBooked = i < 23 && prev.allEvents?.[nextHourKey]?.length > 0;

                          // Apply bottom border if current hour is booked but next is not
                          return (currentBooked && !nextBooked)
                        }) || [...dailyRecurringEvents].length > 0
                      : 
                      (resourceCalendar.some(prev =>
                          prev.events.some(item => {
                              return (
                                prev.month === monthName &&
                                parseInt(prev.year) === currentDate.getFullYear() &&
                                parseInt(prev.date) === currentDate.getDate() &&
                                i === item.to - 1
                              );
                          }))) || [...recurringResourceEvents].length > 0)
                        ? "1px solid gray"
                        : "1px solid transparent",

                      // borderBottom: (calendarUserId !== "All" ? resourceCalendar : sampleData).some(prev =>
                      //   prev.events.some(item => {
                      //     if (item.recurring === "daily") {
                      //       return i === item.to - 1;
                      //     } else if (item.recurring === "weekly") {
                      //       return item.day === weekdays[currentDate.getDay()] && i === item.to - 1;
                      //     } else if (item.recurring === "monthly") {
                      //       return item.date === currentDate.getDate().toString() && i === item.to - 1;
                      //     }
                      //     return prev.month === monthName &&
                      //            parseInt(prev.year) === currentDate.getFullYear() &&
                      //            parseInt(prev.date) === currentDate.getDate() &&
                      //            i === item.to - 1;
                      //   })
                      // ) ? "1px solid gray" : "1px solid transparent",                      
                    } :{}}
                    onClick={() => eventsAtTimeSlot.length < resourceData.length ?
                     handleDailyCalendarEvent(i) :
                      console.log("Slot is Full")}
                    >
                    {calendarUserId !== "All" && calendarUserId !== "Select Member" && calendarUserId !== "Select Resource" ? resourceCalendar.map(prev => {
                      if(
                        prev.month === monthName &&
                        parseInt(prev.year) === currentDate.getFullYear() &&
                        parseInt(prev.date) === currentDate.getDate()
                      ){
                        return prev.events.map(item => {
                          const midpoint = Math.floor((item.from + item.to) / 2);
                          return i === midpoint ? item.title : "";
                        });
                      }
                      return "";
                    }) : ""}
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
              )})}
            </div>
          </div>
        ) : (
          <div className="grid-container header1">
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
                        {hours.map((hour, index) => {
                          const weekday = dayjs(day).format('dddd');
                          const currentHourSlot = parseInt(dayjs(hour, "h A").format("HH"), 10);
                          const hourKey = `hour_${parseInt(dayjs(hour, "h A").format("HH"), 10)}`;
                          const sampleEvents = sampleData.flatMap(prev => {
                            const isMatchingDay =
                              parseInt(prev.date) === day.getDate() &&
                              prev.month === monthName &&
                              parseInt(prev.year) === currentDate.getFullYear();

                            if (!isMatchingDay) return [];
                            
                            return prev.allEvents?.[hourKey] ?? [];
                          })

                          const recurringEvents = recurringAllCalendar?.AllEvents?.[weekday]?.[hourKey]?? [];

                          const resourceCalendarEvents = resourceCalendar.flatMap(prev => {
                            const isMatchingDay =
                              prev.month === monthName &&
                              parseInt(prev.year) === currentDate.getFullYear() &&
                              parseInt(prev.date) === day.getDate();

                            if (!isMatchingDay) return [];


                            return prev.events?.filter(item => {
                              // Non-recurring event
                              return item.from <= currentHourSlot && currentHourSlot < item.to;
                            });
                          })

                          const dayOfWeekCaps = weekday.charAt(0).toUpperCase();
                          const matchingEventsSlot = recurringResourceCalendar?.[dayOfWeekCaps]?.[hourKey] || [];
                          const recurringResourceEvents = matchingEventsSlot.filter(item => {
                            if (item.isRecurring) {
                              if (item.frequency === "daily") {
                                return item.from <= currentHourSlot && currentHourSlot < item.to;
                              } else if (item.frequency === "weekly") {
                                  return item.days === weekday &&
                                  item.from <= currentHourSlot && currentHourSlot < item.to;
                              } else if (item.frequency === "monthly") {
                                  return item.date === day.getDate().toString() &&
                                  item.from <= currentHourSlot && currentHourSlot < item.to;
                              }
                            }
                          });
                          
                          const eventsAtTimeSlot = (
                            calendarUserId !== "All" &&
                            calendarUserId !== "Select Member" &&
                            calendarUserId !== "Select Resource"
                          ) ? 
                          [...resourceCalendarEvents,...recurringResourceEvents]: [...sampleEvents,...recurringEvents];

                          let backgroundColor = "";
                          if (eventsAtTimeSlot.length < (resourceData.length)/2) backgroundColor = "green";
                          else if (eventsAtTimeSlot.length >= resourceData.length) backgroundColor = "red";
                          else backgroundColor = "orangered";
                          return (
                          <div key={index} className="time-section"
                            style={eventsAtTimeSlot.length > 0
                              ? {backgroundColor,
                              borderBottom: ((calendarUserId === "All" || calendarUserId === "Select Member" || calendarUserId === "Select Resource")
                                ? sampleData.some(prev => {
                                    const isMatchingDay =
                                      prev.date === day.getDate().toString() &&
                                      prev.month === monthName &&
                                      parseInt(prev.year) === currentDate.getFullYear();

                                    if (!isMatchingDay) return false;

                                    const hourValue = parseInt(dayjs(hour, "h A").format("HH"), 10);
                                    const currentKey = `hour_${hourValue}`;
                                    const nextKey = `hour_${hourValue + 1}`;

                                    const currentBooked = prev.allEvents?.[currentKey]?.length > 0;
                                    const nextBooked = prev.allEvents?.[nextKey]?.length > 0;

                                    return (currentBooked && !nextBooked); // Border only if it's the last booked hour
                                  }) || [...recurringEvents].length > 0
                                : (resourceCalendar.some(prev => {
                                    const isSameDay = prev.month === monthName &&
                                      parseInt(prev.year) === currentDate.getFullYear() &&
                                      parseInt(prev.date) === day.getDate();

                                    if (!isSameDay) return false;

                                    return prev.events?.some(item => {
                                        return item.from <= currentHourSlot && currentHourSlot < item.to;
                                    });
                                  })) || [...recurringResourceEvents].length > 0)
                                    ? "1px solid gray"
                                    : "1px solid transparent"
                              } : {}}
                            onClick= {() => {eventsAtTimeSlot.length < resourceData.length ?
                              handleWeeklyCalendarEvent(hour,day) :
                              console.log("the Slot is full")}}
                          >
                          {calendarUserId !== "All" && calendarUserId !== "Select Member" && calendarUserId !== "Select Resource" ? resourceCalendar.map((prev) => {
                            if (
                              prev.month === monthName &&
                              parseInt(prev.year) === currentDate.getFullYear() &&
                              parseInt(prev.date) === day.getDate()
                            ) {
                              return prev.events?.map((item) => {
                                const fromTime = parseInt(item.from, 10);
                                const toTime = parseInt(item.to, 10);
                                const midpoint = Math.floor((fromTime + toTime) / 2); // Midpoint calculation

                                return parseInt(dayjs(hour,"h A").format("HH"), 10) == midpoint ? item.title : ""; // Show only at midpoint
                              });
                            }
                            return "";
                          }):""}
                          {currentHour == parseInt(dayjs(hour,"h A").format("HH"), 10) && (
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
                        )})}
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
                    <Button onClick={() => {valueToSet = "";setBookSameSlot(false);setOpenAppointment(false);}}>Book new Event</Button>
                    <Button onClick={()=> {handleUpdateExistingEventDetails(filteredEvents[currentPage - 1]);setBookSameSlot(true)}}>update</Button>
                    <Button danger onClick={()=> deleteEvent()}>Delete</Button>
                  </div> : <div>
                      <Button type="primary" onClick={handleCalendarEvent}>Ok</Button>
                    </div>}
         >
          <div>
            {!openAppointment ? 
            <div style={{display:'flex',textAlign:'left',flexDirection:'column'}}>
              <Row style={{position:'relative'}}>
                <Dropdown overlay={membersMenu} trigger={["click"]}>
                  <input
                    style={{border: !selectedMemberId ? "2px solid red": ""}}
                    className="memberResourceInput"
                    placeholder="Search for members"
                    value={selectedMemberId}
                    onChange={(e)=> handleMembersDropDown(e.target.value)}></input>
                </Dropdown>
                {newErrors.selectedMemberId && <span className="inputError1">{newErrors.selectedMemberId}</span>}
                <Dropdown overlay={resourceMenu} trigger={["click"]}>
                  <input
                    style={{border:!selectedResourceId ? '2px solid red':""}}
                    className="memberResourceInput"
                    placeholder="Search for resource"
                    value={selectedResourceId}
                    onChange={(e)=> handleResourceDropDown(e.target.value)}></input>
                </Dropdown>
                {newErrors.selectedResourceId && <span className="inputError2">{newErrors.selectedResourceId}</span>}
              </Row>
              <h2>Title :<input style={{border:'transparent',outline:'none',borderBottom:'3px solid purple',fontSize:'20px',marginLeft:'10px'}}
                  onChange={(e)=>setEventTitle(e.target.value)}
                  value={eventTitle}
                  />
                  {newErrors.eventTitle &&  <span style={{color:"red"}}>*</span>}</h2>
                  <h2>Notes :<input style={{border:'transparent',outline:'none',borderBottom:'3px solid purple',fontSize:'20px',marginLeft:'10px'}}
                  onChange={(e)=>setEventNotes(e.target.value)}
                  value={eventNotes}
                  /></h2>
                  <Row style={{display:'flex',alignItems:'center',flexDirection:'row'}}>
                    <h2>Recurring : {" "}
                        <Select 
                          value={frequencyOfEvent}
                          onChange={(value) => setFrequencyOfEvent(value)}
                          style={{borderRadius:'5px',padding:'5px',fontSize:'15px',outline:'none'}}>
                          <Option value="noRecurring">No Recurring</Option>
                          <Option value="daily">Daily</Option>
                          <Option value="weekly">Weekly</Option>
                          <Option value="monthly">Monthly</Option>
                      </Select></h2> &nbsp;&nbsp;
                    {frequencyOfEvent === "monthly" &&  
                    <h2>Day : {" "}
                        <select 
                            value={frequencyOfEvent === "monthly" ? monthlyRecurring : weeklyDayRecurring}
                            onChange={(e) => {frequencyOfEvent === "weekly" ? setWeeklyDayRecurring(e.target.value): setMonthlyRecurring(e.target.value)}}

                            disabled={frequencyOfEvent !== "monthly"}
                            style={{borderRadius:'5px',padding:'5px',fontSize:'15px',outline:'none'}}>
                            {days.map((day,index) => 
                            <option value={day.day}>{" "+ day.day}</option>)}
                        </select>
                    </h2>}
                  </Row>
                  <h3>From :<TimePicker 
                                format="h A"
                                style={{width:'100px'}}
                                value={Number.isInteger(fromTimeSlot) ? dayjs().hour(fromTimeSlot) : fromTimeSlot}
                                onChange={(e) => setFromTimeSlot(e.hour())}
                                needConfirm={false}
                                /> &nbsp;&nbsp;
                      To :<TimePicker
                                format="h A"
                                style={{width:'100px'}}
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