function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { useState, useEffect } from "react";
import "./CalendarPage.css";
import { ChevronLeft, ChevronRight, Edit } from "lucide-react";
import { getRecurringCalendar, getAllRecurringCalendar, getCalendar, createEvent, updateEvent, deleteEvent } from "./api/APIUtil";
import { Button, Checkbox, Col, Divider, Dropdown, Select, Menu, Modal, Pagination, Row, TimePicker, Grid, Spin, DatePicker } from "antd";
import dayjs from "dayjs";
import { LoadingOutlined, LockOutlined } from "@ant-design/icons";
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const {
  useBreakpoint
} = Grid;
const CalendarPage = _ref => {
  var _recurringAllCalendar, _recurringAllCalendar2, _selectedRecurringEve, _selectedRecurringEve2;
  let {
    sampleData,
    setSampleData,
    duplicateData,
    entityId,
    resourceData
  } = _ref;
  const [openEventStatusModal, setOpenEventStatusModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [openWeekCalendar, setOpenWeekCalendar] = useState(true);
  const [openMonthCalendar, setOpenMonthCalendar] = useState(false);
  const [openDailyCalendar, setOpenDailyCalendar] = useState(false);
  const [days, setDays] = useState([]);
  const [openEventSlot, setOpenEventSlot] = useState(false);
  const [timeSlot, setTimeSlot] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventNotes, setEventNotes] = useState('');
  const [fromTimeSlot, setFromTimeSlot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [eventStatus, setEventStatus] = useState("");
  const [eventLoading, setEventLoading] = useState(false);
  const [toTimeSlot, setToTimeSlot] = useState(null);
  const [weekEventDate, setWeekEventDate] = useState(null);
  const [currentHour, setCurrentHour] = useState(dayjs().hour());
  const [calendarUserId, setCalendarUserId] = useState("All");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [selectedResourceId, setSelectedResourceId] = useState("");
  const [selectedFilterId, setSelectedFilterId] = useState(""); // ID of selected member/resource for filtering
  const [selectedFilterType, setSelectedFilterType] = useState(""); // "member" or "resource"
  const [openAppointment, setOpenAppointment] = useState(false);
  const [bookSameSlot, setBookSameSlot] = useState(false);
  const [resourceCalendar, setResourceCalendar] = useState([]);
  const [newErrors, setNewErrors] = useState({});
  const [memberDropDown, setMemberDropDown] = useState(false);
  const [resourceDropDown, setResourceDropDown] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [frequencyOfEvent, setFrequencyOfEvent] = useState("noRecurring");
  const [weeklyDayRecurring, setWeeklyDayRecurring] = useState("");
  const [monthlyRecurring, setMonthlyRecurring] = useState(dayjs().date());
  const [recurringAllCalendar, setRecurringAllCalendar] = useState([]);
  const [recurringResourceCalendar, setRecurringResourceCalendar] = useState([]);
  const [openBookedEventModal, setOpenBookedEventModal] = useState(false);
  const [selectedBookedEvent, setSelectedBookedEvent] = useState(null);
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [availableResourcesForSlot, setAvailableResourcesForSlot] = useState([]);
  const [recurringStartDate, setRecurringStartDate] = useState(null);
  const [recurringEndDate, setRecurringEndDate] = useState(null);
  const [selectedRecurringEvent, setSelectedRecurringEvent] = useState(null);
  const [deleteRecurringType, setDeleteRecurringType] = useState('all'); // 'all' or 'single'
  const [isRecurringEventModalOpen, setIsRecurringEventModalOpen] = useState(false);
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
  const [overlapWarning, setOverlapWarning] = useState("");
  useEffect(() => {
    const fetchRecurringCalendar = async () => {
      try {
        const recurringCalendarData = await getAllRecurringCalendar(effectiveEntityId);
        console.log("recurringCalendarData:", recurringCalendarData);
        setRecurringAllCalendar(recurringCalendarData);
      } catch (error) {
        console.log("unable to fetch the Recurring All Calendar:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecurringCalendar();
  }, [effectiveEntityId]);
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
  const hours = Array.from({
    length: 12
  }, (_, i) => "".concat(i === 0 ? 12 : i, " AM")).concat(Array.from({
    length: 12
  }, (_, i) => "".concat(i === 0 ? 12 : i, " PM")));
  const monthName = currentDate.toLocaleDateString("defult", {
    month: "long"
  });
  const formattedDate = openDailyCalendar ? currentDate.toLocaleDateString("default", {
    weekday: "long",
    month: "long",
    day: "numeric"
  }) : currentDate.toLocaleString("default", {
    month: "long"
  });
  useEffect(() => {
    generateCalendar();
  }, [currentDate]);
  useEffect(() => {
    // Only fetch if calendarUserId is set (not empty string)
    if (!calendarUserId) {
      return;
    }
    setIsLoading(true);
    if (calendarUserId && calendarUserId !== "All") {
      // calendarUserId now contains the actual ID (member ID or resource ID)
      const fetchMembersCalendar = async () => {
        try {
          const monthName = currentDate.toLocaleString("default", {
            month: "long"
          });
          const year = currentDate.getFullYear().toString();

          // Fetch regular calendar data
          const memberData = await getCalendar(effectiveEntityId, calendarUserId, monthName, year);
          console.log("Filtered Calendar:", memberData);
          setResourceCalendar(memberData);

          // Fetch recurring calendar data
          const recurringResourceData = await getRecurringCalendar(effectiveEntityId, calendarUserId);
          console.log("recurringResourceData:", recurringResourceData);
          setRecurringResourceCalendar(recurringResourceData);
        } catch (error) {
          console.log("Error fetching calendar data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMembersCalendar();
    } else if (calendarUserId === "All") {
      // Fetch data for all users
      const fetchAllCalendar = async () => {
        try {
          const monthName = currentDate.toLocaleString("default", {
            month: "long"
          });
          const year = currentDate.getFullYear().toString();

          // Fetch regular calendar data for all users
          const allData = await getCalendar(effectiveEntityId, "All", monthName, year);
          console.log("All Calendar Data:", allData);
          setSampleData(allData);

          // Fetch recurring calendar data for all users
          const recurringAllData = await getRecurringCalendar(effectiveEntityId, "All");
          console.log("All Recurring Data:", recurringAllData);
          setRecurringAllCalendar(recurringAllData);
        } catch (error) {
          console.log("Error fetching all calendar data:", error);
        } finally {
          setIsLoading(false);
        }
      };
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
      tempDays.push({
        day: prevMonthDays - i,
        type: "prev"
      });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      tempDays.push({
        day: i,
        type: "current"
      });
    }
    let nextMonthDays = 1;
    while (tempDays.length % 7 !== 0) {
      tempDays.push({
        day: nextMonthDays++,
        type: "next"
      });
    }
    setDays(tempDays);
  };
  const getStartOfWeek = date => {
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - date.getDay());
    return startDate;
  };
  useEffect(() => {
    const format24Hour = dayjs(timeSlot, "h A").hour();
    setFromTimeSlot(format24Hour);
    setToTimeSlot(format24Hour + 1);
  }, [timeSlot]);
  const getWeekDays = () => {
    const startOfWeek = getStartOfWeek(currentDate);
    return Array.from({
      length: 7
    }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  };
  const handlePrev = () => {
    if (openMonthCalendar) {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else if (openWeekCalendar) {
      setCurrentDate(prev => {
        const newDate = new Date(prev);
        newDate.setDate(prev.getDate() - 7);
        return newDate;
      });
    } else {
      setCurrentDate(prev => {
        const newDate = new Date(prev);
        newDate.setDate(prev.getDate() - 1);
        return newDate;
      });
    }
  };
  const handleNext = () => {
    if (openMonthCalendar) {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else if (openWeekCalendar) {
      setCurrentDate(prev => {
        const newDate = new Date(prev);
        newDate.setDate(prev.getDate() + 7);
        return newDate;
      });
    } else {
      setCurrentDate(prev => {
        const newDate = new Date(prev);
        newDate.setDate(prev.getDate() + 1);
        return newDate;
      });
    }
  };
  let valueToSet = "";
  const hour24 = parseInt(dayjs(timeSlot, "h A").format("HH"), 10);
  const filteredEvents = calendarUserId !== "All" && calendarUserId !== "Select Member" && calendarUserId !== "Select Resource" && Array.isArray(resourceCalendar) ? resourceCalendar.flatMap(prev => {
    var _prev$events$filter, _prev$events;
    const isMatchingDay = prev.month === monthName && parseInt(prev.year) === currentDate.getFullYear() && parseInt(prev.date) === (weekEventDate !== null ? weekEventDate : currentDate.getDate());
    if (!isMatchingDay) return [];
    return (_prev$events$filter = (_prev$events = prev.events) === null || _prev$events === void 0 ? void 0 : _prev$events.filter(event => {
      const isUserMatch = event.memberId === calendarUserId || event.resourceId === calendarUserId;
      const isInTimeRange = event.from <= hour24 && hour24 < event.to;
      if (isUserMatch && isInTimeRange) {
        valueToSet = event;
        return true;
      }
      return false;
    })) !== null && _prev$events$filter !== void 0 ? _prev$events$filter : [];
  }) : sampleData.flatMap(prev => prev.month === monthName && parseInt(prev.year) === currentDate.getFullYear() && parseInt(prev.date) === (weekEventDate !== null ? weekEventDate : currentDate.getDate()) ? "" : "");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsForPage = 1;
  const startIndex = (currentPage - 1) * itemsForPage;
  const paginateEvents = filteredEvents.slice(startIndex, startIndex + itemsForPage);
  const {
    Option
  } = Select;
  useEffect(() => {
    if (eventStatus) {
      showStatusModal();
    }
  }, [eventStatus]);
  const showStatusModal = () => {
    setTimeout(() => {
      setOpenEventStatusModal(false);
      setEventStatus("");
    }, 2000);
  };

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
  const refreshCalendarUI = async function () {
    let userId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : calendarUserId;
    let date = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : currentDate;
    if (userId === "Select Member" || userId === "Select Resource") {
      return;
    }
    try {
      setIsLoading(true);
      const monthName = date.toLocaleString("default", {
        month: "long"
      });
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
    const eventDetails = _objectSpread(_objectSpread(_objectSpread({
      memberId: selectedMemberId,
      resourceId: selectedResourceId,
      date: monthlyRecurring,
      month: monthName,
      year: currentDate.getFullYear().toString(),
      title: eventTitle,
      from: fromTimeSlot.toString(),
      to: toTimeSlot.toString(),
      notes: eventNotes,
      isRecurring: recurring,
      frequency: frequencyOfEvent
    }, frequencyOfEvent === "monthly" && {
      monthDays: [monthlyRecurring]
    }), {}, {
      day: weeklyDayRecurring || dayjs().format("dddd")
    }, recurring && recurringStartDate && {
      startDate: recurringStartDate.format("YYYY-MM-DD")
    }), recurring && recurringEndDate && {
      endDate: recurringEndDate.format("YYYY-MM-DD")
    });

    // Unified handler for both add and update operations
    const handleEventOperation = async function () {
      let isUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      setEventLoading(true);
      setOpenEventStatusModal(true);
      try {
        console.log("eventDetails:", eventDetails);
        if (isUpdate) {
          var _filteredEvents;
          // Prefer an explicitly selected recurring or booked event ID, fallback to the paginated filtered event
          const eventId = (selectedRecurringEvent === null || selectedRecurringEvent === void 0 ? void 0 : selectedRecurringEvent.id) || (selectedBookedEvent === null || selectedBookedEvent === void 0 ? void 0 : selectedBookedEvent.id) || ((_filteredEvents = filteredEvents[currentPage - 1]) === null || _filteredEvents === void 0 ? void 0 : _filteredEvents.id);
          if (!eventId) throw new Error('No event id found to update');
          await updateEvent(effectiveEntityId, eventId, eventDetails);
        } else {
          await createEvent(effectiveEntityId, eventDetails);
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
        handleEventOperation(true); // Update
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
      setEventStatus("Recurring event deleted successfully".concat(deleteRecurringType === 'single' ? ' (this occurrence)' : ' (all occurrences)', "!"));

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
  const getMemberNameById = memberId => {
    if (!memberId) return "";
    const member = duplicateData.find(m => m.id === memberId);
    return member ? member.customerName : "";
  };

  // Helper function to get resource name from ID
  const getResourceNameById = resourceId => {
    if (!resourceId) return "";
    const resource = resourceData.find(r => r.resourceId === resourceId);
    return resource ? resource.resourceName : "";
  };
  const handleMembersDropDown = value => {
    // Clear selection on input change - user must select from dropdown menu
    // This prevents ambiguity when there are duplicate names
    if (value === "") {
      setSelectedMemberId("");
    }
    // Note: Selection by ID happens via handleMembersMenu click handler
  };
  const handleResourceDropDown = value => {
    // Clear selection on input change - user must select from dropdown menu
    // This prevents ambiguity when there are duplicate names
    if (value === "") {
      setSelectedResourceId("");
    }
    // Note: Selection by ID happens via handleResourceMenu click handler
  };
  const handleMembersMenu = e => {
    // Get member ID from the menu item's data attribute
    const memberId = e.key;
    setSelectedMemberId(memberId);
  };

  // Filter members based on search input (search by name, but store ID)
  const memberSearchTerm = getMemberNameById(selectedMemberId).toLowerCase();
  const filterMembers = duplicateData.filter(prev => prev.customerName.toLowerCase().includes(memberSearchTerm.toLowerCase()) || memberSearchTerm === "");
  const membersMenu = /*#__PURE__*/React.createElement(Menu, {
    onClick: handleMembersMenu
  }, filterMembers.map(prev => /*#__PURE__*/React.createElement(Menu.Item, {
    key: prev.id,
    title: "ID: ".concat(prev.id)
  }, prev.customerName, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '12px',
      color: '#999'
    }
  }, "(", prev.id, ")"))));
  const handleResourceMenu = e => {
    // Get resource ID from the menu item's key
    const resourceId = e.key;
    setSelectedResourceId(resourceId);
  };

  // Filter resources based on search input (search by name, but store ID)
  const resourceSearchTerm = getResourceNameById(selectedResourceId).toLowerCase();
  const filterResources = resourceData.filter(prev => prev.resourceName.toLowerCase().includes(resourceSearchTerm.toLowerCase()) || resourceSearchTerm === "");
  const hour = parseInt(dayjs(timeSlot, "h A").format("HH"), 10);
  const hourKey = "hour_".concat(hour);
  const matchingDay = sampleData.find(item => (openWeekCalendar ? parseInt(item.date) === weekEventDate : parseInt(item.date) === currentDate.getDate()) && item.month === monthName && parseInt(item.year) === currentDate.getFullYear());

  // Step 2: Get booked resource IDs in that hour from filtered calendar and sampleData (so 'All' view is covered)
  const recurringDayOfWeek = openWeekCalendar ? dayjs(weekEventDate).format("dddd") : dayjs(currentDate.getDate()).format('dddd');
  const recurringEvents = (_recurringAllCalendar = recurringAllCalendar === null || recurringAllCalendar === void 0 || (_recurringAllCalendar2 = recurringAllCalendar.AllEvents) === null || _recurringAllCalendar2 === void 0 || (_recurringAllCalendar2 = _recurringAllCalendar2[recurringDayOfWeek]) === null || _recurringAllCalendar2 === void 0 ? void 0 : _recurringAllCalendar2[hourKey]) !== null && _recurringAllCalendar !== void 0 ? _recurringAllCalendar : [];

  // Get booked resource IDs from the filtered resourceCalendar data
  const bookedResourceIds = resourceCalendar.filter(day => day.month === monthName && parseInt(day.year) === currentDate.getFullYear() && (openWeekCalendar ? parseInt(day.date) === weekEventDate : parseInt(day.date) === currentDate.getDate())).flatMap(day => (day.events || []).filter(event => event.from <= hour && hour < event.to).map(event => event.resourceId != null ? String(event.resourceId) : event.resourceName != null ? String(event.resourceName) : null).filter(Boolean));

  // Additionally include bookings from the aggregated sampleData (used when viewing 'All')
  const sampleBookedResourceIds = sampleData.filter(day => day.month === monthName && parseInt(day.year) === currentDate.getFullYear() && parseInt(day.date) === (openWeekCalendar ? weekEventDate : currentDate.getDate())).flatMap(day => {
    var _day$allEvents$hourKe, _day$allEvents;
    return (_day$allEvents$hourKe = (_day$allEvents = day.allEvents) === null || _day$allEvents === void 0 ? void 0 : _day$allEvents[hourKey]) !== null && _day$allEvents$hourKe !== void 0 ? _day$allEvents$hourKe : [];
  });
  const combinedBookedResourceIds = [...bookedResourceIds, ...sampleBookedResourceIds, ...recurringEvents];

  // Get booked resource IDs from recurring events - normalize and accept resourceName too
  const recurringBookedResourceIds = (recurringEvents || []).map(event => event.resourceId != null ? String(event.resourceId) : event.resourceName != null ? String(event.resourceName) : null).filter(Boolean);
  const bookedSet = new Set(combinedBookedResourceIds.map(String));
  const recurringSet = new Set(recurringBookedResourceIds.map(String));

  // Build a resource list and mark booked resources as disabled (don't remove them entirely)
  const resourcesWithAvailability = filterResources.map(resource => {
    const idStr = String(resource.resourceId);
    const isBooked = bookedSet.has(idStr) || recurringSet.has(idStr);
    return _objectSpread(_objectSpread({}, resource), {}, {
      isBooked
    });
  });
  const resourceMenu = /*#__PURE__*/React.createElement(Menu, {
    onClick: handleResourceMenu
  }, resourcesWithAvailability.map(resource => /*#__PURE__*/React.createElement(Menu.Item, {
    key: resource.resourceId,
    title: "ID: ".concat(resource.resourceId),
    disabled: resource.isBooked
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: resource.isBooked ? 0.45 : 1
    }
  }, resource.resourceName, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '12px',
      color: '#999'
    }
  }, " (", resource.resourceId, ")"), resource.isBooked && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '12px',
      color: '#ff4d4f',
      marginLeft: '6px'
    }
  }, "(Booked)")))));
  const handleUpdateExistingEventDetails = event => {
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
    setTimeSlot(event.from === 0 ? "12 AM" : event.from < 12 ? "".concat(event.from, " AM") : event.from === 12 ? "12 PM" : "".concat(event.from - 12, " PM"));
    setRecurringStartDate(event.startDate ? dayjs(event.startDate) : null);
    setRecurringEndDate(event.endDate ? dayjs(event.endDate) : null);

    // Ensure recurring/editor flags are set correctly
    setRecurring(Boolean(event.isRecurring));
    setFrequencyOfEvent(event.frequency || "noRecurring");
    if (event.isRecurring) setSelectedRecurringEvent(event);
    setBookSameSlot(true);
    setIsEditingEvent(true);
  };
  const handleShowBookedEventDetails = event => {
    // Check if this is a recurring event
    if (event.isRecurring) {
      setSelectedRecurringEvent(event);
      openRecurringEventModalOnly();
    } else {
      setSelectedBookedEvent(event);
      openBookedEventModalOnly();

      // Calculate available resources for this slot
      const eventHour = event.from;
      const hourKey = "hour_".concat(eventHour);
      const bookedInSlot = sampleData.flatMap(day => {
        var _day$allEvents$hourKe2, _day$allEvents2;
        return (_day$allEvents$hourKe2 = (_day$allEvents2 = day.allEvents) === null || _day$allEvents2 === void 0 ? void 0 : _day$allEvents2[hourKey]) !== null && _day$allEvents$hourKe2 !== void 0 ? _day$allEvents$hourKe2 : [];
      });
      const bookedSet = new Set(bookedInSlot.map(b => b && b.resourceId != null ? String(b.resourceId) : String(b)));
      const available = resourceData.filter(res => !bookedSet.has(String(res.resourceId)) && !bookedSet.has(String(res.resourceName)));
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
      var _event$monthDays;
      return dateOfMonth === parseInt(((_event$monthDays = event.monthDays) === null || _event$monthDays === void 0 ? void 0 : _event$monthDays[0]) || event.date);
    }
    return false;
  };
  const dropDownList = /*#__PURE__*/React.createElement("select", {
    value: selectedFilterId,
    disabled: calendarUserId === "All",
    onChange: e => {
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
    },
    style: {
      borderRadius: '5px',
      padding: '5px',
      fontSize: '15px',
      outline: 'none'
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select ", resourceDropDown ? 'Resource' : 'Member'), resourceDropDown ? resourceData.map(prevData => /*#__PURE__*/React.createElement("option", {
    key: prevData.resourceId,
    value: prevData.resourceId
  }, prevData.resourceName)) : duplicateData.map(prevData => /*#__PURE__*/React.createElement("option", {
    key: prevData.id,
    value: prevData.id
  }, prevData.customerName)));
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
    time = time === 0 ? "12 AM" : time < 12 ? "".concat(time, " AM") : time === 12 ? "12 PM" : "".concat(time - 12, " PM");
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
  };
  const handleWeeklyCalendarEvent = (hour, date, bookedEventsList) => {
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
  };
  const isPastDateTime = (date, hour) => {
    const now = new Date();
    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(hour, 0, 0, 0);
    return selectedDateTime < now;
  };
  const showErrorMessage = message => {
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
      const monthName = currentDate.toLocaleString("default", {
        month: "long"
      });
      const yearNumber = currentDate.getFullYear();

      // Fetch calendar only for the specific resource being checked (use resourceId param)
      const resourceCalendarData = await getCalendar(effectiveEntityId, resourceId, monthName, yearNumber);
      console.log("Fetched resource calendar for overlap check:", {
        resourceId,
        resourceCalendarData
      });

      // Check in fetched resourceCalendar for existing bookings
      const overlappingEvents = resourceCalendarData.filter(calendar => {
        var _calendar$events;
        const isMatchingDay = calendar.month === monthName && parseInt(calendar.year) === yearNumber && parseInt(calendar.date) === (selectedDate !== null ? selectedDate : currentDate.getDate());
        if (!isMatchingDay) return false;
        return (_calendar$events = calendar.events) === null || _calendar$events === void 0 ? void 0 : _calendar$events.some(event => {
          // Use resourceId for checking (primary identifier)
          const isSameResource = event.resourceId === resourceId;

          // If we're editing an existing event, ignore the same event to avoid false positive overlap
          const editingId = (selectedBookedEvent === null || selectedBookedEvent === void 0 ? void 0 : selectedBookedEvent.id) || (selectedRecurringEvent === null || selectedRecurringEvent === void 0 ? void 0 : selectedRecurringEvent.id);
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
      const recurringOverlap = recurringData[weekday] ? Object.values(recurringData[weekday]).some(hourEvents => Array.isArray(hourEvents) && hourEvents.some(event => {
        const isSameResource = event.resourceId === resourceId;
        if (isSameResource) {
          // If we're editing an event, ignore the same recurring event
          const editingId = (selectedBookedEvent === null || selectedBookedEvent === void 0 ? void 0 : selectedBookedEvent.id) || (selectedRecurringEvent === null || selectedRecurringEvent === void 0 ? void 0 : selectedRecurringEvent.id);
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
      })) : false;
      console.log("Overlap check result:", {
        overlappingEventsCount: overlappingEvents.length,
        recurringOverlap
      });
      if (overlappingEvents.length > 0 || recurringOverlap) {
        setOverlapWarning("\u26A0\uFE0F Warning: This resource \"".concat(resourceId, "\" is already booked for overlapping time slots"));
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
  const handleDropDown = value => {
    setResourceDropDown(false);
    setMemberDropDown(false);
    setSelectedFilterId(""); // Clear filter selection
    setSelectedFilterType("");
    if (value === "members") {
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
  };
  useEffect(() => {
    if (frequencyOfEvent !== "noRecurring") {
      setRecurring(true);
    } else {
      setRecurring(false);
    }
  }, [frequencyOfEvent]);

  // Auto-check for overlaps when time slots or resource changes
  useEffect(() => {
    const checkOverlap = async () => {
      if (selectedResourceId && fromTimeSlot !== null && fromTimeSlot !== undefined && toTimeSlot !== null && toTimeSlot !== undefined) {
        await checkResourceOverlap(selectedResourceId, fromTimeSlot, toTimeSlot, weekEventDate);
      } else {
        setOverlapWarning("");
      }
    };
    checkOverlap();
  }, [selectedResourceId, fromTimeSlot, toTimeSlot, weekEventDate]);

  // If a member/resource filter is active, inputs should be considered prefilled and non-editable
  const isPrefilledMember = selectedFilterType === 'member' && calendarUserId && calendarUserId !== "All";
  const isPrefilledResource = selectedFilterType === 'resource' && calendarUserId && calendarUserId !== "All";
  return /*#__PURE__*/React.createElement("div", {
    className: "calendar-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "calendar-header"
  }, /*#__PURE__*/React.createElement(Row, {
    hidden: !CalendarPage,
    className: "filterCalendar",
    gutter: [8, 8],
    style: {
      marginBottom: '20px'
    }
  }, /*#__PURE__*/React.createElement(Col, {
    xs: 24,
    sm: 12,
    md: 8,
    style: {
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: memberDropDown,
    onClick: () => handleDropDown("members")
  }, "Member"), /*#__PURE__*/React.createElement(Checkbox, {
    checked: resourceDropDown,
    onClick: () => handleDropDown("resource")
  }, "Resource"), /*#__PURE__*/React.createElement(Checkbox, {
    checked: calendarUserId === "All",
    onClick: () => handleDropDown("All")
  }, "Availability")), /*#__PURE__*/React.createElement(Col, {
    xs: 24,
    sm: 12,
    md: 16,
    style: {
      padding: '10px 0'
    }
  }, dropDownList)), /*#__PURE__*/React.createElement(Row, {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '40px'
    }
  }, /*#__PURE__*/React.createElement(Col, null, /*#__PURE__*/React.createElement(Button, {
    onClick: () => setCurrentDate(new Date())
  }, /*#__PURE__*/React.createElement("h3", null, "Today")), " \xA0"), /*#__PURE__*/React.createElement(Col, null, isLoading && /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement(LoadingOutlined, null), " Loading...")), /*#__PURE__*/React.createElement(Col, null, /*#__PURE__*/React.createElement(Button, {
    onClick: () => {
      setOpenDailyCalendar(true);
      setOpenWeekCalendar(false);
      setOpenMonthCalendar(false);
    },
    style: {
      backgroundColor: openDailyCalendar ? "lightBlue" : ""
    }
  }, /*#__PURE__*/React.createElement("h3", null, "Daily")), " \xA0", screens.lg && /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Button, {
    onClick: () => {
      setOpenWeekCalendar(true);
      setOpenDailyCalendar(false);
      setOpenMonthCalendar(false);
    },
    style: {
      backgroundColor: openWeekCalendar ? "lightBlue" : ""
    }
  }, /*#__PURE__*/React.createElement("h3", null, "Week")), " \xA0"), /*#__PURE__*/React.createElement(Button, {
    onClick: () => {
      setOpenMonthCalendar(true);
      setOpenWeekCalendar(false);
      setOpenDailyCalendar(false);
    },
    style: {
      backgroundColor: openMonthCalendar ? "lightBlue" : ""
    }
  }, /*#__PURE__*/React.createElement("h3", null, "Month")))), /*#__PURE__*/React.createElement(Divider, {
    type: "horizontal"
  })), /*#__PURE__*/React.createElement(Row, {
    style: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '-20px'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: handlePrev
  }, /*#__PURE__*/React.createElement(ChevronLeft, null)), /*#__PURE__*/React.createElement("h2", {
    hidden: !openDailyCalendar
  }, formattedDate, ", ", currentDate.getFullYear()), /*#__PURE__*/React.createElement("h2", {
    hidden: openDailyCalendar
  }, formattedDate, ", ", currentDate.getFullYear()), /*#__PURE__*/React.createElement(Button, {
    onClick: handleNext
  }, /*#__PURE__*/React.createElement(ChevronRight, null))), openMonthCalendar ? /*#__PURE__*/React.createElement("div", {
    className: "calendar-grid"
  }, weekdays.map((day, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    className: "grid-header-item"
  }, day)), days.map((item, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    className: item.type === "current" ? "grid-item" : "disabled",
    onClick: () => {
      setOpenMonthCalendar(false);
      setOpenDailyCalendar(true);
      setCurrentDate(prev => new Date(prev.setDate(item.day)));
    },
    style: {
      backgroundColor: currentDate.getFullYear() === new Date().getFullYear() && currentDate.getMonth() === new Date().getMonth() && item.day === new Date().getDate() && item.type === "current" ? "lightblue" : ""
    }
  }, item.day))) : openDailyCalendar ? /*#__PURE__*/React.createElement("div", {
    className: "day-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "time-column"
  }, Array.from({
    length: 24
  }, (_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "time-slot"
  }, i === 0 ? "12 AM" : i < 12 ? "".concat(i, " AM") : i === 12 ? "12 PM" : "".concat(i - 12, " PM")))), /*#__PURE__*/React.createElement("div", {
    className: "event-column",
    style: {
      position: "relative"
    }
  }, Array.from({
    length: 24
  }, (_, i) => {
    var _recurringAllCalendar3, _recurringAllCalendar4, _recurringAllCalendar5, _recurringAllCalendar6, _recurringResourceCal, _recurringResourceCal2;
    const hourKey = "hour_".concat(i);
    const weekday = dayjs(currentDate).format("dddd");
    const dailySampleEvents = sampleData.flatMap(day => {
      var _day$allEvents$hourKe3, _day$allEvents3;
      const isMatchingDay = day.date === currentDate.getDate().toString() && day.month === monthName && parseInt(day.year) === currentDate.getFullYear();
      if (!isMatchingDay) return [];
      const hourEvents = (_day$allEvents$hourKe3 = (_day$allEvents3 = day.allEvents) === null || _day$allEvents3 === void 0 ? void 0 : _day$allEvents3[hourKey]) !== null && _day$allEvents$hourKe3 !== void 0 ? _day$allEvents$hourKe3 : [];
      return hourEvents;
    });
    const dailyRecurringEvents = (_recurringAllCalendar3 = recurringAllCalendar === null || recurringAllCalendar === void 0 || (_recurringAllCalendar4 = recurringAllCalendar.AllEvents) === null || _recurringAllCalendar4 === void 0 || (_recurringAllCalendar4 = _recurringAllCalendar4[weekday]) === null || _recurringAllCalendar4 === void 0 ? void 0 : _recurringAllCalendar4[hourKey]) !== null && _recurringAllCalendar3 !== void 0 ? _recurringAllCalendar3 : [];
    const monthlyRecurringAttribute = "Day_" + currentDate.getDate();
    const fetchingMonthlyAllRecurringEvents = (_recurringAllCalendar5 = recurringAllCalendar === null || recurringAllCalendar === void 0 || (_recurringAllCalendar6 = recurringAllCalendar.AllEvents) === null || _recurringAllCalendar6 === void 0 || (_recurringAllCalendar6 = _recurringAllCalendar6[monthlyRecurringAttribute]) === null || _recurringAllCalendar6 === void 0 ? void 0 : _recurringAllCalendar6[hourKey]) !== null && _recurringAllCalendar5 !== void 0 ? _recurringAllCalendar5 : [];
    const resourceCalendarEvents = resourceCalendar.flatMap(prev => prev.events.filter(item => {
      // For non-daily recurring events, check the month/year/date too
      return prev.month === monthName && parseInt(prev.year) === currentDate.getFullYear() && parseInt(prev.date) === currentDate.getDate() && item.from <= i && i < item.to;
    }));
    const dayOfWeekCaps = weekday.toUpperCase();
    const resourceMonthlyRecurringEvents = (recurringResourceCalendar === null || recurringResourceCalendar === void 0 || (_recurringResourceCal = recurringResourceCalendar[monthlyRecurringAttribute.toLowerCase()]) === null || _recurringResourceCal === void 0 ? void 0 : _recurringResourceCal[hourKey]) || [];
    const matchingEventsSlot = ((_recurringResourceCal2 = recurringResourceCalendar[dayOfWeekCaps]) === null || _recurringResourceCal2 === void 0 ? void 0 : _recurringResourceCal2[hourKey]) || [];
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
          return item.days === weekday.toUpperCase() && item.from <= i && i < item.to;
        }
        {/* else if (item.frequency === "monthly") {
           return item.date === currentDate.getDate().toString() &&
           item.from <= i && i < item.to;
         } */}
      }
      return false;
    });
    const eventsAtTimeSlot = calendarUserId && calendarUserId !== "All" ? [...resourceCalendarEvents, ...recurringResourceEvents, ...resourceMonthlyRecurringEvents] : [...dailySampleEvents, ...dailyRecurringEvents, ...fetchingMonthlyAllRecurringEvents];
    let backgroundColor = "";
    if (eventsAtTimeSlot.length < parseInt(resourceData.length / 2)) backgroundColor = "green";else if (eventsAtTimeSlot.length >= resourceData.length) backgroundColor = "red";else backgroundColor = "orangered";
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "event-slot",
      style: eventsAtTimeSlot.length > 0 ? {
        backgroundColor,
        borderRight: '2px solid gray',
        borderLeft: "2px solid gray",
        borderBottom: (calendarUserId === "All" || !calendarUserId ? sampleData.some(prev => {
          var _prev$allEvents, _prev$allEvents2;
          const isMatchingDay = prev.date === currentDate.getDate().toString() && prev.month === monthName && parseInt(prev.year) === currentDate.getFullYear();
          if (!isMatchingDay && !dailyRecurringEvents) return false;
          const currentHourKey = "hour_".concat(i);
          const nextHourKey = "hour_".concat(i + 1);
          const currentBooked = ((_prev$allEvents = prev.allEvents) === null || _prev$allEvents === void 0 || (_prev$allEvents = _prev$allEvents[currentHourKey]) === null || _prev$allEvents === void 0 ? void 0 : _prev$allEvents.length) > 0;
          const nextBooked = i < 23 && ((_prev$allEvents2 = prev.allEvents) === null || _prev$allEvents2 === void 0 || (_prev$allEvents2 = _prev$allEvents2[nextHourKey]) === null || _prev$allEvents2 === void 0 ? void 0 : _prev$allEvents2.length) > 0;

          // Apply bottom border if current hour is booked but next is not
          return currentBooked && !nextBooked;
        }) || [...dailyRecurringEvents].length > 0 : resourceCalendar.some(prev => prev.events.some(item => {
          return prev.month === monthName && parseInt(prev.year) === currentDate.getFullYear() && parseInt(prev.date) === currentDate.getDate() && i === item.to - 1;
        })) || [...recurringResourceEvents].length > 0) ? "1px solid gray" : "1px solid transparent"
      } : {},
      onClick: () => handleDailyCalendarEvent(i, eventsAtTimeSlot.length)
    }, calendarUserId && calendarUserId !== "All" ? resourceCalendar.map(prev => {
      if (prev.month === monthName && parseInt(prev.year) === currentDate.getFullYear() && parseInt(prev.date) === currentDate.getDate()) {
        return prev.events.map(item => {
          const midpoint = Math.floor((item.from + item.to) / 2);
          return i === midpoint ? item.title : "";
        });
      }
      return "";
    }) : "", calendarUserId && calendarUserId !== "All" ? recurringResourceEvents.map(item => {
      const midpoint = Math.floor((item.from + item.to) / 2);
      return i === midpoint ? /*#__PURE__*/React.createElement("div", {
        key: "".concat(item.id, "-daily-recurring"),
        style: {
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
        },
        onClick: e => {
          e.stopPropagation();
          handleShowBookedEventDetails(item);
        },
        title: "".concat(item.title, " - Recurring ").concat(item.frequency, " event")
      }, /*#__PURE__*/React.createElement("span", null, item.title, " \uD83D\uDD04"), /*#__PURE__*/React.createElement("span", {
        style: {
          marginLeft: '4px',
          fontSize: '11px'
        }
      }, "\u270E")) : "";
    }) : "", currentHour === i && /*#__PURE__*/React.createElement("div", {
      className: "current-time-line",
      style: {
        position: "absolute",
        left: 0,
        width: "100%",
        height: "2px",
        backgroundColor: "violet",
        top: 35
      }
    }));
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "grid-container header1"
  }, getWeekDays().map((day, index) => /*#__PURE__*/React.createElement("div", {
    key: index
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid-header-item",
    style: {
      backgroundColor: currentDate.getFullYear() === new Date().getFullYear() && currentDate.getMonth() === new Date().getMonth() && day.getDate() === new Date().getDate() ? "lightblue" : "",
      opacity: day.getMonth() !== currentDate.getMonth() ? 0.5 : 1,
      pointerEvents: day.getMonth() !== currentDate.getMonth() ? "none" : "auto"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "day-name"
  }, weekdays[index]), " \xA0", /*#__PURE__*/React.createElement("span", {
    className: "day-number"
  }, day.getDate())), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    hidden: weekdays[index] !== "Sun",
    style: {
      position: "absolute",
      left: '-80px',
      width: '80px'
    },
    className: "week-days"
  }, /*#__PURE__*/React.createElement("div", {
    className: "time-section",
    style: {
      borderBottom: '1px solid gray',
      backgroundColor: "#ececec"
    }
  }, "all-day"), hours.map((hour, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    className: "time-section",
    style: {
      backgroundColor: "#ececec"
    }
  }, hour))), /*#__PURE__*/React.createElement("div", {
    className: "week-days",
    style: currentDate.getFullYear() === new Date().getFullYear() && currentDate.getMonth() === new Date().getMonth() && day.getDate() === new Date().getDate() ? {
      border: '2px solid gray',
      marginTop: '-1px'
    } : {}
  }, /*#__PURE__*/React.createElement("div", {
    className: "time-section",
    style: {
      borderBottom: '1px solid gray'
    }
  }), hours.map((hour, index) => {
    var _recurringAllCalendar7, _recurringAllCalendar8, _recurringAllCalendar9, _recurringAllCalendar0, _recurringResourceCal3, _recurringResourceCal4;
    const weekday = dayjs(day).format('dddd');
    const currentHourSlot = parseInt(dayjs(hour, "h A").format("HH"), 10);
    const hourKey = "hour_".concat(parseInt(dayjs(hour, "h A").format("HH"), 10));
    const sampleEvents = sampleData.flatMap(prev => {
      var _prev$allEvents$hourK, _prev$allEvents3;
      const isMatchingDay = parseInt(prev.date) === day.getDate() && prev.month === monthName && parseInt(prev.year) === currentDate.getFullYear();
      if (!isMatchingDay) return [];
      return (_prev$allEvents$hourK = (_prev$allEvents3 = prev.allEvents) === null || _prev$allEvents3 === void 0 ? void 0 : _prev$allEvents3[hourKey]) !== null && _prev$allEvents$hourK !== void 0 ? _prev$allEvents$hourK : [];
    });
    const recurringEvents = (_recurringAllCalendar7 = recurringAllCalendar === null || recurringAllCalendar === void 0 || (_recurringAllCalendar8 = recurringAllCalendar.AllEvents) === null || _recurringAllCalendar8 === void 0 || (_recurringAllCalendar8 = _recurringAllCalendar8[weekday]) === null || _recurringAllCalendar8 === void 0 ? void 0 : _recurringAllCalendar8[hourKey]) !== null && _recurringAllCalendar7 !== void 0 ? _recurringAllCalendar7 : [];
    const monthlyRecurringAttribute = "Day_" + parseInt(day.getDate()).toString();
    const fetchingMonthlyAllRecurringEvent = (_recurringAllCalendar9 = recurringAllCalendar === null || recurringAllCalendar === void 0 || (_recurringAllCalendar0 = recurringAllCalendar.AllEvents) === null || _recurringAllCalendar0 === void 0 || (_recurringAllCalendar0 = _recurringAllCalendar0[monthlyRecurringAttribute]) === null || _recurringAllCalendar0 === void 0 ? void 0 : _recurringAllCalendar0[hourKey]) !== null && _recurringAllCalendar9 !== void 0 ? _recurringAllCalendar9 : [];
    const resourceCalendarEvents = resourceCalendar.flatMap(prev => {
      var _prev$events2;
      const isMatchingDay = prev.month === monthName && parseInt(prev.year) === currentDate.getFullYear() && parseInt(prev.date) === day.getDate();
      if (!isMatchingDay) return [];
      return (_prev$events2 = prev.events) === null || _prev$events2 === void 0 ? void 0 : _prev$events2.filter(item => {
        // Non-recurring event
        return item.from <= currentHourSlot && currentHourSlot < item.to;
      });
    });
    const dayOfWeekCaps = weekday.toUpperCase();
    const matchingEventsSlot = (recurringResourceCalendar === null || recurringResourceCalendar === void 0 || (_recurringResourceCal3 = recurringResourceCalendar[dayOfWeekCaps]) === null || _recurringResourceCal3 === void 0 ? void 0 : _recurringResourceCal3[hourKey]) || [];
    const resourceMonthlyRecurringEvents = (recurringResourceCalendar === null || recurringResourceCalendar === void 0 || (_recurringResourceCal4 = recurringResourceCalendar[monthlyRecurringAttribute.toLowerCase()]) === null || _recurringResourceCal4 === void 0 ? void 0 : _recurringResourceCal4[hourKey]) || [];
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
          return item.days === weekday.toUpperCase() && item.from <= currentHourSlot && currentHourSlot < item.to;
        }
        {/* else if (item.frequency === "monthly") {
           return item.date === day.getDate().toString() &&
           item.from <= currentHourSlot && currentHourSlot < item.to;
         } */}
      }
      return false;
    });
    const eventsAtTimeSlot = calendarUserId !== "All" && calendarUserId !== "Select Member" && calendarUserId !== "Select Resource" ? [...resourceCalendarEvents, ...recurringResourceEvents, ...resourceMonthlyRecurringEvents] : [...sampleEvents, ...recurringEvents, ...fetchingMonthlyAllRecurringEvent];
    let backgroundColor = "";
    if (eventsAtTimeSlot.length < resourceData.length / 2) backgroundColor = "green";else if (eventsAtTimeSlot.length >= resourceData.length) backgroundColor = "red";else backgroundColor = "orangered";
    return /*#__PURE__*/React.createElement("div", {
      key: index,
      className: "time-section",
      style: eventsAtTimeSlot.length > 0 ? {
        backgroundColor,
        borderBottom: (calendarUserId === "All" || !calendarUserId ? sampleData.some(prev => {
          var _prev$allEvents4, _prev$allEvents5;
          const isMatchingDay = prev.date === day.getDate().toString() && prev.month === monthName && parseInt(prev.year) === currentDate.getFullYear();
          if (!isMatchingDay) return false;
          const hourValue = parseInt(dayjs(hour, "h A").format("HH"), 10);
          const currentKey = "hour_".concat(hourValue);
          const nextKey = "hour_".concat(hourValue + 1);
          const currentBooked = ((_prev$allEvents4 = prev.allEvents) === null || _prev$allEvents4 === void 0 || (_prev$allEvents4 = _prev$allEvents4[currentKey]) === null || _prev$allEvents4 === void 0 ? void 0 : _prev$allEvents4.length) > 0;
          const nextBooked = ((_prev$allEvents5 = prev.allEvents) === null || _prev$allEvents5 === void 0 || (_prev$allEvents5 = _prev$allEvents5[nextKey]) === null || _prev$allEvents5 === void 0 ? void 0 : _prev$allEvents5.length) > 0;
          return currentBooked && !nextBooked; // Border only if it's the last booked hour
        }) || [...recurringEvents].length > 0 : resourceCalendar.some(prev => {
          var _prev$events3;
          const isSameDay = prev.month === monthName && parseInt(prev.year) === currentDate.getFullYear() && parseInt(prev.date) === day.getDate();
          if (!isSameDay) return false;
          return (_prev$events3 = prev.events) === null || _prev$events3 === void 0 ? void 0 : _prev$events3.some(item => {
            return item.from <= currentHourSlot && currentHourSlot < item.to;
          });
        }) || [...recurringResourceEvents].length > 0) ? "1px solid gray" : "1px solid transparent"
      } : {},
      onClick: () => {
        handleWeeklyCalendarEvent(hour, day, eventsAtTimeSlot.length);
      }
    }, calendarUserId && calendarUserId !== "All" ? resourceCalendar.map(prev => {
      if (prev.month === monthName && parseInt(prev.year) === currentDate.getFullYear() && parseInt(prev.date) === day.getDate()) {
        var _prev$events4;
        return (_prev$events4 = prev.events) === null || _prev$events4 === void 0 ? void 0 : _prev$events4.map(item => {
          const fromTime = parseInt(item.from, 10);
          const toTime = parseInt(item.to, 10);
          const midpoint = Math.floor((fromTime + toTime) / 2); // Midpoint calculation

          return parseInt(dayjs(hour, "h A").format("HH"), 10) == midpoint ? item.title : ""; // Show only at midpoint
        });
      }
      return "";
    }) : "", calendarUserId && calendarUserId !== "All" ? recurringResourceEvents.map(item => {
      const fromTime = parseInt(item.from, 10);
      const toTime = parseInt(item.to, 10);
      const midpoint = Math.floor((fromTime + toTime) / 2); // Midpoint calculation
      const currentHourInt = parseInt(dayjs(hour, "h A").format("HH"), 10);
      return currentHourInt == midpoint ? /*#__PURE__*/React.createElement("div", {
        key: "".concat(item.id, "-recurring"),
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '2px 4px',
          backgroundColor: '#ffd666',
          borderRadius: '2px',
          fontSize: '11px',
          fontWeight: 'bold',
          cursor: 'pointer'
        },
        onClick: e => {
          e.stopPropagation();
          handleShowBookedEventDetails(item);
        }
      }, /*#__PURE__*/React.createElement("span", {
        title: "Recurring Event"
      }, item.title, /*#__PURE__*/React.createElement("span", {
        style: {
          marginLeft: '3px',
          fontSize: '10px',
          fontStyle: 'italic'
        }
      }, "\uD83D\uDD04 ", item.frequency)), /*#__PURE__*/React.createElement("span", {
        style: {
          marginLeft: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '12px'
        },
        title: "Edit or Delete"
      }, "\u270E")) : "";
    }) : "", "                         ", currentHour == parseInt(dayjs(hour, "h A").format("HH"), 10) && /*#__PURE__*/React.createElement("div", {
      className: "current-time-line",
      style: {
        position: "absolute",
        left: 0,
        width: "100%",
        height: "2px",
        backgroundColor: "violet",
        top: 30
      }
    }));
  })))))), /*#__PURE__*/React.createElement(Modal, {
    open: openEventSlot,
    title: timeSlot + " Slot",
    onCancel: handleCloseEventSlot,
    footer: !openAppointment && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
      type: "primary",
      onClick: handleCalendarEvent,
      disabled: !!(overlapWarning && !isEditingEvent),
      title: overlapWarning && !isEditingEvent ? overlapWarning : ''
    }, isEditingEvent ? 'Update Event' : 'Create Event'), /*#__PURE__*/React.createElement(Button, {
      onClick: handleCloseEventSlot,
      style: {
        marginLeft: '10px'
      }
    }, "Cancel"))
  }, /*#__PURE__*/React.createElement("div", null, !openAppointment ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      textAlign: 'left',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(Row, {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement(Dropdown, {
    overlay: membersMenu,
    trigger: ["click"],
    disabled: isEditingEvent || isPrefilledMember
  }, /*#__PURE__*/React.createElement("input", {
    disabled: isEditingEvent || isPrefilledMember,
    title: isPrefilledMember ? 'Prefilled by active member filter' : '',
    style: {
      border: !selectedMemberId ? "2px solid red" : "",
      backgroundColor: isEditingEvent || isPrefilledMember ? '#f5f5f5' : 'white',
      cursor: isEditingEvent || isPrefilledMember ? 'not-allowed' : 'pointer'
    },
    className: "memberResourceInput",
    placeholder: "Search for members",
    value: getMemberNameById(selectedMemberId),
    onChange: e => handleMembersDropDown(e.target.value)
  })), isPrefilledMember && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      color: '#666',
      fontSize: '12px'
    },
    title: 'Prefilled by active member filter'
  }, /*#__PURE__*/React.createElement(LockOutlined, {
    style: {
      fontSize: 12
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      lineHeight: 1
    }
  }, "Prefilled"))), newErrors.selectedMemberId && /*#__PURE__*/React.createElement("span", {
    className: "inputError1"
  }, newErrors.selectedMemberId), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement(Dropdown, {
    overlay: resourceMenu,
    trigger: ["click"],
    disabled: isEditingEvent || isPrefilledResource
  }, /*#__PURE__*/React.createElement("input", {
    disabled: isEditingEvent || isPrefilledResource,
    title: isPrefilledResource ? 'Prefilled by active resource filter' : '',
    style: {
      border: !selectedResourceId ? '2px solid red' : "",
      backgroundColor: isEditingEvent || isPrefilledResource ? '#f5f5f5' : 'white',
      cursor: isEditingEvent || isPrefilledResource ? 'not-allowed' : 'pointer'
    },
    className: "memberResourceInput",
    placeholder: "Search for resource",
    value: getResourceNameById(selectedResourceId),
    onChange: e => handleResourceDropDown(e.target.value)
  })), isPrefilledResource && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      color: '#666',
      fontSize: '12px'
    },
    title: 'Prefilled by active resource filter'
  }, /*#__PURE__*/React.createElement(LockOutlined, {
    style: {
      fontSize: 12
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      lineHeight: 1
    }
  }, "Prefilled"))), newErrors.selectedResourceId && /*#__PURE__*/React.createElement("span", {
    className: "inputError2"
  }, newErrors.selectedResourceId)), /*#__PURE__*/React.createElement("h2", null, "Title :", /*#__PURE__*/React.createElement("input", {
    style: {
      border: 'transparent',
      outline: 'none',
      borderBottom: '3px solid purple',
      fontSize: '20px',
      marginLeft: '10px'
    },
    onChange: e => setEventTitle(e.target.value),
    value: eventTitle
  }), newErrors.eventTitle && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "red"
    }
  }, "*")), /*#__PURE__*/React.createElement("h2", null, "Notes :", /*#__PURE__*/React.createElement("input", {
    style: {
      border: 'transparent',
      outline: 'none',
      borderBottom: '3px solid purple',
      fontSize: '20px',
      marginLeft: '10px'
    },
    onChange: e => setEventNotes(e.target.value),
    value: eventNotes
  })), /*#__PURE__*/React.createElement(Row, {
    style: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row'
    }
  }, /*#__PURE__*/React.createElement("h2", null, "Recurring : ", " ", /*#__PURE__*/React.createElement(Select, {
    value: frequencyOfEvent,
    onChange: value => setFrequencyOfEvent(value),
    style: {
      borderRadius: '5px',
      padding: '5px',
      fontSize: '15px',
      outline: 'none'
    }
  }, /*#__PURE__*/React.createElement(Option, {
    value: "noRecurring"
  }, "No Recurring"), /*#__PURE__*/React.createElement(Option, {
    value: "daily"
  }, "Daily"), /*#__PURE__*/React.createElement(Option, {
    value: "weekly"
  }, "Weekly"), /*#__PURE__*/React.createElement(Option, {
    value: "monthly"
  }, "Monthly"))), " \xA0\xA0", frequencyOfEvent === "monthly" && /*#__PURE__*/React.createElement("h2", null, "Day : ", " ", /*#__PURE__*/React.createElement("select", {
    value: frequencyOfEvent === "monthly" ? monthlyRecurring : weeklyDayRecurring,
    onChange: e => {
      frequencyOfEvent === "weekly" ? setWeeklyDayRecurring(e.target.value) : setMonthlyRecurring(e.target.value);
    },
    disabled: frequencyOfEvent !== "monthly",
    style: {
      borderRadius: '5px',
      padding: '5px',
      fontSize: '15px',
      outline: 'none'
    }
  }, days.map((day, index) => /*#__PURE__*/React.createElement("option", {
    value: day.day
  }, " " + day.day))))), frequencyOfEvent !== "noRecurring" && /*#__PURE__*/React.createElement(Row, {
    style: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      gap: '15px',
      marginTop: '15px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("h3", null, "Start Date: ", " "), /*#__PURE__*/React.createElement(DatePicker, {
    value: recurringStartDate,
    onChange: date => setRecurringStartDate(date),
    format: "YYYY-MM-DD",
    disabledDate: current => current && current.isBefore(dayjs().startOf('day'), 'day'),
    style: {
      width: '150px'
    }
  }), newErrors.recurringStartDate && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'red'
    }
  }, newErrors.recurringStartDate)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("h3", null, "End Date: ", " "), /*#__PURE__*/React.createElement(DatePicker, {
    value: recurringEndDate,
    onChange: date => setRecurringEndDate(date),
    format: "YYYY-MM-DD",
    disabledDate: current => {
      if (!current) return false;
      if (current.isBefore(dayjs().startOf('day'), 'day')) return true; // no past end dates
      if (!recurringStartDate) return false;
      return current.isBefore(recurringStartDate, 'day');
    },
    style: {
      width: '150px'
    }
  }), newErrors.recurringEndDate && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'red'
    }
  }, newErrors.recurringEndDate))), /*#__PURE__*/React.createElement("h3", null, "From :", /*#__PURE__*/React.createElement(TimePicker, {
    format: "h A",
    style: {
      width: '100px'
    },
    value: Number.isInteger(fromTimeSlot) ? dayjs().hour(fromTimeSlot) : fromTimeSlot,
    onChange: e => {
      setFromTimeSlot(e.hour());
      // Validation will be triggered by useEffect
    },
    needConfirm: false
  }), " \xA0\xA0 To :", /*#__PURE__*/React.createElement(TimePicker, {
    format: "h A",
    style: {
      width: '100px'
    },
    value: Number.isInteger(toTimeSlot) ? dayjs().hour(toTimeSlot) : toTimeSlot,
    onChange: e => {
      setToTimeSlot(e.hour());
      // Validation will be triggered by useEffect
    },
    needConfirm: false
  })), overlapWarning && !isEditingEvent && /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#ff4d4f',
      backgroundColor: '#fff2e8',
      border: '1px solid #ffbb96',
      borderRadius: '4px',
      padding: '8px 12px',
      marginTop: '10px',
      fontSize: '14px'
    }
  }, overlapWarning)) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      textAlign: 'left',
      flexDirection: 'column'
    }
  }, paginateEvents.map(item => /*#__PURE__*/React.createElement("center", {
    key: item.title,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      marginBottom: '10px'
    }
  }, /*#__PURE__*/React.createElement("h2", null, item.title, " "), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: '5px',
      marginTop: '10px',
      cursor: 'pointer',
      fontSize: '18px',
      color: '#1890ff'
    },
    onClick: () => {
      handleShowBookedEventDetails(filteredEvents[currentPage - 1]);
      // setOpenBookedEventModal(false);
      // setOpenEventSlot(true);
    }
  }, /*#__PURE__*/React.createElement(Edit, null)))), /*#__PURE__*/React.createElement(Pagination, {
    current: currentPage,
    pageSize: itemsForPage,
    onChange: page => setCurrentPage(page),
    total: filteredEvents.length,
    showSizeChanger: false,
    simple: true,
    style: {
      marginTop: "10px",
      textAlign: "center"
    }
  })))), /*#__PURE__*/React.createElement(Modal, {
    title: "Booked Event Details",
    open: openBookedEventModal,
    onCancel: () => {
      closeAllModalsAndResetSelection();
    },
    footer: [/*#__PURE__*/React.createElement(Button, {
      key: "back",
      onClick: () => {
        closeAllModalsAndResetSelection();
      }
    }, "Close"), /*#__PURE__*/React.createElement(Button, {
      key: "book",
      type: "primary",
      onClick: () => {
        setOpenAppointment(false);
        openEventSlotModal();
      }
    }, "Book New Event"), /*#__PURE__*/React.createElement(Button, {
      key: "edit",
      type: "primary",
      onClick: () => {
        handleUpdateExistingEventDetails(selectedBookedEvent);
        openEventSlotModal();
      }
    }, "Edit"), /*#__PURE__*/React.createElement(Button, {
      key: "delete",
      danger: true,
      onClick: async () => {
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
      }
    }, "Delete")],
    width: 500
  }, selectedBookedEvent && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'left',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Event Title:"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '5px 0'
    }
  }, selectedBookedEvent.title)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Member:"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '5px 0'
    }
  }, selectedBookedEvent.memberId)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Resource:"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '5px 0'
    }
  }, selectedBookedEvent.resourceId)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Time Slot:"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '5px 0'
    }
  }, selectedBookedEvent.from === 0 ? '12 AM' : selectedBookedEvent.from < 12 ? "".concat(selectedBookedEvent.from, " AM") : selectedBookedEvent.from === 12 ? '12 PM' : "".concat(selectedBookedEvent.from - 12, " PM"), ' to ', selectedBookedEvent.to === 0 ? '12 AM' : selectedBookedEvent.to < 12 ? "".concat(selectedBookedEvent.to, " AM") : selectedBookedEvent.to === 12 ? '12 PM' : "".concat(selectedBookedEvent.to - 12, " PM"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Notes:"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '5px 0'
    }
  }, selectedBookedEvent.notes || 'N/A')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Date:"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '5px 0'
    }
  }, selectedBookedEvent.date, "/", selectedBookedEvent.month, "/", selectedBookedEvent.year)), availableResourcesForSlot.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#e6f7ff',
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #91d5ff'
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Other available resources for this slot:"), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '5px 0'
    }
  }, availableResourcesForSlot.map(res => /*#__PURE__*/React.createElement("span", {
    key: res.id,
    style: {
      display: 'inline-block',
      backgroundColor: '#1890ff',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '3px',
      marginRight: '5px',
      marginTop: '5px'
    }
  }, res.resourceName)))))), /*#__PURE__*/React.createElement(Modal, {
    title: "Recurring Event Details",
    open: isRecurringEventModalOpen,
    onCancel: () => {
      closeAllModalsAndResetSelection();
    },
    footer: [/*#__PURE__*/React.createElement(Button, {
      key: "back",
      onClick: () => {
        closeAllModalsAndResetSelection();
      }
    }, "Close"), /*#__PURE__*/React.createElement(Button, {
      key: "edit",
      type: "primary",
      onClick: () => {
        if (selectedRecurringEvent) {
          handleUpdateExistingEventDetails(selectedRecurringEvent);
          openEventSlotModal();
        }
      }
    }, "Edit"), /*#__PURE__*/React.createElement(Button, {
      key: "delete",
      danger: true,
      onClick: () => {
        handleDeleteRecurringEvent();
      }
    }, "Delete All Occurrences")],
    width: 600
  }, selectedRecurringEvent && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'left',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Event Id:"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '5px 0'
    }
  }, selectedRecurringEvent.id)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Event Title:"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '5px 0'
    }
  }, selectedRecurringEvent.title)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Member:"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '5px 0'
    }
  }, selectedRecurringEvent.memberId)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Resource:"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '5px 0'
    }
  }, selectedRecurringEvent.resourceId)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Time Slot:"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '5px 0'
    }
  }, selectedRecurringEvent.from === 0 ? '12 AM' : selectedRecurringEvent.from < 12 ? "".concat(selectedRecurringEvent.from, " AM") : selectedRecurringEvent.from === 12 ? '12 PM' : "".concat(selectedRecurringEvent.from - 12, " PM"), ' to ', selectedRecurringEvent.to === 0 ? '12 AM' : selectedRecurringEvent.to < 12 ? "".concat(selectedRecurringEvent.to, " AM") : selectedRecurringEvent.to === 12 ? '12 PM' : "".concat(selectedRecurringEvent.to - 12, " PM"))), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#fff7e6',
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ffd666'
    }
  }, /*#__PURE__*/React.createElement("strong", null, "\uD83D\uDCC5 Recurrence Pattern:"), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '8px 0',
      marginLeft: '15px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Frequency:"), " ", (_selectedRecurringEve = selectedRecurringEvent.frequency) === null || _selectedRecurringEve === void 0 ? void 0 : _selectedRecurringEve.toUpperCase()), selectedRecurringEvent.frequency === 'weekly' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Day:"), " ", selectedRecurringEvent.day || selectedRecurringEvent.days), selectedRecurringEvent.frequency === 'monthly' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Day of Month:"), " ", ((_selectedRecurringEve2 = selectedRecurringEvent.monthDays) === null || _selectedRecurringEve2 === void 0 ? void 0 : _selectedRecurringEve2[0]) || selectedRecurringEvent.date))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "\uD83D\uDCC6 Date Range:"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '5px 0'
    }
  }, "From: ", /*#__PURE__*/React.createElement("strong", null, selectedRecurringEvent.startDate || 'Not specified')), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '5px 0'
    }
  }, "To: ", /*#__PURE__*/React.createElement("strong", null, selectedRecurringEvent.endDate || 'Not specified'))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Notes:"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '5px 0'
    }
  }, selectedRecurringEvent.notes || 'N/A')), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#e6f7ff',
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #91d5ff'
    }
  }, /*#__PURE__*/React.createElement("strong", null, "\u2139\uFE0F Information:"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0',
      fontSize: '13px'
    }
  }, "This is a recurring event. Deleting it will remove all occurrences within the specified date range from the calendar. The resource will become available during these time slots.")))), /*#__PURE__*/React.createElement(Modal, {
    open: openEventStatusModal,
    onCancel: () => setOpenEventStatusModal(false),
    footer: null
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "1rem"
    }
  }, eventLoading ? /*#__PURE__*/React.createElement(Spin, {
    indicator: /*#__PURE__*/React.createElement(LoadingOutlined, {
      style: {
        fontSize: 24
      },
      spin: true
    })
  }) : /*#__PURE__*/React.createElement("h3", null, eventStatus))));
};
export default CalendarPage;