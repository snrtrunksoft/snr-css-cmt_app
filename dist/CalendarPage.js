"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
require("./CalendarPage.css");
var _lucideReact = require("lucide-react");
var _antd = require("antd");
var _dayjs = _interopRequireDefault(require("dayjs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const {
  useBreakpoint
} = _antd.Grid;
const CalendarPage = _ref => {
  let {
    sampleData,
    setSampleData,
    duplicateData,
    resourceData
  } = _ref;
  const [currentDate, setCurrentDate] = (0, _react.useState)(new Date());
  const [openWeekCalendar, setOpenWeekCalendar] = (0, _react.useState)(false);
  const [openMonthCalendar, setOpenMonthCalendar] = (0, _react.useState)(true);
  const [openDailyCalendar, setOpenDailyCalendar] = (0, _react.useState)(false);
  const [days, setDays] = (0, _react.useState)([]);
  const [openEventSlot, setOpenEventSlot] = (0, _react.useState)(false);
  const [timeSlot, setTimeSlot] = (0, _react.useState)(null);
  const [eventTitle, setEventTitle] = (0, _react.useState)('');
  const [eventNotes, setEventNotes] = (0, _react.useState)('');
  const [fromTimeSlot, setFromTimeSlot] = (0, _react.useState)(null);
  const [toTimeSlot, setToTimeSlot] = (0, _react.useState)(null);
  const [weekEventDate, setWeekEventDate] = (0, _react.useState)(null);
  const [currentHour, setCurrentHour] = (0, _react.useState)((0, _dayjs.default)().hour());
  const [calendarUserId, setCalendarUserId] = (0, _react.useState)("All");
  const [selectedMemberId, setSelectedMemberId] = (0, _react.useState)("");
  const [selectedResourceId, setSelectedResourceId] = (0, _react.useState)("");
  const [openAppointment, setOpenAppoinment] = (0, _react.useState)(false);
  const [bookSameSlot, setBookSameSlot] = (0, _react.useState)(false);
  const [resourceCalendar, setResourceCalendar] = (0, _react.useState)("");
  const [newErrors, setNewErrors] = (0, _react.useState)({});
  const [memberDropDown, setMemberDropDown] = (0, _react.useState)(true);
  const [frequencyOfEvent, setFrequencyOfEvent] = (0, _react.useState)("noRecurring");
  const [weeklyDayRecurring, setWeeklyDayRecurring] = (0, _react.useState)(weekdays[(0, _dayjs.default)().weekday()]);
  const [monthlyRecurring, setMonthlyRecurring] = (0, _react.useState)(currentDate.getDate().toString());
  const screens = useBreakpoint();
  const validateFields = () => {
    let fieldError = {};
    if (!selectedMemberId) fieldError.selectedMemberId = "please enter member Id";
    if (!selectedResourceId) fieldError.selectedResourceId = "please enter resource Id";
    if (!eventTitle) fieldError.eventTitle = "Title required...!";
    setNewErrors(fieldError);
    return Object.keys(fieldError).length === 0;
  };
  const [allEventsOnDay, setAllEventsOnDay] = (0, _react.useState)(Object.fromEntries(Array.from({
    length: 24
  }, (_, i) => [i === 0 ? "12 AM" : i < 12 ? "".concat(i, " AM") : i === 12 ? "12 PM" : "".concat(i - 12, " PM"), 3])));
  const decrement = () => {
    setAllEventsOnDay(prev => _objectSpread(_objectSpread({}, prev), {}, {
      [timeSlot]: Math.max(0, (prev[timeSlot] || 0) - 1)
    }));
  };
  (0, _react.useEffect)(() => {
    const updateHour = () => {
      setCurrentHour((0, _dayjs.default)().hour());
    };
    updateHour();
    const interval = setInterval(updateHour, 3600000);
    return () => clearInterval(interval);
  }, []);
  console.log("allEventsOnDay:", allEventsOnDay);
  console.log("time Slot:", timeSlot);
  (0, _react.useEffect)(() => {
    if (calendarUserId !== "All") {
      setOpenAppoinment(sampleData.some(prev => prev.month === monthName && parseInt(prev.year) === currentDate.getFullYear() && parseInt(prev.date) === (weekEventDate !== null ? weekEventDate : currentDate.getDate()) && prev.events.some(item => item.from <= (0, _dayjs.default)(timeSlot, "h A").format("HH") && (0, _dayjs.default)(timeSlot, "h A").format("HH") < item.to ? true : false)));
    }
  }, [currentDate, timeSlot]);
  console.log("openAppointment:", openAppointment);
  const hours = Array.from({
    length: 12
  }, (_, i) => "".concat(i === 0 ? 12 : i, " AM")).concat(Array.from({
    length: 12
  }, (_, i) => "".concat(i === 0 ? 12 : i, " PM")));
  const monthName = currentDate.toLocaleDateString("defult", {
    month: "long"
  });
  console.log("Hours Array:", hours);
  console.log("current year:", currentDate.getFullYear());
  const formattedDate = openDailyCalendar ? currentDate.toLocaleDateString("default", {
    weekday: "long",
    month: "long",
    day: "numeric"
  }) : currentDate.toLocaleString("default", {
    month: "long"
  });
  console.log("formatted Date:", formattedDate);
  (0, _react.useEffect)(() => {
    generateCalendar();
  }, [currentDate]);
  (0, _react.useEffect)(() => {
    if (calendarUserId !== "All" && !memberDropDown) {
      const filteredData = sampleData.filter(record => record.events.some(event => event.resourceId === calendarUserId)) // Keep records where at least one event has "SNR_2"
      .map(record => _objectSpread(_objectSpread({}, record), {}, {
        events: record.events.filter(event => event.resourceId === calendarUserId) // Keep only events with "SNR_2"
      }));
      console.log("filteredData:", filteredData);
      setResourceCalendar(filteredData);
    } else if (calendarUserId !== "All" && memberDropDown) {
      const filteredData = sampleData.filter(record => record.events.some(event => event.memberId === calendarUserId)) // Keep records where at least one event has "SNR_2"
      .map(record => _objectSpread(_objectSpread({}, record), {}, {
        events: record.events.filter(event => event.memberId === calendarUserId) // Keep only events with "SNR_2"
      }));
      console.log("filteredData:", filteredData);
      setResourceCalendar(filteredData);
    } else {
      const filteredData = sampleData.filter(record => record.events.some(event => event.resourceId !== "")) // Keep records where at least one event has "SNR_2"
      .map(record => _objectSpread(_objectSpread({}, record), {}, {
        events: record.events.filter(event => event.resourceId !== "") // Keep only events with "SNR_2"
      }));
      console.log("filteredData:", filteredData);
      setResourceCalendar(filteredData);
    }
  }, [calendarUserId]);
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
  (0, _react.useEffect)(() => {
    const format24Hour = (0, _dayjs.default)(timeSlot, "h A").hour();
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
  const filteredEvents = (calendarUserId !== "All" ? resourceCalendar : sampleData).flatMap(prev => prev.month === monthName && parseInt(prev.year) === currentDate.getFullYear() && parseInt(prev.date) === (weekEventDate !== null ? weekEventDate : currentDate.getDate()) ? prev.events.filter(item => {
    if (item.from <= (0, _dayjs.default)(timeSlot, "h A").format("HH") && (0, _dayjs.default)(timeSlot, "h A").format("HH") < item.to) {
      valueToSet = item;
      return true;
    }
    return false;
  }) : []);
  console.log("filteredEvents:", filteredEvents);
  console.log("selected Event Item:", valueToSet);
  const [currentPage, setCurrentPage] = (0, _react.useState)(1);
  const itemsForPage = 1;
  const startIndex = (currentPage - 1) * itemsForPage;
  const paginateEvents = filteredEvents.slice(startIndex, startIndex + itemsForPage);
  const {
    Option
  } = _antd.Select;
  const handleCalendarEvent = () => {
    const eventDetails = {
      memberId: selectedMemberId,
      resourceId: selectedResourceId,
      date: frequencyOfEvent === "monthly" ? monthlyRecurring.toString() : currentDate.getDate().toString(),
      month: monthName,
      year: currentDate.getFullYear().toString(),
      title: eventTitle,
      from: fromTimeSlot.toString(),
      to: toTimeSlot.toString(),
      notes: eventNotes,
      recurring: frequencyOfEvent,
      day: frequencyOfEvent === "weekly" ? weeklyDayRecurring : ""
    };
    const updateEventSlot = async () => {
      try {
        await fetch("https://3jb2f8gsn0.execute-api.us-east-1.amazonaws.com/dev/event/".concat(filteredEvents[currentPage - 1].id), {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(eventDetails)
        }).then(responce => responce.json()).then(data => console.log("updated event data:", data));
        setSampleData(prev => prev.map(day => _objectSpread(_objectSpread({}, day), {}, {
          events: day.events.map(event => event.id === filteredEvents[currentPage - 1].id ? _objectSpread(_objectSpread({}, event), eventDetails) : event)
        })));
      } catch (error) {
        console.log("unable to update the record", error);
      }
    };
    const addEventSlot = async () => {
      try {
        const response = await fetch("https://3jb2f8gsn0.execute-api.us-east-1.amazonaws.com/dev/event", {
          method: "POST",
          headers: {
            'Content-Type': "application/json"
          },
          body: JSON.stringify(eventDetails)
        });
        const postData = await response.json();
        console.log("postData:", postData);
        const updatedRecord = _objectSpread(_objectSpread({}, eventDetails), {}, {
          id: postData.eventId
        });
        console.log("new event record:", updatedRecord);
        decrement();
        const newEventRecord = {
          month: currentDate.toLocaleDateString("default", {
            month: "long"
          }),
          year: currentDate.getFullYear().toString(),
          userId: "ABC10!",
          date: (weekEventDate !== null ? weekEventDate : currentDate.getDate()).toString(),
          events: [updatedRecord]
        };
        setSampleData(prevData => {
          if (prevData.month === monthName && parseInt(prevData.date) === (weekEventDate !== null ? weekEventDate : currentDate.getDate())) {
            return _objectSpread(_objectSpread({}, prevData), {}, {
              events: [...(prevData.events || []), updatedRecord].sort((a, b) => a.from - b.from)
            });
          }
          return [...prevData, newEventRecord];
        });
      } catch (error) {
        console.log("unable to create new event:", error);
      }
    };
    if (!selectedMemberId || !selectedResourceId || !eventTitle) {
      validateFields();
    } else {
      if (valueToSet !== "" && bookSameSlot) {
        updateEventSlot();
      } else {
        if (allEventsOnDay[timeSlot] >= 1) {
          addEventSlot();
          console.log("slot is available");
        } else {
          console.log("slot is not available");
        }
      }
      handleCloseEventSlot();
    }
    console.log(eventDetails);
  };
  const deleteEvent = () => {
    const deleteExistingEvent = async () => {
      try {
        await fetch("https://3jb2f8gsn0.execute-api.us-east-1.amazonaws.com/dev/event/".concat(filteredEvents[currentPage - 1].id), {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
        }).then(responce => responce.json()).then(data => console.log("Deleted event Successfully", data));
        setSampleData(prevData => prevData.map(prev => _objectSpread(_objectSpread({}, prev), {}, {
          events: prev.events.filter(event => event.id !== filteredEvents[currentPage - 1].id)
        })));
      } catch (error) {
        console.log("unable to delete Event", error);
      }
    };
    deleteExistingEvent();
  };
  console.log("sample Data:", sampleData);
  const handleCloseEventSlot = () => {
    setOpenEventSlot(false);
    setSelectedMemberId("");
    setSelectedResourceId("");
    setEventTitle("");
    setEventNotes("");
    setTimeSlot("");
    setFrequencyOfEvent("");
    setWeeklyDayRecurring("");
    setMonthlyRecurring("");
    setNewErrors({});
  };
  const handleMembersDropDown = value => {
    setSelectedMemberId(value);
  };
  const handleResourceDropDown = value => {
    setSelectedResourceId(value);
  };
  const handleMembersMenu = e => {
    setSelectedMemberId(e.domEvent.target.textContent);
  };
  const filterMembers = duplicateData.filter(prev => prev.customerName.toLowerCase().includes(selectedMemberId.toLowerCase()));
  const membersMenu = /*#__PURE__*/_react.default.createElement(_antd.Menu, {
    onClick: handleMembersMenu
  }, filterMembers.map(prev => /*#__PURE__*/_react.default.createElement(_antd.Menu.Item, {
    key: prev.customerId
  }, prev.customerName)));
  const handleResourceMenu = e => {
    setSelectedResourceId(e.domEvent.target.textContent);
  };
  const filterResources = resourceData.filter(prev => prev.resourceName.toLowerCase().includes(selectedResourceId.toLowerCase()));
  const filterOutAvailableResource = filterResources.flatMap(prev => prev.resourceName).filter(resourceName => {
    return sampleData.filter(prev => prev.month === monthName && parseInt(prev.year) === currentDate.getFullYear() && parseInt(prev.date) === currentDate.getDate()).flatMap(prev => prev.events.filter(item => item.from <= (0, _dayjs.default)(timeSlot, "h A").format("HH") && (0, _dayjs.default)(timeSlot, "h A").format("HH") < item.to)).every(event => event.resourceId !== resourceName);
  });
  console.log("filterOutAvailableResource:", filterOutAvailableResource);
  const resourceMenu = /*#__PURE__*/_react.default.createElement(_antd.Menu, {
    onClick: handleResourceMenu
  }, filterOutAvailableResource.map((prev, index) => /*#__PURE__*/_react.default.createElement(_antd.Menu.Item, {
    key: index
  }, prev)));
  const handleUpdateExistingEventDetails = event => {
    setOpenAppoinment(false);
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
  const dropDownList = /*#__PURE__*/_react.default.createElement("select", {
    value: calendarUserId,
    onChange: e => setCalendarUserId(e.target.value),
    style: {
      borderRadius: '5px',
      padding: '5px',
      fontSize: '15px',
      outline: 'none'
    }
  }, /*#__PURE__*/_react.default.createElement("option", {
    value: "All"
  }, "All"), !memberDropDown ? resourceData.map(prevData => /*#__PURE__*/_react.default.createElement("option", null, prevData.resourceName)) : duplicateData.map(prevData => /*#__PURE__*/_react.default.createElement("option", null, prevData.customerName)));
  const handleDailyCalendarEvent = time => {
    time = time === 0 ? "12 AM" : time < 12 ? "".concat(time, " AM") : time === 12 ? "12 PM" : "".concat(time - 12, " PM");
    if (allEventsOnDay[time] > 0) {
      setWeekEventDate(null);
      setOpenEventSlot(true);
      setTimeSlot(time);
    }
    ;
  };
  const handleWeeklyCalendarEvent = (hour, date) => {
    if (allEventsOnDay[hour] > 0) {
      setOpenEventSlot(true);
      setTimeSlot(hour);
      setWeekEventDate(date);
    }
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "calendar-container"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "calendar-header"
  }, /*#__PURE__*/_react.default.createElement(_antd.Row, {
    hidden: !CalendarPage,
    className: "filterCalendar",
    gutter: [8, 8],
    style: {
      marginBottom: '20px'
    }
  }, /*#__PURE__*/_react.default.createElement(_antd.Col, {
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
  }, /*#__PURE__*/_react.default.createElement(_antd.Checkbox, {
    checked: memberDropDown,
    onClick: () => setMemberDropDown(true)
  }, "Member"), /*#__PURE__*/_react.default.createElement(_antd.Checkbox, {
    checked: !memberDropDown,
    onClick: () => setMemberDropDown(false)
  }, "Resource")), /*#__PURE__*/_react.default.createElement(_antd.Col, {
    xs: 24,
    sm: 12,
    md: 16,
    style: {
      padding: '10px 0'
    }
  }, dropDownList)), /*#__PURE__*/_react.default.createElement(_antd.Row, {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '40px'
    }
  }, /*#__PURE__*/_react.default.createElement(_antd.Col, null, /*#__PURE__*/_react.default.createElement(_antd.Button, {
    onClick: () => setCurrentDate(new Date())
  }, /*#__PURE__*/_react.default.createElement("h3", null, "Today")), " \xA0"), /*#__PURE__*/_react.default.createElement(_antd.Col, null, /*#__PURE__*/_react.default.createElement(_antd.Button, {
    onClick: () => {
      setOpenDailyCalendar(true);
      setOpenWeekCalendar(false);
      setOpenMonthCalendar(false);
    },
    style: {
      backgroundColor: openDailyCalendar ? "lightBlue" : ""
    }
  }, /*#__PURE__*/_react.default.createElement("h3", null, "Daily")), " \xA0", screens.lg && /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement(_antd.Button, {
    onClick: () => {
      setOpenWeekCalendar(true);
      setOpenDailyCalendar(false);
      setOpenMonthCalendar(false);
    },
    style: {
      backgroundColor: openWeekCalendar ? "lightBlue" : ""
    }
  }, /*#__PURE__*/_react.default.createElement("h3", null, "Week")), " \xA0"), /*#__PURE__*/_react.default.createElement(_antd.Button, {
    onClick: () => {
      setOpenMonthCalendar(true);
      setOpenWeekCalendar(false);
      setOpenDailyCalendar(false);
    },
    style: {
      backgroundColor: openMonthCalendar ? "lightBlue" : ""
    }
  }, /*#__PURE__*/_react.default.createElement("h3", null, "Month")))), /*#__PURE__*/_react.default.createElement(_antd.Divider, {
    type: "horizontal"
  })), /*#__PURE__*/_react.default.createElement(_antd.Row, {
    style: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '-20px'
    }
  }, /*#__PURE__*/_react.default.createElement(_antd.Button, {
    onClick: handlePrev
  }, /*#__PURE__*/_react.default.createElement(_lucideReact.ChevronLeft, null)), /*#__PURE__*/_react.default.createElement("h2", {
    hidden: !openDailyCalendar
  }, formattedDate, ", ", currentDate.getFullYear()), /*#__PURE__*/_react.default.createElement("h2", {
    hidden: openDailyCalendar
  }, formattedDate, ", ", currentDate.getFullYear()), /*#__PURE__*/_react.default.createElement(_antd.Button, {
    onClick: handleNext
  }, /*#__PURE__*/_react.default.createElement(_lucideReact.ChevronRight, null))), openMonthCalendar ? /*#__PURE__*/_react.default.createElement("div", {
    className: "calendar-grid"
  }, weekdays.map((day, index) => /*#__PURE__*/_react.default.createElement("div", {
    key: index,
    className: "grid-header-item"
  }, day)), days.map((item, index) => /*#__PURE__*/_react.default.createElement("div", {
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
  }, item.day))) : openDailyCalendar ? /*#__PURE__*/_react.default.createElement("div", {
    className: "day-view"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "time-column"
  }, Array.from({
    length: 24
  }, (_, i) => /*#__PURE__*/_react.default.createElement("div", {
    key: i,
    className: "time-slot"
  }, i === 0 ? "12 AM" : i < 12 ? "".concat(i, " AM") : i === 12 ? "12 PM" : "".concat(i - 12, " PM")))), /*#__PURE__*/_react.default.createElement("div", {
    className: "event-column",
    style: {
      position: "relative"
    }
  }, Array.from({
    length: 24
  }, (_, i) => {
    const eventsAtTimeSlot = (calendarUserId !== "All" ? resourceCalendar : sampleData).flatMap(prev =>
    // Check if event is daily and skip the month/year/date validation for recurring events
    prev.events.filter(item => {
      if (item.recurring === "daily") {
        return item.from <= i && i < item.to; // Don't need to check for month, year, date for daily events
      } else if (item.recurring === "weekly") {
        return item.day === weekdays[currentDate.getDay()] &&
        // Just checking the week day for weekly recurring
        item.from <= i && i < item.to;
      } else if (item.recurring === "monthly") {
        return item.date === currentDate.getDate().toString() &&
        // Just checking date of the month for monthly recurring
        item.from <= i && item.to;
      }
      // For non-daily recurring events, check the month/year/date too
      return prev.month === monthName && parseInt(prev.year) === currentDate.getFullYear() && parseInt(prev.date) === currentDate.getDate() && item.from <= i && i < item.to;
    }));
    let backgroundColor = "";
    if (eventsAtTimeSlot.length === 1) backgroundColor = "green";else if (eventsAtTimeSlot.length === 2) backgroundColor = "orange";else if (eventsAtTimeSlot.length === 3) backgroundColor = "red";
    return /*#__PURE__*/_react.default.createElement("div", {
      key: i,
      className: "event-slot",
      style: (calendarUserId !== "All" ? resourceCalendar : sampleData).some(prev => prev.events.some(item => {
        if (item.recurring === "daily") {
          return item.from <= i && i < item.to; // Skip month, year, date validation for daily events
        } else if (item.recurring === "weekly") {
          return item.day === weekdays[currentDate.getDay()] && item.from <= i && i < item.to;
        } else if (item.recurring === "monthly") {
          return item.date === currentDate.getDate().toString() && item.from <= i && i < item.to;
        }
        return prev.month === monthName && parseInt(prev.year) === currentDate.getFullYear() && parseInt(prev.date) === currentDate.getDate() && item.from <= i && i < item.to;
      })) ? {
        backgroundColor,
        borderRight: '2px solid gray',
        borderLeft: "2px solid gray",
        borderBottom: (calendarUserId !== "All" ? resourceCalendar : sampleData).some(prev => prev.events.some(item => {
          if (item.recurring === "daily") {
            return i === item.to - 1;
          } else if (item.recurring === "weekly") {
            return item.day === weekdays[currentDate.getDay()] && i === item.to - 1;
          } else if (item.recurring === "monthly") {
            return item.date === currentDate.getDate().toString() && i === item.to - 1;
          }
          return prev.month === monthName && parseInt(prev.year) === currentDate.getFullYear() && parseInt(prev.date) === currentDate.getDate() && i === item.to - 1;
        })) ? "1px solid gray" : "1px solid transparent"
      } : {},
      onClick: () => handleDailyCalendarEvent(i)
    }, calendarUserId !== "All" ? resourceCalendar.map(prev => {
      if (prev.month === monthName && parseInt(prev.year) === currentDate.getFullYear() && parseInt(prev.date) === currentDate.getDate()) {
        return prev.events.map(item => {
          const midpoint = Math.floor((item.from + item.to) / 2);
          return i === midpoint ? item.title : "";
        });
      }
      return "";
    }) : "", currentHour === i && /*#__PURE__*/_react.default.createElement("div", {
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
  }))) : /*#__PURE__*/_react.default.createElement("div", {
    className: "grid-container header1"
  }, getWeekDays().map((day, index) => /*#__PURE__*/_react.default.createElement("div", {
    key: index
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "grid-header-item",
    style: {
      backgroundColor: currentDate.getFullYear() === new Date().getFullYear() && currentDate.getMonth() === new Date().getMonth() && day.getDate() === new Date().getDate() ? "lightblue" : "",
      opacity: day.getMonth() !== currentDate.getMonth() ? 0.5 : 1,
      pointerEvents: day.getMonth() !== currentDate.getMonth() ? "none" : "auto"
    }
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "day-name"
  }, weekdays[index]), " \xA0", /*#__PURE__*/_react.default.createElement("span", {
    className: "day-number"
  }, day.getDate())), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    hidden: weekdays[index] !== "Sun",
    style: {
      position: "absolute",
      left: '-80px',
      width: '80px'
    },
    className: "week-days"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "time-section",
    style: {
      borderBottom: '1px solid gray',
      backgroundColor: "#ececec"
    }
  }, "all-day"), hours.map((hour, index) => /*#__PURE__*/_react.default.createElement("div", {
    key: index,
    className: "time-section",
    style: {
      backgroundColor: "#ececec"
    }
  }, hour))), /*#__PURE__*/_react.default.createElement("div", {
    className: "week-days",
    style: currentDate.getFullYear() === new Date().getFullYear() && currentDate.getMonth() === new Date().getMonth() && day.getDate() === new Date().getDate() ? {
      border: '2px solid gray',
      marginTop: '-1px'
    } : {}
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "time-section",
    style: {
      borderBottom: '1px solid gray'
    }
  }), hours.map((hour, index) => {
    const eventsAtTimeSlot = (calendarUserId !== "All" ? resourceCalendar : sampleData).flatMap(prev => prev.events.filter(item => {
      if (item.recurring === "daily") {
        return item.from <= (0, _dayjs.default)(hour, "h A").format("HH") && (0, _dayjs.default)(hour, "h A").format("HH") < item.to;
      } else if (item.recurring === "weekly") {
        return item.day === weekdays[day.getDay()] && item.from <= (0, _dayjs.default)(hour, "h A").format("HH") && (0, _dayjs.default)(hour, "h A").format("HH") < item.to;
      } else if (item.recurring === "monthly") {
        return item.date === day.getDate().toString() && item.from <= (0, _dayjs.default)(hour, "h A").format("HH") && (0, _dayjs.default)(hour, "h A").format("HH") < item.to;
      }
      return prev.month === monthName && parseInt(prev.year) === currentDate.getFullYear() && parseInt(prev.date) === day.getDate() && item.from <= (0, _dayjs.default)(hour, "h A").format("HH") && (0, _dayjs.default)(hour, "h A").format("HH") < item.to;
    }));
    let backgroundColor = "";
    if (eventsAtTimeSlot.length === 1) backgroundColor = "green";else if (eventsAtTimeSlot.length === 2) backgroundColor = "orange";else if (eventsAtTimeSlot.length === 3) backgroundColor = "red";
    return /*#__PURE__*/_react.default.createElement("div", {
      key: index,
      className: "time-section",
      style: (calendarUserId !== "All" ? resourceCalendar : sampleData).some(prev => prev.events.some(item => {
        if (item.recurring === "daily") {
          return item.from <= (0, _dayjs.default)(hour, "h A").format("HH") && (0, _dayjs.default)(hour, "h A").format("HH") < item.to;
        } else if (item.recurring === "weekly") {
          return item.day === weekdays[day.getDay()] && item.from <= (0, _dayjs.default)(hour, "h A").format("HH") && (0, _dayjs.default)(hour, "h A").format("HH") < item.to;
        } else if (item.recurring === "monthly") {
          return item.date === day.getDate().toString() && item.from <= (0, _dayjs.default)(hour, "h A").format("HH") && (0, _dayjs.default)(hour, "h A").format("HH") < item.to;
        }
        return prev.month === monthName && parseInt(prev.year) === currentDate.getFullYear() && parseInt(prev.date) === day.getDate() && item.from <= (0, _dayjs.default)(hour, "h A").format("HH") && (0, _dayjs.default)(hour, "h A").format("HH") < item.to;
      })) ? {
        backgroundColor,
        borderBottom: (calendarUserId !== "All" ? resourceCalendar : sampleData).some(prev => prev.events.some(item => {
          if (item.recurring === "daily") {
            return item.from <= (0, _dayjs.default)(hour, "h A").format("HH") && (0, _dayjs.default)(hour, "h A").format("HH") < item.to;
          } else if (item.recurring === "weekly") {
            return item.day === weekdays[day.getDay()] && item.from <= (0, _dayjs.default)(hour, "h A").format("HH") && (0, _dayjs.default)(hour, "h A").format("HH") < item.to;
          } else if (item.recurring === "monthly") {
            return item.date === day.getDate().toString() && item.from <= (0, _dayjs.default)(hour, "h A").format("HH") && (0, _dayjs.default)(hour, "h A").format("HH") < item.to;
          }
          return prev.month === monthName && parseInt(prev.year) === currentDate.getFullYear() && parseInt(prev.date) === day.getDate() && item.from <= (0, _dayjs.default)(hour, "h A").format("HH") && (0, _dayjs.default)(hour, "h A").format("HH") < item.to;
        })) ? "1px solid gray" : "1px solid transparent"
      } : {},
      onClick: () => {
        handleWeeklyCalendarEvent(hour, day.getDate());
      }
    }, calendarUserId !== "All" ? resourceCalendar.map(prev => {
      if (prev.month === monthName && parseInt(prev.year) === currentDate.getFullYear() && parseInt(prev.date) === day.getDate()) {
        return prev.events.map(item => {
          const fromTime = parseInt(item.from, 10);
          const toTime = parseInt(item.to, 10);
          const midpoint = Math.floor((fromTime + toTime) / 2); // Midpoint calculation

          return (0, _dayjs.default)(hour, "h A").format("HH") == midpoint ? item.title : ""; // Show only at midpoint
        });
      }
      return "";
    }) : "", currentHour == (0, _dayjs.default)(hour, "h A").format("HH") && /*#__PURE__*/_react.default.createElement("div", {
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
  })))))), /*#__PURE__*/_react.default.createElement(_antd.Modal, {
    open: openEventSlot,
    title: timeSlot + " Slot",
    onCancel: handleCloseEventSlot,
    footer: openAppointment ? /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/_react.default.createElement(_antd.Button, {
      disabled: allEventsOnDay[timeSlot] === 0,
      onClick: () => {
        valueToSet = "";
        setBookSameSlot(false);
        setOpenAppoinment(false);
      }
    }, "Book new Event"), /*#__PURE__*/_react.default.createElement(_antd.Button, {
      onClick: () => {
        handleUpdateExistingEventDetails(filteredEvents[currentPage - 1]);
        setBookSameSlot(true);
      }
    }, "update"), /*#__PURE__*/_react.default.createElement(_antd.Button, {
      danger: true,
      onClick: () => deleteEvent()
    }, "Delete")) : /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_antd.Button, {
      type: "primary",
      onClick: handleCalendarEvent
    }, "Ok"))
  }, /*#__PURE__*/_react.default.createElement("div", null, !openAppointment ? /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      textAlign: 'left',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/_react.default.createElement(_antd.Row, {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/_react.default.createElement(_antd.Dropdown, {
    overlay: membersMenu,
    trigger: ["click"]
  }, /*#__PURE__*/_react.default.createElement("input", {
    style: {
      border: !selectedMemberId ? "2px solid red" : ""
    },
    className: "memberResourceInput",
    placeholder: "Search for members",
    value: selectedMemberId,
    onChange: e => handleMembersDropDown(e.target.value)
  })), newErrors.selectedMemberId && /*#__PURE__*/_react.default.createElement("span", {
    className: "inputError1"
  }, newErrors.selectedMemberId), /*#__PURE__*/_react.default.createElement(_antd.Dropdown, {
    overlay: resourceMenu,
    trigger: ["click"]
  }, /*#__PURE__*/_react.default.createElement("input", {
    style: {
      border: !selectedResourceId ? '2px solid red' : ""
    },
    className: "memberResourceInput",
    placeholder: "Search for resource",
    value: selectedResourceId,
    onChange: e => handleResourceDropDown(e.target.value)
  })), newErrors.selectedResourceId && /*#__PURE__*/_react.default.createElement("span", {
    className: "inputError2"
  }, newErrors.selectedResourceId)), /*#__PURE__*/_react.default.createElement("h2", null, "Title :", /*#__PURE__*/_react.default.createElement("input", {
    style: {
      border: 'transparent',
      outline: 'none',
      borderBottom: '3px solid purple',
      fontSize: '20px',
      marginLeft: '10px'
    },
    onChange: e => setEventTitle(e.target.value),
    value: eventTitle
  }), newErrors.eventTitle && /*#__PURE__*/_react.default.createElement("span", {
    style: {
      color: "red"
    }
  }, "*")), /*#__PURE__*/_react.default.createElement("h2", null, "Notes :", /*#__PURE__*/_react.default.createElement("input", {
    style: {
      border: 'transparent',
      outline: 'none',
      borderBottom: '3px solid purple',
      fontSize: '20px',
      marginLeft: '10px'
    },
    onChange: e => setEventNotes(e.target.value),
    value: eventNotes
  })), /*#__PURE__*/_react.default.createElement(_antd.Row, {
    style: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row'
    }
  }, /*#__PURE__*/_react.default.createElement("h2", null, "Recurring : ", " ", /*#__PURE__*/_react.default.createElement(_antd.Select, {
    value: frequencyOfEvent,
    onChange: value => setFrequencyOfEvent(value),
    style: {
      borderRadius: '5px',
      padding: '5px',
      fontSize: '15px',
      outline: 'none'
    }
  }, /*#__PURE__*/_react.default.createElement(Option, {
    value: "noRecurring"
  }, "No Recurring"), /*#__PURE__*/_react.default.createElement(Option, {
    value: "daily"
  }, "Daily"), /*#__PURE__*/_react.default.createElement(Option, {
    value: "weekly"
  }, "Weekly"), /*#__PURE__*/_react.default.createElement(Option, {
    value: "monthly"
  }, "Monthly"))), " \xA0\xA0", /*#__PURE__*/_react.default.createElement("h2", null, "Day : ", " ", /*#__PURE__*/_react.default.createElement("select", {
    value: frequencyOfEvent === "weekly" ? weeklyDayRecurring : monthlyRecurring,
    onChange: e => {
      frequencyOfEvent === "weekly" ? setWeeklyDayRecurring(e.target.value) : setMonthlyRecurring(e.target.value);
    },
    disabled: frequencyOfEvent === "noRecurring" || frequencyOfEvent === "daily",
    style: {
      borderRadius: '5px',
      padding: '5px',
      fontSize: '15px',
      outline: 'none'
    }
  }, frequencyOfEvent === "weekly" ? weekdays.map((day, index) => /*#__PURE__*/_react.default.createElement("option", {
    value: day
  }, day)) : days.map((day, index) => /*#__PURE__*/_react.default.createElement("option", {
    value: day.day
  }, " " + day.day))))), /*#__PURE__*/_react.default.createElement("h3", null, "From :", /*#__PURE__*/_react.default.createElement(_antd.TimePicker, {
    format: "h A",
    style: {
      width: '100px'
    },
    value: Number.isInteger(fromTimeSlot) ? (0, _dayjs.default)().hour(fromTimeSlot) : fromTimeSlot,
    onChange: e => setFromTimeSlot(e.hour()),
    needConfirm: false
  }), " \xA0\xA0 To :", /*#__PURE__*/_react.default.createElement(_antd.TimePicker, {
    format: "h A",
    style: {
      width: '100px'
    },
    value: Number.isInteger(toTimeSlot) ? (0, _dayjs.default)().hour(toTimeSlot) : toTimeSlot,
    onChange: e => setToTimeSlot(e.hour()),
    needConfirm: false
  }))) : /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      textAlign: 'left',
      flexDirection: 'column'
    }
  }, paginateEvents.map(item => /*#__PURE__*/_react.default.createElement("center", {
    key: item.title
  }, /*#__PURE__*/_react.default.createElement("h2", {
    onClick: () => {
      handleUpdateExistingEventDetails(filteredEvents[currentPage - 1]);
      setBookSameSlot(true);
    }
  }, item.title))), /*#__PURE__*/_react.default.createElement(_antd.Pagination, {
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
  })))));
};
var _default = exports.default = CalendarPage;