function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { useState, useEffect } from 'react';
import { Button, Col, Divider, Grid, Input, Modal, Row, Switch, Table, Form } from 'antd';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { LoadingOutlined } from '@ant-design/icons';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';

// Local component imports
import Header from './Header';
import Footer from './Footer';
import NameCard from './NameCard';
import ResourcePage from './ResourcePage';
import TodosPage from './TodosPage';
import AddNewUser from './AddNewUser';
import StatusModal from './StatusModal';
import CalendarPage from './CalendarPage';
import './CmtApp.css';

// APIUtil imports
import { getMembers, getResources, getCalendar, createMember } from "./api/APIUtil";
import dayjs from 'dayjs';
const {
  useBreakpoint
} = Grid;

// Registering necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);
const CmtApp = _ref => {
  let {
    setSelectedApp,
    selectedGroup,
    groupMessages,
    setGroupMessages
  } = _ref;
  const [entityId, setEntityId] = useState(null);

  // Resolve entityId (localStorage -> token claims)
  useEffect(() => {
    const resolveEntityId = async () => {
      let id = null;
      try {
        id = localStorage.getItem('entityId') || null;
      } catch (_) {}
      if (!id) {
        try {
          var _session$tokens, _session$tokens2, _session$tokens3, _session$tokens4, _session$tokens5, _session$tokens6, _session$tokens7, _session$tokens8;
          const session = await fetchAuthSession();
          id =
          // Prefer explicit tenantId if present
          (session === null || session === void 0 || (_session$tokens = session.tokens) === null || _session$tokens === void 0 || (_session$tokens = _session$tokens.idToken) === null || _session$tokens === void 0 || (_session$tokens = _session$tokens.payload) === null || _session$tokens === void 0 ? void 0 : _session$tokens['tenantId']) || (session === null || session === void 0 || (_session$tokens2 = session.tokens) === null || _session$tokens2 === void 0 || (_session$tokens2 = _session$tokens2.accessToken) === null || _session$tokens2 === void 0 || (_session$tokens2 = _session$tokens2.payload) === null || _session$tokens2 === void 0 ? void 0 : _session$tokens2['tenantId']) || (// Then try custom attributes (both casings)
          session === null || session === void 0 || (_session$tokens3 = session.tokens) === null || _session$tokens3 === void 0 || (_session$tokens3 = _session$tokens3.idToken) === null || _session$tokens3 === void 0 || (_session$tokens3 = _session$tokens3.payload) === null || _session$tokens3 === void 0 ? void 0 : _session$tokens3['custom:entityid']) || (session === null || session === void 0 || (_session$tokens4 = session.tokens) === null || _session$tokens4 === void 0 || (_session$tokens4 = _session$tokens4.accessToken) === null || _session$tokens4 === void 0 || (_session$tokens4 = _session$tokens4.payload) === null || _session$tokens4 === void 0 ? void 0 : _session$tokens4['custom:entityid']) || (session === null || session === void 0 || (_session$tokens5 = session.tokens) === null || _session$tokens5 === void 0 || (_session$tokens5 = _session$tokens5.idToken) === null || _session$tokens5 === void 0 || (_session$tokens5 = _session$tokens5.payload) === null || _session$tokens5 === void 0 ? void 0 : _session$tokens5['custom:entityId']) || (session === null || session === void 0 || (_session$tokens6 = session.tokens) === null || _session$tokens6 === void 0 || (_session$tokens6 = _session$tokens6.accessToken) === null || _session$tokens6 === void 0 || (_session$tokens6 = _session$tokens6.payload) === null || _session$tokens6 === void 0 ? void 0 : _session$tokens6['custom:entityId']) || (// Then a generic entityId if your IdP populates it
          session === null || session === void 0 || (_session$tokens7 = session.tokens) === null || _session$tokens7 === void 0 || (_session$tokens7 = _session$tokens7.idToken) === null || _session$tokens7 === void 0 || (_session$tokens7 = _session$tokens7.payload) === null || _session$tokens7 === void 0 ? void 0 : _session$tokens7['entityId']) || (session === null || session === void 0 || (_session$tokens8 = session.tokens) === null || _session$tokens8 === void 0 || (_session$tokens8 = _session$tokens8.accessToken) === null || _session$tokens8 === void 0 || (_session$tokens8 = _session$tokens8.payload) === null || _session$tokens8 === void 0 ? void 0 : _session$tokens8['entityId']) || (// Last resort: userSub
          session === null || session === void 0 ? void 0 : session.userSub) || null;
        } catch (e) {
          // Standalone mode without auth is allowed
        }
      }
      if (id) {
        setEntityId(id);
        try {
          localStorage.setItem('entityId', id);
        } catch (_) {}
      }
    };
    resolveEntityId();
  }, []);
  const [isAddNewNameCardModalOpen, setIsAddNewNameCardModalOpen] = useState(false);
  const [statusModal, setStatusModal] = useState({
    visible: false,
    type: "",
    title: "",
    message: "",
    entityType: ""
  });
  const [dataView, setDataView] = useState("grid");
  const [statusSelection, setStatusSelection] = useState("All");
  const [groupSelection, setGroupSelection] = useState("All");
  const [showDashboard, setShowDashboard] = useState(false);
  const [openCalendarPage, setOpenCalendarPage] = useState(false);
  const [resourcePage, setResourcePage] = useState(false);
  const [membersPage, setMembersPage] = useState(true);
  const [todosPage, setTodosPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [view, setView] = useState("Grid");
  const [resourceData, setResourceData] = useState([]);
  const [resourceData1, setResourceData1] = useState([]);
  const [form] = Form.useForm(); // for new user/Resource details

  const screens = useBreakpoint();
  const [data, setData] = useState([]);
  const [sampleData, setSampleData] = useState([]);
  // Cache flags to avoid repeat backend calls when re-entering tabs
  const [hasLoadedMembers, setHasLoadedMembers] = useState(false);
  const [hasLoadedCalendar, setHasLoadedCalendar] = useState(false);

  // Reset caches when tenant changes
  useEffect(() => {
    if (!entityId) return;
    setHasLoadedMembers(false);
    setHasLoadedCalendar(false);
  }, [entityId]);

  // Data fetches (members/resources or calendar) with cache flags.
  useEffect(() => {
    if (!entityId) return;
    // Members tab
    if (membersPage) {
      if (hasLoadedMembers) {
        // Already loaded once for this entity; do not refetch
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const fetchingData = async () => {
        try {
          const fetchedData = await getMembers(entityId);
          const groupingData = fetchedData.map(prev => _objectSpread(_objectSpread({}, prev), {}, {
            groupId: prev.groupId || "group_1"
          }));
          setData(groupingData);
        } catch (error) {
          console.error("Error while fetching members", error);
        }
        try {
          const fetchedResources = await getResources(entityId);
          const groupingData = fetchedResources.map(prev => _objectSpread(_objectSpread({}, prev), {}, {
            groupId: prev.groupId || "group_1"
          }));
          setResourceData1(groupingData);
        } catch (error) {
          console.error("Error while fetching resources", error);
        } finally {
          setHasLoadedMembers(true);
          setIsLoading(false);
        }
      };
      fetchingData();
    }
    // Calendar tab
    else if (openCalendarPage) {
      if (hasLoadedCalendar) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const fetchCalendar = async () => {
        try {
          const fetchedCalendarData = await getCalendar(entityId, dayjs().format("MMM"), dayjs().year());
          setSampleData(fetchedCalendarData);
        } catch (error) {
          console.error("Error while fetching Calendar Data", error);
        } finally {
          setHasLoadedCalendar(true);
          setIsLoading(false);
        }
      };
      fetchCalendar();
    }
    // Other tabs (Resources/Todos) do not fetch here
    else {
      setIsLoading(false);
    }
  }, [membersPage, openCalendarPage, entityId, hasLoadedMembers, hasLoadedCalendar]);

  // Mirror fetched resources into the view list
  useEffect(() => {
    setResourceData(resourceData1);
  }, [resourceData1]);
  const [duplicateData, setDuplicateData] = useState(data);
  const [commentBox, setCommentBox] = useState([]);
  useEffect(() => {
    setDuplicateData(data);
  }, [data]);

  // Build status/city counts safely
  const statusCount = data.reduce((acc, item) => {
    var _item$address;
    const city = (_item$address = item.address) === null || _item$address === void 0 || (_item$address = _item$address[0]) === null || _item$address === void 0 ? void 0 : _item$address.city;
    if (city) {
      acc[city] = (acc[city] || 0) + 1;
    }
    return acc;
  }, {});

  // Unique city list for dropdown
  const uniqueCities = Array.from(new Set(data.flatMap(item => (item.address || []).map(addr => {
    var _addr$city;
    return addr === null || addr === void 0 || (_addr$city = addr.city) === null || _addr$city === void 0 ? void 0 : _addr$city.trim();
  }).filter(Boolean))));

  // Unique groupId list for dropdown
  const uniqueGroups = Array.from(new Set(data.map(item => {
    var _item$groupId;
    return item === null || item === void 0 || (_item$groupId = item.groupId) === null || _item$groupId === void 0 ? void 0 : _item$groupId.trim();
  }).filter(Boolean)));

  // Legend labels mirror labels by default; customize here if needed
  const legendLabels = uniqueCities.reduce((acc, city) => {
    acc[city] = city;
    return acc;
  }, {});
  const graphData = {
    labels: Object.keys(statusCount),
    datasets: [{
      label: 'Status Count',
      data: Object.values(statusCount),
      backgroundColor: ['brown', '#00B0FF', '#4CAF50', 'pink'],
      borderColor: ['brown', '#00B0FF', '#4CAF50', 'pink']
    }]
  };
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Status Distribution'
      },
      legend: {
        position: 'top',
        labels: {
          generateLabels: chart => {
            return chart.data.labels.map((label, index) => ({
              text: legendLabels[label] || label,
              fillStyle: chart.data.datasets[0].backgroundColor[index],
              strokeStyle: chart.data.datasets[0].borderColor[index],
              lineWidth: 1
            }));
          }
        },
        onClick: null
      }
    }
  };
  const handleAddNewNameCard = values => {
    const {
      firstName,
      lastName,
      phone,
      email,
      address,
      city,
      state,
      country,
      pincode,
      status = "ACTIVE",
      groupId = "undefined"
    } = values;
    const newRecord = {
      customerName: (firstName || "") + (lastName || ""),
      phoneNumber: phone,
      email: email,
      address: [{
        country: country || "",
        city: city || "",
        houseNo: "NA",
        street1: address || "NA",
        street2: "NA",
        pincode: pincode || "NA",
        state: state || ""
      }],
      comments: [],
      status: status,
      groupId: groupId,
      subscriptions: []
    };
    const addNewMember = async () => {
      try {
        const postData = await createMember(entityId, newRecord);
        console.log("new customer data:", newRecord);
        console.log("post New Member Data:", postData);
        const updatedRecord = _objectSpread(_objectSpread({}, newRecord), {}, {
          id: postData.userId
        });
        // Update BOTH data and duplicateData to keep them in sync
        setData(prevData => [...prevData, updatedRecord]);
        setDuplicateData(prevData => [...prevData, updatedRecord]);
        setHasLoadedMembers(true); // Keep cache valid; avoid refetch on tab switch

        // Show success modal
        setStatusModal({
          visible: true,
          type: "success",
          title: "User Added Successfully",
          message: "New user \"".concat(newRecord.customerName, "\" has been added successfully!"),
          entityType: "user"
        });
      } catch (error) {
        console.log("unable to add new member", error);
        // Show error modal
        setStatusModal({
          visible: true,
          type: "error",
          title: "User Addition Failed",
          message: "Failed to add new user. Please try again.",
          entityType: "user"
        });
      }
    };
    addNewMember();
  };
  const handleStatusSelection = value => {
    setStatusSelection(value);
    setShowDashboard(true);
    if (value === "All") {
      setDuplicateData(data);
      setShowDashboard(false);
    } else {
      const filteredRecords = data.filter(item => Array.isArray(item.address) && item.address.some(addr => addr.city === value));
      setDuplicateData(filteredRecords);
    }
  };
  const handleGroupSelection = value => {
    setGroupSelection(value);
    if (value === "All") {
      setDuplicateData(data);
    } else {
      const filteredRecords = data.filter(item => item.groupId === value);
      setDuplicateData(filteredRecords);
    }
  };
  const handleSearchText = value => {
    setSearchText(value);
    if (membersPage) {
      const q = value.toLowerCase();
      const filterData = data.filter(prev => (prev.customerName || '').toLowerCase().includes(q) || (prev.phoneNumber || '').includes(value));
      setDuplicateData(filterData);
    } else {
      const q = value.toLowerCase();
      const filteredResourceData = resourceData1.filter(prev => (prev.resourceName || '').toLowerCase().includes(q) || (prev.phoneNumber || '').includes(value));
      setResourceData(filteredResourceData);
    }
  };
  const dropDownList = /*#__PURE__*/React.createElement("select", {
    value: statusSelection,
    hidden: openCalendarPage || todosPage || resourcePage || isLoading,
    style: {
      borderRadius: '5px',
      padding: '5px',
      margin: '0px 10px',
      outline: 'none',
      fontSize: '15px'
    },
    onChange: e => handleStatusSelection(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "All"
  }, "Select City"), uniqueCities.map((city, index) => /*#__PURE__*/React.createElement("option", {
    key: index,
    value: city
  }, city)));
  const groupDropDownList = /*#__PURE__*/React.createElement("select", {
    value: groupSelection,
    hidden: openCalendarPage || todosPage || resourcePage || isLoading,
    style: {
      borderRadius: '5px',
      padding: '5px',
      margin: '0px 10px',
      outline: 'none',
      fontSize: '15px'
    },
    onChange: e => handleGroupSelection(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "All"
  }, "Select Group"), uniqueGroups.map((groupId, index) => /*#__PURE__*/React.createElement("option", {
    key: index,
    value: groupId
  }, groupId)));
  const colSize = duplicateData.length <= 3 ? 24 / duplicateData.length : 6;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: "#f0f0f0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "home_app"
  }, /*#__PURE__*/React.createElement(Header, {
    commentBox: commentBox,
    membersPage: membersPage,
    openCalendarPage: openCalendarPage,
    todosPage: todosPage,
    resourcePage: resourcePage,
    setOpenCalendarPage: setOpenCalendarPage,
    setMembersPage: setMembersPage,
    setResourcePage: setResourcePage,
    setTodosPage: setTodosPage,
    setSelectedApp: setSelectedApp
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    hidden: isLoading || openCalendarPage
  }, /*#__PURE__*/React.createElement(Button, {
    style: membersPage ? {
      backgroundColor: '#1677ff',
      color: 'azure'
    } : {},
    onClick: () => {
      setResourcePage(false);
      setOpenCalendarPage(false);
      setMembersPage(true);
      setTodosPage(false);
    }
  }, /*#__PURE__*/React.createElement("h3", null, "Members")), /*#__PURE__*/React.createElement(Button, {
    style: resourcePage ? {
      backgroundColor: '#1677ff',
      color: 'azure'
    } : {},
    onClick: () => {
      setResourcePage(true);
      setMembersPage(false);
      setOpenCalendarPage(false);
      setTodosPage(false);
    }
  }, /*#__PURE__*/React.createElement("h3", null, "Resources"))), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingRight: '5px'
    },
    hidden: !membersPage && !resourcePage
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Search Name or Ph no.",
    value: searchText,
    onChange: e => handleSearchText(e.target.value)
  }))), /*#__PURE__*/React.createElement(Row, {
    style: {
      width: '100%',
      gap: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '10px'
    }
  }, /*#__PURE__*/React.createElement(Col, {
    hidden: openCalendarPage || todosPage || isLoading,
    style: {
      fontSize: '20px'
    }
  }, /*#__PURE__*/React.createElement("span", null, view + " View "), /*#__PURE__*/React.createElement(Switch, {
    onClick: () => {
      setDataView(dataView === "grid" ? "table" : "grid");
      setView(view === "Grid" ? "List" : "Grid");
    }
  })), /*#__PURE__*/React.createElement(Col, {
    hidden: openCalendarPage || todosPage || isLoading,
    style: {
      fontSize: '20px'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Show Dashboard "), /*#__PURE__*/React.createElement(Switch, {
    checked: showDashboard,
    onClick: () => setShowDashboard(prev => !prev)
  })), /*#__PURE__*/React.createElement(Col, {
    style: {
      fontSize: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'end'
    }
  }, /*#__PURE__*/React.createElement("span", {
    hidden: openCalendarPage || todosPage || resourcePage || isLoading
  }, "City:"), " ", dropDownList), /*#__PURE__*/React.createElement(Col, {
    style: {
      fontSize: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'end'
    }
  }, /*#__PURE__*/React.createElement("span", {
    hidden: openCalendarPage || todosPage || resourcePage || isLoading
  }, "groupId:"), " ", groupDropDownList)), isLoading ? /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement(LoadingOutlined, null), " Loading...") : membersPage ? /*#__PURE__*/React.createElement(React.Fragment, null, dataView === "table" ? /*#__PURE__*/React.createElement("div", {
    className: "table-wrapper"
  }, /*#__PURE__*/React.createElement(Row, {
    className: "table-row table-header"
  }, /*#__PURE__*/React.createElement(Col, {
    span: 3,
    className: "table-cell"
  }, "ID"), /*#__PURE__*/React.createElement(Col, {
    span: 5,
    className: "table-cell"
  }, "Name"), /*#__PURE__*/React.createElement(Col, {
    span: 10,
    className: "table-cell"
  }, "Address"), /*#__PURE__*/React.createElement(Col, {
    span: 6,
    className: "table-cell"
  }, "Phone Number")), duplicateData.map((item, index) => {
    var _item$address2, _item$address3, _item$address4, _item$address5, _item$address6, _item$address7;
    return /*#__PURE__*/React.createElement(Row, {
      key: index,
      className: "table-row"
    }, /*#__PURE__*/React.createElement(Col, {
      span: 3,
      className: "table-cell"
    }, item.id), /*#__PURE__*/React.createElement(Col, {
      span: 5,
      className: "table-cell"
    }, item.customerName), /*#__PURE__*/React.createElement(Col, {
      span: 10,
      className: "table-cell"
    }, [(_item$address2 = item.address) === null || _item$address2 === void 0 || (_item$address2 = _item$address2[0]) === null || _item$address2 === void 0 ? void 0 : _item$address2.houseNo, (_item$address3 = item.address) === null || _item$address3 === void 0 || (_item$address3 = _item$address3[0]) === null || _item$address3 === void 0 ? void 0 : _item$address3.street1, (_item$address4 = item.address) === null || _item$address4 === void 0 || (_item$address4 = _item$address4[0]) === null || _item$address4 === void 0 ? void 0 : _item$address4.street2, (_item$address5 = item.address) === null || _item$address5 === void 0 || (_item$address5 = _item$address5[0]) === null || _item$address5 === void 0 ? void 0 : _item$address5.city, (_item$address6 = item.address) === null || _item$address6 === void 0 || (_item$address6 = _item$address6[0]) === null || _item$address6 === void 0 ? void 0 : _item$address6.state, (_item$address7 = item.address) === null || _item$address7 === void 0 || (_item$address7 = _item$address7[0]) === null || _item$address7 === void 0 ? void 0 : _item$address7.country].filter(Boolean).join(', ')), /*#__PURE__*/React.createElement(Col, {
      span: 6,
      className: "table-cell"
    }, item.phoneNumber));
  }), /*#__PURE__*/React.createElement(Row, {
    className: "table-row add-record-row"
  }, /*#__PURE__*/React.createElement(Col, {
    span: 24,
    style: {
      margin: '10px'
    }
  }, /*#__PURE__*/React.createElement("center", null, /*#__PURE__*/React.createElement(Button, {
    style: {
      fontSize: '18px'
    },
    onClick: () => setIsAddNewNameCardModalOpen(true)
  }, "+ Add New Record"))))) : /*#__PURE__*/React.createElement(Row, {
    gutter: [16, 16],
    className: "home-grid ".concat(screens.xs ? "mobile-grid-alignment" : "web-grid-alignment")
  }, duplicateData.length !== 0 ? duplicateData.map(item => /*#__PURE__*/React.createElement(Col, {
    key: item.id,
    xs: 20,
    md: 12,
    lg: colSize
  }, /*#__PURE__*/React.createElement(NameCard, {
    key: item.id,
    membersPage: true,
    entityId: entityId,
    data: data,
    setData: setData,
    customerId: item.id,
    customerName: item.customerName,
    email: item.email,
    phoneNumber: item.phoneNumber,
    address: item.address,
    status: item.status,
    groupId: item.groupId,
    comments: item.comments,
    subscriptions: item.subscriptions,
    setDuplicateData: setDuplicateData,
    commentBox: commentBox,
    setCommentBox: setCommentBox,
    selectedGroup: selectedGroup,
    groupMessages: groupMessages,
    setGroupMessages: setGroupMessages
  }))) : /*#__PURE__*/React.createElement("h2", null, "No NameCards Found..."), /*#__PURE__*/React.createElement(Col, {
    xs: 20,
    md: 12,
    lg: colSize,
    className: "nameCard",
    onClick: () => setIsAddNewNameCardModalOpen(true),
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    style: {
      border: 'transparent',
      fontSize: '40px'
    }
  }, "+"))), /*#__PURE__*/React.createElement(Divider, {
    type: "horizontal"
  }), showDashboard && /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement(Row, {
    className: "status-track-icons"
  }, Object.entries(statusCount).map((_ref2, index) => {
    let [city, count] = _ref2;
    const colors = ['#FFB6C1', '#ADD8E6', '#90EE90', '#FFD580', '#D8BFD8', '#98FB98'];
    const bgColor = colors[index % colors.length];
    return /*#__PURE__*/React.createElement(Col, {
      key: city,
      className: "status-icons"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        backgroundColor: bgColor
      }
    }, count), /*#__PURE__*/React.createElement("h3", null, city));
  })), /*#__PURE__*/React.createElement(Col, {
    style: {
      paddingTop: '0px'
    }
  }, /*#__PURE__*/React.createElement(Divider, {
    type: "horizontal"
  })), /*#__PURE__*/React.createElement(Row, {
    className: "graph",
    justify: 'center'
  }, /*#__PURE__*/React.createElement(Col, {
    xs: 24,
    sm: 22,
    md: 20,
    lg: 16,
    xl: 12
  }, /*#__PURE__*/React.createElement(Bar, {
    data: graphData,
    options: options
  })))), /*#__PURE__*/React.createElement(Modal, {
    open: isAddNewNameCardModalOpen,
    onCancel: () => {
      setIsAddNewNameCardModalOpen(false);
      form.resetFields();
    },
    footer: null
  }, /*#__PURE__*/React.createElement(AddNewUser, {
    mode: "member",
    form: form,
    onSubmit: handleAddNewNameCard,
    entityId: entityId
  })), /*#__PURE__*/React.createElement(StatusModal, {
    visible: statusModal.visible,
    type: statusModal.type,
    title: statusModal.title,
    message: statusModal.message,
    onClose: () => {
      setStatusModal({
        visible: false,
        type: "",
        title: "",
        message: "",
        entityType: ""
      });
      if (statusModal.type === "success") {
        setIsAddNewNameCardModalOpen(false);
        form.resetFields();
      }
    }
  })) : resourcePage ? /*#__PURE__*/React.createElement(ResourcePage, {
    resourceData: resourceData,
    setResourceData1: setResourceData1,
    setResourceData: setResourceData,
    dataView: dataView,
    entityId: entityId,
    commentBox: commentBox,
    setCommentBox: setCommentBox
  }) : openCalendarPage ? /*#__PURE__*/React.createElement(CalendarPage, {
    sampleData: sampleData,
    setSampleData: setSampleData,
    entityId: entityId,
    duplicateData: duplicateData,
    resourceData: resourceData
  }) : /*#__PURE__*/React.createElement(TodosPage, {
    sampleData: sampleData
  })));
};
export default CmtApp;