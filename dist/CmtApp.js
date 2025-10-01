function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { useState, useEffect } from 'react';
import { Button, Col, Divider, Grid, Input, Modal, Row, Switch, Table } from 'antd';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { LoadingOutlined } from '@ant-design/icons';
import { Amplify } from 'aws-amplify';

// Local component imports
import Header from './Header';
import Footer from './Footer';
import NameCard from './NameCard';
import ResourcePage from './ResourcePage';
import TodosPage from './TodosPage';
import AddNewNameCard from './AddNewNameCard';
import CalendarPage from './CalendarPage';
import './CmtApp.css';

// Amplify API imports
import { get, post } from "aws-amplify/api";
import dayjs from 'dayjs';
const {
  useBreakpoint
} = Grid;

// Registering necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);
const CmtApp = _ref => {
  let {
    cartItems,
    setCartItems,
    setSelectedApp,
    entityId
  } = _ref;
  const [isAddNewNameCardModalOpen, setIsAddNewNameCardModalOpen] = useState(false);
  const [dataView, setDataView] = useState("grid");
  // const [ isInitialLoad, setIsInitialLoad ] = useRef(true);
  const [newRecordName, setNewRecordName] = useState('');
  const [newRecordPhone, setNewRecordPhone] = useState('');
  const [newRecordAddress, setNewRecordAddress] = useState('');
  const [newRecordLastName, setNewRecordLastName] = useState('');
  const [newRecordStatus, setNewRecordStatus] = useState("ACTIVE");
  const [newRecordCountry, setNewRecordCountry] = useState("");
  const [newRecordState, setNewRecordState] = useState("");
  const [newRecordPincode, setNewRecordPincode] = useState("");
  const [newRecordCity, setNewRecordCity] = useState("");
  const [statusSelection, setStatusSelection] = useState("All");
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
  const screens = useBreakpoint();
  const [data, setData] = useState([]);
  const [sampleData, setSampleData] = useState([]);
  useEffect(() => {
    if (membersPage) {
      console.log("Amplify config11:", Amplify.getConfig());
      console.log("initial loading, fetching data from the Database22");
      const fetchingData = async () => {
        try {
          // Fetch members using Amplify get
          const op = get({
            apiName: "UsersAPI",
            path: "/users",
            options: {
              headers: {
                entityid: entityId
              }
            },
            authMode: "userPool"
          });
          const {
            body
          } = await op.response;
          const fetchedData = await body.json();
          console.log("fetching Data from database is complete");
          console.log("Fetched Data:", fetchedData);
          setData(fetchedData);
        } catch (error) {
          console.log("fail in fetching Data");
          console.error("Error while fetching Data", error);
        }
        try {
          // Fetch resources using Amplify get
          const op = get({
            apiName: "ResourcesAPI",
            path: "/resources",
            options: {
              headers: {
                entityid: entityId
              }
            },
            authMode: "userPool"
          });
          const {
            body
          } = await op.response;
          const fetchedData = await body.json();
          console.log("fetching Resource Data from database is complete");
          console.log("Fetched Resource Data:", fetchedData);
          setResourceData1(fetchedData);
        } catch (error) {
          console.log("fail in fetching resource Data");
          console.error("Error while fetching resource Data", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchingData();
    } else if (openCalendarPage) {
      const fetchCalendar = async () => {
        try {
          // Fetch calendar using Amplify get
          const op = get({
            apiName: "CalendarAPI",
            path: "/calendar/user/All/month/".concat(dayjs().format("MMM"), "/year/").concat(dayjs().year()),
            options: {
              headers: {
                entityid: entityId
              }
            },
            authMode: "userPool"
          });
          const {
            body
          } = await op.response;
          const fetchedCalendarData = await body.json();
          console.log("fetching Calendar Data from database is complete");
          console.log("Fetched Calendar Data:", fetchedCalendarData);
          setSampleData(fetchedCalendarData);
        } catch (error) {
          console.log("fail in fetching Calendar Data");
          console.error("Error while fetching Calendar Data", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchCalendar();
    }
  }, [membersPage, openCalendarPage]);
  useEffect(() => {
    setResourceData(resourceData1);
  }, [resourceData1]);
  const [duplicateData, setDuplicateData] = useState(data);
  const [commentBox, setCommentBox] = useState([]);
  useEffect(() => {
    setDuplicateData(data);
  }, [data]);
  const statusCount = data.reduce((acc, item) => {
    acc[item.address[0].city] = (acc[item.address[0].city] || 0) + 1;
    return acc;
  }, {});
  if (!("Hyd" in statusCount)) {
    statusCount["Hyd"] = 0;
  }
  ;
  if (!("HYD" in statusCount)) {
    statusCount["HYD"] = 0;
  }
  ;
  if (!("Test City" in statusCount)) {
    statusCount["Test City"] = 0;
  }
  ;
  const legendLabels = {
    "Hyd": "Hyd",
    "HYD": "HYD",
    "Test City": "Test City"
  };
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
            // Customizing the legend labels based on the chart's data
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
  const handleAddNewNameCard = () => {
    const newRecord = {
      customerName: newRecordName + newRecordLastName,
      phoneNumber: newRecordPhone,
      address: [{
        "country": newRecordCountry,
        "city": newRecordCity,
        "houseNo": "NA",
        "street1": newRecordAddress || "NA",
        "street2": "NA",
        "pincode": newRecordPincode || "NA",
        "state": newRecordState
      }],
      comments: [{
        "author": newRecordName,
        "commentId": "test id 101",
        "message": "test comment 101"
      }],
      status: newRecordStatus,
      subscriptions: []
    };
    const addNewMember = async () => {
      try {
        // Add new member using Amplify post
        const op = post({
          apiName: "UsersAPI",
          path: "/users",
          options: {
            headers: {
              entityid: entityId
            },
            body: newRecord
          },
          authMode: "userPool"
        });
        const {
          body
        } = await op.response;
        const postData = await body.json();
        console.log("postData:", postData);
        const updatedRecord = _objectSpread(_objectSpread({}, newRecord), {}, {
          id: postData.userId
        });
        setDuplicateData(prevData => [...prevData, updatedRecord]);
      } catch (error) {
        console.log("unable to add new member", error);
      }
    };
    addNewMember();
    setIsAddNewNameCardModalOpen(false);
  };
  const handleStatusSelection = value => {
    setStatusSelection(value);
    setShowDashboard(true);
    if (value === "All") {
      setDuplicateData(data);
      // setResourceData(resourceData1);
      setShowDashboard(false);
    } else {
      const filteredRecords = data.filter(prev => prev.address.some(prev1 => prev1.city === value));
      setDuplicateData(filteredRecords);
    }
    ;
  };
  const handleSearchText = value => {
    setSearchText(value);
    if (membersPage) {
      const filterData = data.filter(prev => prev.customerName.toLowerCase().includes(value.toLowerCase()) || prev.phoneNumber.includes(value));
      setDuplicateData(filterData);
    } else {
      const filteredResourceData = resourceData1.filter(prev => prev.resourceName.toLowerCase().includes(value.toLowerCase()) || prev.phoneNumber.includes(value));
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
  }, "Select City"), /*#__PURE__*/React.createElement("option", {
    value: "Hyd"
  }, "Hyd"), /*#__PURE__*/React.createElement("option", {
    value: "HYD"
  }, "HYD"), /*#__PURE__*/React.createElement("option", {
    value: "Test City"
  }, "Test City"));
  const colSize = duplicateData.length <= 3 ? 24 / duplicateData.length : 6;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
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
      backgroundColor: '',
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
  }, /*#__PURE__*/React.createElement("span", null, view + " View "), /*#__PURE__*/React.createElement(Switch
  // style={{ margin: '0px 10px' }}
  , {
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
    checked: showDashboard
    // style={{ margin: '0px 10px' }}
    ,
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
  }, "Status:"), " ", dropDownList)), isLoading ? /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement(LoadingOutlined, null), " Loading...") : membersPage ? /*#__PURE__*/React.createElement("div", null, dataView === "table" ? /*#__PURE__*/React.createElement("div", {
    className: "table-wrapper"
  }, /*#__PURE__*/React.createElement(Row, {
    className: "table-row table-header",
    style: {
      width: screens.xl || screens.lg ? '60vw' : ""
    }
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
  }, "Phone Number")), duplicateData.map((item, index) => /*#__PURE__*/React.createElement(Row, {
    key: index,
    className: "table-row",
    style: {
      width: screens.xl || screens.lg ? '60vw' : ""
    }
  }, /*#__PURE__*/React.createElement(Col, {
    span: 3,
    className: "table-cell"
  }, item.id), /*#__PURE__*/React.createElement(Col, {
    span: 5,
    className: "table-cell"
  }, item.customerName), /*#__PURE__*/React.createElement(Col, {
    span: 10,
    className: "table-cell"
  }, "".concat(item.address[0].houseNo, ", ").concat(item.address[0].street1, ", ").concat(item.address[0].street2, ", ").concat(item.address[0].city, ", ").concat(item.address[0].state, ", ").concat(item.address[0].country)), /*#__PURE__*/React.createElement(Col, {
    span: 6,
    className: "table-cell"
  }, item.phoneNumber))), /*#__PURE__*/React.createElement(Row, {
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
    className: "home-grid"
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
    phoneNumber: item.phoneNumber,
    address: item.address,
    status: item.status,
    comments: item.comments,
    subscriptions: item.subscriptions,
    setDuplicateData: setDuplicateData,
    commentBox: commentBox,
    setCommentBox: setCommentBox
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
  }, /*#__PURE__*/React.createElement(Col, {
    className: "status-icons"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      backgroundColor: 'pink'
    }
  }, " ", statusCount["HYD"], " "), /*#__PURE__*/React.createElement("h3", null, "HYD")), /*#__PURE__*/React.createElement(Col, {
    className: "status-icons"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      backgroundColor: 'lightBlue'
    }
  }, " ", statusCount["Hyd"], " "), /*#__PURE__*/React.createElement("h3", null, "Hyd")), /*#__PURE__*/React.createElement(Col, {
    className: "status-icons"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      backgroundColor: 'lightgreen'
    }
  }, " ", statusCount["Test City"], " "), /*#__PURE__*/React.createElement("h3", null, "Test City"))), /*#__PURE__*/React.createElement(Col, {
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
    onCancel: () => setIsAddNewNameCardModalOpen(false),
    footer: null
  }, /*#__PURE__*/React.createElement(AddNewNameCard, {
    setNewRecordName: setNewRecordName,
    setNewRecordLastName: setNewRecordLastName,
    setNewRecordPhone: setNewRecordPhone,
    setNewRecordAddress: setNewRecordAddress,
    setNewRecordCity: setNewRecordCity,
    setNewRecordState: setNewRecordState,
    setNewRecordPincode: setNewRecordPincode,
    setNewRecordCountry: setNewRecordCountry,
    setNewRecordStatus: setNewRecordStatus,
    newRecordStatus: newRecordStatus,
    handleAddNewNameCard: handleAddNewNameCard,
    membersPage: true
  }))) : resourcePage ? /*#__PURE__*/React.createElement(ResourcePage, {
    resourceData: resourceData,
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
  }), /*#__PURE__*/React.createElement(Divider, {
    type: "horizontal"
  }), /*#__PURE__*/React.createElement(Footer, null)));
};
export default CmtApp;