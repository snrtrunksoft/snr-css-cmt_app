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
import { getMembers, getResources, getCalendar, createMember, getAvailableGroups } from "./api/APIUtil";
import dayjs from 'dayjs';

const { useBreakpoint } = Grid;

// Registering necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const CmtApp = ({ tenantConfig, setSelectedApp, selectedGroup, groupMessages, setGroupMessages }) => {
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
  const [sampleData, setSampleData] = useState([]);
  // Cache flags to avoid repeat backend calls when re-entering tabs
  const [hasLoadedMembers, setHasLoadedMembers] = useState(false);
  const [hasLoadedCalendar, setHasLoadedCalendar] = useState(false);
  const [uniqueGroups, setUniqueGroups] = useState([]);

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
            groupId: [prev.groupId] || ["undefined"],
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
          const groups = res.map(group => group.groupName);
          setUniqueGroups(groups);
        } catch (error) {
          console.log("Error fetching available groups:", error);
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
          const fetchedCalendarData = await getCalendar(
            entityId,
            dayjs().format("MMM"),
            dayjs().year()
          );
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
    const city = item.address?.[0]?.city;
    if (city) {
      acc[city] = (acc[city] || 0) + 1;
    }
    return acc;
  }, {});

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


  // Legend labels mirror labels by default; customize here if needed
  const legendLabels = uniqueCities.reduce((acc, city) => {
    acc[city] = city;
    return acc;
  }, {});

  const graphData = {
    labels: Object.keys(statusCount),
    datasets: [
      {
        label: 'Status Count',
        data: Object.values(statusCount),
        backgroundColor: ['brown', '#00B0FF', '#4CAF50', 'pink'],
        borderColor: ['brown', '#00B0FF', '#4CAF50', 'pink'],
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Status Distribution' },
      legend: {
        position: 'top',
        labels: {
          generateLabels: (chart) => {
            return chart.data.labels.map((label, index) => ({
              text: legendLabels[label] || label,
              fillStyle: chart.data.datasets[0].backgroundColor[index],
              strokeStyle: chart.data.datasets[0].borderColor[index],
              lineWidth: 1
            }));
          }
        },
        onClick: null,
      }
    },
  };

  const handleAddNewNameCard = (values) => {
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
      groupId = "undefined",
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
      groupId: [groupId],
      subscriptions: [],
    };

    const addNewMember = async () => {
      try {
        const postData = await createMember(entityId, newRecord);
        console.log("new customer data:", newRecord);
        console.log("post New Member Data:", postData);
        const updatedRecord = { ...newRecord, id: postData.userId };
        // Update BOTH data and duplicateData to keep them in sync
        setData(prevData => [...prevData, updatedRecord]);
        setDuplicateData(prevData => [...prevData, updatedRecord]);
        setHasLoadedMembers(true); // Keep cache valid; avoid refetch on tab switch
        
        // Show success modal
        setStatusModal({
          visible: true,
          type: "success",
          title: "User Added Successfully",
          message: `New user "${newRecord.customerName}" has been added successfully!`,
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
      {uniqueGroups.map((groupId, index) => (
        <option key={index} value={groupId}>
          {groupId}
        </option>
      ))}
    </select>
  );

  const colSize = duplicateData.length <= 3 ? 24 / duplicateData.length : 6;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: "#f0f0f0" }}>
      <div className='home_app'>
        <Header
          tenantConfig={tenantConfig}
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
                        />
                      </Col>
                    )) : <h2>No NameCards Found...</h2>}
                    <Col xs={20}
                      md={12}
                      lg={colSize}
                      className='nameCard'
                      onClick={() => setIsAddNewNameCardModalOpen(true)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                      }}>
                      <Button style={{ border: 'transparent', fontSize: '40px' }}>+</Button>
                    </Col>
                  </Row>)}
              <Divider type='horizontal' />
              {showDashboard && <div style={{ width: "100%" }}>
                <Row className="status-track-icons">
                  {Object.entries(statusCount).map(([city, count], index) => {
                    const colors = ['#FFB6C1', '#ADD8E6', '#90EE90', '#FFD580', '#D8BFD8', '#98FB98'];
                    const bgColor = colors[index % colors.length];
                    return (
                      <Col key={city} className="status-icons">
                        <span style={{ backgroundColor: bgColor }}>{count}</span>
                        <h3>{city}</h3>
                      </Col>
                    );
                  })}
                </Row>
                <Col style={{ paddingTop: '0px' }}>
                  <Divider type='horizontal' ></Divider>
                </Col>
                <Row className="graph" justify={'center'}>
                  <Col xs={24} sm={22} md={20} lg={16} xl={12}>
                    <Bar data={graphData} options={options} />
                  </Col>
                </Row>
              </div>}
              <Modal
                open={isAddNewNameCardModalOpen}
                onCancel={() => {setIsAddNewNameCardModalOpen(false); form.resetFields();}}
                footer={null}
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
            /> : openCalendarPage ?
              <CalendarPage
                sampleData={sampleData}
                setSampleData={setSampleData}
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