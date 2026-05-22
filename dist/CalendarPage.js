function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { useCallback, useRef, useState, useEffect } from "react";
import "./CalendarPage.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getRecurringCalendar, getCalendar, createEvent, updateEvent, deleteEvent } from "./api/APIUtil";
import { Button, Checkbox, Col, Divider, Dropdown, Select, Menu, Modal, Row, TimePicker, Grid, Spin, DatePicker } from "antd";
import dayjs from "dayjs";
import { LoadingOutlined, LockOutlined } from "@ant-design/icons";
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const {
  useBreakpoint
} = Grid;
const MAX_CALENDAR_MONTH_CACHE = 3;
const MAX_CALENDAR_USER_CACHE = 2;
const CalendarPage = _ref => {
  var _selectedRecurringEve, _selectedRecurringEve2;
  let {
    duplicateData,
    entityId,
    resourceData
  } = _ref;
  const [openEventStatusModal, setOpenEventStatusModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [pendingFilterDate, setPendingFilterDate] = useState(dayjs());
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
  const [sampleData, setSampleData] = useState([]);
  const [showMyAppointments, setShowMyAppointments] = useState(false);
  const calendarCacheRef = useRef({});
  const calendarCacheOrderRef = useRef({});
  const calendarUserCacheOrderRef = useRef([]);
  const recurringCacheRef = useRef({});
  const calendarRequestRef = useRef({});
  const recurringRequestRef = useRef({});
  const [effectiveEntityId, setEffectiveEntityId] = useState(entityId || null);
  useEffect(() => {
    if (entityId) {
      setEffectiveEntityId(entityId);
      return;
    }
    if (typeof window !== "undefined") {
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
  }, [entityId]);
  const [overlapWarning, setOverlapWarning] = useState("");
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
    if (!selectedMemberId) fieldError.selectedMemberId = "Please select a member";
    if (!selectedResourceId) fieldError.selectedResourceId = "Please select a resource";
    if (!eventTitle) fieldError.eventTitle = "Title required...!";
    if (fromTimeSlot === null || fromTimeSlot === undefined) fieldError.fromTimeSlot = "From time required";
    if (toTimeSlot === null || toTimeSlot === undefined) fieldError.toTimeSlot = "To time required";

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
    setPendingFilterDate(dayjs(currentDate));
  }, [currentDate]);
  const getCalendarRequestParams = useCallback(date => {
    const targetDate = date || new Date();
    return {
      monthName: targetDate.toLocaleString("default", {
        month: "long"
      }),
      year: targetDate.getFullYear().toString()
    };
  }, []);
  const getVisibleCalendarMonths = useCallback(date => {
    const targetDate = date || new Date();
    const datesToCheck = openWeekCalendar ? Array.from({
      length: 7
    }, (_, i) => {
      const startOfWeek = new Date(targetDate);
      startOfWeek.setDate(targetDate.getDate() - targetDate.getDay());
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    }) : [targetDate];
    const monthMap = new Map();
    datesToCheck.forEach(visibleDate => {
      const {
        monthName,
        year
      } = getCalendarRequestParams(visibleDate);
      monthMap.set("".concat(monthName, ":").concat(year), {
        monthName,
        year,
        date: visibleDate
      });
    });
    return Array.from(monthMap.values());
  }, [openWeekCalendar, getCalendarRequestParams]);
  const rememberCalendarUserCacheKey = useCallback(userCacheKey => {
    calendarUserCacheOrderRef.current = [userCacheKey, ...calendarUserCacheOrderRef.current.filter(key => key !== userCacheKey)];
    while (calendarUserCacheOrderRef.current.length > MAX_CALENDAR_USER_CACHE) {
      const userKeyToDelete = calendarUserCacheOrderRef.current.pop();
      const calendarKeyPrefix = "".concat(userKeyToDelete, ":");
      Object.keys(calendarCacheRef.current).forEach(cacheKey => {
        if (cacheKey.startsWith(calendarKeyPrefix)) {
          delete calendarCacheRef.current[cacheKey];
        }
      });
      Object.keys(calendarRequestRef.current).forEach(cacheKey => {
        if (cacheKey.startsWith(calendarKeyPrefix)) {
          delete calendarRequestRef.current[cacheKey];
        }
      });
      delete calendarCacheOrderRef.current[userKeyToDelete];
      delete recurringCacheRef.current[userKeyToDelete];
      delete recurringRequestRef.current[userKeyToDelete];
    }
  }, []);
  const rememberCalendarCacheKey = useCallback((userCacheKey, cacheKey) => {
    rememberCalendarUserCacheKey(userCacheKey);
    const userMonthOrder = calendarCacheOrderRef.current[userCacheKey] || [];
    calendarCacheOrderRef.current[userCacheKey] = [cacheKey, ...userMonthOrder.filter(key => key !== cacheKey)];
    while (calendarCacheOrderRef.current[userCacheKey].length > MAX_CALENDAR_MONTH_CACHE) {
      const keyToDelete = calendarCacheOrderRef.current[userCacheKey].pop();
      delete calendarCacheRef.current[keyToDelete];
      delete calendarRequestRef.current[keyToDelete];
    }
  }, [rememberCalendarUserCacheKey]);
  const visibleMonthsKey = getVisibleCalendarMonths(currentDate).map(_ref2 => {
    let {
      monthName,
      year
    } = _ref2;
    return "".concat(monthName, ":").concat(year);
  }).join("|");
  const loadCalendarData = useCallback(async (userId, date) => {
    if (!effectiveEntityId || !userId || userId === "Select Member" || userId === "Select Resource") {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const visibleMonths = getVisibleCalendarMonths(date);
      const recurringCacheKey = "".concat(effectiveEntityId, ":").concat(userId);
      rememberCalendarUserCacheKey(recurringCacheKey);
      const cachedRecurringData = recurringCacheRef.current[recurringCacheKey];
      const [calendarDataByMonth, recurringData] = await Promise.all([Promise.all(visibleMonths.map(_ref3 => {
        let {
          monthName,
          year
        } = _ref3;
        const calendarCacheKey = "".concat(effectiveEntityId, ":").concat(userId, ":").concat(monthName, ":").concat(year);
        const cachedCalendarData = calendarCacheRef.current[calendarCacheKey];
        if (cachedCalendarData !== undefined) {
          rememberCalendarCacheKey(recurringCacheKey, calendarCacheKey);
          return Promise.resolve(cachedCalendarData);
        }
        if (!calendarRequestRef.current[calendarCacheKey]) {
          calendarRequestRef.current[calendarCacheKey] = getCalendar(effectiveEntityId, userId, monthName, year).then(calendarData => {
            if (calendarUserCacheOrderRef.current.includes(recurringCacheKey)) {
              calendarCacheRef.current[calendarCacheKey] = calendarData;
              rememberCalendarCacheKey(recurringCacheKey, calendarCacheKey);
            }
            delete calendarRequestRef.current[calendarCacheKey];
            return calendarData;
          }).catch(error => {
            delete calendarRequestRef.current[calendarCacheKey];
            throw error;
          });
        }
        return calendarRequestRef.current[calendarCacheKey];
      })), cachedRecurringData !== undefined ? Promise.resolve(cachedRecurringData) : (() => {
        if (!recurringRequestRef.current[recurringCacheKey]) {
          recurringRequestRef.current[recurringCacheKey] = getRecurringCalendar(effectiveEntityId, userId).then(recurringData => {
            if (calendarUserCacheOrderRef.current.includes(recurringCacheKey)) {
              recurringCacheRef.current[recurringCacheKey] = recurringData;
            }
            delete recurringRequestRef.current[recurringCacheKey];
            return recurringData;
          }).catch(error => {
            delete recurringRequestRef.current[recurringCacheKey];
            throw error;
          });
        }
        return recurringRequestRef.current[recurringCacheKey];
      })()]);
      const calendarData = calendarDataByMonth.flatMap(monthData => Array.isArray(monthData) ? monthData : []);
      if (userId === "All") {
        setSampleData(Array.isArray(calendarData) ? calendarData : []);
        setRecurringAllCalendar(recurringData || []);
        setResourceCalendar([]);
        setRecurringResourceCalendar([]);
      } else {
        setResourceCalendar(Array.isArray(calendarData) ? calendarData : []);
        setRecurringResourceCalendar(recurringData || []);
      }
    } catch (error) {
      console.log("Error fetching calendar data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [effectiveEntityId, getVisibleCalendarMonths, rememberCalendarCacheKey, rememberCalendarUserCacheKey]);
  const isCalendarMonthCached = useCallback((userId, date) => {
    if (!effectiveEntityId || !userId || userId === "Select Member" || userId === "Select Resource") {
      return true;
    }
    return getVisibleCalendarMonths(date).every(_ref4 => {
      let {
        monthName,
        year
      } = _ref4;
      const calendarCacheKey = "".concat(effectiveEntityId, ":").concat(userId, ":").concat(monthName, ":").concat(year);
      return calendarCacheRef.current[calendarCacheKey] !== undefined || calendarRequestRef.current[calendarCacheKey];
    });
  }, [effectiveEntityId, getVisibleCalendarMonths]);
  useEffect(() => {
    loadCalendarData(calendarUserId, currentDate);
  }, [calendarUserId, visibleMonthsKey, loadCalendarData]);
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
  const getWeekDaysForDate = date => {
    const startOfWeek = getStartOfWeek(date);
    return Array.from({
      length: 7
    }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  };
  useEffect(() => {
    const format24Hour = dayjs(timeSlot, "h A").hour();
    setFromTimeSlot(format24Hour);
    setToTimeSlot(format24Hour + 1);
  }, [timeSlot]);
  const getWeekDays = () => {
    return getWeekDaysForDate(currentDate);
  };
  const parseApiDate = value => {
    if (!value) return null;
    const parsedDate = value instanceof Date ? value : new Date(value);
    if (!Number.isNaN(parsedDate.getTime())) {
      return dayjs(parsedDate);
    }
    const normalizedDate = String(value).replace(" UTC ", " GMT ");
    const normalizedParsedDate = new Date(normalizedDate);
    return Number.isNaN(normalizedParsedDate.getTime()) ? null : dayjs(normalizedParsedDate);
  };
  const isRecurringWithinDateRange = (date, event) => {
    var _parseApiDate, _parseApiDate2;
    if (!event || typeof event !== "object") return true;
    const selectedDate = dayjs(date).startOf("day");
    const startDate = (_parseApiDate = parseApiDate(event.startDate)) === null || _parseApiDate === void 0 ? void 0 : _parseApiDate.startOf("day");
    const endDate = (_parseApiDate2 = parseApiDate(event.endDate)) === null || _parseApiDate2 === void 0 ? void 0 : _parseApiDate2.startOf("day");
    const startsOk = !startDate || selectedDate.isSame(startDate, "day") || selectedDate.isAfter(startDate, "day");
    const endsOk = !endDate || selectedDate.isSame(endDate, "day") || selectedDate.isBefore(endDate, "day");
    return startsOk && endsOk;
  };
  const getRecurringRoot = calendarData => (calendarData === null || calendarData === void 0 ? void 0 : calendarData.AllEvents) || calendarData || {};
  const getRecurringBucket = (calendarData, key) => {
    var _key$toUpperCase, _key$toLowerCase;
    const root = getRecurringRoot(calendarData);
    const titleKey = key ? key.charAt(0).toUpperCase() + key.slice(1).toLowerCase() : key;
    return (root === null || root === void 0 ? void 0 : root[key]) || (root === null || root === void 0 ? void 0 : root[key === null || key === void 0 || (_key$toUpperCase = key.toUpperCase) === null || _key$toUpperCase === void 0 ? void 0 : _key$toUpperCase.call(key)]) || (root === null || root === void 0 ? void 0 : root[key === null || key === void 0 || (_key$toLowerCase = key.toLowerCase) === null || _key$toLowerCase === void 0 ? void 0 : _key$toLowerCase.call(key)]) || (root === null || root === void 0 ? void 0 : root[titleKey]) || {};
  };
  const getHourItems = (items, hourKey) => {
    const hourItems = items === null || items === void 0 ? void 0 : items[hourKey];
    return Array.isArray(hourItems) ? hourItems : [];
  };
  const getRecurringHourItemsForDate = (calendarData, date, hour) => {
    const dateObj = dayjs(date);
    const hourKey = "hour_".concat(hour);
    const weekdayKey = dateObj.format("dddd");
    const monthDayKey = "Day_".concat(dateObj.date());
    const recurringItems = [...getHourItems(getRecurringBucket(calendarData, weekdayKey), hourKey), ...getHourItems(getRecurringBucket(calendarData, monthDayKey), hourKey)];
    const seen = new Set();
    return recurringItems.filter((item, index) => {
      const key = item && typeof item === "object" ? "".concat(item.id || "recurring", "-").concat(item.frequency || "", "-").concat(item.from || hour, "-").concat(item.to || "", "-").concat(index) : "".concat(String(item), "-").concat(index);
      if (seen.has(key)) return false;
      seen.add(key);
      if (!item || typeof item !== "object") return true;
      if (!isRecurringWithinDateRange(dateObj, item)) return false;
      const from = Number(item.from);
      const to = Number(item.to);
      if (Number.isFinite(from) && Number.isFinite(to) && !(from <= hour && hour < to)) {
        return false;
      }
      if (item.frequency === "monthly") {
        var _item$monthDays;
        return Number(((_item$monthDays = item.monthDays) === null || _item$monthDays === void 0 ? void 0 : _item$monthDays[0]) || item.date || dateObj.date()) === dateObj.date();
      }
      if (item.frequency === "weekly") {
        const weekday = dateObj.format("dddd");
        const weekdayCaps = weekday.toUpperCase();
        return !item.day && !item.days ? true : item.day === weekday || item.day === weekdayCaps || item.days === weekdayCaps;
      }
      return true;
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
  const handleApplyDateFilter = () => {
    const selectedDate = pendingFilterDate ? pendingFilterDate.toDate() : new Date(currentDate);
    const nextDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    setWeekEventDate(null);
    setCurrentPage(1);
    setCurrentDate(nextDate);
    if (!isCalendarMonthCached(calendarUserId, nextDate)) {
      loadCalendarData(calendarUserId, nextDate);
    }
  };

  // useEffect(() => {
  //   if(eventStatus){
  //     showStatusModal();
  //   }
  // }, [eventStatus])

  // const showStatusModal = () => {
  //   setTimeout(() => {
  //     setOpenEventStatusModal(false);
  //     setEventStatus("");
  //   }, 2000);
  // }

  // Modal Management Helper Functions
  const closeAllModals = () => {
    setOpenEventSlot(false);
    setOpenBookedEventModal(false);
    setIsRecurringEventModalOpen(false);
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
    if (!effectiveEntityId || userId === "Select Member" || userId === "Select Resource") {
      return;
    }
    try {
      setIsLoading(true);
      const recurringCacheKey = "".concat(effectiveEntityId, ":").concat(userId);
      const visibleMonths = getVisibleCalendarMonths(date);
      rememberCalendarUserCacheKey(recurringCacheKey);
      const [calendarDataByMonth, recurringData] = await Promise.all([Promise.all(visibleMonths.map(_ref5 => {
        let {
          monthName,
          year
        } = _ref5;
        return getCalendar(effectiveEntityId, userId, monthName, year).then(calendarData => {
          const calendarCacheKey = "".concat(effectiveEntityId, ":").concat(userId, ":").concat(monthName, ":").concat(year);
          calendarCacheRef.current[calendarCacheKey] = calendarData;
          rememberCalendarCacheKey(recurringCacheKey, calendarCacheKey);
          return calendarData;
        });
      })), getRecurringCalendar(effectiveEntityId, userId)]);
      const calendarData = calendarDataByMonth.flatMap(monthData => Array.isArray(monthData) ? monthData : []);
      console.log("Refreshed Calendar Data:", calendarData);
      recurringCacheRef.current[recurringCacheKey] = recurringData;
      if (userId === "All") {
        setSampleData(Array.isArray(calendarData) ? calendarData : []);
      } else {
        setResourceCalendar(Array.isArray(calendarData) ? calendarData : []);
      }
      console.log("Refreshed Recurring Data:", recurringData);
      if (userId === "All") {
        setRecurringAllCalendar(recurringData || []);
      } else {
        setRecurringResourceCalendar(recurringData || []);
      }
    } catch (error) {
      console.log("Error refreshing calendar UI:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCalendarEvent = () => {
    if (!validateFields()) {
      return;
    }
    setEventLoading(true);
    setOpenEventStatusModal(true);
    setOpenEventSlot(false);
    const appointmentDate = Number(monthlyRecurring) || currentDate.getDate();
    const eventDetails = _objectSpread(_objectSpread(_objectSpread({
      memberId: selectedMemberId,
      resourceId: selectedResourceId,
      date: appointmentDate,
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
      day: weeklyDayRecurring || dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), appointmentDate)).format("dddd")
    }, recurring && recurringStartDate && {
      startDate: recurringStartDate.format("YYYY-MM-DD")
    }), recurring && recurringEndDate && {
      endDate: recurringEndDate.format("YYYY-MM-DD")
    });

    // Unified handler for both add and update operations
    const handleEventOperation = async function () {
      let isUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      try {
        if (isUpdate) {
          var _filteredEvents;
          // Prefer an explicitly selected recurring or booked event ID, fallback to the paginated filtered event
          const eventId = (selectedRecurringEvent === null || selectedRecurringEvent === void 0 ? void 0 : selectedRecurringEvent.id) || (selectedBookedEvent === null || selectedBookedEvent === void 0 ? void 0 : selectedBookedEvent.id) || ((_filteredEvents = filteredEvents[currentPage - 1]) === null || _filteredEvents === void 0 ? void 0 : _filteredEvents.id);
          if (!eventId) throw new Error('No event id found to update');
          await updateEvent(effectiveEntityId, eventId, eventDetails);
        } else {
          await createEvent(effectiveEntityId, eventDetails);
        }

        // Show success message
        setEventStatus(isUpdate ? "Event updated successfully!" : "Event created successfully!");

        // Close modals
        closeAllModals();
        handleCloseEventSlot();

        // Refresh from the API after a successful write; do not populate calendar state locally.
        await refreshCalendarUI(calendarUserId, currentDate);
      } catch (error) {
        console.log(isUpdate ? "Unable to update event:" : "Unable to create event:", error);
        setEventStatus(isUpdate ? "Error updating event. Please try again." : "Error creating event. Please try again.");
      } finally {
        setEventLoading(false);
      }
    };

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
    setIsRecurringEventModalOpen(false);
    try {
      // For now, we delete the entire recurring event
      // In future, could implement delete single occurrence logic
      await deleteEvent(effectiveEntityId, selectedRecurringEvent.id);

      // Show success message
      setEventStatus("Recurring event deleted successfully".concat(deleteRecurringType === 'single' ? ' (this occurrence)' : ' (all occurrences)', "!"));

      // Close modals
      closeAllModals();

      // Refresh UI after brief delay
      setTimeout(() => {
        refreshCalendarUI(calendarUserId, currentDate);
      }, 800);
    } catch (error) {
      console.log("Unable to delete recurring event:", error);
      setEventStatus("Error deleting recurring event. Please try again.");
    } finally {
      setEventLoading(false);
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
  const resourceMenuDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), openWeekCalendar && weekEventDate ? weekEventDate : currentDate.getDate());
  const recurringEvents = getRecurringHourItemsForDate(recurringAllCalendar, resourceMenuDate, hour);

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
    setRecurringStartDate(parseApiDate(event.startDate));
    setRecurringEndDate(parseApiDate(event.endDate));

    // Ensure recurring/editor flags are set correctly
    setRecurring(Boolean(event.isRecurring));
    setFrequencyOfEvent(event.frequency || "noRecurring");
    if (event.isRecurring) setSelectedRecurringEvent(event);
    setBookSameSlot(true);
    setIsEditingEvent(true);
  };
  const handleShowBookedEventDetails = event => {
    setSelectedBookedEvent(event);
    if (event !== null && event !== void 0 && event.isRecurring) {
      setSelectedRecurringEvent(event);
    }
    openBookedEventModalOnly();

    // Calculate available resources for this slot
    const eventHour = event === null || event === void 0 ? void 0 : event.from;
    const hourKey = "hour_".concat(eventHour);
    const bookedInSlot = sampleData.flatMap(day => {
      var _day$allEvents$hourKe2, _day$allEvents2;
      return (_day$allEvents$hourKe2 = (_day$allEvents2 = day.allEvents) === null || _day$allEvents2 === void 0 ? void 0 : _day$allEvents2[hourKey]) !== null && _day$allEvents$hourKe2 !== void 0 ? _day$allEvents$hourKe2 : [];
    });
    const bookedSet = new Set(bookedInSlot.map(b => b && b.resourceId != null ? String(b.resourceId) : String(b)));
    const available = resourceData.filter(res => !bookedSet.has(String(res.resourceId)) && !bookedSet.has(String(res.resourceName)));
    setAvailableResourcesForSlot(available);
  };
  const getBookedEventsForSlot = (date, hourValue) => {
    const slotDate = dayjs(date);
    const month = slotDate.format("MMMM");
    const year = slotDate.year();
    const dateNumber = slotDate.date();
    const weekday = slotDate.format("dddd");
    const weekdayCaps = weekday.toUpperCase();
    const oneTimeEvents = resourceCalendar.flatMap(calendarDay => {
      const isMatchingDay = calendarDay.month === month && parseInt(calendarDay.year, 10) === year && parseInt(calendarDay.date, 10) === dateNumber;
      if (!isMatchingDay) return [];
      return (calendarDay.events || []).filter(event => event.from <= hourValue && hourValue < event.to).map(event => _objectSpread(_objectSpread({}, event), {}, {
        date: event.date || calendarDay.date,
        month: event.month || calendarDay.month,
        year: event.year || calendarDay.year
      }));
    });
    const recurringItemsForDate = getRecurringHourItemsForDate(recurringResourceCalendar, slotDate, hourValue);
    const weeklyRecurringEvents = recurringItemsForDate.filter(event => {
      var _event$monthDays;
      if (!event || typeof event !== "object") return true;
      if (event.frequency === "daily") return event.from <= hourValue && hourValue < event.to;
      if (event.frequency === "weekly") return (event.days === weekdayCaps || event.day === weekdayCaps || event.day === weekday) && event.from <= hourValue && hourValue < event.to;
      if (event.frequency === "monthly") return Number(((_event$monthDays = event.monthDays) === null || _event$monthDays === void 0 ? void 0 : _event$monthDays[0]) || event.date || dateNumber) === dateNumber && event.from <= hourValue && hourValue < event.to;
      return event.from <= hourValue && hourValue < event.to;
    }).map(event => {
      var _event$isRecurring;
      return _objectSpread(_objectSpread({}, event), {}, {
        date: event.date || String(dateNumber),
        month: event.month || month,
        year: event.year || String(year),
        day: event.day || weekday,
        isRecurring: (_event$isRecurring = event.isRecurring) !== null && _event$isRecurring !== void 0 ? _event$isRecurring : true
      });
    });
    return [...oneTimeEvents, ...weeklyRecurringEvents];
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
    return isRecurringWithinDateRange(date, event);
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
      var _event$monthDays2;
      return dateOfMonth === parseInt(((_event$monthDays2 = event.monthDays) === null || _event$monthDays2 === void 0 ? void 0 : _event$monthDays2[0]) || event.date);
    }
    return false;
  };
  const getCalendarDayEntry = date => {
    const dateObj = dayjs(date);
    return sampleData.find(day => parseInt(day.date, 10) === dateObj.date() && day.month === dateObj.format("MMMM") && parseInt(day.year, 10) === dateObj.year());
  };
  const getAllEventsForSlot = (date, hour) => {
    const dateObj = dayjs(date);
    const hourKey = "hour_".concat(hour);
    const dayEntry = getCalendarDayEntry(dateObj.toDate());
    return [...getHourItems(dayEntry === null || dayEntry === void 0 ? void 0 : dayEntry.allEvents, hourKey), ...getRecurringHourItemsForDate(recurringAllCalendar, dateObj, hour)];
  };
  const getAllCalendarHourCount = (date, hour) => {
    const dateObj = dayjs(date);
    const hourKey = "hour_".concat(hour);
    const dayEntry = getCalendarDayEntry(dateObj.toDate());
    const oneTimeCount = getHourItems(dayEntry === null || dayEntry === void 0 ? void 0 : dayEntry.allEvents, hourKey).length;
    const recurringCount = getRecurringHourItemsForDate(recurringAllCalendar, dateObj, hour).length;
    return oneTimeCount + recurringCount;
  };
  const getFilteredCalendarHourCount = (date, hour) => {
    const dateObj = dayjs(date);
    const hourKey = "hour_".concat(hour);
    const dayEvents = resourceCalendar.flatMap(calendarDay => {
      var _calendarDay$events$f, _calendarDay$events;
      const isMatchingDay = calendarDay.month === dateObj.format("MMMM") && parseInt(calendarDay.year, 10) === dateObj.year() && parseInt(calendarDay.date, 10) === dateObj.date();
      if (!isMatchingDay) return [];
      return (_calendarDay$events$f = (_calendarDay$events = calendarDay.events) === null || _calendarDay$events === void 0 ? void 0 : _calendarDay$events.filter(event => event.from <= hour && hour < event.to)) !== null && _calendarDay$events$f !== void 0 ? _calendarDay$events$f : [];
    });
    const recurringEvents = getRecurringHourItemsForDate(recurringResourceCalendar, dateObj, hour);
    return dayEvents.length + recurringEvents.length;
  };
  const getBookedEventCountForHour = (date, hour) => {
    const isFilteredCalendar = calendarUserId && calendarUserId !== "All" && calendarUserId !== "Select Member" && calendarUserId !== "Select Resource";
    return isFilteredCalendar ? getFilteredCalendarHourCount(date, hour) : getAllCalendarHourCount(date, hour);
  };
  const getBookedEventCountForDay = date => {
    return Array.from({
      length: 24
    }, (_, hour) => getBookedEventCountForHour(date, hour)).reduce((total, count) => total + count, 0);
  };
  const getBookedResourceKey = event => {
    if (!event) return "";
    if (typeof event === "string" || typeof event === "number") return String(event);
    return String(event.resourceId || event.resourceName || event.id || "");
  };
  const getBookedResourceCount = events => {
    const uniqueResources = new Set((events || []).map(getBookedResourceKey).filter(Boolean));
    return uniqueResources.size || (events || []).length;
  };
  const isSlotFullyBooked = events => {
    if (!events || events.length === 0) return false;
    const totalResources = resourceData.length || 0;
    return totalResources > 0 && getBookedResourceCount(events) >= totalResources;
  };
  const isFilteredCalendarView = () => calendarUserId && calendarUserId !== "All" && calendarUserId !== "Select Member" && calendarUserId !== "Select Resource";
  const getBookedEventsForDay = date => {
    return Array.from({
      length: 24
    }, (_, hour) => isFilteredCalendarView() ? getBookedEventsForSlot(date, hour) : getAllEventsForSlot(date, hour)).find(events => isFilteredCalendarView() ? events.length > 0 : isSlotFullyBooked(events)) || [];
  };
  const renderBookedStatus = function (events) {
    var _events$find;
    let className = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    if (!events || events.length === 0) return null;
    const eventTitle = isFilteredCalendarView() ? (_events$find = events.find(event => event && typeof event === "object" && event.title)) === null || _events$find === void 0 ? void 0 : _events$find.title : "";
    return /*#__PURE__*/React.createElement("span", {
      className: "booked-count ".concat(className)
    }, eventTitle || "Booked");
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
    if (calendarUserId !== "All" && (!selectedFilterType || !calendarUserId)) {
      showErrorMessage("Please select a member or resource from the calendar dropdown before booking.");
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
      const bookedEvents = getBookedEventsForSlot(currentDate, parseInt(dayjs(time, "h A").format("HH"), 10));
      if (bookedEvents.length > 0) {
        handleShowBookedEventDetails(bookedEvents[0]);
      }
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
    if (calendarUserId !== "All" && (!selectedFilterType || !calendarUserId)) {
      showErrorMessage("Please select a member or resource from the calendar dropdown before booking.");
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
      const bookedEvents = getBookedEventsForSlot(date, hourValue);
      if (bookedEvents.length > 0) {
        handleShowBookedEventDetails(bookedEvents[0]);
      }
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

          // console.log("Event check:", { 
          //   event: event.title, 
          //   isSameResource, 
          //   eventFrom, 
          //   eventTo, 
          //   hasOverlap
          // });

          return isSameResource && hasOverlap;
        });
      });

      // Fetch recurring events for the specific resource
      const recurringData = await getRecurringCalendar(effectiveEntityId, resourceId);
      console.log("Fetched recurring calendar:", recurringData);
      const weekday = dayjs(selectedDate ? new Date(yearNumber, currentDate.getMonth(), selectedDate) : currentDate).format("dddd").toUpperCase();
      const selectedDateObj = dayjs(selectedDate ? new Date(yearNumber, currentDate.getMonth(), selectedDate) : currentDate);
      const recurringDayBucket = getRecurringBucket(recurringData, weekday);
      const recurringOverlap = recurringDayBucket ? Object.values(recurringDayBucket).some(hourEvents => Array.isArray(hourEvents) && hourEvents.some(event => {
        const isSameResource = event.resourceId === resourceId;
        if (isSameResource) {
          // If we're editing an event, ignore the same recurring event
          const editingId = (selectedBookedEvent === null || selectedBookedEvent === void 0 ? void 0 : selectedBookedEvent.id) || (selectedRecurringEvent === null || selectedRecurringEvent === void 0 ? void 0 : selectedRecurringEvent.id);
          if (editingId && event.id === editingId) return false;

          // Check if selected date is within the recurring event date range
          if (!isRecurringWithinDateRange(selectedDateObj, event)) return false;
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
      setSelectedMemberId("");
      setSelectedResourceId("");
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
  const weekDaysForView = getWeekDays();
  const weekRangeLabel = "".concat(dayjs(weekDaysForView[0]).format("MMM D, YYYY"), " - ").concat(dayjs(weekDaysForView[6]).format("MMM D, YYYY"));
  const selectedCalendarName = selectedFilterType === "resource" ? getResourceNameById(calendarUserId) : selectedFilterType === "member" ? getMemberNameById(calendarUserId) : "";
  const myAppointments = resourceCalendar.flatMap(calendarDay => (calendarDay.events || []).map(event => _objectSpread(_objectSpread({}, event), {}, {
    date: event.date || calendarDay.date,
    month: event.month || calendarDay.month,
    year: event.year || calendarDay.year
  }))).sort((a, b) => {
    const dateA = dayjs("".concat(a.month, " ").concat(a.date, " ").concat(a.year), "MMMM D YYYY").valueOf();
    const dateB = dayjs("".concat(b.month, " ").concat(b.date, " ").concat(b.year), "MMMM D YYYY").valueOf();
    if (dateA !== dateB) return dateA - dateB;
    return Number(a.from) - Number(b.from);
  });
  const formatEventTime = hour => dayjs().hour(Number(hour)).minute(0).format("h:mm A");
  const formatAppointmentDate = value => {
    const parsedDate = parseApiDate(value);
    return parsedDate ? parsedDate.format("ddd, MMM D, YYYY") : "Not specified";
  };
  const openMyAppointments = () => {
    if (!selectedFilterType || !calendarUserId || calendarUserId === "All") {
      showErrorMessage("Please select a member or resource before opening My appointments.");
      return;
    }
    setShowMyAppointments(true);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "calendar-container"
  }, /*#__PURE__*/React.createElement("main", {
    className: "scheduler-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "calendar-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "scheduler-topbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "calendar-view-actions"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: () => {
      setShowMyAppointments(false);
      setOpenDailyCalendar(true);
      setOpenWeekCalendar(false);
      setOpenMonthCalendar(false);
    },
    className: "calendar-view-btn ".concat(!showMyAppointments && openDailyCalendar ? "active" : "")
  }, "Day"), screens.lg && /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Button, {
    onClick: () => {
      setShowMyAppointments(false);
      setOpenWeekCalendar(true);
      setOpenDailyCalendar(false);
      setOpenMonthCalendar(false);
    },
    className: "calendar-view-btn ".concat(!showMyAppointments && openWeekCalendar ? "active" : "")
  }, "Week")), /*#__PURE__*/React.createElement(Button, {
    onClick: () => {
      setShowMyAppointments(false);
      setOpenMonthCalendar(true);
      setOpenWeekCalendar(false);
      setOpenDailyCalendar(false);
    },
    className: "calendar-view-btn ".concat(!showMyAppointments && openMonthCalendar ? "active" : "")
  }, "Month"), /*#__PURE__*/React.createElement(Button, {
    className: "calendar-view-btn ".concat(showMyAppointments ? "active" : ""),
    onClick: openMyAppointments
  }, "My appointments")), /*#__PURE__*/React.createElement("div", {
    className: "scheduler-date-control"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "calendar-nav-btn",
    onClick: handlePrev,
    "aria-label": "Previous period"
  }, /*#__PURE__*/React.createElement(ChevronLeft, {
    size: 18
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, showMyAppointments ? "".concat(currentDate.toLocaleString("default", {
    month: "long"
  }), " ").concat(currentDate.getFullYear()) : openWeekCalendar ? weekRangeLabel : "".concat(formattedDate, ", ").concat(currentDate.getFullYear())), /*#__PURE__*/React.createElement("span", null, showMyAppointments ? "My appointments" : openDailyCalendar ? "Day" : openMonthCalendar ? "Month" : "Week")), /*#__PURE__*/React.createElement(Button, {
    className: "calendar-nav-btn",
    onClick: handleNext,
    "aria-label": "Next period"
  }, /*#__PURE__*/React.createElement(ChevronRight, {
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    className: "scheduler-apply-control"
  }, /*#__PURE__*/React.createElement(DatePicker, {
    value: pendingFilterDate,
    format: "DD-MM-YYYY",
    onChange: date => {
      if (date) setPendingFilterDate(date);
    },
    allowClear: false
  }), /*#__PURE__*/React.createElement(Button, {
    type: "primary",
    className: "scheduler-apply-btn",
    onClick: handleApplyDateFilter
  }, "Apply"))), /*#__PURE__*/React.createElement(Row, {
    hidden: !CalendarPage,
    className: "filterCalendar scheduler-filter-row",
    gutter: [12, 12]
  }, /*#__PURE__*/React.createElement(Col, {
    xs: 24,
    sm: 12,
    md: 8,
    className: "calendar-filter-options"
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
    className: "calendar-filter-select"
  }, dropDownList)), /*#__PURE__*/React.createElement("div", {
    className: "scheduler-subbar"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "calendar-action-btn",
    onClick: () => setCurrentDate(new Date())
  }, "Today"), isLoading && /*#__PURE__*/React.createElement("span", {
    className: "calendar-loading"
  }, /*#__PURE__*/React.createElement(LoadingOutlined, null), " Loading..."), /*#__PURE__*/React.createElement("div", {
    className: "calendar-legend"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
    className: "legend-dot low"
  }), "Low"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
    className: "legend-dot medium"
  }), "Medium"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
    className: "legend-dot full"
  }), "Full")))), showMyAppointments ? /*#__PURE__*/React.createElement("section", {
    className: "my-appointments-panel calendar-surface"
  }, /*#__PURE__*/React.createElement("div", {
    className: "my-appointments-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "My appointments"), /*#__PURE__*/React.createElement("span", null, currentDate.toLocaleString("default", {
    month: "long"
  }), " ", currentDate.getFullYear()), selectedCalendarName && /*#__PURE__*/React.createElement("em", null, selectedCalendarName)), /*#__PURE__*/React.createElement("strong", null, myAppointments.length, " booked")), /*#__PURE__*/React.createElement("div", {
    className: "my-appointments-list"
  }, myAppointments.length ? myAppointments.map(event => /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "my-appointment-row",
    key: event.id || "".concat(event.memberId, "-").concat(event.resourceId, "-").concat(event.date, "-").concat(event.from),
    onClick: () => handleShowBookedEventDetails(event)
  }, /*#__PURE__*/React.createElement("div", {
    className: "my-appointment-title"
  }, /*#__PURE__*/React.createElement("strong", null, event.title || "Untitled appointment"), /*#__PURE__*/React.createElement("span", null, selectedFilterType === "resource" ? getMemberNameById(event.memberId) || event.memberId : getResourceNameById(event.resourceId) || event.resourceId)), /*#__PURE__*/React.createElement("div", {
    className: "my-appointment-time"
  }, /*#__PURE__*/React.createElement("strong", null, dayjs("".concat(event.month, " ").concat(event.date, " ").concat(event.year), "MMMM D YYYY").format("ddd, MMM D")), /*#__PURE__*/React.createElement("span", null, formatEventTime(event.from), " - ", formatEventTime(event.to))), /*#__PURE__*/React.createElement("span", {
    className: "my-appointment-type"
  }, event.isRecurring ? event.frequency || "Recurring" : "One time"))) : /*#__PURE__*/React.createElement("div", {
    className: "my-appointments-empty"
  }, "No appointments found for the selected ", selectedFilterType || "filter", " in this month."))) : openMonthCalendar ? /*#__PURE__*/React.createElement("div", {
    className: "calendar-grid calendar-surface"
  }, weekdays.map((day, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    className: "grid-header-item"
  }, day)), days.map((item, index) => {
    const calendarDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), item.day);
    const isPastDay = item.type === "current" && dayjs(calendarDate).isBefore(dayjs().startOf('day'), 'day');
    const bookedEvents = item.type === "current" && !isPastDay ? isFilteredCalendarView() ? getBookedEventsForDay(calendarDate) : getBookedEventsForDay(calendarDate) : [];
    return /*#__PURE__*/React.createElement("div", {
      key: index,
      className: "".concat(item.type === "current" ? "grid-item" : "disabled", " ").concat(isPastDay ? "past-calendar-cell" : ""),
      onClick: () => {
        if (item.type !== "current" || isPastDay) return;
        setOpenMonthCalendar(false);
        setOpenDailyCalendar(true);
        setCurrentDate(prev => new Date(prev.setDate(item.day)));
      },
      style: {
        backgroundColor: currentDate.getFullYear() === new Date().getFullYear() && currentDate.getMonth() === new Date().getMonth() && item.day === new Date().getDate() && item.type === "current" ? "#eef6ff" : ""
      }
    }, /*#__PURE__*/React.createElement("span", null, item.day), isPastDay ? /*#__PURE__*/React.createElement("span", {
      className: "past-slot-label month-past-label"
    }, "Past") : renderBookedStatus(bookedEvents, "month-count"));
  })) : openDailyCalendar ? /*#__PURE__*/React.createElement("div", {
    className: "day-view calendar-surface"
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
    const isPastSlot = isPastDateTime(currentDate, i);
    const hourKey = "hour_".concat(i);
    const weekday = dayjs(currentDate).format("dddd");
    const dailySampleEvents = sampleData.flatMap(day => {
      var _day$allEvents$hourKe3, _day$allEvents3;
      const isMatchingDay = day.date === currentDate.getDate().toString() && day.month === monthName && parseInt(day.year) === currentDate.getFullYear();
      if (!isMatchingDay) return [];
      const hourEvents = (_day$allEvents$hourKe3 = (_day$allEvents3 = day.allEvents) === null || _day$allEvents3 === void 0 ? void 0 : _day$allEvents3[hourKey]) !== null && _day$allEvents$hourKe3 !== void 0 ? _day$allEvents$hourKe3 : [];
      return hourEvents;
    });
    const dailyRecurringEvents = getRecurringHourItemsForDate(recurringAllCalendar, currentDate, i);
    const resourceCalendarEvents = resourceCalendar.flatMap(prev => prev.events.filter(item => {
      // For non-daily recurring events, check the month/year/date too
      return prev.month === monthName && parseInt(prev.year) === currentDate.getFullYear() && parseInt(prev.date) === currentDate.getDate() && item.from <= i && i < item.to;
    }));
    const recurringResourceEvents = getRecurringHourItemsForDate(recurringResourceCalendar, currentDate, i);
    const eventsAtTimeSlot = isPastSlot ? [] : calendarUserId && calendarUserId !== "All" ? [...resourceCalendarEvents, ...recurringResourceEvents] : [...dailySampleEvents, ...dailyRecurringEvents];
    const isUnavailableSlot = isFilteredCalendarView() ? eventsAtTimeSlot.length > 0 : isSlotFullyBooked(eventsAtTimeSlot);
    let backgroundColor = "";
    let borderColor = "";
    if (eventsAtTimeSlot.length < parseInt(resourceData.length / 2)) {
      backgroundColor = "#eef8f1";
      borderColor = "#b7e4c7";
    } else if (eventsAtTimeSlot.length >= resourceData.length) {
      backgroundColor = "#fde8e7";
      borderColor = "#ffccc7";
    } else {
      backgroundColor = "#f7ead1";
      borderColor = "#ffe0a3";
    }
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "event-slot ".concat(isPastSlot ? "past-time-slot" : ""),
      style: eventsAtTimeSlot.length > 0 ? {
        backgroundColor,
        borderRight: "1px solid ".concat(borderColor),
        borderLeft: "1px solid ".concat(borderColor),
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
        })) || [...recurringResourceEvents].length > 0) ? "1px solid ".concat(borderColor) : "1px solid transparent"
      } : {},
      onClick: () => {
        if (!isPastSlot) handleDailyCalendarEvent(i, getBookedResourceCount(eventsAtTimeSlot));
      }
    }, isPastSlot ? /*#__PURE__*/React.createElement("span", {
      className: "past-slot-label"
    }, "Past") : isUnavailableSlot ? renderBookedStatus(eventsAtTimeSlot, "slot-count") : /*#__PURE__*/React.createElement("span", {
      className: "available-slot-label"
    }, "Available"), false && !isPastSlot && calendarUserId && calendarUserId !== "All" ? resourceCalendar.map(prev => {
      if (prev.month === monthName && parseInt(prev.year) === currentDate.getFullYear() && parseInt(prev.date) === currentDate.getDate()) {
        return prev.events.map(item => {
          const midpoint = Math.floor((item.from + item.to) / 2);
          return i === midpoint ? item.title : "";
        });
      }
      return "";
    }) : "", false && !isPastSlot && calendarUserId && calendarUserId !== "All" ? recurringResourceEvents.map(item => {
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
        backgroundColor: "#1677ff",
        top: 35
      }
    }));
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "weekly-calendar-shell calendar-surface"
  }, /*#__PURE__*/React.createElement("div", {
    className: "weekly-time-rail"
  }, /*#__PURE__*/React.createElement("div", {
    className: "time-section weekly-time-header"
  }, "Time"), hours.map((hour, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    className: "time-section weekly-time-label"
  }, hour))), /*#__PURE__*/React.createElement("div", {
    className: "grid-container header1 weekly-calendar-surface"
  }, getWeekDays().map((day, index) => /*#__PURE__*/React.createElement("div", {
    key: index
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid-header-item",
    style: {
      backgroundColor: currentDate.getFullYear() === new Date().getFullYear() && currentDate.getMonth() === new Date().getMonth() && day.getDate() === new Date().getDate() ? "#eef6ff" : "",
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
    className: "week-days",
    style: currentDate.getFullYear() === new Date().getFullYear() && currentDate.getMonth() === new Date().getMonth() && day.getDate() === new Date().getDate() ? {
      border: '1px solid #9fc7ff',
      boxShadow: 'inset 0 0 0 1px #d8eaff',
      marginTop: '-1px'
    } : {}
  }, hours.map((hour, index) => {
    const weekday = dayjs(day).format('dddd');
    const currentHourSlot = parseInt(dayjs(hour, "h A").format("HH"), 10);
    const isPastSlot = isPastDateTime(day, currentHourSlot);
    const hourKey = "hour_".concat(parseInt(dayjs(hour, "h A").format("HH"), 10));
    const sampleEvents = sampleData.flatMap(prev => {
      var _prev$allEvents$hourK, _prev$allEvents3;
      const isMatchingDay = parseInt(prev.date) === day.getDate() && prev.month === monthName && parseInt(prev.year) === currentDate.getFullYear();
      if (!isMatchingDay) return [];
      return (_prev$allEvents$hourK = (_prev$allEvents3 = prev.allEvents) === null || _prev$allEvents3 === void 0 ? void 0 : _prev$allEvents3[hourKey]) !== null && _prev$allEvents$hourK !== void 0 ? _prev$allEvents$hourK : [];
    });
    const recurringEvents = getRecurringHourItemsForDate(recurringAllCalendar, day, currentHourSlot);
    const resourceCalendarEvents = resourceCalendar.flatMap(prev => {
      var _prev$events2;
      const isMatchingDay = prev.month === monthName && parseInt(prev.year) === currentDate.getFullYear() && parseInt(prev.date) === day.getDate();
      if (!isMatchingDay) return [];
      return (_prev$events2 = prev.events) === null || _prev$events2 === void 0 ? void 0 : _prev$events2.filter(item => {
        // Non-recurring event
        return item.from <= currentHourSlot && currentHourSlot < item.to;
      });
    });
    const recurringResourceEvents = getRecurringHourItemsForDate(recurringResourceCalendar, day, currentHourSlot);
    const eventsAtTimeSlot = isPastSlot ? [] : calendarUserId !== "All" && calendarUserId !== "Select Member" && calendarUserId !== "Select Resource" ? [...resourceCalendarEvents, ...recurringResourceEvents] : [...sampleEvents, ...recurringEvents];
    const isUnavailableSlot = isFilteredCalendarView() ? eventsAtTimeSlot.length > 0 : isSlotFullyBooked(eventsAtTimeSlot);
    let backgroundColor = "";
    let borderColor = "";
    if (eventsAtTimeSlot.length < resourceData.length / 2) {
      backgroundColor = "#eef8f1";
      borderColor = "#b7e4c7";
    } else if (eventsAtTimeSlot.length >= resourceData.length) {
      backgroundColor = "#fde8e7";
      borderColor = "#ffccc7";
    } else {
      backgroundColor = "#f7ead1";
      borderColor = "#ffe0a3";
    }
    return /*#__PURE__*/React.createElement("div", {
      key: index,
      className: "time-section ".concat(isPastSlot ? "past-time-slot" : ""),
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
        }) || [...recurringResourceEvents].length > 0) ? "1px solid ".concat(borderColor) : "1px solid transparent"
      } : {},
      onClick: () => {
        if (!isPastSlot) handleWeeklyCalendarEvent(hour, day, getBookedResourceCount(eventsAtTimeSlot));
      }
    }, isPastSlot ? /*#__PURE__*/React.createElement("span", {
      className: "past-slot-label weekly-past-label"
    }, "Past") : isUnavailableSlot ? renderBookedStatus(eventsAtTimeSlot, "slot-count weekly-count") : /*#__PURE__*/React.createElement("span", {
      className: "available-slot-label weekly-available-label"
    }, "Available"), false && !isPastSlot && calendarUserId && calendarUserId !== "All" ? resourceCalendar.map(prev => {
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
    }) : "", false && !isPastSlot && calendarUserId && calendarUserId !== "All" ? recurringResourceEvents.map(item => {
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
        backgroundColor: "#1677ff",
        top: 30
      }
    }));
  })))))))), /*#__PURE__*/React.createElement(Modal, {
    open: openEventSlot,
    title: "Book appointment",
    onCancel: handleCloseEventSlot,
    className: "appointment-modal",
    width: 650,
    footer: /*#__PURE__*/React.createElement("div", {
      className: "appointment-modal-footer"
    }, /*#__PURE__*/React.createElement(Button, {
      onClick: handleCloseEventSlot
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      type: "primary",
      onClick: handleCalendarEvent,
      disabled: !!(overlapWarning && !isEditingEvent),
      title: overlapWarning && !isEditingEvent ? overlapWarning : ''
    }, isEditingEvent ? 'Update Appointment' : 'Book Appointment'))
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "appointment-form"
  }, /*#__PURE__*/React.createElement("div", {
    className: "appointment-summary"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Member:"), " ", getMemberNameById(selectedMemberId) || "Select member below"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Resource:"), " ", getResourceNameById(selectedResourceId) || "Select resource below"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Date:"), " ", dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), Number(monthlyRecurring) || currentDate.getDate())).format("ddd, MMM D")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Day:"), " ", weeklyDayRecurring || dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), Number(monthlyRecurring) || currentDate.getDate())).format("dddd"))), /*#__PURE__*/React.createElement("div", {
    className: "appointment-field-grid"
  }, /*#__PURE__*/React.createElement("label", {
    className: "appointment-field"
  }, /*#__PURE__*/React.createElement("span", null, "Member ", /*#__PURE__*/React.createElement("em", null, "*")), /*#__PURE__*/React.createElement(Select, {
    value: selectedMemberId || undefined,
    placeholder: "Select member",
    disabled: isPrefilledMember,
    onChange: value => setSelectedMemberId(value),
    showSearch: true,
    optionFilterProp: "children"
  }, duplicateData.map(member => /*#__PURE__*/React.createElement(Option, {
    key: member.id,
    value: member.id
  }, member.customerName))), newErrors.selectedMemberId && /*#__PURE__*/React.createElement("small", null, newErrors.selectedMemberId)), /*#__PURE__*/React.createElement("label", {
    className: "appointment-field"
  }, /*#__PURE__*/React.createElement("span", null, "Resource ", /*#__PURE__*/React.createElement("em", null, "*")), /*#__PURE__*/React.createElement(Select, {
    value: selectedResourceId || undefined,
    placeholder: "Select resource",
    disabled: isPrefilledResource,
    onChange: value => setSelectedResourceId(value),
    showSearch: true,
    optionFilterProp: "children"
  }, resourceData.map(resource => /*#__PURE__*/React.createElement(Option, {
    key: resource.resourceId,
    value: resource.resourceId
  }, resource.resourceName))), newErrors.selectedResourceId && /*#__PURE__*/React.createElement("small", null, newErrors.selectedResourceId))), /*#__PURE__*/React.createElement("label", {
    className: "appointment-field"
  }, /*#__PURE__*/React.createElement("span", null, "Title ", /*#__PURE__*/React.createElement("em", null, "*")), /*#__PURE__*/React.createElement("input", {
    className: "appointment-input",
    placeholder: "Appointment title",
    onChange: e => setEventTitle(e.target.value),
    value: eventTitle
  }), newErrors.eventTitle && /*#__PURE__*/React.createElement("small", null, newErrors.eventTitle)), /*#__PURE__*/React.createElement("div", {
    className: "appointment-field-grid"
  }, /*#__PURE__*/React.createElement("label", {
    className: "appointment-field"
  }, /*#__PURE__*/React.createElement("span", null, "From ", /*#__PURE__*/React.createElement("em", null, "*")), /*#__PURE__*/React.createElement(TimePicker, {
    format: "h A",
    className: "appointment-time-picker",
    value: Number.isInteger(fromTimeSlot) ? dayjs().hour(fromTimeSlot) : fromTimeSlot,
    onChange: value => setFromTimeSlot(value ? value.hour() : null),
    needConfirm: false
  }), newErrors.fromTimeSlot && /*#__PURE__*/React.createElement("small", null, newErrors.fromTimeSlot)), /*#__PURE__*/React.createElement("label", {
    className: "appointment-field"
  }, /*#__PURE__*/React.createElement("span", null, "To ", /*#__PURE__*/React.createElement("em", null, "*")), /*#__PURE__*/React.createElement(TimePicker, {
    format: "h A",
    className: "appointment-time-picker",
    value: Number.isInteger(toTimeSlot) ? dayjs().hour(toTimeSlot) : toTimeSlot,
    onChange: value => setToTimeSlot(value ? value.hour() : null),
    needConfirm: false
  }), newErrors.toTimeSlot && /*#__PURE__*/React.createElement("small", null, newErrors.toTimeSlot))), /*#__PURE__*/React.createElement("label", {
    className: "appointment-field"
  }, /*#__PURE__*/React.createElement("span", null, "Notes"), /*#__PURE__*/React.createElement("textarea", {
    className: "appointment-textarea",
    placeholder: "Optional notes",
    onChange: e => setEventNotes(e.target.value),
    value: eventNotes
  })), /*#__PURE__*/React.createElement("div", {
    className: "appointment-recurring-row"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: frequencyOfEvent !== "noRecurring",
    onChange: e => setFrequencyOfEvent(e.target.checked ? "weekly" : "noRecurring")
  }, "Recurring appointment"), frequencyOfEvent !== "noRecurring" && /*#__PURE__*/React.createElement(Select, {
    value: frequencyOfEvent,
    onChange: value => setFrequencyOfEvent(value),
    className: "appointment-recurring-select"
  }, /*#__PURE__*/React.createElement(Option, {
    value: "daily"
  }, "Daily"), /*#__PURE__*/React.createElement(Option, {
    value: "weekly"
  }, "Weekly"), /*#__PURE__*/React.createElement(Option, {
    value: "monthly"
  }, "Monthly"))), frequencyOfEvent === "monthly" && /*#__PURE__*/React.createElement("label", {
    className: "appointment-field compact"
  }, /*#__PURE__*/React.createElement("span", null, "Recurring day"), /*#__PURE__*/React.createElement("select", {
    value: monthlyRecurring,
    onChange: e => setMonthlyRecurring(e.target.value),
    className: "appointment-input"
  }, days.filter(day => day.type === "current").map((day, index) => /*#__PURE__*/React.createElement("option", {
    key: "".concat(day.day, "-").concat(index),
    value: day.day
  }, day.day)))), frequencyOfEvent !== "noRecurring" && /*#__PURE__*/React.createElement("div", {
    className: "appointment-field-grid"
  }, /*#__PURE__*/React.createElement("label", {
    className: "appointment-field"
  }, /*#__PURE__*/React.createElement("span", null, "Start date"), /*#__PURE__*/React.createElement(DatePicker, {
    value: recurringStartDate,
    onChange: date => setRecurringStartDate(date),
    format: "YYYY-MM-DD",
    disabledDate: current => current && current.isBefore(dayjs().startOf('day'), 'day')
  }), newErrors.recurringStartDate && /*#__PURE__*/React.createElement("small", null, newErrors.recurringStartDate)), /*#__PURE__*/React.createElement("label", {
    className: "appointment-field"
  }, /*#__PURE__*/React.createElement("span", null, "End date"), /*#__PURE__*/React.createElement(DatePicker, {
    value: recurringEndDate,
    onChange: date => setRecurringEndDate(date),
    format: "YYYY-MM-DD",
    disabledDate: current => {
      if (!current) return false;
      if (current.isBefore(dayjs().startOf('day'), 'day')) return true;
      if (!recurringStartDate) return false;
      return current.isBefore(recurringStartDate, 'day');
    }
  }), newErrors.recurringEndDate && /*#__PURE__*/React.createElement("small", null, newErrors.recurringEndDate))), overlapWarning && !isEditingEvent && /*#__PURE__*/React.createElement("div", {
    className: "appointment-warning"
  }, overlapWarning)))), /*#__PURE__*/React.createElement(Modal, {
    title: "Appointment details",
    open: openBookedEventModal,
    onCancel: () => {
      closeAllModalsAndResetSelection();
    },
    className: "appointment-details-modal",
    footer: [/*#__PURE__*/React.createElement(Button, {
      key: "delete",
      danger: true,
      onClick: async () => {
        if (!selectedBookedEvent) return;
        setEventLoading(true);
        setOpenBookedEventModal(false);
        setOpenEventStatusModal(true);
        try {
          await deleteEvent(effectiveEntityId, selectedBookedEvent.id);
          setEventStatus("Event deleted successfully!");
          setSelectedBookedEvent(null);
          setTimeout(() => refreshCalendarUI(calendarUserId, currentDate), 800);
        } catch (err) {
          setEventStatus("Error deleting event. Please try again.");
        } finally {
          setEventLoading(false);
        }
      }
    }, "Cancel Appointment"), /*#__PURE__*/React.createElement(Button, {
      key: "back",
      onClick: () => {
        closeAllModalsAndResetSelection();
      }
    }, "Close"), /*#__PURE__*/React.createElement(Button, {
      key: "edit",
      onClick: editBookedEvent
    }, "Edit Appointment"), /*#__PURE__*/React.createElement(Button, {
      key: "calendar",
      type: "primary",
      onClick: () => {
        if (selectedBookedEvent !== null && selectedBookedEvent !== void 0 && selectedBookedEvent.date) {
          setCurrentDate(new Date(Number(selectedBookedEvent.year), dayjs().month(selectedBookedEvent.month).month(), Number(selectedBookedEvent.date)));
          setOpenDailyCalendar(true);
          setOpenWeekCalendar(false);
          setOpenMonthCalendar(false);
          setShowMyAppointments(false);
        }
        closeAllModalsAndResetSelection();
      }
    }, "View on Calendar")],
    width: 650
  }, selectedBookedEvent && /*#__PURE__*/React.createElement("div", {
    className: "appointment-details-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "appointment-details-hero"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Appointment"), /*#__PURE__*/React.createElement("h3", null, selectedBookedEvent.title || "Untitled appointment")), /*#__PURE__*/React.createElement("b", null, "Booked")), /*#__PURE__*/React.createElement("div", {
    className: "appointment-detail-row"
  }, /*#__PURE__*/React.createElement("span", null, "Reference"), /*#__PURE__*/React.createElement("strong", null, selectedBookedEvent.id || "-")), /*#__PURE__*/React.createElement("div", {
    className: "appointment-detail-row"
  }, /*#__PURE__*/React.createElement("span", null, "Member ID"), /*#__PURE__*/React.createElement("strong", null, selectedBookedEvent.memberId || "-")), /*#__PURE__*/React.createElement("div", {
    className: "appointment-detail-row"
  }, /*#__PURE__*/React.createElement("span", null, "Resource"), /*#__PURE__*/React.createElement("strong", null, getResourceNameById(selectedBookedEvent.resourceId) || selectedBookedEvent.resourceId || "-")), /*#__PURE__*/React.createElement("div", {
    className: "appointment-detail-row"
  }, /*#__PURE__*/React.createElement("span", null, "Date"), /*#__PURE__*/React.createElement("strong", null, dayjs("".concat(selectedBookedEvent.month, " ").concat(selectedBookedEvent.date, " ").concat(selectedBookedEvent.year), "MMMM D YYYY").format("ddd, MMM D"))), /*#__PURE__*/React.createElement("div", {
    className: "appointment-detail-row"
  }, /*#__PURE__*/React.createElement("span", null, "Time"), /*#__PURE__*/React.createElement("strong", null, formatEventTime(selectedBookedEvent.from), " - ", formatEventTime(selectedBookedEvent.to))), /*#__PURE__*/React.createElement("div", {
    className: "appointment-detail-row"
  }, /*#__PURE__*/React.createElement("span", null, "Duration"), /*#__PURE__*/React.createElement("strong", null, Math.max(Number(selectedBookedEvent.to) - Number(selectedBookedEvent.from), 0), " hour", Math.max(Number(selectedBookedEvent.to) - Number(selectedBookedEvent.from), 0) === 1 ? "" : "s")), /*#__PURE__*/React.createElement("div", {
    className: "appointment-detail-row"
  }, /*#__PURE__*/React.createElement("span", null, "Recurring"), /*#__PURE__*/React.createElement("strong", null, selectedBookedEvent.isRecurring ? selectedBookedEvent.frequency || "Yes" : "No")), selectedBookedEvent.isRecurring && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "appointment-detail-row"
  }, /*#__PURE__*/React.createElement("span", null, "Start Date"), /*#__PURE__*/React.createElement("strong", null, formatAppointmentDate(selectedBookedEvent.startDate))), /*#__PURE__*/React.createElement("div", {
    className: "appointment-detail-row"
  }, /*#__PURE__*/React.createElement("span", null, "End Date"), /*#__PURE__*/React.createElement("strong", null, formatAppointmentDate(selectedBookedEvent.endDate)))), /*#__PURE__*/React.createElement("div", {
    className: "appointment-detail-notes"
  }, /*#__PURE__*/React.createElement("span", null, "Notes"), /*#__PURE__*/React.createElement("p", null, selectedBookedEvent.notes || "No notes")), availableResourcesForSlot.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "appointment-detail-resources"
  }, /*#__PURE__*/React.createElement("strong", null, "Other available resources for this slot:"), /*#__PURE__*/React.createElement("div", null, availableResourcesForSlot.map(res => /*#__PURE__*/React.createElement("span", {
    key: res.id || res.resourceId
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
      backgroundColor: '#f7ead1',
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