import React, { useState, useEffect } from 'react';
import { Button, Col, Divider, Grid, Input, Modal, Row, Switch, Table } from 'antd';
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
import CalendarPage from './CalendarPage';
import './CmtApp.css';

// APIUtil imports
import { getMembers, getResources, getCalendar, createMember } from "./api/APIUtil";
import dayjs from 'dayjs';

const { useBreakpoint } = Grid;

// Registering necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const CmtApp = ({ setSelectedApp }) => {
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
  const [dataView, setDataView] = useState("grid");
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
          setData(fetchedData);
        } catch (error) {
          console.error("Error while fetching members", error);
        }
        try {
          const fetchedResources = await getResources(entityId);
          setResourceData1(fetchedResources);
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
      address,
      city,
      state,
      country,
      pincode,
      status = "ACTIVE",
    } = values;

    const newRecord = {
      customerName: (firstName || "") + (lastName || ""),
      phoneNumber: phone,
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
      subscriptions: [],
    };

    const addNewMember = async () => {
      try {
        const postData = await createMember(entityId, newRecord);
        console.log("post New Resource Data:", postData);
        const updatedRecord = { ...newRecord, id: postData.userId };
        setDuplicateData(prevData => [...prevData, updatedRecord]);
        setHasLoadedMembers(true); // Keep cache valid; avoid refetch on tab switch
      } catch (error) {
        console.log("unable to add new member", error);
      } finally {
        setIsAddNewNameCardModalOpen(false);
      }
    };
    addNewMember();
  };

  const handleStatusSelection = (value) => {
    setStatusSelection(value);
    setShowDashboard(true);
    if (value === "All") {
      setDuplicateData(data);
      setShowDashboard(false);
    } else {
      const filteredRecords = data.filter(
        (item) =>
          Array.isArray(item.address) &&
          item.address.some((addr) => addr.city === value)
      );
      setDuplicateData(filteredRecords);
    }
  };

  const handleSearchText = (value) => {
    setSearchText(value);
    if (membersPage) {
      const q = value.toLowerCase();
      const filterData = data.filter(
        prev =>
          (prev.customerName || '').toLowerCase().includes(q) ||
          (prev.phoneNumber || '').includes(value)
      );
      setDuplicateData(filterData);
    } else {
      const q = value.toLowerCase();
      const filteredResourceData = resourceData1.filter(
        prev =>
          (prev.resourceName || '').toLowerCase().includes(q) ||
          (prev.phoneNumber || '').includes(value)
      );
      setResourceData(filteredResourceData);
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

  const colSize = duplicateData.length <= 3 ? 24 / duplicateData.length : 6;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: "#f0f0f0" }}>
      <div className='home_app'>
        <Header
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
            <span hidden={openCalendarPage || todosPage || resourcePage || isLoading}>Status:</span> {dropDownList}
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
                          phoneNumber={item.phoneNumber}
                          address={item.address}
                          status={item.status}
                          comments={item.comments}
                          subscriptions={item.subscriptions}
                          setDuplicateData={setDuplicateData}
                          commentBox={commentBox}
                          setCommentBox={setCommentBox}
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
                onCancel={() => setIsAddNewNameCardModalOpen(false)}
                footer={null}
              >
                <AddNewUser
                  mode="member"
                  onSubmit={handleAddNewNameCard}
                />
              </Modal>
            </>
          ) : (resourcePage ?
            <ResourcePage
              resourceData={resourceData}
              setResourceData={setResourceData}
              dataView={dataView}
              entityId={entityId}
              commentBox={commentBox}
              setCommentBox={setCommentBox}
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