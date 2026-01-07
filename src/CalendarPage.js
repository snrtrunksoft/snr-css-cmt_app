import React, { useState, useEffect } from "react";
import "./CalendarPage.css";
import { ChevronLeft, ChevronRight, Edit } from "lucide-react";
import { getRecurringCalendar, getAllRecurringCalendar, getCalendar, createEvent, updateEvent, deleteEvent } from "./api/APIUtil";

import { Button, Checkbox, Col, Divider, Dropdown, Select, Menu, Modal, Pagination, Row, TimePicker, Grid, Spin, DatePicker } from "antd";

import dayjs from "dayjs";
import { LoadingOutlined, LockOutlined } from "@ant-design/icons";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const { useBreakpoint } = Grid;

const CalendarPage = ({ sampleData, setSampleData, duplicateData, entityId, resourceData}) => {
  const [openEventStatusModal, setOpenEventStatusModal] = useState(false);
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
  const [ isLoading, setIsLoading ] = useState(true);
  const [eventStatus, setEventStatus] = useState("");
  const [eventLoading, setEventLoading] = useState(false);
  const [ toTimeSlot, setToTimeSlot ] = useState(null);
  const [ weekEventDate, setWeekEventDate ] = useState(null);
  const [currentHour, setCurrentHour] = useState(dayjs().hour());
  const [ calendarUserId, setCalendarUserId ]  = useState("All");
  const [ selectedMemberId, setSelectedMemberId ] = useState("");
  const [ selectedResourceId, setSelectedResourceId ] = useState("");
  const [ selectedFilterId, setSelectedFilterId ] = useState(""); // ID of selected member/resource for filtering
  const [ selectedFilterType, setSelectedFilterType ] = useState(""); // "member" or "resource"
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
  const [ openBookedEventModal, setOpenBookedEventModal ] = useState(false);
  const [ selectedBookedEvent, setSelectedBookedEvent ] = useState(null);
  const [ isEditingEvent, setIsEditingEvent ] = useState(false);
  const [ availableResourcesForSlot, setAvailableResourcesForSlot ] = useState([]);
  const [ recurringStartDate, setRecurringStartDate ] = useState(null);
  const [ recurringEndDate, setRecurringEndDate ] = useState(null);
  const [ selectedRecurringEvent, setSelectedRecurringEvent ] = useState(null);
  const [ deleteRecurringType, setDeleteRecurringType ] = useState('all'); // 'all' or 'single'
  const [ isRecurringEventModalOpen, setIsRecurringEventModalOpen ] = useState(false);

  const [effectiveEntityId, setEffectiveEntityId] = useState(entityId || null);

  useEffect(() => {
    if (!effectiveEntityId && typeof window !== "undefined") {
      try {
        const storedId = localStorage.getItem("entityId");
        if (storedId) {
          setEffectiveEntityId(storedId);
          console.log("CalendarPage using entityId from localStorage:", storedId);
        }
      } catch (e) {
        console.log("Unable to read entityId from localStorage in CalendarPage", e);
      }
    }
  }, [effectiveEntityId, entityId]);
  const [ overlapWarning, setOverlapWarning ] = useState("");

  useEffect(() => {
    const fetchRecurringCalendar = async() => {
      try{
        const recurringCalendarData = await getAllRecurringCalendar(effectiveEntityId);
        console.log("recurringCalendarData:", recurringCalendarData);
        setRecurringAllCalendar(recurringCalendarData);
      } catch(error) {
          console.log("unable to fetch the Recurring All Calendar:", error)
        } finally {
            setIsLoading(false);
          }
    }
    fetchRecurringCalendar();
  }, [effectiveEntityId])
  
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

    // For recurring events ensure start/end dates aren't in the past and the range is valid
    if (recurring || frequencyOfEvent !== 'noRecurring') {
      const today = dayjs().startOf('day');
      if (!recurringStartDate) {
        fieldError.recurringStartDate = "Start date required for recurring events";
      } else if (recurringStartDate.isBefore(today, 'day')) {
        fieldError.recurringStartDate = "Start date cannot be in the past";
      }

      if (recurringEndDate && recurringEndDate.isBefore(today, 'day')) {
        fieldError.recurringEndDate = "End date cannot be in the past";
      }

      if (recurringStartDate && recurringEndDate && recurringEndDate.isBefore(recurringStartDate, 'day')) {
        fieldError.recurringEndDate = "End date cannot be before start date";
      }
    }

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

   const formattedDate = openDailyCalendar ? currentDate.toLocaleDateString("default", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }) : currentDate.toLocaleString("default", { month: "long" });

  useEffect(() => {
    generateCalendar();
  }, [currentDate]);

  useEffect(() => {
    // Only fetch if calendarUserId is set (not empty string)
    if (!calendarUserId) {
      return;
    }
    
    setIsLoading(true);
    
    if(calendarUserId && calendarUserId !== "All" ){
      // calendarUserId now contains the actual ID (member ID or resource ID)
      const fetchMembersCalendar = async () => {
        try {
          const monthName = currentDate.toLocaleString("default", { month: "long" });
          const year = currentDate.getFullYear().toString();
          
          // Fetch regular calendar data
          const memberData = await getCalendar(effectiveEntityId, calendarUserId, monthName, year);
          console.log("Filtered Calendar:", memberData);
          setResourceCalendar(memberData);
          
          // Fetch recurring calendar data
          const recurringResourceData = await getRecurringCalendar(effectiveEntityId, calendarUserId);
          console.log("recurringResourceData:", recurringResourceData);
          setRecurringResourceCalendar(recurringResourceData);
        } catch(error) {
          console.log("Error fetching calendar data:", error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchMembersCalendar();
    } else if(calendarUserId === "All") {
      // Fetch data for all users
      const fetchAllCalendar = async () => {
        try {
          const monthName = currentDate.toLocaleString("default", { month: "long" });
          const year = currentDate.getFullYear().toString();
          
          // Fetch regular calendar data for all users
          const allData = await getCalendar(effectiveEntityId, "All", monthName, year);
          console.log("All Calendar Data:", allData);
          setSampleData(allData);
          
          // Fetch recurring calendar data for all users
          const recurringAllData = await getRecurringCalendar(effectiveEntityId, "All");
          console.log("All Recurring Data:", recurringAllData);
          setRecurringAllCalendar(recurringAllData);
        } catch(error) {
          console.log("Error fetching all calendar data:", error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchAllCalendar();
    }
  }, [calendarUserId, currentDate, effectiveEntityId]);

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

  const [ currentPage, setCurrentPage ] = useState(1);
  const itemsForPage = 1;
  const startIndex = (currentPage - 1) * itemsForPage;
  const paginateEvents = filteredEvents.slice(startIndex,startIndex + itemsForPage);
  const { Option } = Select;

  useEffect(() => {
    if(eventStatus){
      showStatusModal();
    }
  }, [eventStatus])

  const showStatusModal = () => {
    setTimeout(() => {
      setOpenEventStatusModal(false);
      setEventStatus("");
    }, 2000);
  }

  // Modal Management Helper Functions
  const closeAllModals = () => {
    setOpenEventSlot(false);
    setOpenBookedEventModal(false);
    setIsRecurringEventModalOpen(false);
    setOpenEventStatusModal(false);
    // Don't reset selected events here - they'll be reset when modals close
  };

  const closeAllModalsAndResetSelection = () => {
    closeAllModals();
    setSelectedBookedEvent(null);
    setSelectedRecurringEvent(null);
  };

  const openEventSlotModal = () => {
    closeAllModals();
    setTimeout(() => setOpenEventSlot(true), 100);
  };

  const openBookedEventModalOnly = () => {
    closeAllModals();
    setTimeout(() => setOpenBookedEventModal(true), 100);
  };

  const openRecurringEventModalOnly = () => {
    closeAllModals();
    setTimeout(() => setIsRecurringEventModalOpen(true), 100);
  };

  // Unified refresh function to reload calendar data from backend
  const refreshCalendarUI = async (userId = calendarUserId, date = currentDate) => {
    if (userId === "Select Member" || userId === "Select Resource") {
      return;
    }

    try {
      setIsLoading(true);

      const monthName = date.toLocaleString("default", { month: "long" });
      const yearNumber = date.getFullYear();

      // Fetch calendar data
      const calendarData = await getCalendar(effectiveEntityId, userId, monthName, yearNumber);
      console.log("Refreshed Calendar Data:", calendarData);

      if (userId === "All") {
        setSampleData(calendarData);
      } else {
        setResourceCalendar(calendarData);
      }

      // Fetch recurring events data
      const recurringData = await getRecurringCalendar(effectiveEntityId, userId);
      console.log("Refreshed Recurring Data:", recurringData);
      setRecurringResourceCalendar(recurringData);

      setIsLoading(false);
    } catch (error) {
      console.log("Error refreshing calendar UI:", error);
      setIsLoading(false);
    }
  };

  const handleCalendarEvent = () => {

    const eventDetails = {
      memberId:selectedMemberId,
      resourceId:selectedResourceId,
      date: monthlyRecurring,
      month:monthName,
      year:currentDate.getFullYear().toString(),
      title: eventTitle,
      from: fromTimeSlot.toString(),
      to: toTimeSlot.toString(),
      notes: eventNotes,
      isRecurring: recurring,
      frequency: frequencyOfEvent,
      ...(frequencyOfEvent === "monthly" && { monthDays: [monthlyRecurring] }),
      day: weeklyDayRecurring || dayjs().format("dddd"),
      ...(recurring && recurringStartDate && { startDate: recurringStartDate.format("YYYY-MM-DD") }),
      ...(recurring && recurringEndDate && { endDate: recurringEndDate.format("YYYY-MM-DD") })
    };

    // Unified handler for both add and update operations
    const handleEventOperation = async (isUpdate = false) => {
      setEventLoading(true);
      setOpenEventStatusModal(true);

      try {
        console.log("eventDetails:", eventDetails);
        
        if (isUpdate) {
          // Prefer an explicitly selected recurring or booked event ID, fallback to the paginated filtered event
          const eventId = selectedRecurringEvent?.id || selectedBookedEvent?.id || filteredEvents[currentPage - 1]?.id;
          if (!eventId) throw new Error('No event id found to update');
          await updateEvent(effectiveEntityId, eventId, eventDetails);
        } else {
          // await createEvent(effectiveEntityId, eventDetails);
        }

        console.log(isUpdate ? "Event updated:" : "Event created:", eventDetails);

        // Show success message
        setEventLoading(false);
        setEventStatus(isUpdate ? "Event updated successfully!" : "Event created successfully!");

        // Close modals
        closeAllModals();
        handleCloseEventSlot();

        // Refresh UI after brief delay to allow success message to display
        setTimeout(() => {
          refreshCalendarUI(calendarUserId, currentDate);
        }, 800);

      } catch (error) {
        console.log(isUpdate ? "Unable to update event:" : "Unable to create event:", error);
        setEventLoading(false);
        setEventStatus(isUpdate ? "Error updating event. Please try again." : "Error creating event. Please try again.");
      }
    };

    // Run validation for required and recurring date constraints
    if (!validateFields()) {
      return;
    }

    // Check for overlap before submitting
    checkResourceOverlap(selectedResourceId, fromTimeSlot, toTimeSlot, weekEventDate).then(hasOverlap => {
      if (hasOverlap && !isEditingEvent) {
        showErrorMessage("Cannot book: Resource has overlapping time slots. Please select a different time or resource.");
        return;
      }

      if (isEditingEvent) {
        handleEventOperation(true);  // Update
      } else {
        handleEventOperation(false); // Add/Create
      }
    });
  };

  const handleDeleteEvent = async () => {
    if (!filteredEvents || filteredEvents.length === 0) {
      setEventStatus("No event selected to delete.");
      return;
    }

    const eventToDelete = filteredEvents[currentPage - 1];
    
    setEventLoading(true);
    setOpenEventStatusModal(true);

    try {
      await deleteEvent(effectiveEntityId, eventToDelete.id);

      console.log("Event deleted successfully:", eventToDelete);

      // Show success message
      setEventLoading(false);
      setEventStatus("Event deleted successfully!");

      // Close modals
      closeAllModals();
      handleCloseEventSlot();

      // Refresh UI after brief delay
      setTimeout(() => {
        refreshCalendarUI(calendarUserId, currentDate);
      }, 800);

    } catch (error) {
      console.log("Unable to delete event:", error);
      setEventLoading(false);
      setEventStatus("Error deleting event. Please try again.");
    }
  };

  const handleDeleteRecurringEvent = async () => {
    if (!selectedRecurringEvent) {
      setEventStatus("No recurring event selected to delete.");
      return;
    }

    setEventLoading(true);
    setOpenEventStatusModal(true);

    try {
      // For now, we delete the entire recurring event
      // In future, could implement delete single occurrence logic
      await deleteEvent(effectiveEntityId, selectedRecurringEvent.id);

      // Show success message
      setEventLoading(false);
      setEventStatus(`Recurring event deleted successfully${deleteRecurringType === 'single' ? ' (this occurrence)' : ' (all occurrences)'}!`);

      // Close modals
      closeAllModals();

      // Refresh UI after brief delay
      setTimeout(() => {
        refreshCalendarUI(calendarUserId, currentDate);
      }, 800);

    } catch (error) {
      console.log("Unable to delete recurring event:", error);
      setEventLoading(false);
      setEventStatus("Error deleting recurring event. Please try again.");
    }
  };

  const handleCloseEventSlot = () => {
    setOpenEventSlot(false);
    // If a filter is active, preserve the prefilled selection; otherwise clear
    if (selectedFilterType === 'member' && calendarUserId && calendarUserId !== "All") {
      setSelectedMemberId(calendarUserId);
    } else {
      setSelectedMemberId("");
    }
    if (selectedFilterType === 'resource' && calendarUserId && calendarUserId !== "All") {
      setSelectedResourceId(calendarUserId);
    } else {
      setSelectedResourceId("");
    }

    setEventTitle("");
    setEventNotes("");
    setTimeSlot("");
    setRecurring(false);
    setFrequencyOfEvent("noRecurring");
    setWeeklyDayRecurring("");
    setMonthlyRecurring("");
    setRecurringStartDate(null);
    setRecurringEndDate(null);
    setNewErrors({});
    setOverlapWarning("");
    setIsEditingEvent(false);
    setBookSameSlot(false);
    setOpenAppointment(false);
    setSelectedBookedEvent(null);
    setSelectedRecurringEvent(null);
  };

  // Helper function to get member name from ID
  const getMemberNameById = (memberId) => {
    if (!memberId) return "";
    const member = duplicateData.find(m => m.id === memberId);
    return member ? member.customerName : "";
  };

  // Helper function to get resource name from ID
  const getResourceNameById = (resourceId) => {
    if (!resourceId) return "";
    const resource = resourceData.find(r => r.resourceId === resourceId);
    return resource ? resource.resourceName : "";
  };

  const handleMembersDropDown = (value) => {
    // Clear selection on input change - user must select from dropdown menu
    // This prevents ambiguity when there are duplicate names
    if (value === "") {
      setSelectedMemberId("");
    }
    // Note: Selection by ID happens via handleMembersMenu click handler
  };

  const handleResourceDropDown = (value) => {
    // Clear selection on input change - user must select from dropdown menu
    // This prevents ambiguity when there are duplicate names
    if (value === "") {
      setSelectedResourceId("");
    }
    // Note: Selection by ID happens via handleResourceMenu click handler
  };

  const handleMembersMenu = (e) => {
    // Get member ID from the menu item's data attribute
    const memberId = e.key;
    setSelectedMemberId(memberId);
  };

  // Filter members based on search input (search by name, but store ID)
  const memberSearchTerm = getMemberNameById(selectedMemberId).toLowerCase();
  const filterMembers = duplicateData.filter((prev) => 
    prev.customerName.toLowerCase().includes(memberSearchTerm.toLowerCase()) || memberSearchTerm === ""
  );

  const membersMenu = (
  <Menu onClick={handleMembersMenu}>
    {filterMembers.map((prev) => (
      <Menu.Item key={prev.id} title={`ID: ${prev.id}`}>
        {prev.customerName} <span style={{fontSize: '12px', color: '#999'}}>({prev.id})</span>
      </Menu.Item>
    ))}
  </Menu>);

  const handleResourceMenu = (e) => {
    // Get resource ID from the menu item's key
    const resourceId = e.key;
    setSelectedResourceId(resourceId);
  }

  // Filter resources based on search input (search by name, but store ID)
  const resourceSearchTerm = getResourceNameById(selectedResourceId).toLowerCase();
  const filterResources = resourceData.filter((prev) => 
    prev.resourceName.toLowerCase().includes(resourceSearchTerm.toLowerCase()) || resourceSearchTerm === ""
  );

  const hour = parseInt(dayjs(timeSlot, "h A").format("HH"), 10);
  const hourKey = `hour_${hour}`;
  const matchingDay = sampleData.find(
      item =>
        (openWeekCalendar ? parseInt(item.date) === weekEventDate : parseInt(item.date) === currentDate.getDate()) &&
        item.month === monthName &&
        parseInt(item.year) === currentDate.getFullYear()
    );

    // Step 2: Get booked resource IDs in that hour from filtered calendar and sampleData (so 'All' view is covered)
    const recurringDayOfWeek = openWeekCalendar ? dayjs(weekEventDate).format("dddd") : dayjs(currentDate.getDate()).format('dddd');
    const recurringEvents = recurringAllCalendar?.AllEvents?.[recurringDayOfWeek]?.[hourKey] ?? [];

    // Get booked resource IDs from the filtered resourceCalendar data
    const bookedResourceIds = resourceCalendar
      .filter(day => 
        day.month === monthName &&
        parseInt(day.year) === currentDate.getFullYear() &&
        (openWeekCalendar ? parseInt(day.date) === weekEventDate : parseInt(day.date) === currentDate.getDate())
      )
      .flatMap(day => 
        (day.events || [])
          .filter(event => event.from <= hour && hour < event.to)
          .map(event => (event.resourceId != null ? String(event.resourceId) : (event.resourceName != null ? String(event.resourceName) : null)))
          .filter(Boolean)
      );

    // Additionally include bookings from the aggregated sampleData (used when viewing 'All')
    const sampleBookedResourceIds = sampleData
      .filter(day => 
        day.month === monthName &&
        parseInt(day.year) === currentDate.getFullYear() &&
        parseInt(day.date) === (openWeekCalendar ? weekEventDate : currentDate.getDate())
      )
      .flatMap(day => (day.allEvents?.[hourKey] ?? []));

    const combinedBookedResourceIds = [...bookedResourceIds, ...sampleBookedResourceIds, ...recurringEvents];

    // Get booked resource IDs from recurring events - normalize and accept resourceName too
    const recurringBookedResourceIds = (recurringEvents || [])
      .map(event => (event.resourceId != null ? String(event.resourceId) : (event.resourceName != null ? String(event.resourceName) : null)))
      .filter(Boolean);

    const bookedSet = new Set(combinedBookedResourceIds.map(String));
    const recurringSet = new Set(recurringBookedResourceIds.map(String));

    // Build a resource list and mark booked resources as disabled (don't remove them entirely)
    const resourcesWithAvailability = filterResources.map(resource => {
      const idStr = String(resource.resourceId);
      const isBooked = bookedSet.has(idStr) || recurringSet.has(idStr);
      return { ...resource, isBooked };
    });

  const resourceMenu = (
    <Menu onClick={handleResourceMenu}>
      {resourcesWithAvailability.map((resource) => (
        <Menu.Item key={resource.resourceId} title={`ID: ${resource.resourceId}`} disabled={resource.isBooked}>
          <span style={{opacity: resource.isBooked ? 0.45 : 1}}>
            {resource.resourceName}
            <span style={{fontSize: '12px', color: '#999'}}> ({resource.resourceId})</span>
            {resource.isBooked && <span style={{fontSize:'12px', color:'#ff4d4f', marginLeft:'6px'}}>(Booked)</span>}
          </span>
        </Menu.Item>
      ))}
    </Menu>
  );

  const handleUpdateExistingEventDetails = (event) => {
    setOpenAppointment(false);
    setSelectedMemberId(event.memberId);
    setSelectedResourceId(event.resourceId);
    setEventTitle(event.title);
    setEventNotes(event.notes);
    setFromTimeSlot(event.from);
    setToTimeSlot(event.to);
    setFrequencyOfEvent(event.frequency || "noRecurring");
    setWeeklyDayRecurring(event.day || "");
    setMonthlyRecurring(event.date || dayjs().date());
    setTimeSlot(event.from === 0 ? "12 AM" : event.from < 12 ? `${event.from} AM` : event.from === 12 ? "12 PM" : `${event.from - 12} PM`);
    setRecurringStartDate(event.startDate ? dayjs(event.startDate) : null);
    setRecurringEndDate(event.endDate ? dayjs(event.endDate) : null);

    // Ensure recurring/editor flags are set correctly
    setRecurring(Boolean(event.isRecurring));
    setFrequencyOfEvent(event.frequency || "noRecurring");
    if (event.isRecurring) setSelectedRecurringEvent(event);
    setBookSameSlot(true);
    setIsEditingEvent(true);
  };

  const handleShowBookedEventDetails = (event) => {
    // Check if this is a recurring event
    if (event.isRecurring) {
      setSelectedRecurringEvent(event);
      openRecurringEventModalOnly();
    } else {
      setSelectedBookedEvent(event);
      openBookedEventModalOnly();
      
      // Calculate available resources for this slot
      const eventHour = event.from;
      const hourKey = `hour_${eventHour}`;
      const bookedInSlot = sampleData.flatMap(day => day.allEvents?.[hourKey] ?? []);
      const bookedSet = new Set(bookedInSlot.map(b => (b && b.resourceId != null) ? String(b.resourceId) : String(b)));
      const available = resourceData.filter(res => 
        !bookedSet.has(String(res.resourceId)) && !bookedSet.has(String(res.resourceName))
      );
      setAvailableResourcesForSlot(available);
    }
  };

  // Edit handlers for booked and recurring events
  const editBookedEvent = () => {
    if (!selectedBookedEvent) return;
    handleUpdateExistingEventDetails(selectedBookedEvent);
    // Close booked-event modal and open the slot editor
    setOpenBookedEventModal(false);
    openEventSlotModal();
  };

  const editRecurringEvent = () => {
    if (!selectedRecurringEvent) return;
    handleUpdateExistingEventDetails(selectedRecurringEvent);
    setRecurring(Boolean(selectedRecurringEvent.isRecurring));
    setFrequencyOfEvent(selectedRecurringEvent.frequency || "noRecurring");
    setSelectedRecurringEvent(selectedRecurringEvent);
    setIsEditingEvent(true);
    setIsRecurringEventModalOpen(false);
    openEventSlotModal();
  };

  // Helper function to check if a date falls within recurring event range
  const isDateInRecurringRange = (date, event) => {
    if (!event.startDate || !event.endDate) return true;
    const checkDate = dayjs(date);
    const startDate = dayjs(event.startDate);
    const endDate = dayjs(event.endDate);
    const isAfterStart = checkDate.isAfter(startDate) || checkDate.isSame(startDate, 'day');
    const isBeforeEnd = checkDate.isBefore(endDate) || checkDate.isSame(endDate, 'day');
    return isAfterStart && isBeforeEnd;
  };

  // Helper function to check if a recurring event occurs on a specific date
  const isRecurringEventOnDate = (event, date) => {
    if (!event.isRecurring) return false;
    if (!isDateInRecurringRange(date, event)) return false;

    const dayOfWeek = dayjs(date).format('dddd').toUpperCase();
    const dateOfMonth = dayjs(date).date();

    if (event.frequency === 'daily') {
      return true;
    } else if (event.frequency === 'weekly') {
      return event.days === dayOfWeek || event.day === dayOfWeek;
    } else if (event.frequency === 'monthly') {
      return dateOfMonth === parseInt(event.monthDays?.[0] || event.date);
    }
    return false;
  };

  const dropDownList = (
    <select 
      value={selectedFilterId}
      disabled={calendarUserId === "All"}
      onChange={(e) => {
        const selectedValue = e.target.value;
        setSelectedFilterId(selectedValue);

        // Track whether the filter represents a member or resource
        const type = resourceDropDown ? 'resource' : 'member';
        setSelectedFilterType(type);

        if (selectedValue) {
          // Apply the filter and also default the booking selection so it's fixed when creating an event
          setCalendarUserId(selectedValue);
          if (type === 'resource') {
            setSelectedResourceId(selectedValue);
            setSelectedMemberId("");
          } else {
            setSelectedMemberId(selectedValue);
            setSelectedResourceId("");
          }
        } else {
          // Clearing the filter
          setCalendarUserId("All");
          setSelectedFilterType("");
          setSelectedMemberId("");
          setSelectedResourceId("");
        }
      }}
      style={{borderRadius:'5px',padding:'5px',fontSize:'15px',outline:'none'}}>
      <option value="">Select {resourceDropDown ? 'Resource' : 'Member'}</option>
      {resourceDropDown ? resourceData.map(prevData => (
        <option key={prevData.resourceId} value={prevData.resourceId}>{prevData.resourceName}</option>
      )) : 
      duplicateData.map(prevData => (
        <option key={prevData.id} value={prevData.id}>{prevData.customerName}</option>
      ))}
    </select>
  );

  const handleDailyCalendarEvent = (time, bookedEventsList) => {
    // Check if the selected time is in the past
    if (isPastDateTime(currentDate, time)) {
      showErrorMessage("Cannot book slots in the past. Please select a present or future time.");
      return;
    }

    // Check if slot is completely full
    if (bookedEventsList >= resourceData.length) {
      showErrorMessage("This time slot is not available. All resources are booked. Please select another time.");
      return;
    }

    time = (time === 0 ? "12 AM" : time < 12 ? `${time} AM` : time === 12 ? "12 PM" : `${time - 12} PM`);
      setWeekEventDate(null);
      setMonthlyRecurring(currentDate.getDate());

      // If a member/resource filter is active, default that selection for booking so it's fixed
      if (calendarUserId && calendarUserId !== "All") {
        if (resourceDropDown) {
          setSelectedResourceId(calendarUserId);
        } else {
          setSelectedMemberId(calendarUserId);
        }
      }

     // Set the time slot first so availability can be computed immediately in the modal
      setTimeSlot(time);

      if (calendarUserId && calendarUserId !== "All" && bookedEventsList) {
        openEventSlotModal();
        setOpenAppointment(true);
      } else if (bookedEventsList < resourceData.length) {
        setOpenAppointment(false);
        openEventSlotModal();
    }
      const dayFormat = dayjs(dayjs().date()).format('dddd');
      setWeeklyDayRecurring(dayFormat);
  }

  const handleWeeklyCalendarEvent = (hour,date, bookedEventsList) => {
    // Extract hour from the hour string (e.g., "9 AM" -> 9)
    const hourValue = parseInt(dayjs(hour, "h A").format("HH"), 10);
    
    // Check if the selected date/time is in the past
    if (isPastDateTime(date, hourValue)) {
      showErrorMessage("Cannot book slots in the past. Please select a present or future time.");
      return;
    }

    // Check if slot is completely full
    if (bookedEventsList >= resourceData.length) {
      showErrorMessage("This time slot is not available. All resources are booked. Please select another time.");
      return;
    }

    // If a member/resource filter is active, default that selection for booking so it's fixed
    if (calendarUserId && calendarUserId !== "All") {
      if (resourceDropDown) {
        setSelectedResourceId(calendarUserId);
      } else {
        setSelectedMemberId(calendarUserId);
      }
    }

    if (calendarUserId && calendarUserId !== "All" && bookedEventsList) {
        openEventSlotModal();
        setOpenAppointment(true);
      } else if (bookedEventsList < resourceData.length) {
        setOpenAppointment(false);
        openEventSlotModal();
    }
      setTimeSlot(hour);
      const dayFormat = dayjs(date).format('dddd');
      setWeekEventDate(date.getDate());
      setWeeklyDayRecurring(dayFormat);
      setMonthlyRecurring(date.getDate());
    }
  
  const isPastDateTime = (date, hour) => {
    const now = new Date();
    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(hour, 0, 0, 0);
    return selectedDateTime < now;
  };

  const showErrorMessage = (message) => {
    setEventStatus(message);
    setOpenEventStatusModal(true);
    setTimeout(() => {
      setOpenEventStatusModal(false);
      setEventStatus("");
    }, 2000);
  };

  const checkResourceOverlap = async (resourceId, fromTime, toTime, selectedDate) => {
    if (!resourceId || fromTime === null || toTime === null) {
      setOverlapWarning("");
      return false;
    }

    // Convert to numbers if they're strings
    const fromTimeNum = typeof fromTime === 'string' ? parseInt(fromTime, 10) : fromTime;
    const toTimeNum = typeof toTime === 'string' ? parseInt(toTime, 10) : toTime;

    if (fromTimeNum >= toTimeNum) {
      setOverlapWarning("⚠️ End time must be after start time");
      return true;
    }

    try {
      // Fetch the specific resource's calendar for the current month
      const monthName = currentDate.toLocaleString("default", { month: "long" });
      const yearNumber = currentDate.getFullYear();
      
      // Fetch calendar only for the specific resource being checked (use resourceId param)
      const resourceCalendarData = await getCalendar(effectiveEntityId, resourceId, monthName, yearNumber);
      console.log("Fetched resource calendar for overlap check:", { resourceId, resourceCalendarData });

      // Check in fetched resourceCalendar for existing bookings
      const overlappingEvents = resourceCalendarData.filter(calendar => {
        const isMatchingDay =
          calendar.month === monthName &&
          parseInt(calendar.year) === yearNumber &&
          parseInt(calendar.date) === (selectedDate !== null ? selectedDate : currentDate.getDate());

        if (!isMatchingDay) return false;

        return calendar.events?.some(event => {
          // Use resourceId for checking (primary identifier)
          const isSameResource = event.resourceId === resourceId;

          // If we're editing an existing event, ignore the same event to avoid false positive overlap
          const editingId = selectedBookedEvent?.id || selectedRecurringEvent?.id;
          if (editingId && event.id === editingId) return false;
          
          // Parse event times as numbers
          const eventFrom = typeof event.from === 'string' ? parseInt(event.from, 10) : event.from;
          const eventTo = typeof event.to === 'string' ? parseInt(event.to, 10) : event.to;
          
          // Check if time ranges overlap
          const hasOverlap = fromTimeNum < eventTo && eventFrom < toTimeNum;
          
          console.log("Event check:", { 
            event: event.title, 
            isSameResource, 
            eventFrom, 
            eventTo, 
            hasOverlap
          });
          
          return isSameResource && hasOverlap;
        });
      });

      // Fetch recurring events for the specific resource
      const recurringData = await getRecurringCalendar(effectiveEntityId, resourceId);
      console.log("Fetched recurring calendar:", recurringData);

      const weekday = dayjs(selectedDate ? new Date(yearNumber, currentDate.getMonth(), selectedDate) : currentDate).format("dddd").toUpperCase();
      const selectedDateObj = dayjs(selectedDate ? new Date(yearNumber, currentDate.getMonth(), selectedDate) : currentDate);
      
      const recurringOverlap = recurringData[weekday] ? 
        Object.values(recurringData[weekday]).some(hourEvents => 
          Array.isArray(hourEvents) && hourEvents.some(event => {
            const isSameResource = event.resourceId === resourceId;
            if (isSameResource) {
              // If we're editing an event, ignore the same recurring event
              const editingId = selectedBookedEvent?.id || selectedRecurringEvent?.id;
              if (editingId && event.id === editingId) return false;

              // Check if selected date is within the recurring event date range
              if (event.startDate && event.endDate) {
                const startDate = dayjs(event.startDate);
                const endDate = dayjs(event.endDate);
                const isAfterStart = selectedDateObj.isAfter(startDate) || selectedDateObj.isSame(startDate, 'day');
                const isBeforeEnd = selectedDateObj.isBefore(endDate) || selectedDateObj.isSame(endDate, 'day');
                if (!(isAfterStart && isBeforeEnd)) return false;
              }
              
              const eventFrom = typeof event.from === 'string' ? parseInt(event.from, 10) : event.from;
              const eventTo = typeof event.to === 'string' ? parseInt(event.to, 10) : event.to;
              return fromTimeNum < eventTo && eventFrom < toTimeNum;
            }
            return false;
          })
        ) : false;

      console.log("Overlap check result:", { overlappingEventsCount: overlappingEvents.length, recurringOverlap });

      if (overlappingEvents.length > 0 || recurringOverlap) {
        setOverlapWarning(`⚠️ Warning: This resource "${resourceId}" is already booked for overlapping time slots`);
        return true;
      }

      setOverlapWarning("");
      return false;
    } catch (error) {
      console.error("Error checking resource overlap:", error);
      setOverlapWarning("");
      return false;
    }
  };

  const handleDropDown = (value) => {
    setResourceDropDown(false);
    setMemberDropDown(false);
    setSelectedFilterId(""); // Clear filter selection
    setSelectedFilterType("");
    
    if (value === "members"){
      setMemberDropDown(true);
      setSelectedFilterType("member");
      setCalendarUserId(""); // Stay with empty, wait for dropdown selection
    } else if (value === "resource") {
      setResourceDropDown(true);
      setSelectedFilterType("resource");
      setCalendarUserId(""); // Stay with empty, wait for dropdown selection
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

  // Auto-check for overlaps when time slots or resource changes
  useEffect(() => {
    const checkOverlap = async () => {
      if (selectedResourceId && 
          fromTimeSlot !== null && fromTimeSlot !== undefined && 
          toTimeSlot !== null && toTimeSlot !== undefined) {
        await checkResourceOverlap(selectedResourceId, fromTimeSlot, toTimeSlot, weekEventDate);
      } else {
        setOverlapWarning("");
      }
    };
    checkOverlap();
  }, [selectedResourceId, fromTimeSlot, toTimeSlot, weekEventDate])

  // If a member/resource filter is active, inputs should be considered prefilled and non-editable
  const isPrefilledMember = selectedFilterType === 'member' && calendarUserId && calendarUserId !== "All";
  const isPrefilledResource = selectedFilterType === 'resource' && calendarUserId && calendarUserId !== "All";

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
              {isLoading && (<h3><LoadingOutlined /> Loading...</h3>)}
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
                const monthlyRecurringAttribute = "Day_" + currentDate.getDate();
                const fetchingMonthlyAllRecurringEvents = recurringAllCalendar?.AllEvents?.[monthlyRecurringAttribute]?.[hourKey]?? [];
                const resourceCalendarEvents = resourceCalendar.flatMap(prev => prev.events.filter(item => {
                  // For non-daily recurring events, check the month/year/date too
                  return prev.month === monthName &&
                    parseInt(prev.year) === currentDate.getFullYear() &&
                    parseInt(prev.date) === currentDate.getDate() &&
                    item.from <= i && i < item.to;
                }))
                const dayOfWeekCaps = weekday.toUpperCase();
                const resourceMonthlyRecurringEvents = recurringResourceCalendar?.[monthlyRecurringAttribute.toLowerCase()]?.[hourKey] || [];
                const matchingEventsSlot = recurringResourceCalendar[dayOfWeekCaps]?.[hourKey] || [];
                const recurringResourceEvents = matchingEventsSlot.filter(item => {
                  if (item.isRecurring) {
                    // Check if current date is within the recurring event date range
                    // Only apply date range check if both startDate and endDate are present
                    if (item.startDate && item.endDate) {
                      const currentDateObj = dayjs(currentDate);
                      const startDate = dayjs(item.startDate);
                      const endDate = dayjs(item.endDate);
                      
                      // Check if current date is between start and end dates (inclusive)
                      const isAfterStart = currentDateObj.isAfter(startDate) || currentDateObj.isSame(startDate, 'day');
                      const isBeforeEnd = currentDateObj.isBefore(endDate) || currentDateObj.isSame(endDate, 'day');
                      
                      if (!(isAfterStart && isBeforeEnd)) return false;
                    }
                    
                    if (item.frequency === "daily") {
                      return item.from <= i && i < item.to;
                    } else if (item.frequency === "weekly") {
                        return item.days === weekday.toUpperCase() &&
                        item.from <= i && i < item.to;
                    }
                     {/* else if (item.frequency === "monthly") {
                        return item.date === currentDate.getDate().toString() &&
                        item.from <= i && i < item.to;
                    } */}
                  }
                  return false;
                });

                const eventsAtTimeSlot = (calendarUserId && calendarUserId !== "All") ? 
                [...resourceCalendarEvents,...recurringResourceEvents,...resourceMonthlyRecurringEvents] : [...dailySampleEvents,...dailyRecurringEvents,...fetchingMonthlyAllRecurringEvents];
                let backgroundColor = "";
                if (eventsAtTimeSlot.length < parseInt(resourceData.length / 2)) backgroundColor = "green";
                else if (eventsAtTimeSlot.length >= resourceData.length) backgroundColor = "red";
                else backgroundColor = "orangered";

                return (
                  <div key={i} 
                    className="event-slot"
                    style={eventsAtTimeSlot.length > 0
                    ? {backgroundColor, borderRight:'2px solid gray',borderLeft:"2px solid gray",
                    borderBottom: ((calendarUserId === "All" || !calendarUserId)
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
                    } :{}}
                    onClick={() => handleDailyCalendarEvent(i, eventsAtTimeSlot.length)}
                    >
                    {calendarUserId && calendarUserId !== "All" ? resourceCalendar.map(prev => {
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
                    {calendarUserId && calendarUserId !== "All" ? recurringResourceEvents.map(item => {
                      const midpoint = Math.floor((item.from + item.to) / 2);
                      return i === midpoint ? (
                        <div
                          key={`${item.id}-daily-recurring`}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '3px 6px',
                            backgroundColor: '#ffd666',
                            borderRadius: '2px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowBookedEventDetails(item);
                          }}
                          title={`${item.title} - Recurring ${item.frequency} event`}
                        >
                          <span>{item.title} 🔄</span>
                          <span style={{marginLeft: '4px', fontSize: '11px'}}>✎</span>
                        </div>
                      ) : "";
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
                          const monthlyRecurringAttribute = "Day_" + parseInt(day.getDate()).toString();
                          const fetchingMonthlyAllRecurringEvent = recurringAllCalendar?.AllEvents?.[monthlyRecurringAttribute]?.[hourKey]?? [];

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

                          const dayOfWeekCaps = weekday.toUpperCase();
                          const matchingEventsSlot = recurringResourceCalendar?.[dayOfWeekCaps]?.[hourKey] || [];
                          const resourceMonthlyRecurringEvents = recurringResourceCalendar?.[monthlyRecurringAttribute.toLowerCase()]?.[hourKey] || [];
                          const recurringResourceEvents = matchingEventsSlot.filter(item => {
                            if (item.isRecurring) {
                              // Check if current date is within the recurring event date range
                              // Only apply date range check if both startDate and endDate are present
                              if (item.startDate && item.endDate) {
                                const dayObj = dayjs(day);
                                const startDate = dayjs(item.startDate);
                                const endDate = dayjs(item.endDate);
                                
                                // Check if day is between start and end dates (inclusive)
                                const isAfterStart = dayObj.isAfter(startDate) || dayObj.isSame(startDate, 'day');
                                const isBeforeEnd = dayObj.isBefore(endDate) || dayObj.isSame(endDate, 'day');
                                
                                if (!(isAfterStart && isBeforeEnd)) return false;
                              }
                              
                              if (item.frequency === "daily") {
                                return item.from <= currentHourSlot && currentHourSlot < item.to;
                              } else if (item.frequency === "weekly") {
                                  return item.days === weekday.toUpperCase() &&
                                  item.from <= currentHourSlot && currentHourSlot < item.to;
                              }
                               {/* else if (item.frequency === "monthly") {
                                  return item.date === day.getDate().toString() &&
                                  item.from <= currentHourSlot && currentHourSlot < item.to;
                              } */}
                            }
                            return false;
                          });
                          
                          const eventsAtTimeSlot = (
                            calendarUserId !== "All" &&
                            calendarUserId !== "Select Member" &&
                            calendarUserId !== "Select Resource"
                          ) ? 
                          [...resourceCalendarEvents,...recurringResourceEvents,...resourceMonthlyRecurringEvents]: [...sampleEvents,...recurringEvents,...fetchingMonthlyAllRecurringEvent];

                          let backgroundColor = "";
                          if (eventsAtTimeSlot.length < (resourceData.length)/2) backgroundColor = "green";
                          else if (eventsAtTimeSlot.length >= resourceData.length) backgroundColor = "red";
                          else backgroundColor = "orangered";
                          return (
                          <div key={index} className="time-section"
                            style={eventsAtTimeSlot.length > 0
                              ? {backgroundColor,
                              borderBottom: ((calendarUserId === "All" || !calendarUserId)
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
                            onClick= {() => {handleWeeklyCalendarEvent(hour, day, eventsAtTimeSlot.length)}}>
                          {calendarUserId && calendarUserId !== "All" ? resourceCalendar.map((prev) => {
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
                          {calendarUserId && calendarUserId !== "All" ? recurringResourceEvents.map((item) => {
                            const fromTime = parseInt(item.from, 10);
                            const toTime = parseInt(item.to, 10);
                            const midpoint = Math.floor((fromTime + toTime) / 2); // Midpoint calculation
                            const currentHourInt = parseInt(dayjs(hour,"h A").format("HH"), 10);

                            return currentHourInt == midpoint ? (
                              <div 
                                key={`${item.id}-recurring`}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  padding: '2px 4px',
                                  backgroundColor: '#ffd666',
                                  borderRadius: '2px',
                                  fontSize: '11px',
                                  fontWeight: 'bold',
                                  cursor: 'pointer'
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShowBookedEventDetails(item);
                                }}
                              >
                                <span title="Recurring Event">
                                  {item.title} 
                                  <span style={{marginLeft: '3px', fontSize: '10px', fontStyle: 'italic'}}>
                                    🔄 {item.frequency}
                                  </span>
                                </span>
                                <span 
                                  style={{
                                    marginLeft: '4px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: '12px'
                                  }}
                                  title="Edit or Delete">
                                  ✎
                                </span>
                              </div>
                            ) : "";
                          }):""}                         {currentHour == parseInt(dayjs(hour,"h A").format("HH"), 10) && (
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
         footer={!openAppointment && <div>
          <Button
            type="primary"
            onClick={handleCalendarEvent}
            disabled={!!(overlapWarning && !isEditingEvent)}
            title={overlapWarning && !isEditingEvent ? overlapWarning : ''}
          >
            {isEditingEvent ? 'Update Event' : 'Create Event'}
          </Button>
          <Button onClick={handleCloseEventSlot} style={{marginLeft:'10px'}}>Cancel</Button>
        </div>}
         >
          <div>
            {!openAppointment ? 
            <div style={{display:'flex',textAlign:'left',flexDirection:'column'}}>
              <Row style={{position:'relative'}}>
                <span style={{display:'inline-flex',alignItems:'center',gap:'8px'}}>
                  <Dropdown overlay={membersMenu} trigger={["click"]} disabled={isEditingEvent || isPrefilledMember}>
                    <input
                      disabled={isEditingEvent || isPrefilledMember}
                      title={isPrefilledMember ? 'Prefilled by active member filter' : ''}
                      style={{
                        border: !selectedMemberId ? "2px solid red": "",
                        backgroundColor: (isEditingEvent || isPrefilledMember) ? '#f5f5f5' : 'white',
                        cursor: (isEditingEvent || isPrefilledMember) ? 'not-allowed' : 'pointer'
                      }}
                      className="memberResourceInput"
                      placeholder="Search for members"
                      value={getMemberNameById(selectedMemberId)}
                      onChange={(e)=> handleMembersDropDown(e.target.value)}></input>
                  </Dropdown>
                  {isPrefilledMember && (
                    <span style={{display:'inline-flex',alignItems:'center',gap:'6px',color:'#666',fontSize:'12px'}} title={'Prefilled by active member filter'}>
                      <LockOutlined style={{fontSize:12}} />
                      <span style={{lineHeight:1}}>Prefilled</span>
                    </span>
                  )}
                </span>
                {newErrors.selectedMemberId && <span className="inputError1">{newErrors.selectedMemberId}</span>}
                <span style={{display:'inline-flex',alignItems:'center',gap:'8px'}}>
                  <Dropdown overlay={resourceMenu} trigger={["click"]} disabled={isEditingEvent || isPrefilledResource}>
                    <input
                      disabled={isEditingEvent || isPrefilledResource}
                      title={isPrefilledResource ? 'Prefilled by active resource filter' : ''}
                      style={{
                        border:!selectedResourceId ? '2px solid red':"",
                        backgroundColor: (isEditingEvent || isPrefilledResource) ? '#f5f5f5' : 'white',
                        cursor: (isEditingEvent || isPrefilledResource) ? 'not-allowed' : 'pointer'
                      }}
                      className="memberResourceInput"
                      placeholder="Search for resource"
                      value={getResourceNameById(selectedResourceId)}
                      onChange={(e)=> handleResourceDropDown(e.target.value)}></input>
                  </Dropdown>
                  {isPrefilledResource && (
                    <span style={{display:'inline-flex',alignItems:'center',gap:'6px',color:'#666',fontSize:'12px'}} title={'Prefilled by active resource filter'}>
                      <LockOutlined style={{fontSize:12}} />
                      <span style={{lineHeight:1}}>Prefilled</span>
                    </span>
                  )}
                </span>
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
                  {frequencyOfEvent !== "noRecurring" && (
                    <Row style={{display:'flex',alignItems:'center',flexDirection:'column',gap:'15px',marginTop:'15px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'15px',width:'100%'}}>
                        <h3>Start Date: {" "}</h3>
                        <DatePicker 
                          value={recurringStartDate}
                          onChange={(date) => setRecurringStartDate(date)}
                          format="YYYY-MM-DD"
                          disabledDate={(current) => current && current.isBefore(dayjs().startOf('day'), 'day')}
                          style={{width:'150px'}}
                        />
                        {newErrors.recurringStartDate && <span style={{color:'red'}}>{newErrors.recurringStartDate}</span>}
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:'15px',width:'100%'}}>
                        <h3>End Date: {" "}</h3>
                        <DatePicker 
                          value={recurringEndDate}
                          onChange={(date) => setRecurringEndDate(date)}
                          format="YYYY-MM-DD"
                          disabledDate={(current) => {
                            if (!current) return false;
                            if (current.isBefore(dayjs().startOf('day'), 'day')) return true; // no past end dates
                            if (!recurringStartDate) return false;
                            return current.isBefore(recurringStartDate, 'day');
                          }}
                          style={{width:'150px'}}
                        />
                        {newErrors.recurringEndDate && <span style={{color:'red'}}>{newErrors.recurringEndDate}</span>}
                      </div>
                    </Row>
                  )}
                  <h3>From :<TimePicker 
                                format="h A"
                                style={{width:'100px'}}
                                value={Number.isInteger(fromTimeSlot) ? dayjs().hour(fromTimeSlot) : fromTimeSlot}
                                onChange={(e) => {
                                  setFromTimeSlot(e.hour());
                                  // Validation will be triggered by useEffect
                                }}
                                needConfirm={false}
                                /> &nbsp;&nbsp;
                      To :<TimePicker
                                format="h A"
                                style={{width:'100px'}}
                                value={Number.isInteger(toTimeSlot) ? dayjs().hour(toTimeSlot) : toTimeSlot}
                                onChange={(e) => {
                                  setToTimeSlot(e.hour());
                                  // Validation will be triggered by useEffect
                                }}
                                needConfirm={false}
                                /></h3>
                  {overlapWarning && !isEditingEvent && (
                    <div style={{
                      color: '#ff4d4f',
                      backgroundColor: '#fff2e8',
                      border: '1px solid #ffbb96',
                      borderRadius: '4px',
                      padding: '8px 12px',
                      marginTop: '10px',
                      fontSize: '14px'
                    }}>
                      {overlapWarning}
                    </div>
                  )}
            </div> : <div style={{display:'flex',textAlign:'left',flexDirection:'column'}}>
                {paginateEvents.map(item => (
                  <center key={item.title} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'10px',marginBottom:'10px'}}>
                    <h2>{item.title} </h2>
                    <span style={{marginLeft: '5px', marginTop:'10px', cursor: 'pointer', fontSize: '18px', color:'#1890ff'}} onClick={() => {
                      handleShowBookedEventDetails(filteredEvents[currentPage - 1]);
                      // setOpenBookedEventModal(false);
                      // setOpenEventSlot(true);
                    }}><Edit /></span>
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
         <Modal
            title="Booked Event Details"
            open={openBookedEventModal}
            onCancel={() => {
              closeAllModalsAndResetSelection();
            }}
            footer={[
              <Button key="back" onClick={() => {
                closeAllModalsAndResetSelection();
              }}>Close</Button>,
              <Button key="book" type="primary" onClick={() => {
                setOpenAppointment(false);
                openEventSlotModal();
              }}>Book New Event</Button>,
              <Button key="edit" type="primary" onClick={() => {
                handleUpdateExistingEventDetails(selectedBookedEvent);
                openEventSlotModal();
              }}>Edit</Button>,
              <Button key="delete" danger onClick={async () => {
                if (!selectedBookedEvent) return;
                setEventLoading(true);
                setOpenEventStatusModal(true);
                try {
                  await deleteEvent(effectiveEntityId, selectedBookedEvent.id);
                  setEventStatus("Event deleted successfully!");
                  setOpenBookedEventModal(false);
                  setSelectedBookedEvent(null);
                  setEventLoading(false);
                  setTimeout(() => refreshCalendarUI(calendarUserId, currentDate), 800);
                } catch (err) {
                  setEventLoading(false);
                  setEventStatus("Error deleting event. Please try again.");
                }
              }}>Delete</Button>
            ]}
            width={500}
         >
            {selectedBookedEvent && (
              <div style={{textAlign:'left', display:'flex', flexDirection:'column', gap:'15px'}}>
                <div>
                  <strong>Event Title:</strong>
                  <p style={{margin:'5px 0'}}>{selectedBookedEvent.title}</p>
                </div>
                <div>
                  <strong>Member:</strong>
                  <p style={{margin:'5px 0'}}>{selectedBookedEvent.memberId}</p>
                </div>
                <div>
                  <strong>Resource:</strong>
                  <p style={{margin:'5px 0'}}>{selectedBookedEvent.resourceId}</p>
                </div>
                <div>
                  <strong>Time Slot:</strong>
                  <p style={{margin:'5px 0'}}>
                    {selectedBookedEvent.from === 0 ? '12 AM' : selectedBookedEvent.from < 12 ? `${selectedBookedEvent.from} AM` : selectedBookedEvent.from === 12 ? '12 PM' : `${selectedBookedEvent.from - 12} PM`}
                    {' to '}
                    {selectedBookedEvent.to === 0 ? '12 AM' : selectedBookedEvent.to < 12 ? `${selectedBookedEvent.to} AM` : selectedBookedEvent.to === 12 ? '12 PM' : `${selectedBookedEvent.to - 12} PM`}
                  </p>
                </div>
                <div>
                  <strong>Notes:</strong>
                  <p style={{margin:'5px 0'}}>{selectedBookedEvent.notes || 'N/A'}</p>
                </div>
                <div>
                  <strong>Date:</strong>
                  <p style={{margin:'5px 0'}}>{selectedBookedEvent.date}/{selectedBookedEvent.month}/{selectedBookedEvent.year}</p>
                </div>
                {availableResourcesForSlot.length > 0 && (
                  <div style={{
                    backgroundColor:'#e6f7ff',
                    padding:'10px',
                    borderRadius:'4px',
                    border:'1px solid #91d5ff'
                  }}>
                    <strong>Other available resources for this slot:</strong>
                    <div style={{margin:'5px 0'}}>
                      {availableResourcesForSlot.map(res => (
                        <span key={res.id} style={{
                          display:'inline-block',
                          backgroundColor:'#1890ff',
                          color:'white',
                          padding:'4px 8px',
                          borderRadius:'3px',
                          marginRight:'5px',
                          marginTop:'5px'
                        }}>
                          {res.resourceName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
         </Modal>
         <Modal 
            title="Recurring Event Details"
            open={isRecurringEventModalOpen}
            onCancel={() => {
              closeAllModalsAndResetSelection();
            }}
            footer={[
              <Button key="back" onClick={() => {
                closeAllModalsAndResetSelection();
              }}>Close</Button>,
              <Button key="edit" type="primary" onClick={() => {
                if (selectedRecurringEvent) {
                  handleUpdateExistingEventDetails(selectedRecurringEvent);
                  openEventSlotModal();
                }
              }}>Edit</Button>,
              <Button key="delete" danger onClick={() => {
                handleDeleteRecurringEvent();
              }}>Delete All Occurrences</Button>
            ]}
            width={600}
         >
            {selectedRecurringEvent && (
              <div style={{textAlign:'left', display:'flex', flexDirection:'column', gap:'15px'}}>
                <div>
                  <strong>Event Id:</strong>
                  <p style={{margin:'5px 0'}}>{selectedRecurringEvent.id}</p>
                </div>
                <div>
                  <strong>Event Title:</strong>
                  <p style={{margin:'5px 0'}}>{selectedRecurringEvent.title}</p>
                </div>
                <div>
                  <strong>Member:</strong>
                  <p style={{margin:'5px 0'}}>{selectedRecurringEvent.memberId}</p>
                </div>
                <div>
                  <strong>Resource:</strong>
                  <p style={{margin:'5px 0'}}>{selectedRecurringEvent.resourceId}</p>
                </div>
                <div>
                  <strong>Time Slot:</strong>
                  <p style={{margin:'5px 0'}}>
                    {selectedRecurringEvent.from === 0 ? '12 AM' : selectedRecurringEvent.from < 12 ? `${selectedRecurringEvent.from} AM` : selectedRecurringEvent.from === 12 ? '12 PM' : `${selectedRecurringEvent.from - 12} PM`}
                    {' to '}
                    {selectedRecurringEvent.to === 0 ? '12 AM' : selectedRecurringEvent.to < 12 ? `${selectedRecurringEvent.to} AM` : selectedRecurringEvent.to === 12 ? '12 PM' : `${selectedRecurringEvent.to - 12} PM`}
                  </p>
                </div>
                <div style={{backgroundColor:'#fff7e6', padding:'10px', borderRadius:'4px', border:'1px solid #ffd666'}}>
                  <strong>📅 Recurrence Pattern:</strong>
                  <div style={{margin:'8px 0', marginLeft:'15px'}}>
                    <div><strong>Frequency:</strong> {selectedRecurringEvent.frequency?.toUpperCase()}</div>
                    {selectedRecurringEvent.frequency === 'weekly' && (
                      <div><strong>Day:</strong> {selectedRecurringEvent.day || selectedRecurringEvent.days}</div>
                    )}{selectedRecurringEvent.frequency === 'monthly' && (
                      <div><strong>Day of Month:</strong> {selectedRecurringEvent.monthDays?.[0] || selectedRecurringEvent.date}</div>
                    )}</div>
                </div>
                <div>
                  <strong>📆 Date Range:</strong>
                  <p style={{margin:'5px 0'}}>
                    From: <strong>{selectedRecurringEvent.startDate || 'Not specified'}</strong>
                  </p>
                  <p style={{margin:'5px 0'}}>
                    To: <strong>{selectedRecurringEvent.endDate || 'Not specified'}</strong>
                  </p>
                </div>
                <div>
                  <strong>Notes:</strong>
                  <p style={{margin:'5px 0'}}>{selectedRecurringEvent.notes || 'N/A'}</p>
                </div>
                <div style={{backgroundColor:'#e6f7ff', padding:'10px', borderRadius:'4px', border:'1px solid #91d5ff'}}>
                  <strong>ℹ️ Information:</strong>
                  <p style={{margin:'8px 0', fontSize:'13px'}}>
                    This is a recurring event. Deleting it will remove all occurrences within the specified date range from the calendar. The resource will become available during these time slots.
                  </p>
                </div>
              </div>
            )}
         </Modal>
         <Modal 
            open={openEventStatusModal}
            onCancel={() => (setOpenEventStatusModal(false))}
            footer={null}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                }}
                >
                  {eventLoading ? (
                      <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                  ) : (
                    <h3>{eventStatus}</h3>
                  )}
              </div>
         </Modal>
    </div>
  );
};

export default CalendarPage;