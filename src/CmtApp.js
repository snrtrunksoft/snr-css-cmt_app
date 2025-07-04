import React, { useState, useEffect } from 'react';
import { Button, Col, Divider, Grid, Input, Modal, Row, Switch, Table } from 'antd';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { LoadingOutlined } from '@ant-design/icons';

// Local component imports
import Header from './Header';
import Footer from './Footer';
import NameCard from './NameCard';
import ResourcePage from './ResourcePage';
import TodosPage from './TodosPage';
import AddNewNameCard from './AddNewNameCard';
import CalendarPage from './CalendarPage';
import './CmtApp.css';

// Endpoint constants
import { MEMBERS_API, RESOURCES_API, CALENDAR_API } from './properties/EndPointProperties';
import dayjs from 'dayjs';

const { useBreakpoint } = Grid;

// Registering necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const CmtApp = ({cartItems, setCartItems, setSelectedApp}) => {

  const [ isAddNewNameCardModalOpen, setIsAddNewNameCardModalOpen ] = useState(false);
  const [ dataView, setDataView ] = useState("grid");
  // const [ isInitialLoad, setIsInitialLoad ] = useRef(true);
  const [ newRecordName, setNewRecordName ] = useState('');
  const [ newRecordPhone, setNewRecordPhone ] = useState('');
  const [ newRecordAddress, setNewRecordAddress ] = useState('');
  const [ newRecordLastName, setNewRecordLastName ] = useState('');
  const [ newRecordStatus, setNewRecordStatus ] = useState("Active");
  const [ newRecordCountry, setNewRecordCountry ] = useState("");
  const [ newRecordState, setNewRecordState ] = useState("");
  const [ newRecordCity, setNewRecordCity ] = useState("");
  const [ statusSelection, setStatusSelection ] = useState("All");
  const [ showDashboard, setShowDashboard ] = useState(false);
  const [ openCalendarPage, setOpenCalendarPage ] = useState(false);
  const [ resourcePage, setResourcePage ] = useState(false);
  const [ membersPage, setMembersPage ] = useState(true);
  const [ todosPage, setTodosPage ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ searchText, setSearchText ] = useState("");
  const [view, setView] = useState("Grid");
  const [ resourceData, setResourceData ] = useState([]);
  const [ resourceData1, setResourceData1 ] = useState([]);

  const screens = useBreakpoint();

  const [ data, setData]  = useState([]);


  const [ sampleData, setSampleData ] = useState([]);

  useEffect(() =>{
      if (membersPage) {
        console.log("initial loading, fetching data from the Database");
        const fetchingData = async() => {
          try {
            const Data = await fetch(MEMBERS_API, {
              method: "GET",
              headers : {
                "entityid" : "w_123",
                "Content-Type" : "application/json",
              }
            });
            const fetchedData = await Data.json();
            console.log("fetching Data from database is complete");
            console.log("Fetched Data:",fetchedData);
            setData(fetchedData);
          } catch (error){
            console.log("fail in fetching Data");
            console.error("Error while fetching Data",error);
          }
        try {
            const Data = await fetch(RESOURCES_API, {
              method : "GET",
              headers : {
                "entityid" : "w_123",
                "Content-Type" : "application/json"
              }
            });
            const fetchedData = await Data.json();
            console.log("fetching Resource Data from database is complete");
            console.log("Fetched Resource Data:",fetchedData);
            setResourceData1(fetchedData);
          } catch (error){
            console.log("fail in fetching resource Data");
            console.error("Error while fetching resource Data",error);
          } finally {
            setIsLoading(false);
          }
        }
        fetchingData();
      } else if (openCalendarPage) {
          const fetchCalendar = async () => {
            try {
              const calendarData = await fetch(CALENDAR_API + "All/month/"+ dayjs().format("MMM") + "/year/" + dayjs().year(), {
                method : "GET",
                headers : {
                  "entityid" : "w_123",
                  "Content-Type" : "application/json"
                }
              });
              const fetchedCalendarData = await calendarData.json();
              console.log("fetching Calendar Data from database is complete");
              console.log("Fetched Calendar Data:",fetchedCalendarData);
              setSampleData(fetchedCalendarData);
            } catch (error){
              console.log("fail in fetching Calendar Data");
              console.error("Error while fetching Calendar Data",error);
            } finally {
              setIsLoading(false);
            }
          }
          fetchCalendar();
        }
  },[membersPage, openCalendarPage]);

  useEffect(() => {
    setResourceData(resourceData1);
  },[resourceData1]);

  const [ duplicateData, setDuplicateData ] = useState(data);
  const [ commentBox, setCommentBox ] = useState([]);

  useEffect(()=>{
    setDuplicateData(data);
  },[data]);

  const statusCount = data.reduce((acc,item) => {
    acc[item.address[0].city] = (acc[item.address[0].city] || 0) + 1;
    return acc;
  }, {});

  if(!("Hyd" in statusCount)){
    statusCount["Hyd"] = 0;
  };
  if(!("HYD" in statusCount)){
    statusCount["HYD"] = 0;
  };
  if(!("Test City" in statusCount)){
    statusCount["Test City"] = 0;
  };
  if (!("Cancelled" in statusCount)) {
    statusCount["Cancelled"] = 0;
  };


  const legendLabels = {
    "Hyd": "Hyd",
    "HYD": "HYD",
    "Test City": "Test City"
  };
  
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
      title: {
        display: true,
        text: 'Status Distribution',
      },
      legend: {
        position: 'top',
        labels: {
          generateLabels: (chart) => {
            // Customizing the legend labels based on the chart's data
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


  const handleAddNewNameCard = () =>{
  const newRecord = {
    customerName: newRecordName + newRecordLastName,
    phoneNumber: newRecordPhone,                                          
    address: [{
                "country": newRecordCountry,
                "city": newRecordCity,
                "houseNo": "",
                "street1": newRecordAddress,
                "street2": "",
                "state": newRecordState
            }],
    comments:[{
                "author": newRecordName,
                "commentId": "test id 101",
                "message": "test comment 101"
            }],
    status: newRecordStatus,
    subscriptions:[{}],
  }
  const addNewMember = async () => {
    try{
      const response = await fetch(MEMBERS_API, {
        method:"POST",
        headers: {
          "entityid" : "w_123",
          'Content-Type' : "application/json"
        },
        body:JSON.stringify(newRecord)
      })
      const postData = await response.json();
      console.log("postData:",postData);
      const updatedRecord = {
        ...newRecord,
        id: postData.userId
      }
      setDuplicateData(prevData => [...prevData, updatedRecord]);
      } catch (error){
        console.log("unable to add new member",error);
      }
    }
    addNewMember();
    setIsAddNewNameCardModalOpen(false);
  };

  const handleStatusSelection = (value) => {
      setStatusSelection(value);
      setShowDashboard(true);
      if (value === "All"){
        setDuplicateData(data);
        // setResourceData(resourceData1);
        setShowDashboard(false);
      } else {
        const filteredRecords = data.filter(prev => prev.address.some(prev1 => prev1.city === value));
        setDuplicateData(filteredRecords);
      };
  };

  const handleSearchText = (value) => {
    setSearchText(value);
    if (membersPage){
      const filterData = data.filter(prev => (prev.customerName.toLowerCase().includes(value.toLowerCase()) || prev.phoneNumber.includes(value)));
      setDuplicateData(filterData);
    } else {
      const filteredResourceData = resourceData1.filter(prev => (prev.resourceName.toLowerCase().includes(value.toLowerCase()) || prev.phoneNumber.includes(value)));
      setResourceData(filteredResourceData);
    }
  };

  const dropDownList = (
    <select
      value={statusSelection}
      hidden={openCalendarPage || todosPage || resourcePage || isLoading}
      style={{borderRadius:'5px',padding:'5px',margin:'0px 10px',outline:'none',fontSize:'15px'}}
      onChange={(e) => handleStatusSelection(e.target.value)}
    >
      <option value="All">Select City</option>
      <option value="Hyd">Hyd</option>
      <option value="HYD">HYD</option>
      <option value="Test City">Test City</option>
    </select>
  );

  return (
    <div>
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
        <span style={{display:'flex',alignItems:'center',justifyContent:'center',width:'100%'}}>
          <div hidden={isLoading || openCalendarPage}>
            <Button style={membersPage ? {backgroundColor:'#1677ff',color:'azure'}:{}} onClick={() => {setResourcePage(false);setOpenCalendarPage(false);setMembersPage(true);setTodosPage(false);}}><h3>Members</h3></Button>
            <Button style={resourcePage ? {backgroundColor:'#1677ff',color:'azure'}:{}} onClick={()=>{setResourcePage(true);setMembersPage(false);setOpenCalendarPage(false);setTodosPage(false);}}><h3>Resources</h3></Button>
          </div>
          <div style={{paddingRight:'5px'}} hidden={!membersPage && !resourcePage}><Input placeholder='Search Name or Ph no.' value={searchText} onChange={(e) => handleSearchText(e.target.value)}></Input></div>
        </span>
      <Row  style={{width:'100%',backgroundColor:'',gap:'16px',display:'flex',alignItems:'center',justifyContent:'center',margin:'10px'}}>
        <Col hidden={openCalendarPage || todosPage || isLoading} style={{fontSize:'20px'}}>
           <span>{view + " View "}</span>
            <Switch
              // style={{ margin: '0px 10px' }}
              onClick={() => {
                setDataView(dataView === "grid" ? "table" : "grid");
                setView(view === "Grid" ? "List" : "Grid");
              }}
            />
        </Col>
        <Col hidden={openCalendarPage || todosPage || isLoading} style={{fontSize:'20px'}}>
            <span>Show Dashboard </span>
            <Switch
              checked={showDashboard}
              // style={{ margin: '0px 10px' }}
              onClick={() => setShowDashboard(prev => !prev)}
            />
        </Col>
        <Col style={{fontSize:'20px',display:'flex',alignItems:'center',justifyContent:'end'}}>
            <span hidden={openCalendarPage || todosPage || resourcePage || isLoading}>Status:</span> {dropDownList}
        </Col>
      </Row>
      {isLoading ? (<h3><LoadingOutlined/> Loading...</h3>) :
        (membersPage) ? (
          <div>
            {dataView === "table" ? 
              <div className='table-wrapper'>
                <Row className="table-row table-header" style={{width:screens.xl || screens.lg ? '60vw' : ""}}>
                  <Col span={3} className="table-cell">ID</Col>
                  <Col span={5} className="table-cell">Name</Col>
                  <Col span={10} className="table-cell">Address</Col>
                  <Col span={6} className="table-cell">Phone Number</Col>
                </Row>
                {/* Data Rows */}
                {duplicateData.map((item, index) => (
                  <Row key={index} className="table-row" style={{width:screens.xl || screens.lg ? '60vw' : ""}}>
                    <Col span={3} className="table-cell">{item.id}</Col>
                    <Col span={5} className="table-cell">{item.customerName}</Col>
                    <Col span={10} className="table-cell">
                      {`${item.address[0].houseNo}, ${item.address[0].street1}, ${item.address[0].street2}, ${item.address[0].city}, ${item.address[0].state}, ${item.address[0].country}`}
                    </Col>
                    <Col span={6} className="table-cell">{item.phoneNumber}</Col>
                  </Row>
                ))}
                {/* Add New Record */}
                <Row className="table-row add-record-row">
                  <Col span={24} style={{margin:'10px'}}>
                    <center>
                        <Button style={{fontSize:'18px'}} onClick={() => setIsAddNewNameCardModalOpen(true)}>+ Add New Record</Button>
                    </center>
                    </Col>
                </Row>
              {/* <div className='members-table'>
                <Table 
                  columns={columns}
                  dataSource={duplicateData} 
                  pagination={{pageSize:5,simple:true}}
                  footer={()=>(
                    <tr style={{display:'flex',alignItems:'center',justifyContent:'center',height:'10px'}}>
                      <td colSpan={columns.length}>
                        <Button 
                          onClick={()=>setIsAddNewNameCardModalOpen(true)}
                          style={{
                            border:'transparent',
                            fontSize:'40px',
                            backgroundColor:'transparent'
                            }}>+</Button>
                      </td>
                    </tr>
                  )}
                ></Table> </div> */}
              </div>
               : (
              <Row gutter={[16, 16]} className="home-grid">
                {duplicateData.map((item) => (
                  <Col key={item.id} 
                    xs={duplicateData.length <= 1 ? 24 : 12} 
                    sm={duplicateData.length <= 1 ? 24 : 12} 
                    md={duplicateData.length <= 2 ? 20 : 8}
                    lg={duplicateData.length <= 2 ? 20 : 6} 
                    xl={duplicateData.length <= 2 ? 20 : 6}>
                    <NameCard key={item.id}
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
                ))}
                  <Col xs={duplicateData.length <= 1 ? 24 : 12} 
                      sm={duplicateData.length <= 1 ? 24 : 12} 
                      md={duplicateData.length <= 2 ? 20 : 8}
                      lg={duplicateData.length <= 2 ? 20 : 6}
                      xl={duplicateData.length <= 2 ? 20 : 6}
                    className='nameCard'
                    onClick={()=>setIsAddNewNameCardModalOpen(true)}
                    style= {{
                      display:'flex',
                      alignItems:'center',
                      justifyContent:'center',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}>
                    <Button style={{border:'transparent',fontSize:'40px'}}>+</Button>
                  </Col>
              </Row>)}
            <Divider type='horizontal'/>
            {showDashboard && <div style={{width:"100%"}}>
              <Row className='status-track-icons'>
                  <Col className='status-icons'>
                    <span style={{backgroundColor:'pink'}}> {statusCount["HYD"]} </span>
                    <h3>HYD</h3>
                  </Col>
                  <Col className='status-icons'>
                    <span style={{backgroundColor:'lightBlue'}}> {statusCount["Hyd"]} </span>
                    <h3>Hyd</h3>
                  </Col>
                  <Col className='status-icons'>
                    <span style={{backgroundColor:'lightgreen'}}> {statusCount["Test City"]} </span>
                    <h3>Test City</h3>
                  </Col>
                  <Col className='status-icons'>
                    <span style={{backgroundColor:'rgba(256,0,0,0.7)'}}> {statusCount["Cancelled"]} </span>
                    <h3>Cancelled</h3>
                  </Col>
              </Row>
              <Col style={{paddingTop:'0px'}}>
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
              onCancel={()=> setIsAddNewNameCardModalOpen(false)}
              footer={null}
              >
              <AddNewNameCard
                setNewRecordName={setNewRecordName}
                setNewRecordLastName={setNewRecordLastName}
                setNewRecordPhone={setNewRecordPhone}
                setNewRecordAddress={setNewRecordAddress}
                setNewRecordCity={setNewRecordCity}
                setNewRecordState={setNewRecordState}
                setNewRecordCountry={setNewRecordCountry}
                setNewRecordStatus={setNewRecordStatus}
                newRecordStatus={newRecordStatus}
                handleAddNewNameCard={handleAddNewNameCard}
                membersPage={true}
                />
            </Modal>
          </div>
        ) : (resourcePage ? 
        <ResourcePage 
          resourceData={resourceData}
          setResourceData={setResourceData}
          dataView={dataView}
          setDuplicateData = {setDuplicateData}
          commentBox = {commentBox}
          setCommentBox = {setCommentBox}
        /> :openCalendarPage ? 
        <CalendarPage 
          sampleData={sampleData} 
          setSampleData={setSampleData} 
          duplicateData={duplicateData} 
          resourceData={resourceData} 
          /> : <TodosPage sampleData={sampleData}/>)}
        <Divider type='horizontal'/>
        {<Footer/>}
      </div>
    </div>
  );
}

export default CmtApp;