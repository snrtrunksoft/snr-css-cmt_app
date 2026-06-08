function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { useState, useEffect } from 'react';
import { Button, Col, Divider, Grid, Input, Modal, Row, Switch, Table, Tooltip, Form } from 'antd';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend, ArcElement } from 'chart.js';
import { LoadingOutlined, TeamOutlined, EnvironmentOutlined, ApartmentOutlined, PhoneOutlined, MailOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import awsExports from './aws-exports-dev.local';

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
import { getMembers, getResources, createMember, getAvailableGroups } from "./api/APIUtil";
const {
  useBreakpoint
} = Grid;
const createUserName = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "".concat(Date.now(), "-").concat(Math.random().toString(16).slice(2));
};

// Registering necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend, ArcElement);
const CmtApp = _ref => {
  let {
    headerTitle,
    logoPath,
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
  const [sampleData] = useState([]);
  // Cache flags to avoid repeat backend calls when re-entering tabs
  const [hasLoadedMembers, setHasLoadedMembers] = useState(false);
  const [uniqueGroups, setUniqueGroups] = useState([]);

  // Reset caches when tenant changes
  useEffect(() => {
    if (!entityId) return;
    setHasLoadedMembers(false);
  }, [entityId]);

  // Data fetches for member/resource tabs. Calendar data is owned by CalendarPage.
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
            groupId: [prev.groupId] || ["undefined"]
          }));
          setData(groupingData);
        } catch (error) {
          console.error("Error while fetching members", error);
        }
        try {
          const fetchedResources = await getResources(entityId);
          const groupingData = fetchedResources.map(prev => {
            var _prev$groupId;
            return _objectSpread(_objectSpread({}, prev), {}, {
              groupId: [(_prev$groupId = prev.groupId) !== null && _prev$groupId !== void 0 ? _prev$groupId : "undefined"]
            });
          });
          setResourceData1(groupingData);
        } catch (error) {
          console.error("Error while fetching resources", error);
        } finally {
          setHasLoadedMembers(true);
          setIsLoading(false);
        }
        try {
          const res = await getAvailableGroups(entityId);
          const groups = Array.isArray(res) ? res.map(group => group.groupName || group.name || group) : [];
          setUniqueGroups(groups);
        } catch (error) {
          console.log("Error fetching available groups:", error);
        }
      };
      fetchingData();
    } else {
      setIsLoading(false);
    }
  }, [membersPage, entityId, hasLoadedMembers]);

  // Mirror fetched resources into the view list
  useEffect(() => {
    setResourceData(resourceData1);
  }, [resourceData1]);
  const [duplicateData, setDuplicateData] = useState(data);
  const [commentBox, setCommentBox] = useState([]);
  useEffect(() => {
    setDuplicateData(data);
  }, [data]);

  // Build city and group counts safely from the member data already loaded.
  const cityCount = data.reduce((acc, item) => {
    var _item$address;
    const city = (_item$address = item.address) === null || _item$address === void 0 || (_item$address = _item$address[0]) === null || _item$address === void 0 ? void 0 : _item$address.city;
    if (city) {
      acc[city] = (acc[city] || 0) + 1;
    }
    return acc;
  }, {});
  const filteredCityCount = duplicateData.reduce((acc, item) => {
    var _item$address2;
    const city = ((_item$address2 = item.address) === null || _item$address2 === void 0 || (_item$address2 = _item$address2[0]) === null || _item$address2 === void 0 ? void 0 : _item$address2.city) || "Unknown";
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});
  const flattenGroups = groupId => {
    if (!Array.isArray(groupId)) return [];
    return groupId.flat().filter(Boolean);
  };
  const groupCount = data.reduce((acc, item) => {
    const groups = flattenGroups(item.groupId);
    if (groups.length === 0) {
      acc.Ungrouped = (acc.Ungrouped || 0) + 1;
      return acc;
    }
    groups.forEach(group => {
      acc[group] = (acc[group] || 0) + 1;
    });
    return acc;
  }, {});
  const activeMembers = data.filter(item => String(item.status || "").toLowerCase() === "active").length;
  const withPhone = data.filter(item => Boolean(item.phoneNumber)).length;
  const withEmail = data.filter(item => Boolean(item.email)).length;
  const totalComments = data.reduce((total, item) => total + (Array.isArray(item.comments) ? item.comments.length : 0), 0);
  const totalSubscriptions = data.reduce((total, item) => {
    var _item$subscriptions;
    if (Array.isArray(item.punchCards)) return total + item.punchCards.length;
    if (Array.isArray(item.subscriptions)) return total + item.subscriptions.length;
    if (Array.isArray((_item$subscriptions = item.subscriptions) === null || _item$subscriptions === void 0 ? void 0 : _item$subscriptions.punchCards)) return total + item.subscriptions.punchCards.length;
    return total;
  }, 0);
  const topCities = Object.entries(cityCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topGroups = Object.entries(groupCount).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const resourceCityCount = resourceData1.reduce((acc, item) => {
    var _item$address3;
    const city = ((_item$address3 = item.address) === null || _item$address3 === void 0 || (_item$address3 = _item$address3[0]) === null || _item$address3 === void 0 ? void 0 : _item$address3.city) || "Unknown";
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});
  const filteredResourceCityCount = resourceData.reduce((acc, item) => {
    var _item$address4;
    const city = ((_item$address4 = item.address) === null || _item$address4 === void 0 || (_item$address4 = _item$address4[0]) === null || _item$address4 === void 0 ? void 0 : _item$address4.city) || "Unknown";
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});
  const resourceStatusCount = resourceData1.reduce((acc, item) => {
    const status = item.status || "Unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  const resourceGroupCount = resourceData1.reduce((acc, item) => {
    const groups = flattenGroups(item.groupId);
    if (groups.length === 0) {
      acc.Ungrouped = (acc.Ungrouped || 0) + 1;
      return acc;
    }
    groups.forEach(group => {
      acc[group] = (acc[group] || 0) + 1;
    });
    return acc;
  }, {});
  const availableResources = resourceData1.filter(item => String(item.status || "").toLowerCase() === "active").length;
  const resourcesWithPhone = resourceData1.filter(item => Boolean(item.phoneNumber)).length;
  const resourcesWithEmail = resourceData1.filter(item => Boolean(item.email)).length;
  const resourceComments = resourceData1.reduce((total, item) => total + (Array.isArray(item.comments) ? item.comments.length : 0), 0);
  const topResourceCities = Object.entries(resourceCityCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topResourceGroups = Object.entries(resourceGroupCount).sort((a, b) => b[1] - a[1]).slice(0, 6);

  // Unique city list for dropdown
  const uniqueCities = Array.from(new Set(data.flatMap(item => (item.address || []).map(addr => {
    var _addr$city;
    return addr === null || addr === void 0 || (_addr$city = addr.city) === null || _addr$city === void 0 ? void 0 : _addr$city.trim();
  }).filter(Boolean))));
  const dashboardColors = ['#1677ff', '#16a34a', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6', '#64748b'];
  const cityGraphData = {
    labels: Object.keys(filteredCityCount),
    datasets: [{
      label: 'Members',
      data: Object.values(filteredCityCount),
      backgroundColor: Object.keys(filteredCityCount).map((_, index) => dashboardColors[index % dashboardColors.length]),
      borderColor: '#ffffff',
      borderWidth: 2
    }]
  };
  const groupGraphData = {
    labels: topGroups.map(_ref2 => {
      let [group] = _ref2;
      return group;
    }),
    datasets: [{
      label: 'Members',
      data: topGroups.map(_ref3 => {
        let [, count] = _ref3;
        return count;
      }),
      backgroundColor: '#1677ff',
      borderRadius: 8,
      maxBarThickness: 42
    }]
  };
  const resourceCityGraphData = {
    labels: Object.keys(filteredResourceCityCount),
    datasets: [{
      label: 'Resources',
      data: Object.values(filteredResourceCityCount),
      backgroundColor: Object.keys(filteredResourceCityCount).map((_, index) => dashboardColors[index % dashboardColors.length]),
      borderColor: '#ffffff',
      borderWidth: 2
    }]
  };
  const resourceStatusGraphData = {
    labels: Object.keys(resourceStatusCount),
    datasets: [{
      label: 'Resources',
      data: Object.values(resourceStatusCount),
      backgroundColor: Object.keys(resourceStatusCount).map((_, index) => dashboardColors[index % dashboardColors.length]),
      borderRadius: 8,
      maxBarThickness: 42
    }]
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false
      },
      legend: {
        position: 'bottom',
        labels: {
          boxHeight: 10,
          boxWidth: 10,
          usePointStyle: true
        }
      }
    }
  };
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false
      },
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#64748b'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#eef2f7'
        },
        ticks: {
          precision: 0,
          color: '#64748b'
        }
      }
    }
  };
  const handleAddNewNameCard = values => {
    var _awsExports$Auth;
    const {
      firstName,
      lastName,
      phone,
      email,
      houseNo,
      street1,
      street2,
      city,
      state,
      country,
      pincode,
      status = "ACTIVE",
      groupId
    } = values;
    const trimmedFirstName = (firstName === null || firstName === void 0 ? void 0 : firstName.trim()) || "";
    const trimmedLastName = (lastName === null || lastName === void 0 ? void 0 : lastName.trim()) || "";
    const newRecord = {
      subscriptions: {
        totalNumberOfPaidServices: "0",
        totalNumberOfUsedServices: "0",
        history: []
      },
      punchCards: [],
      comments: [],
      groupId: groupId ? [groupId] : [],
      userName: values.userName || createUserName(),
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      phoneNumber: phone,
      email: email,
      orderIds: [],
      rewardPoints: 0,
      userPoolId: (awsExports === null || awsExports === void 0 || (_awsExports$Auth = awsExports.Auth) === null || _awsExports$Auth === void 0 || (_awsExports$Auth = _awsExports$Auth.Cognito) === null || _awsExports$Auth === void 0 ? void 0 : _awsExports$Auth.userPoolId) || "",
      status: status,
      address: [{
        country: country || "",
        city: city || "",
        houseNo: houseNo || "",
        street1: street1 || "",
        street2: street2 || "",
        pincode: pincode || "",
        state: state || ""
      }]
    };
    const addNewMember = async () => {
      try {
        const postData = await createMember(entityId, newRecord);
        console.log("new customer data:", newRecord);
        console.log("post New Member Data:", postData);
        const updatedRecord = _objectSpread(_objectSpread({}, newRecord), {}, {
          id: postData.userId,
          customerName: "".concat(trimmedFirstName).concat(trimmedLastName)
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
          message: "New user \"".concat(updatedRecord.customerName, "\" has been added successfully!"),
          entityType: "user"
        });
        return {
          success: true,
          record: updatedRecord
        };
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
        // Re-throw so callers can catch
        throw error;
      }
    };
    // Return the promise so callers (e.g., AddNewUser) can await completion
    return addNewMember();
  };

  // Helper function to apply all active filters together
  const applyAllFilters = function (dataToFilter) {
    let filters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const {
      status = statusSelection,
      group = groupSelection,
      search = searchText,
      isResource = false
    } = filters;
    return dataToFilter.filter(item => {
      // Status filter
      const statusMatch = status === "All" ? true : Array.isArray(item.address) && item.address.some(addr => addr.city === status);

      // Group filter - handle both simple array and nested array cases
      let groupMatch = group === "All" ? true : false;
      if (group !== "All" && item.groupId) {
        if (Array.isArray(item.groupId)) {
          // Check if it's a nested array (e.g., [["group1", "group2"]])
          if (item.groupId.length > 0 && Array.isArray(item.groupId[0])) {
            // Flatten and check
            groupMatch = item.groupId[0].includes(group);
          } else {
            // Simple array (e.g., ["group1", "group2"])
            groupMatch = item.groupId.includes(group);
          }
        }
      }

      // Search filter
      const q = search.toLowerCase();
      const searchMatch = search === "" ? true : (isResource ? (item.resourceName || '').toLowerCase().includes(q) : (item.customerName || '').toLowerCase().includes(q)) || (item.phoneNumber || '').includes(search);
      return statusMatch && groupMatch && searchMatch;
    });
  };
  const handleStatusSelection = value => {
    setStatusSelection(value);
    setShowDashboard(value !== "All");
    const filtered = applyAllFilters(data, {
      status: value,
      group: groupSelection,
      search: searchText,
      isResource: false
    });
    setDuplicateData(filtered);
  };
  const handleGroupSelection = value => {
    setGroupSelection(value);
    const filtered = applyAllFilters(data, {
      status: statusSelection,
      group: value,
      search: searchText,
      isResource: false
    });
    setDuplicateData(filtered);
  };
  const handleSearchText = value => {
    setSearchText(value);
    if (membersPage) {
      const filtered = applyAllFilters(data, {
        status: statusSelection,
        group: groupSelection,
        search: value,
        isResource: false
      });
      setDuplicateData(filtered);
    } else {
      const filtered = applyAllFilters(resourceData1, {
        status: statusSelection,
        group: groupSelection,
        search: value,
        isResource: true
      });
      setResourceData(filtered);
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
  }, "Select Group"), uniqueGroups.map((groupName, index) => /*#__PURE__*/React.createElement("option", {
    key: index,
    value: groupName
  }, groupName)));
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
    headerTitle: headerTitle,
    logoPath: logoPath,
    commentBox: commentBox,
    membersPage: membersPage,
    openCalendarPage: openCalendarPage,
    todosPage: todosPage,
    resourcePage: resourcePage,
    setOpenCalendarPage: setOpenCalendarPage,
    setMembersPage: setMembersPage,
    setResourcePage: setResourcePage,
    setTodosPage: setTodosPage,
    setSelectedApp: setSelectedApp,
    searchText: searchText,
    handleSearchText: handleSearchText
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
    var _item$address5, _item$address6, _item$address7, _item$address8, _item$address9, _item$address0;
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
    }, [(_item$address5 = item.address) === null || _item$address5 === void 0 || (_item$address5 = _item$address5[0]) === null || _item$address5 === void 0 ? void 0 : _item$address5.houseNo, (_item$address6 = item.address) === null || _item$address6 === void 0 || (_item$address6 = _item$address6[0]) === null || _item$address6 === void 0 ? void 0 : _item$address6.street1, (_item$address7 = item.address) === null || _item$address7 === void 0 || (_item$address7 = _item$address7[0]) === null || _item$address7 === void 0 ? void 0 : _item$address7.street2, (_item$address8 = item.address) === null || _item$address8 === void 0 || (_item$address8 = _item$address8[0]) === null || _item$address8 === void 0 ? void 0 : _item$address8.city, (_item$address9 = item.address) === null || _item$address9 === void 0 || (_item$address9 = _item$address9[0]) === null || _item$address9 === void 0 ? void 0 : _item$address9.state, (_item$address0 = item.address) === null || _item$address0 === void 0 || (_item$address0 = _item$address0[0]) === null || _item$address0 === void 0 ? void 0 : _item$address0.country].filter(Boolean).join(', ')), /*#__PURE__*/React.createElement(Col, {
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
    resourceData: resourceData,
    setResourceData: setResourceData,
    setResourceData1: setResourceData1,
    customerId: item.id,
    customerName: item.customerName,
    email: item.email,
    phoneNumber: item.phoneNumber,
    address: item.address,
    status: item.status,
    groupId: item.groupId,
    comments: item.comments,
    subscriptions: item.subscriptions,
    punchCards: item.punchCards,
    setDuplicateData: setDuplicateData,
    commentBox: commentBox,
    setCommentBox: setCommentBox,
    selectedGroup: selectedGroup,
    groupMessages: groupMessages,
    setGroupMessages: setGroupMessages,
    uniqueGroups: uniqueGroups
  }))) : /*#__PURE__*/React.createElement("h2", null, "No NameCards Found..."), /*#__PURE__*/React.createElement(Col, {
    xs: 20,
    md: 12,
    lg: colSize,
    className: "nameCard add-card",
    onClick: () => setIsAddNewNameCardModalOpen(true)
  }, /*#__PURE__*/React.createElement(Button, {
    style: {
      border: 'transparent',
      fontSize: '40px'
    }
  }, "+"))), /*#__PURE__*/React.createElement(Divider, {
    type: "horizontal"
  }), showDashboard && /*#__PURE__*/React.createElement("section", {
    className: "dashboard-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dashboard-heading"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "Member dashboard"), /*#__PURE__*/React.createElement("h2", null, statusSelection === "All" ? "All member activity" : "".concat(statusSelection, " member activity"))), /*#__PURE__*/React.createElement("span", null, duplicateData.length, " showing of ", data.length)), /*#__PURE__*/React.createElement("div", {
    className: "dashboard-metrics"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dashboard-stat primary"
  }, /*#__PURE__*/React.createElement(TeamOutlined, null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Total members"), /*#__PURE__*/React.createElement("strong", null, data.length))), /*#__PURE__*/React.createElement("div", {
    className: "dashboard-stat"
  }, /*#__PURE__*/React.createElement(CheckCircleOutlined, null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Active"), /*#__PURE__*/React.createElement("strong", null, activeMembers))), /*#__PURE__*/React.createElement("div", {
    className: "dashboard-stat"
  }, /*#__PURE__*/React.createElement(EnvironmentOutlined, null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Cities"), /*#__PURE__*/React.createElement("strong", null, uniqueCities.length))), /*#__PURE__*/React.createElement("div", {
    className: "dashboard-stat"
  }, /*#__PURE__*/React.createElement(ApartmentOutlined, null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Groups"), /*#__PURE__*/React.createElement("strong", null, Object.keys(groupCount).length))), /*#__PURE__*/React.createElement("div", {
    className: "dashboard-stat"
  }, /*#__PURE__*/React.createElement(PhoneOutlined, null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Phone coverage"), /*#__PURE__*/React.createElement("strong", null, data.length ? Math.round(withPhone / data.length * 100) : 0, "%"))), /*#__PURE__*/React.createElement("div", {
    className: "dashboard-stat"
  }, /*#__PURE__*/React.createElement(MailOutlined, null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Email coverage"), /*#__PURE__*/React.createElement("strong", null, data.length ? Math.round(withEmail / data.length * 100) : 0, "%")))), /*#__PURE__*/React.createElement(Row, {
    gutter: [16, 16],
    className: "dashboard-content"
  }, /*#__PURE__*/React.createElement(Col, {
    xs: 24,
    lg: 10
  }, /*#__PURE__*/React.createElement("div", {
    className: "dashboard-card chart-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dashboard-card-title"
  }, /*#__PURE__*/React.createElement("h3", null, "City distribution"), /*#__PURE__*/React.createElement("span", null, Object.keys(filteredCityCount).length, " locations")), /*#__PURE__*/React.createElement("div", {
    className: "dashboard-chart"
  }, Object.keys(filteredCityCount).length ? /*#__PURE__*/React.createElement(Pie, {
    data: cityGraphData,
    options: chartOptions
  }) : /*#__PURE__*/React.createElement("div", {
    className: "dashboard-empty"
  }, "No city data available")))), /*#__PURE__*/React.createElement(Col, {
    xs: 24,
    lg: 14
  }, /*#__PURE__*/React.createElement("div", {
    className: "dashboard-card chart-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dashboard-card-title"
  }, /*#__PURE__*/React.createElement("h3", null, "Top groups"), /*#__PURE__*/React.createElement("span", null, topGroups.length, " tracked")), /*#__PURE__*/React.createElement("div", {
    className: "dashboard-chart"
  }, topGroups.length ? /*#__PURE__*/React.createElement(Bar, {
    data: groupGraphData,
    options: barOptions
  }) : /*#__PURE__*/React.createElement("div", {
    className: "dashboard-empty"
  }, "No group data available")))), /*#__PURE__*/React.createElement(Col, {
    xs: 24,
    lg: 12
  }, /*#__PURE__*/React.createElement("div", {
    className: "dashboard-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dashboard-card-title"
  }, /*#__PURE__*/React.createElement("h3", null, "Top cities"), /*#__PURE__*/React.createElement("span", null, "Members by location")), /*#__PURE__*/React.createElement("div", {
    className: "rank-list"
  }, topCities.length ? topCities.map((_ref4, index) => {
    let [city, count] = _ref4;
    return /*#__PURE__*/React.createElement("div", {
      className: "rank-item",
      key: city
    }, /*#__PURE__*/React.createElement("span", null, index + 1), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, city), /*#__PURE__*/React.createElement("em", null, count, " member", count === 1 ? "" : "s")), /*#__PURE__*/React.createElement("b", {
      style: {
        width: "".concat(data.length ? count / data.length * 100 : 0, "%")
      }
    }));
  }) : /*#__PURE__*/React.createElement("div", {
    className: "dashboard-empty compact"
  }, "No city data available")))), /*#__PURE__*/React.createElement(Col, {
    xs: 24,
    lg: 12
  }, /*#__PURE__*/React.createElement("div", {
    className: "dashboard-card insight-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dashboard-card-title"
  }, /*#__PURE__*/React.createElement("h3", null, "Engagement snapshot"), /*#__PURE__*/React.createElement("span", null, "From member records")), /*#__PURE__*/React.createElement("div", {
    className: "insight-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Comments"), /*#__PURE__*/React.createElement("strong", null, totalComments)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Subscriptions"), /*#__PURE__*/React.createElement("strong", null, totalSubscriptions)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Filtered members"), /*#__PURE__*/React.createElement("strong", null, duplicateData.length)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Without email"), /*#__PURE__*/React.createElement("strong", null, Math.max(data.length - withEmail, 0)))))))), /*#__PURE__*/React.createElement(Modal, {
    open: isAddNewNameCardModalOpen,
    onCancel: () => {
      setIsAddNewNameCardModalOpen(false);
      form.resetFields();
    },
    footer: null,
    width: 920,
    className: "add-user-modal",
    destroyOnHidden: true
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
  })) : resourcePage ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ResourcePage, {
    resourceData: resourceData,
    setResourceData1: setResourceData1,
    setResourceData: setResourceData,
    dataView: dataView,
    entityId: entityId,
    commentBox: commentBox,
    setCommentBox: setCommentBox,
    groupMessages: groupMessages,
    setGroupMessages: setGroupMessages,
    selectedGroup: selectedGroup,
    uniqueGroups: uniqueGroups
  }), showDashboard && /*#__PURE__*/React.createElement("section", {
    className: "dashboard-panel resource-dashboard-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dashboard-heading"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "Resource dashboard"), /*#__PURE__*/React.createElement("h2", null, "Resource availability and coverage")), /*#__PURE__*/React.createElement("span", null, resourceData.length, " showing of ", resourceData1.length)), /*#__PURE__*/React.createElement("div", {
    className: "dashboard-metrics"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dashboard-stat primary"
  }, /*#__PURE__*/React.createElement(ApartmentOutlined, null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Total resources"), /*#__PURE__*/React.createElement("strong", null, resourceData1.length))), /*#__PURE__*/React.createElement("div", {
    className: "dashboard-stat"
  }, /*#__PURE__*/React.createElement(CheckCircleOutlined, null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Active"), /*#__PURE__*/React.createElement("strong", null, availableResources))), /*#__PURE__*/React.createElement("div", {
    className: "dashboard-stat"
  }, /*#__PURE__*/React.createElement(EnvironmentOutlined, null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Locations"), /*#__PURE__*/React.createElement("strong", null, Object.keys(resourceCityCount).length))), /*#__PURE__*/React.createElement("div", {
    className: "dashboard-stat"
  }, /*#__PURE__*/React.createElement(TeamOutlined, null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Groups"), /*#__PURE__*/React.createElement("strong", null, Object.keys(resourceGroupCount).length))), /*#__PURE__*/React.createElement("div", {
    className: "dashboard-stat"
  }, /*#__PURE__*/React.createElement(PhoneOutlined, null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Phone coverage"), /*#__PURE__*/React.createElement("strong", null, resourceData1.length ? Math.round(resourcesWithPhone / resourceData1.length * 100) : 0, "%"))), /*#__PURE__*/React.createElement("div", {
    className: "dashboard-stat"
  }, /*#__PURE__*/React.createElement(MailOutlined, null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Email coverage"), /*#__PURE__*/React.createElement("strong", null, resourceData1.length ? Math.round(resourcesWithEmail / resourceData1.length * 100) : 0, "%")))), /*#__PURE__*/React.createElement(Row, {
    gutter: [16, 16],
    className: "dashboard-content"
  }, /*#__PURE__*/React.createElement(Col, {
    xs: 24,
    lg: 10
  }, /*#__PURE__*/React.createElement("div", {
    className: "dashboard-card chart-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dashboard-card-title"
  }, /*#__PURE__*/React.createElement("h3", null, "Location distribution"), /*#__PURE__*/React.createElement("span", null, Object.keys(filteredResourceCityCount).length, " locations")), /*#__PURE__*/React.createElement("div", {
    className: "dashboard-chart"
  }, Object.keys(filteredResourceCityCount).length ? /*#__PURE__*/React.createElement(Pie, {
    data: resourceCityGraphData,
    options: chartOptions
  }) : /*#__PURE__*/React.createElement("div", {
    className: "dashboard-empty"
  }, "No location data available")))), /*#__PURE__*/React.createElement(Col, {
    xs: 24,
    lg: 14
  }, /*#__PURE__*/React.createElement("div", {
    className: "dashboard-card chart-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dashboard-card-title"
  }, /*#__PURE__*/React.createElement("h3", null, "Status overview"), /*#__PURE__*/React.createElement("span", null, Object.keys(resourceStatusCount).length, " statuses")), /*#__PURE__*/React.createElement("div", {
    className: "dashboard-chart"
  }, Object.keys(resourceStatusCount).length ? /*#__PURE__*/React.createElement(Bar, {
    data: resourceStatusGraphData,
    options: barOptions
  }) : /*#__PURE__*/React.createElement("div", {
    className: "dashboard-empty"
  }, "No status data available")))), /*#__PURE__*/React.createElement(Col, {
    xs: 24,
    lg: 12
  }, /*#__PURE__*/React.createElement("div", {
    className: "dashboard-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dashboard-card-title"
  }, /*#__PURE__*/React.createElement("h3", null, "Top resource cities"), /*#__PURE__*/React.createElement("span", null, "Resources by location")), /*#__PURE__*/React.createElement("div", {
    className: "rank-list"
  }, topResourceCities.length ? topResourceCities.map((_ref5, index) => {
    let [city, count] = _ref5;
    return /*#__PURE__*/React.createElement("div", {
      className: "rank-item",
      key: city
    }, /*#__PURE__*/React.createElement("span", null, index + 1), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, city), /*#__PURE__*/React.createElement("em", null, count, " resource", count === 1 ? "" : "s")), /*#__PURE__*/React.createElement("b", {
      style: {
        width: "".concat(resourceData1.length ? count / resourceData1.length * 100 : 0, "%")
      }
    }));
  }) : /*#__PURE__*/React.createElement("div", {
    className: "dashboard-empty compact"
  }, "No location data available")))), /*#__PURE__*/React.createElement(Col, {
    xs: 24,
    lg: 12
  }, /*#__PURE__*/React.createElement("div", {
    className: "dashboard-card insight-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dashboard-card-title"
  }, /*#__PURE__*/React.createElement("h3", null, "Resource snapshot"), /*#__PURE__*/React.createElement("span", null, "From resource records")), /*#__PURE__*/React.createElement("div", {
    className: "insight-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Comments"), /*#__PURE__*/React.createElement("strong", null, resourceComments)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Tracked groups"), /*#__PURE__*/React.createElement("strong", null, topResourceGroups.length)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Filtered resources"), /*#__PURE__*/React.createElement("strong", null, resourceData.length)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Without email"), /*#__PURE__*/React.createElement("strong", null, Math.max(resourceData1.length - resourcesWithEmail, 0))))))))) : openCalendarPage ? /*#__PURE__*/React.createElement(CalendarPage, {
    entityId: entityId,
    duplicateData: duplicateData,
    resourceData: resourceData
  }) : /*#__PURE__*/React.createElement(TodosPage, {
    sampleData: sampleData
  })));
};
export default CmtApp;