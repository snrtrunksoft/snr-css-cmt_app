"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
require("./App.css");
var _NameCard = _interopRequireDefault(require("./NameCard"));
var _Header = _interopRequireDefault(require("./Header"));
var _Footer = _interopRequireDefault(require("./Footer"));
var _ResourcePage = _interopRequireDefault(require("./ResourcePage"));
var _TodosPage = _interopRequireDefault(require("./TodosPage"));
var _AddNewNameCard = _interopRequireDefault(require("./AddNewNameCard"));
var _antd = require("antd");
var _CalendarPage = _interopRequireDefault(require("./CalendarPage"));
var _reactChartjs = require("react-chartjs-2");
var _chart = require("chart.js");
var _icons = require("@ant-design/icons");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// Registering necessary Chart.js components
_chart.Chart.register(_chart.CategoryScale, _chart.LinearScale, _chart.BarElement, _chart.Title, _chart.Tooltip, _chart.Legend, _chart.ArcElement);
function App() {
  const [isAddNewNameCardModalOpen, setIsAddNewNameCardModalOpen] = (0, _react.useState)(false);
  const [dataView, setDataView] = (0, _react.useState)("grid");
  // const [ isInitialLoad, setIsInitialLoad ] = useRef(true);
  const [newRecordName, setNewRecordName] = (0, _react.useState)('');
  const [newRecordPhone, setNewRecordPhone] = (0, _react.useState)('');
  const [newRecordAddress, setNewRecordAddress] = (0, _react.useState)('');
  const [newRecordStatus, setNewRecordStatus] = (0, _react.useState)("New");
  const [statusSelection, setStatusSelection] = (0, _react.useState)("All");
  const [hideDashboard, setHideDashboard] = (0, _react.useState)(false);
  const [openCalendarPage, setOpenCalendarPage] = (0, _react.useState)(false);
  const [resourcePage, setResourcePage] = (0, _react.useState)(false);
  const [membersPage, setMembersPage] = (0, _react.useState)(true);
  const [todosPage, setTodosPage] = (0, _react.useState)(false);
  const [isLoading, setIsLoading] = (0, _react.useState)(true);
  const [searchText, setSearchText] = (0, _react.useState)("");
  const [resourceData, setResourceData] = (0, _react.useState)([
    //     {
    //     "resourceId": "8",
    //     "resourceName": "SNR",
    //     "phoneNumber": "8876543210",
    //     "address": [
    //         {
    //             "street1": "test street5",
    //             "street2": "test street6",
    //             "city": "Test City",
    //             "state": "TX",
    //             "country": "USA"
    //         }
    //     ],
    //     "comments": [
    //         {
    //             "commentId": "2034",
    //             "message": "test Comment5",
    //             "author": "SNR"
    //         },
    //         {
    //             "commentId": "2346",
    //             "message": "test comment 2",
    //             "author": "SNR"
    //         }
    //     ],
    //     "status": "Active"
    // },
  ]);
  const [data, setData] = (0, _react.useState)([
    // {
    //     "id": "8",
    //     "customerName": "SNR",
    //     "phoneNumber": "8876543210",
    //     "address": [
    //         {
    //             "street1": "test street5",
    //             "street2": "test street6",
    //             "city": "Test City",
    //             "state": "TX",
    //             "country": "USA"
    //         }
    //     ],
    //     "comments": [
    //         {
    //             "commentId": "2034",
    //             "message": "test Comment5",
    //             "author": "SNR"
    //         },
    //         {
    //             "commentId": "2346",
    //             "message": "test comment 2",
    //             "author": "SNR"
    //         }
    //     ],
    //     "status": "Active",
    //     "subscriptions": [
    //     {
    //         "id": "001",
    //         "status": "Complete",
    //         "noOfServicesLeft": "0",
    //         "noOfServicesCompleted": "10",
    //         "totalNumberOfServices": "10",
    //         "purchasedDate": "Mar-02-2023",
    //         "compltedData": "Feb-20-2024"
    //     },
    //     {
    //         "id": "002",
    //         "status": "Complete",
    //         "noOfServicesLeft": "0",
    //         "noOfServicesCompleted": "10",
    //         "totalNumberOfServices": "10",
    //         "purchasedDate": "Mar-30-2024",
    //         "compltedData": "Jan-20-2025"

    //     },
    //     {
    //         "id": "003",
    //         "status": "Complete",
    //         "noOfServicesLeft": "9",
    //         "noOfServicesCompleted": "1",
    //         "totalNumberOfServices": "10",
    //         "purchasedDate": "Jan-30-2025"
    //     }
    // ],
    // },
  ]);
  const [sampleData, setSampleData] = (0, _react.useState)([{
    "month": "April",
    "year": "2025",
    "userId": "ABC123",
    "date": "25",
    "events": [{
      "memberId": "ABC123",
      "resourceId": "R_2",
      "date": "25",
      "year": "2025",
      "month": "March",
      "from": "02",
      "to": "03",
      "recurring": "weekly",
      "day": "Fri",
      "title": "Test title2",
      "notes": "Appointment for dentist"
    }]
  }]);
  (0, _react.useEffect)(() => {
    console.log("initial loading, fetching data from the Database");
    // if(isInitialLoad.current){
    const fetchingData = async () => {
      try {
        const Data = await fetch("https://kh9zku31eb.execute-api.us-east-1.amazonaws.com/dev/users");
        const fetchedData = await Data.json();
        console.log("fetching Data from database is complete");
        console.log("Fetched Data:", fetchedData);
        setData(fetchedData);
      } catch (error) {
        console.log("fail in fetching Data");
        console.error("Error while fetching Data", error);
      }
      try {
        const calendarData = await fetch("https://pliol7eyw7.execute-api.us-east-1.amazonaws.com/dev/calendar/user/lakshmi/month/March/year/2024");
        const fetchedCalendarData = await calendarData.json();
        console.log("fetching Calendar Data from database is complete");
        console.log("Fetched Calendar Data:", fetchedCalendarData);
        setSampleData(fetchedCalendarData);
      } catch (error) {
        console.log("fail in fetching Calendar Data");
        console.error("Error while fetching Calendar Data", error);
      }
      try {
        const Data = await fetch("https://bws4su8xog.execute-api.us-east-1.amazonaws.com/dev/resources");
        const fetchedData = await Data.json();
        console.log("fetching Resource Data from database is complete");
        console.log("Fetched Resource Data:", fetchedData);
        setResourceData(fetchedData);
      } catch (error) {
        console.log("fail in fetching resource Data");
        console.error("Error while fetching resource Data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchingData();
    // isInitialLoad.current = false;
    // }
  }, []);
  const [duplicateData, setDuplicateData] = (0, _react.useState)(data);
  const [commentBox, setCommentBox] = (0, _react.useState)([]);
  console.log("comment Box:", commentBox);
  console.log("data:", duplicateData);
  (0, _react.useEffect)(() => {
    setDuplicateData(data);
  }, [data]);
  const statusCount = data.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});
  console.log(statusCount);
  if (!("New" in statusCount)) {
    statusCount["New"] = 0;
  }
  ;
  if (!("In-progress" in statusCount)) {
    statusCount["In_Progress"] = 0;
  }
  ;
  if (!("Complete" in statusCount)) {
    statusCount["Complete"] = 0;
  }
  ;
  if (!("Cancelled" in statusCount)) {
    statusCount["Cancelled"] = 0;
  }
  ;
  console.log("StatusCount:", statusCount);
  const legendLabels = {
    "New": "New Status",
    "In_Progress": "In Progress Status",
    "Complete": "Completed Status"
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
  const columns = [{
    title: 'Name',
    dataIndex: 'customerName',
    key: 'customerName',
    render: text => /*#__PURE__*/_react.default.createElement("a", null, text)
  }, {
    title: 'Phone',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber'
  }, {
    title: 'Address',
    dataIndex: "address",
    key: 'address',
    render: address => {
      return /*#__PURE__*/_react.default.createElement("div", {
        style: {
          maxHeight: '60px',
          // Limit the height
          overflow: 'hidden',
          // Hide overflow content
          textOverflow: 'ellipsis',
          // Optional: show ellipsis if text overflows
          display: 'inline-block',
          // Ensure it behaves like a block element
          whiteSpace: 'nowrap'
        }
      }, Object.keys(address[0]).map((key, index) => /*#__PURE__*/_react.default.createElement("div", {
        key: index
      }, address[0][key])));
    }
  }, {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    sorter: (a, b) => a.status.localeCompare(b.status),
    // Sorting by status alphabetically
    sortDirections: ['ascend', 'descend']
  }];
  const handleAddNewNameCard = () => {
    const newRecord = {
      id: parseInt(data.length) + 10,
      customerName: newRecordName,
      phoneNumber: newRecordPhone,
      address: newRecordAddress || [{}],
      comments: [{}],
      status: newRecordStatus,
      subscriptions: [{}],
      status: "Active"
    };
    const addNewMember = async () => {
      try {
        const response = await fetch("https://kh9zku31eb.execute-api.us-east-1.amazonaws.com/dev/users", {
          method: "POST",
          headers: {
            'Content-Type': "application/json"
          },
          body: JSON.stringify(newRecord)
        });
        const postData = await response.json();
        console.log("postData:", postData);
        const updatedRecord = _objectSpread(_objectSpread({}, newRecord), {}, {
          id: postData.userId
        }).then(responce => responce.json()).then(data => console.log("Member is added:", data));
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
    setHideDashboard(true);
    if (value === "All") {
      setDuplicateData(data);
      setHideDashboard(false);
    } else {
      const filteredRecords = data.filter(prev => prev.status === value);
      setDuplicateData(filteredRecords);
    }
    ;
  };
  const handleSearchText = value => {
    setSearchText(value);
    const filterData = data.filter(prev => prev.customerName.toLowerCase().includes(value.toLowerCase()) || prev.phoneNumber.includes(value));
    setDuplicateData(filterData);
  };
  const dropDownList = /*#__PURE__*/_react.default.createElement("select", {
    value: statusSelection,
    style: {
      borderRadius: '5px',
      padding: '5px',
      margin: '0px 10px',
      outline: 'none'
    },
    onChange: e => handleStatusSelection(e.target.value)
  }, /*#__PURE__*/_react.default.createElement("option", {
    value: "All"
  }, "All"), /*#__PURE__*/_react.default.createElement("option", {
    value: "New"
  }, "New"), /*#__PURE__*/_react.default.createElement("option", {
    value: "In_Progress"
  }, "In-progress"), /*#__PURE__*/_react.default.createElement("option", {
    value: "Complete"
  }, "Complete"), /*#__PURE__*/_react.default.createElement("option", {
    value: "Cancelled"
  }, "Cancelled"));
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "home-app"
  }, /*#__PURE__*/_react.default.createElement(_Header.default, {
    dropDownList: dropDownList,
    dataView: dataView,
    setDataView: setDataView,
    setHideDashboard: setHideDashboard,
    hideDashboard: hideDashboard,
    commentBox: commentBox,
    membersPage: membersPage,
    openCalendarPage: openCalendarPage,
    todosPage: todosPage,
    resourcePage: resourcePage,
    setOpenCalendarPage: setOpenCalendarPage,
    setMembersPage: setMembersPage,
    setResourcePage: setResourcePage,
    setTodosPage: setTodosPage
  }), /*#__PURE__*/_react.default.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%'
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    hidden: isLoading
  }, /*#__PURE__*/_react.default.createElement(_antd.Button, {
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
  }, /*#__PURE__*/_react.default.createElement("h3", null, "Members")), /*#__PURE__*/_react.default.createElement(_antd.Button, {
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
  }, /*#__PURE__*/_react.default.createElement("h3", null, "Resources"))), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      paddingRight: '5px'
    },
    hidden: !membersPage
  }, /*#__PURE__*/_react.default.createElement(_antd.Input, {
    placeholder: "Search Name or Ph no.",
    value: searchText,
    onChange: e => handleSearchText(e.target.value)
  }))), isLoading ? /*#__PURE__*/_react.default.createElement("h3", null, /*#__PURE__*/_react.default.createElement(_icons.LoadingOutlined, null), " Loading...") : membersPage ? /*#__PURE__*/_react.default.createElement("div", null, dataView === "table" ? /*#__PURE__*/_react.default.createElement("div", {
    className: "table"
  }, /*#__PURE__*/_react.default.createElement(_antd.Table, {
    columns: columns,
    dataSource: duplicateData,
    pagination: {
      pageSize: 5,
      simple: true
    },
    footer: () => /*#__PURE__*/_react.default.createElement("tr", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '10px'
      }
    }, /*#__PURE__*/_react.default.createElement("td", {
      colSpan: columns.length
    }, /*#__PURE__*/_react.default.createElement(_antd.Button, {
      onClick: () => setIsAddNewNameCardModalOpen(true),
      style: {
        border: 'transparent',
        fontSize: '40px',
        backgroundColor: 'transparent'
      }
    }, "+")))
  })) : /*#__PURE__*/_react.default.createElement(_antd.Row, {
    gutter: [16, 16],
    className: "home-grid"
  }, duplicateData.map(item => /*#__PURE__*/_react.default.createElement(_antd.Col, {
    key: item.id,
    xs: duplicateData.length <= 1 ? 24 : 12,
    sm: duplicateData.length <= 1 ? 24 : 12,
    md: duplicateData.length <= 2 ? 20 : 8,
    lg: duplicateData.length <= 2 ? 20 : 6,
    xl: duplicateData.length <= 2 ? 20 : 6
  }, /*#__PURE__*/_react.default.createElement(_NameCard.default, {
    key: item.id,
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
  }))), /*#__PURE__*/_react.default.createElement(_antd.Col, {
    xs: duplicateData.length <= 1 ? 24 : 12,
    sm: duplicateData.length <= 1 ? 24 : 12,
    md: duplicateData.length <= 2 ? 20 : 8,
    lg: duplicateData.length <= 2 ? 20 : 6,
    xl: duplicateData.length <= 2 ? 20 : 6,
    className: dataView === "grid" ? 'nameCard' : 'table',
    onClick: () => setIsAddNewNameCardModalOpen(true),
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    }
  }, /*#__PURE__*/_react.default.createElement(_antd.Button, {
    style: {
      border: 'transparent',
      fontSize: '40px'
    }
  }, "+"))), /*#__PURE__*/_react.default.createElement(_antd.Divider, {
    type: "horizontal"
  }), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      width: "100%"
    },
    hidden: hideDashboard
  }, /*#__PURE__*/_react.default.createElement(_antd.Row, {
    className: "status-track-icons"
  }, /*#__PURE__*/_react.default.createElement(_antd.Col, {
    className: "status-icons"
  }, /*#__PURE__*/_react.default.createElement("span", {
    style: {
      backgroundColor: 'pink'
    }
  }, " ", statusCount["New"], " "), /*#__PURE__*/_react.default.createElement("h3", null, "New")), /*#__PURE__*/_react.default.createElement(_antd.Col, {
    className: "status-icons"
  }, /*#__PURE__*/_react.default.createElement("span", {
    style: {
      backgroundColor: 'lightBlue'
    }
  }, " ", statusCount["In_Progress"], " "), /*#__PURE__*/_react.default.createElement("h3", null, "In_progress")), /*#__PURE__*/_react.default.createElement(_antd.Col, {
    className: "status-icons"
  }, /*#__PURE__*/_react.default.createElement("span", {
    style: {
      backgroundColor: 'lightgreen'
    }
  }, " ", statusCount["Complete"], " "), /*#__PURE__*/_react.default.createElement("h3", null, "Completed")), /*#__PURE__*/_react.default.createElement(_antd.Col, {
    className: "status-icons"
  }, /*#__PURE__*/_react.default.createElement("span", {
    style: {
      backgroundColor: 'rgba(256,0,0,0.7)'
    }
  }, " ", statusCount["Cancelled"], " "), /*#__PURE__*/_react.default.createElement("h3", null, "Cancelled"))), /*#__PURE__*/_react.default.createElement(_antd.Col, {
    style: {
      paddingTop: '0px'
    }
  }, /*#__PURE__*/_react.default.createElement(_antd.Divider, {
    type: "horizontal"
  })), /*#__PURE__*/_react.default.createElement(_antd.Row, {
    className: "graph",
    justify: 'center'
  }, /*#__PURE__*/_react.default.createElement(_antd.Col, {
    xs: 24,
    sm: 22,
    md: 20,
    lg: 16,
    xl: 12
  }, /*#__PURE__*/_react.default.createElement(_reactChartjs.Bar, {
    data: graphData,
    options: options
  })))), /*#__PURE__*/_react.default.createElement(_antd.Modal, {
    title: "AddNewNameCard",
    open: isAddNewNameCardModalOpen,
    onCancel: () => setIsAddNewNameCardModalOpen(false),
    footer: null
  }, /*#__PURE__*/_react.default.createElement(_AddNewNameCard.default, {
    data: data,
    setNewRecordName: setNewRecordName,
    setNewRecordPhone: setNewRecordPhone
    // setNewRecordAge={setNewRecordAge}
    ,
    setNewRecordAddress: setNewRecordAddress,
    setNewRecordStatus: setNewRecordStatus,
    newRecordStatus: newRecordStatus,
    setIsAddNewNameCardModalOpen: setIsAddNewNameCardModalOpen,
    handleAddNewNameCard: handleAddNewNameCard
  }))) : resourcePage ? /*#__PURE__*/_react.default.createElement(_ResourcePage.default, {
    resourceData: resourceData,
    setDuplicateData: setDuplicateData,
    commentBox: commentBox,
    setCommentBox: setCommentBox
  }) : openCalendarPage ? /*#__PURE__*/_react.default.createElement(_CalendarPage.default, {
    sampleData: sampleData,
    setSampleData: setSampleData,
    duplicateData: duplicateData,
    resourceData: resourceData
  }) : /*#__PURE__*/_react.default.createElement(_TodosPage.default, {
    sampleData: sampleData
  }), /*#__PURE__*/_react.default.createElement(_antd.Divider, {
    type: "horizontal"
  }), /*#__PURE__*/_react.default.createElement(_Footer.default, null));
}
var _default = exports.default = App;