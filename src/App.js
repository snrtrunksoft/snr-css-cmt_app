import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import NameCard from './NameCard';
import Header from './Header';
import Footer from './Footer';
import ResourcePage from './ResourcePage';
import TodosPage from "./TodosPage";
import AddNewNameCard from './AddNewNameCard';
import InventoryApp from "./InventoryApp/InventoryApp";
import { Button, Col, Divider, Input, Modal, Row, Table, } from "antd";
import CalendarPage from "./CalendarPage";
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { LoadingOutlined } from '@ant-design/icons';

// Registering necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function App() {

  const [ isAddNewNameCardModalOpen, setIsAddNewNameCardModalOpen ] = useState(false);
  const [ dataView, setDataView ] = useState("grid");
  // const [ isInitialLoad, setIsInitialLoad ] = useRef(true);
  const [ newRecordName, setNewRecordName ] = useState('');
  const [ newRecordPhone, setNewRecordPhone ] = useState('');
  const [ newRecordAddress, setNewRecordAddress ] = useState('');
  const [ newRecordStatus, setNewRecordStatus ] = useState("New");
  const [ statusSelection, setStatusSelection ] = useState("All");
  const [ hideDashboard, setHideDashboard ] = useState(false);
  const [ openCalendarPage, setOpenCalendarPage ] = useState(false);
  const [ resourcePage, setResourcePage ] = useState(false);
  const [ membersPage, setMembersPage ] = useState(true);
  const [ todosPage, setTodosPage ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ searchText, setSearchText ] = useState("");
  const [ openShoppingApp, setOpenShoppingApp ] = useState(false);
  const [ resourceData, setResourceData ] = useState([
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
  const [ data, setData]  = useState([
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


  const [ sampleData, setSampleData ] = useState([

    {
      "month": "April",
      "year": "2025",
      "userId": "ABC123",
      "date":"25",
      "events":[{
          "memberId": "ABC123",
          "resourceId": "R_2",
          "date": "25",
          "year": "2025",
          "month": "March",
          "from": "02",
          "to": "03",
          "recurring":"weekly",
          "day":"Fri",
          "title": "Test title2",
          "notes": "Appointment for dentist"
        },]
    },
  ]);

  useEffect(() =>{
    console.log("initial loading, fetching data from the Database");
    // if(isInitialLoad.current){
      const fetchingData = async() => {
        try{
          const Data = await fetch("https://kh9zku31eb.execute-api.us-east-1.amazonaws.com/dev/users");
          const fetchedData = await Data.json();
          console.log("fetching Data from database is complete");
          console.log("Fetched Data:",fetchedData);
          setData(fetchedData);
        }catch(error){
          console.log("fail in fetching Data");
          console.error("Error while fetching Data",error);
        }
        try{
          const calendarData = await fetch("https://pliol7eyw7.execute-api.us-east-1.amazonaws.com/dev/calendar/user/lakshmi/month/March/year/2024");
          const fetchedCalendarData = await calendarData.json();
          console.log("fetching Calendar Data from database is complete");
          console.log("Fetched Calendar Data:",fetchedCalendarData);
          setSampleData(fetchedCalendarData);
        }catch(error){
          console.log("fail in fetching Calendar Data");
          console.error("Error while fetching Calendar Data",error);
        }
        try{
          const Data = await fetch("https://bws4su8xog.execute-api.us-east-1.amazonaws.com/dev/resources");
          const fetchedData = await Data.json();
          console.log("fetching Resource Data from database is complete");
          console.log("Fetched Resource Data:",fetchedData);
          setResourceData(fetchedData);
        }catch(error){
          console.log("fail in fetching resource Data");
          console.error("Error while fetching resource Data",error);
        }
        finally{
          setIsLoading(false);
        }
      }
      fetchingData();
      // isInitialLoad.current = false;
    // }
  },[]);

  const [ duplicateData, setDuplicateData ] = useState(data);
  const [ commentBox, setCommentBox ] = useState([]);

  console.log("comment Box:",commentBox);
  console.log("data:",duplicateData);

  useEffect(()=>{
    setDuplicateData(data);
  },[data]);

  const statusCount = data.reduce((acc,item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});
  console.log(statusCount);

  if(!("New" in statusCount)){
    statusCount["New"] = 0;
  };
  if(!("In-progress" in statusCount)){
    statusCount["In_Progress"] = 0;
  };
  if(!("Complete" in statusCount)){
    statusCount["Complete"] = 0;
  };
  if (!("Cancelled" in statusCount)) {
    statusCount["Cancelled"] = 0;
  };

  console.log("StatusCount:",statusCount);

  const legendLabels = {
    "New": "New Status",
    "In_Progress": "In Progress Status",
    "Complete": "Completed Status"
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

  const columns = [
    {
      title:'Name',
      dataIndex :'customerName',
      key:'customerName',
      render: (text) => <a>{text}</a>,
    },
    {
      title:'Phone',
      dataIndex:'phoneNumber',
      key:'phoneNumber',
    },
    {
      title:'Address',
      dataIndex:"address",
      key:'address',
      render: (address) => {
        return (
          <div
            style={{
              maxHeight: '60px', // Limit the height
              overflow: 'hidden', // Hide overflow content
              textOverflow: 'ellipsis', // Optional: show ellipsis if text overflows
              display: 'inline-block', // Ensure it behaves like a block element
              whiteSpace:'nowrap'
            }}
          >
            {Object.keys(address[0]).map((key, index) => (
              <div key={index}>
                {address[0][key]}
              </div>
            ))}
          </div>
        );
      },

    },
    {
      title:'Status',
      dataIndex:'status',
      key:'status',
      sorter: (a, b) => a.status.localeCompare(b.status),  // Sorting by status alphabetically
      sortDirections: ['ascend','descend'],
    },
  ]

  const handleAddNewNameCard = () =>{
  const newRecord = {
    id:parseInt(data.length) + 10,
    customerName: newRecordName,
    phoneNumber:newRecordPhone,                                                                                    
    address: newRecordAddress || [{}],
    comments:[{}],
    status: newRecordStatus,
    subscriptions:[{}],
    status:"Active",
  }
  const addNewMember = async () => {
    try{
      const response = await fetch("https://kh9zku31eb.execute-api.us-east-1.amazonaws.com/dev/users",{
        method:"POST",
        headers: {
          'Content-Type' : "application/json"
        },
        body:JSON.stringify(newRecord)
      })
      const postData = await response.json();
      console.log("postData:",postData);
      const updatedRecord = {
        ...newRecord,
        id:postData.userId
      }
      .then(responce => responce.json())
      .then(data => console.log("Member is added:",data))
      setDuplicateData(prevData => [...prevData, updatedRecord]);
      }catch(error){
        console.log("unable to add new member",error);
      }
    }
    addNewMember();
    setIsAddNewNameCardModalOpen(false);
  };

  const handleStatusSelection = (value) =>{
      setStatusSelection(value);
      setHideDashboard(true);
      if(value === "All"){
        setDuplicateData(data);
        setHideDashboard(false);
      }else{
        const filteredRecords = data.filter((prev)=> prev.status === value);
        setDuplicateData(filteredRecords);
      };
  };

  const handleSearchText = (value) => {
    setSearchText(value);
    const filterData = data.filter(prev => (prev.customerName.toLowerCase().includes(value.toLowerCase()) || prev.phoneNumber.includes(value)));
    setDuplicateData(filterData);
  };

  const dropDownList = (
    <select
      value={statusSelection}
      style={{borderRadius:'5px',padding:'5px',margin:'0px 10px',outline:'none'}}
      onChange={(e) => handleStatusSelection(e.target.value)}
    >
      <option value="All">All</option>
      <option value="New">New</option>
      <option value="In_Progress">In-progress</option>
      <option value="Complete">Complete</option>
      <option value="Cancelled">Cancelled</option>
    </select>
  );

  return (
    <div>
      {openShoppingApp ? <InventoryApp setOpenShoppingApp={setOpenShoppingApp}/>:
      <div className='home_app'>
        <Header 
          dropDownList={dropDownList} 
          dataView={dataView} 
          setDataView={setDataView} 
          setHideDashboard={setHideDashboard} 
          hideDashboard={hideDashboard}
          commentBox={commentBox}
          membersPage={membersPage}
          openCalendarPage={openCalendarPage}
          todosPage={todosPage}
          resourcePage={resourcePage}
          openShoppingApp={openShoppingApp}
          setOpenCalendarPage={setOpenCalendarPage}
          setMembersPage={setMembersPage}
          setResourcePage={setResourcePage}
          setTodosPage={setTodosPage}
          setOpenShoppingApp={setOpenShoppingApp}
          />
        <span style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%'}}>
          <div hidden={isLoading}>
            <Button style={membersPage ? {backgroundColor:'#1677ff',color:'azure'}:{}} onClick={() => {setResourcePage(false);setOpenCalendarPage(false);setMembersPage(true);setTodosPage(false);}}><h3>Members</h3></Button>
            <Button style={resourcePage ? {backgroundColor:'#1677ff',color:'azure'}:{}} onClick={()=>{setResourcePage(true);setMembersPage(false);setOpenCalendarPage(false);setTodosPage(false);}}><h3>Resources</h3></Button>
          </div>
          <div style={{paddingRight:'5px'}} hidden={!membersPage}><Input placeholder='Search Name or Ph no.' value={searchText} onChange={(e) => handleSearchText(e.target.value)}></Input></div>
        </span>
      {isLoading ? (<h3><LoadingOutlined/> Loading...</h3>) :
        (membersPage) ? (
          <div>
            {dataView === "table" ? (
              <div className='members-table'>
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
                ></Table>
              </div>) : (
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
                    className={dataView === "grid" ? 'nameCard' : 'table'}
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
            <div style={{width:"100%"}} hidden={hideDashboard}>
              <Row className='status-track-icons'>
                  <Col className='status-icons'>
                    <span style={{backgroundColor:'pink'}}> {statusCount["New"]} </span>
                    <h3>New</h3>
                  </Col>
                  <Col className='status-icons'>
                    <span style={{backgroundColor:'lightBlue'}}> {statusCount["In_Progress"]} </span>
                    <h3>In_progress</h3>
                  </Col>
                  <Col className='status-icons'>
                    <span style={{backgroundColor:'lightgreen'}}> {statusCount["Complete"]} </span>
                    <h3>Completed</h3>
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
            </div>
            <Modal
              title="AddNewNameCard"
              open={isAddNewNameCardModalOpen}
              onCancel={()=>setIsAddNewNameCardModalOpen(false)}
              footer={null}
              >
              <AddNewNameCard
                data={data}
                setNewRecordName={setNewRecordName}
                setNewRecordPhone={setNewRecordPhone}
                // setNewRecordAge={setNewRecordAge}
                setNewRecordAddress={setNewRecordAddress}
                setNewRecordStatus={setNewRecordStatus}
                newRecordStatus={newRecordStatus}
                setIsAddNewNameCardModalOpen={setIsAddNewNameCardModalOpen}
                handleAddNewNameCard={handleAddNewNameCard}
                />
            </Modal>
          </div>
        ) : (resourcePage ? 
        <ResourcePage 
          resourceData={resourceData}
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
      </div>}
    </div>
  );
}

export default App;
