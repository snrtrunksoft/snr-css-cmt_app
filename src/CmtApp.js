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

const { useBreakpoint } = Grid;

const createUserName = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

// Registering necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend, ArcElement);

const CmtApp = ({ headerTitle, logoPath, setSelectedApp, selectedGroup, groupMessages, setGroupMessages }) => {
  const [entityId, setEntityId] = useState(null);

  // Resolve entityId (localStorage -> token claims)
  useEffect(() => {
    const resolveEntityId = async () => {
      let id = null;
      try { id = localStorage.getItem('entityId') || null; } catch (_) {}
      if (!id) {
        try {
          const session = await fetchAuthSession();
          id =
            // Prefer explicit tenantId if present
            session?.tokens?.idToken?.payload?.['tenantId'] ||
            session?.tokens?.accessToken?.payload?.['tenantId'] ||
            // Then try custom attributes (both casings)
            session?.tokens?.idToken?.payload?.['custom:entityid'] ||
            session?.tokens?.accessToken?.payload?.['custom:entityid'] ||
            session?.tokens?.idToken?.payload?.['custom:entityId'] ||
            session?.tokens?.accessToken?.payload?.['custom:entityId'] ||
            // Then a generic entityId if your IdP populates it
            session?.tokens?.idToken?.payload?.['entityId'] ||
            session?.tokens?.accessToken?.payload?.['entityId'] ||
            // Last resort: userSub
            session?.userSub ||
            null;
        } catch (e) {
          // Standalone mode without auth is allowed
        }
      }
      if (id) {
        setEntityId(id);
        try { localStorage.setItem('entityId', id); } catch (_) {}
      }
    };
    resolveEntityId();
  }, []);

  const [isAddNewNameCardModalOpen, setIsAddNewNameCardModalOpen] = useState(false);
  const [statusModal, setStatusModal] = useState({ visible: false, type: "", title: "", message: "", entityType: "" });
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
          const groupingData = fetchedData.map((prev) => ({
            ...prev,
            groupId: [prev.groupId] || ["undefined"],
          }));
          setData(groupingData);
        } catch (error) {
          console.error("Error while fetching members", error);
        }
        try {
          const fetchedResources = await getResources(entityId);
          const groupingData = fetchedResources.map((prev) => ({
            ...prev,
            groupId: [prev.groupId ?? "undefined"],
          }));
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
    }
    else {
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
    const city = item.address?.[0]?.city;
    if (city) {
      acc[city] = (acc[city] || 0) + 1;
    }
    return acc;
  }, {});

  const filteredCityCount = duplicateData.reduce((acc, item) => {
    const city = item.address?.[0]?.city || "Unknown";
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});

  const flattenGroups = (groupId) => {
    if (!Array.isArray(groupId)) return [];
    return groupId.flat().filter(Boolean);
  };

  const groupCount = data.reduce((acc, item) => {
    const groups = flattenGroups(item.groupId);
    if (groups.length === 0) {
      acc.Ungrouped = (acc.Ungrouped || 0) + 1;
      return acc;
    }
    groups.forEach((group) => {
      acc[group] = (acc[group] || 0) + 1;
    });
    return acc;
  }, {});

  const activeMembers = data.filter((item) => String(item.status || "").toLowerCase() === "active").length;
  const withPhone = data.filter((item) => Boolean(item.phoneNumber)).length;
  const withEmail = data.filter((item) => Boolean(item.email)).length;
  const totalComments = data.reduce((total, item) => total + (Array.isArray(item.comments) ? item.comments.length : 0), 0);
  const totalSubscriptions = data.reduce((total, item) => total + (Array.isArray(item.subscriptions) ? item.subscriptions.length : 0), 0);
  const topCities = Object.entries(cityCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topGroups = Object.entries(groupCount).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const resourceCityCount = resourceData1.reduce((acc, item) => {
    const city = item.address?.[0]?.city || "Unknown";
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});

  const filteredResourceCityCount = resourceData.reduce((acc, item) => {
    const city = item.address?.[0]?.city || "Unknown";
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
    groups.forEach((group) => {
      acc[group] = (acc[group] || 0) + 1;
    });
    return acc;
  }, {});

  const availableResources = resourceData1.filter((item) => String(item.status || "").toLowerCase() === "active").length;
  const resourcesWithPhone = resourceData1.filter((item) => Boolean(item.phoneNumber)).length;
  const resourcesWithEmail = resourceData1.filter((item) => Boolean(item.email)).length;
  const resourceComments = resourceData1.reduce((total, item) => total + (Array.isArray(item.comments) ? item.comments.length : 0), 0);
  const topResourceCities = Object.entries(resourceCityCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topResourceGroups = Object.entries(resourceGroupCount).sort((a, b) => b[1] - a[1]).slice(0, 6);

  // Unique city list for dropdown
  const uniqueCities = Array.from(
    new Set(
      data.flatMap(item =>
        (item.address || [])
          .map(addr => addr?.city?.trim())
          .filter(Boolean)
      )
    )
  );


  const dashboardColors = ['#1677ff', '#16a34a', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6', '#64748b'];

  const cityGraphData = {
    labels: Object.keys(filteredCityCount),
    datasets: [
      {
        label: 'Members',
        data: Object.values(filteredCityCount),
        backgroundColor: Object.keys(filteredCityCount).map((_, index) => dashboardColors[index % dashboardColors.length]),
        borderColor: '#ffffff',
        borderWidth: 2,
      }
    ]
  };

  const groupGraphData = {
    labels: topGroups.map(([group]) => group),
    datasets: [
      {
        label: 'Members',
        data: topGroups.map(([, count]) => count),
        backgroundColor: '#1677ff',
        borderRadius: 8,
        maxBarThickness: 42,
      }
    ]
  };

  const resourceCityGraphData = {
    labels: Object.keys(filteredResourceCityCount),
    datasets: [
      {
        label: 'Resources',
        data: Object.values(filteredResourceCityCount),
        backgroundColor: Object.keys(filteredResourceCityCount).map((_, index) => dashboardColors[index % dashboardColors.length]),
        borderColor: '#ffffff',
        borderWidth: 2,
      }
    ]
  };

  const resourceStatusGraphData = {
    labels: Object.keys(resourceStatusCount),
    datasets: [
      {
        label: 'Resources',
        data: Object.values(resourceStatusCount),
        backgroundColor: Object.keys(resourceStatusCount).map((_, index) => dashboardColors[index % dashboardColors.length]),
        borderRadius: 8,
        maxBarThickness: 42,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: false },
      legend: {
        position: 'bottom',
        labels: {
          boxHeight: 10,
          boxWidth: 10,
          usePointStyle: true,
        },
      }
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: false },
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b' },
      },
      y: {
        beginAtZero: true,
        grid: { color: '#eef2f7' },
        ticks: {
          precision: 0,
          color: '#64748b',
        },
      },
    },
  };

  const handleAddNewNameCard = (values) => {
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
      groupId,
    } = values;
    const trimmedFirstName = firstName?.trim() || "";
    const trimmedLastName = lastName?.trim() || "";

    const newRecord = {
      subscriptions: [],
      comments: [],
      groupId: groupId ? [groupId] : [],
      userName: values.userName || createUserName(),
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      phoneNumber: phone,
      email: email,
      orderIds: [],
      rewardPoints: 0,
      userPoolId: awsExports?.Auth?.Cognito?.userPoolId || "",
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
        const updatedRecord = {
          ...newRecord,
          id: postData.userId,
          customerName: `${trimmedFirstName}${trimmedLastName}`,
        };
        // Update BOTH data and duplicateData to keep them in sync
        setData(prevData => [...prevData, updatedRecord]);
        setDuplicateData(prevData => [...prevData, updatedRecord]);
        setHasLoadedMembers(true); // Keep cache valid; avoid refetch on tab switch
        
        // Show success modal
        setStatusModal({
          visible: true,
          type: "success",
          title: "User Added Successfully",
          message: `New user "${updatedRecord.customerName}" has been added successfully!`,
          entityType: "user"
        });
        return { success: true, record: updatedRecord };
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
  const applyAllFilters = (dataToFilter, filters = {}) => {
    const { status = statusSelection, group = groupSelection, search = searchText, isResource = false } = filters;
    
    return dataToFilter.filter(item => {
      // Status filter
      const statusMatch = status === "All" ? true : (
        Array.isArray(item.address) &&
        item.address.some((addr) => addr.city === status)
      );
      
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
      const searchMatch = search === "" ? true : (
        (isResource 
          ? (item.resourceName || '').toLowerCase().includes(q) 
          : (item.customerName || '').toLowerCase().includes(q)) ||
        (item.phoneNumber || '').includes(search)
      );
      
      return statusMatch && groupMatch && searchMatch;
    });
  };

  const handleStatusSelection = (value) => {
    setStatusSelection(value);
    setShowDashboard(value !== "All");
    const filtered = applyAllFilters(data, { status: value, group: groupSelection, search: searchText, isResource: false });
    setDuplicateData(filtered);
  };

  const handleGroupSelection = (value) => {
    setGroupSelection(value);
    const filtered = applyAllFilters(data, { status: statusSelection, group: value, search: searchText, isResource: false });
    setDuplicateData(filtered);
  };

  const handleSearchText = (value) => {
    setSearchText(value);
    if (membersPage) {
      const filtered = applyAllFilters(data, { status: statusSelection, group: groupSelection, search: value, isResource: false });
      setDuplicateData(filtered);
    } else {
      const filtered = applyAllFilters(resourceData1, { status: statusSelection, group: groupSelection, search: value, isResource: true });
      setResourceData(filtered);
    }
  };

  const dropDownList = (
    <select
      value={statusSelection}
      hidden={openCalendarPage || todosPage || resourcePage || isLoading}
      style={{ borderRadius: '5px', padding: '5px', margin: '0px 10px', outline: 'none', fontSize: '15px' }}
      onChange={(e) => handleStatusSelection(e.target.value)}
    >
      <option value="All">Select City</option>
      {uniqueCities.map((city, index) => (
        <option key={index} value={city}>
          {city}
        </option>
      ))}
    </select>
  );

  const groupDropDownList = (
    <select
      value={groupSelection}
      hidden={openCalendarPage || todosPage || resourcePage || isLoading}
      style={{ borderRadius: '5px', padding: '5px', margin: '0px 10px', outline: 'none', fontSize: '15px' }}
      onChange={(e) => handleGroupSelection(e.target.value)}
    >
      <option value="All">Select Group</option>
      {uniqueGroups.map((groupName, index) => (
        <option key={index} value={groupName}>
          {groupName}
        </option>
      ))}
    </select>
  );

  const colSize = duplicateData.length <= 3 ? 24 / duplicateData.length : 6;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: "#f0f0f0" }}>
      <div className='home_app'>
        <Header
          headerTitle={headerTitle}
          logoPath={logoPath}
          commentBox={commentBox}
          membersPage={membersPage}
          openCalendarPage={openCalendarPage}
          todosPage={todosPage}
          resourcePage={resourcePage}
          setOpenCalendarPage={setOpenCalendarPage}
          setMembersPage={setMembersPage}
          setResourcePage={setResourcePage}
          setTodosPage={setTodosPage}
          setSelectedApp={setSelectedApp}
          searchText={searchText}
          handleSearchText={handleSearchText}
        />
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <div hidden={isLoading || openCalendarPage}>
            <Button
              style={membersPage ? { backgroundColor: '#1677ff', color: 'azure' } : {}}
              onClick={() => { setResourcePage(false); setOpenCalendarPage(false); setMembersPage(true); setTodosPage(false); }}
            >
              <h3>Members</h3>
            </Button>
            <Button
              style={resourcePage ? { backgroundColor: '#1677ff', color: 'azure' } : {}}
              onClick={() => { setResourcePage(true); setMembersPage(false); setOpenCalendarPage(false); setTodosPage(false); }}
            >
              <h3>Resources</h3>
            </Button>
          </div>
          <div style={{ paddingRight: '5px' }} hidden={!membersPage && !resourcePage}>
            <Input placeholder='Search Name or Ph no.' value={searchText} onChange={(e) => handleSearchText(e.target.value)} />
          </div>
        </span>
        <Row style={{ width: '100%', gap: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px' }}>
          <Col hidden={openCalendarPage || todosPage || isLoading} style={{ fontSize: '20px' }}>
            <span>{view + " View "}</span>
            <Switch
              onClick={() => {
                setDataView(dataView === "grid" ? "table" : "grid");
                setView(view === "Grid" ? "List" : "Grid");
              }}
            />
          </Col>
          <Col hidden={openCalendarPage || todosPage || isLoading} style={{ fontSize: '20px' }}>
            <span>Show Dashboard </span>
            <Switch
              checked={showDashboard}
              onClick={() => setShowDashboard(prev => !prev)}
            />
          </Col>
          <Col style={{ fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
            <span hidden={openCalendarPage || todosPage || resourcePage || isLoading}>City:</span> {dropDownList}
          </Col>
          <Col style={{ fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
            <span hidden={openCalendarPage || todosPage || resourcePage || isLoading}>groupId:</span> {groupDropDownList}
          </Col>
        </Row>
        {isLoading ? (<h3><LoadingOutlined /> Loading...</h3>) :
          (membersPage) ? (
            <>
              {dataView === "table" ?
                <div className='table-wrapper'>
                  <Row className="table-row table-header">
                    <Col span={3} className="table-cell">ID</Col>
                    <Col span={5} className="table-cell">Name</Col>
                    <Col span={10} className="table-cell">Address</Col>
                    <Col span={6} className="table-cell">Phone Number</Col>
                  </Row>

                  {/* Data Rows */}
                  {duplicateData.map((item, index) => (
                    <Row key={index} className="table-row">
                      <Col span={3} className="table-cell">{item.id}</Col>
                      <Col span={5} className="table-cell">{item.customerName}</Col>
                      <Col span={10} className="table-cell">
                        {[
                          item.address?.[0]?.houseNo,
                          item.address?.[0]?.street1,
                          item.address?.[0]?.street2,
                          item.address?.[0]?.city,
                          item.address?.[0]?.state,
                          item.address?.[0]?.country
                        ].filter(Boolean).join(', ')}
                      </Col>
                      <Col span={6} className="table-cell">{item.phoneNumber}</Col>
                    </Row>
                  ))}

                  {/* Add New Record Button */}
                  <Row className="table-row add-record-row">
                    <Col span={24} style={{ margin: '10px' }}>
                      <center>
                        <Button style={{ fontSize: '18px' }} onClick={() => setIsAddNewNameCardModalOpen(true)}>+ Add New Record</Button>
                      </center>
                    </Col>
                  </Row>
                </div>
                : (
                  <Row gutter={[16, 16]} className={`home-grid ${screens.xs ? "mobile-grid-alignment" : "web-grid-alignment"}`}>
                    {duplicateData.length !== 0 ? duplicateData.map((item) => (
                      <Col key={item.id}
                        xs={20}
                        md={12}
                        lg={colSize}>
                        <NameCard key={item.id}
                          membersPage={true}
                          entityId={entityId}
                          data={data}
                          setData={setData}
                          resourceData={resourceData}
                          setResourceData={setResourceData}
                          setResourceData1={setResourceData1}
                          customerId={item.id}
                          customerName={item.customerName}
                          email={item.email}
                          phoneNumber={item.phoneNumber}
                          address={item.address}
                          status={item.status}
                          groupId={item.groupId}
                          comments={item.comments}
                          subscriptions={item.subscriptions}
                          setDuplicateData={setDuplicateData}
                          commentBox={commentBox}
                          setCommentBox={setCommentBox}
                          selectedGroup={selectedGroup}
                          groupMessages={groupMessages}
                          setGroupMessages={setGroupMessages}
                          uniqueGroups={uniqueGroups}
                        />
                      </Col>
                    )) : <h2>No NameCards Found...</h2>}
                    <Col xs={20}
                      md={12}
                      lg={colSize}
                      className='nameCard add-card'
                      onClick={() => setIsAddNewNameCardModalOpen(true)}>
                      <Button style={{ border: 'transparent', fontSize: '40px' }}>+</Button>
                    </Col>
                  </Row>)}
              <Divider type='horizontal' />
              {showDashboard && (
                <section className="dashboard-panel">
                  <div className="dashboard-heading">
                    <div>
                      <p>Member dashboard</p>
                      <h2>{statusSelection === "All" ? "All member activity" : `${statusSelection} member activity`}</h2>
                    </div>
                    <span>{duplicateData.length} showing of {data.length}</span>
                  </div>

                  <div className="dashboard-metrics">
                    <div className="dashboard-stat primary">
                      <TeamOutlined />
                      <div>
                        <span>Total members</span>
                        <strong>{data.length}</strong>
                      </div>
                    </div>
                    <div className="dashboard-stat">
                      <CheckCircleOutlined />
                      <div>
                        <span>Active</span>
                        <strong>{activeMembers}</strong>
                      </div>
                    </div>
                    <div className="dashboard-stat">
                      <EnvironmentOutlined />
                      <div>
                        <span>Cities</span>
                        <strong>{uniqueCities.length}</strong>
                      </div>
                    </div>
                    <div className="dashboard-stat">
                      <ApartmentOutlined />
                      <div>
                        <span>Groups</span>
                        <strong>{Object.keys(groupCount).length}</strong>
                      </div>
                    </div>
                    <div className="dashboard-stat">
                      <PhoneOutlined />
                      <div>
                        <span>Phone coverage</span>
                        <strong>{data.length ? Math.round((withPhone / data.length) * 100) : 0}%</strong>
                      </div>
                    </div>
                    <div className="dashboard-stat">
                      <MailOutlined />
                      <div>
                        <span>Email coverage</span>
                        <strong>{data.length ? Math.round((withEmail / data.length) * 100) : 0}%</strong>
                      </div>
                    </div>
                  </div>

                  <Row gutter={[16, 16]} className="dashboard-content">
                    <Col xs={24} lg={10}>
                      <div className="dashboard-card chart-card">
                        <div className="dashboard-card-title">
                          <h3>City distribution</h3>
                          <span>{Object.keys(filteredCityCount).length} locations</span>
                        </div>
                        <div className="dashboard-chart">
                          {Object.keys(filteredCityCount).length ? (
                            <Pie data={cityGraphData} options={chartOptions} />
                          ) : (
                            <div className="dashboard-empty">No city data available</div>
                          )}
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} lg={14}>
                      <div className="dashboard-card chart-card">
                        <div className="dashboard-card-title">
                          <h3>Top groups</h3>
                          <span>{topGroups.length} tracked</span>
                        </div>
                        <div className="dashboard-chart">
                          {topGroups.length ? (
                            <Bar data={groupGraphData} options={barOptions} />
                          ) : (
                            <div className="dashboard-empty">No group data available</div>
                          )}
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} lg={12}>
                      <div className="dashboard-card">
                        <div className="dashboard-card-title">
                          <h3>Top cities</h3>
                          <span>Members by location</span>
                        </div>
                        <div className="rank-list">
                          {topCities.length ? topCities.map(([city, count], index) => (
                            <div className="rank-item" key={city}>
                              <span>{index + 1}</span>
                              <div>
                                <strong>{city}</strong>
                                <em>{count} member{count === 1 ? "" : "s"}</em>
                              </div>
                              <b style={{ width: `${data.length ? (count / data.length) * 100 : 0}%` }} />
                            </div>
                          )) : <div className="dashboard-empty compact">No city data available</div>}
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} lg={12}>
                      <div className="dashboard-card insight-card">
                        <div className="dashboard-card-title">
                          <h3>Engagement snapshot</h3>
                          <span>From member records</span>
                        </div>
                        <div className="insight-grid">
                          <div>
                            <span>Comments</span>
                            <strong>{totalComments}</strong>
                          </div>
                          <div>
                            <span>Subscriptions</span>
                            <strong>{totalSubscriptions}</strong>
                          </div>
                          <div>
                            <span>Filtered members</span>
                            <strong>{duplicateData.length}</strong>
                          </div>
                          <div>
                            <span>Without email</span>
                            <strong>{Math.max(data.length - withEmail, 0)}</strong>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </section>
              )}
              {/* Floating Add Button (quick access) */}
              {/* <Tooltip title="Add New Member">
                <Button aria-label="Add New Member" className="floating-add-btn" type="primary" shape="circle" size="large" onClick={() => setIsAddNewNameCardModalOpen(true)}>+</Button>
              </Tooltip> */}

              <Modal
                open={isAddNewNameCardModalOpen}
                onCancel={() => {setIsAddNewNameCardModalOpen(false); form.resetFields();}}
                footer={null}
                width={920}
                className="add-user-modal"
                destroyOnHidden
              >
                <AddNewUser
                  mode="member"
                  form={form}
                  onSubmit={handleAddNewNameCard}
                  entityId={entityId}
                />
              </Modal>

              {/* Status Modal for Add User/Resource */}
              <StatusModal
                visible={statusModal.visible}
                type={statusModal.type}
                title={statusModal.title}
                message={statusModal.message}
                onClose={() => {
                  setStatusModal({ visible: false, type: "", title: "", message: "", entityType: "" });
                  if (statusModal.type === "success") {
                    setIsAddNewNameCardModalOpen(false);
                    form.resetFields();
                  }
                }}
              />
            </>
          ) : (resourcePage ?
            <>
              <ResourcePage
                resourceData={resourceData}
                setResourceData1={setResourceData1}
                setResourceData={setResourceData}
                dataView={dataView}
                entityId={entityId}
                commentBox={commentBox}
                setCommentBox={setCommentBox}
                groupMessages={groupMessages}
                setGroupMessages={setGroupMessages}
                selectedGroup={selectedGroup}
                uniqueGroups={uniqueGroups}
              />
              {showDashboard && (
                <section className="dashboard-panel resource-dashboard-panel">
                  <div className="dashboard-heading">
                    <div>
                      <p>Resource dashboard</p>
                      <h2>Resource availability and coverage</h2>
                    </div>
                    <span>{resourceData.length} showing of {resourceData1.length}</span>
                  </div>

                  <div className="dashboard-metrics">
                    <div className="dashboard-stat primary">
                      <ApartmentOutlined />
                      <div>
                        <span>Total resources</span>
                        <strong>{resourceData1.length}</strong>
                      </div>
                    </div>
                    <div className="dashboard-stat">
                      <CheckCircleOutlined />
                      <div>
                        <span>Active</span>
                        <strong>{availableResources}</strong>
                      </div>
                    </div>
                    <div className="dashboard-stat">
                      <EnvironmentOutlined />
                      <div>
                        <span>Locations</span>
                        <strong>{Object.keys(resourceCityCount).length}</strong>
                      </div>
                    </div>
                    <div className="dashboard-stat">
                      <TeamOutlined />
                      <div>
                        <span>Groups</span>
                        <strong>{Object.keys(resourceGroupCount).length}</strong>
                      </div>
                    </div>
                    <div className="dashboard-stat">
                      <PhoneOutlined />
                      <div>
                        <span>Phone coverage</span>
                        <strong>{resourceData1.length ? Math.round((resourcesWithPhone / resourceData1.length) * 100) : 0}%</strong>
                      </div>
                    </div>
                    <div className="dashboard-stat">
                      <MailOutlined />
                      <div>
                        <span>Email coverage</span>
                        <strong>{resourceData1.length ? Math.round((resourcesWithEmail / resourceData1.length) * 100) : 0}%</strong>
                      </div>
                    </div>
                  </div>

                  <Row gutter={[16, 16]} className="dashboard-content">
                    <Col xs={24} lg={10}>
                      <div className="dashboard-card chart-card">
                        <div className="dashboard-card-title">
                          <h3>Location distribution</h3>
                          <span>{Object.keys(filteredResourceCityCount).length} locations</span>
                        </div>
                        <div className="dashboard-chart">
                          {Object.keys(filteredResourceCityCount).length ? (
                            <Pie data={resourceCityGraphData} options={chartOptions} />
                          ) : (
                            <div className="dashboard-empty">No location data available</div>
                          )}
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} lg={14}>
                      <div className="dashboard-card chart-card">
                        <div className="dashboard-card-title">
                          <h3>Status overview</h3>
                          <span>{Object.keys(resourceStatusCount).length} statuses</span>
                        </div>
                        <div className="dashboard-chart">
                          {Object.keys(resourceStatusCount).length ? (
                            <Bar data={resourceStatusGraphData} options={barOptions} />
                          ) : (
                            <div className="dashboard-empty">No status data available</div>
                          )}
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} lg={12}>
                      <div className="dashboard-card">
                        <div className="dashboard-card-title">
                          <h3>Top resource cities</h3>
                          <span>Resources by location</span>
                        </div>
                        <div className="rank-list">
                          {topResourceCities.length ? topResourceCities.map(([city, count], index) => (
                            <div className="rank-item" key={city}>
                              <span>{index + 1}</span>
                              <div>
                                <strong>{city}</strong>
                                <em>{count} resource{count === 1 ? "" : "s"}</em>
                              </div>
                              <b style={{ width: `${resourceData1.length ? (count / resourceData1.length) * 100 : 0}%` }} />
                            </div>
                          )) : <div className="dashboard-empty compact">No location data available</div>}
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} lg={12}>
                      <div className="dashboard-card insight-card">
                        <div className="dashboard-card-title">
                          <h3>Resource snapshot</h3>
                          <span>From resource records</span>
                        </div>
                        <div className="insight-grid">
                          <div>
                            <span>Comments</span>
                            <strong>{resourceComments}</strong>
                          </div>
                          <div>
                            <span>Tracked groups</span>
                            <strong>{topResourceGroups.length}</strong>
                          </div>
                          <div>
                            <span>Filtered resources</span>
                            <strong>{resourceData.length}</strong>
                          </div>
                          <div>
                            <span>Without email</span>
                            <strong>{Math.max(resourceData1.length - resourcesWithEmail, 0)}</strong>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </section>
              )}
            </> : openCalendarPage ?
              <CalendarPage
                entityId={entityId}
                duplicateData={duplicateData}
                resourceData={resourceData}
              /> : <TodosPage sampleData={sampleData} />)}
        {/* <Divider type='horizontal'/>
        {<Footer/>} */}
      </div>
    </div>
  );
}

export default CmtApp;
