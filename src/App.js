import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import NameCard from './NameCard';
import Header from './Header';
import Footer from './Footer';
import ResourcePage from './ResourcePage';
import TodosPage from "./TodosPage";
import AddNewNameCard from './AddNewNameCard';
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
  const [ resourceData, setResourceData ] = useState([]);
  const [ data, setData]  = useState([]);

  const [ sampleData, setSampleData ] = useState();

  useEffect(() =>{
    console.log("initial loading, fetching data from the Database");
    // if(isInitialLoad.current){
      const fetchingData = async() => {
        try{
          const Data = await fetch("https://7mw76m35e8.execute-api.us-east-2.amazonaws.com/users");
          const fetchedData = await Data.json();
          console.log("fetching Data from database is complete");
          console.log("Fetched Data:",fetchedData);
          setData(fetchedData);
        }catch(error){
          console.log("fail in fetching Data");
          console.error("Error while fetching Data",error);
        }
        try{
          const calendarData = await fetch("https://nrv8108ak6.execute-api.us-east-2.amazonaws.com/Calendar/user/ABC123/month/March/year/2025/");
          const fetchedCalendarData = await calendarData.json();
          console.log("fetching Calendar Data from database is complete");
          console.log("Fetched Calendar Data:",fetchedCalendarData);
          setSampleData(fetchedCalendarData);
        }catch(error){
          console.log("fail in fetching Calendar Data");
          console.error("Error while fetching Calendar Data",error);
        }
        try{
          const Data = await fetch("https://yk216g0lxb.execute-api.us-east-2.amazonaws.com/resources");
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

  const newRecord = {
    customerId:parseInt(data.length) + 10,
    customerName: newRecordName,
    phonenumber: newRecordPhone,                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
    address: newRecordAddress || [{}],
    status: newRecordStatus,
    comments:[{}],
  }
  const handleAddNewNameCard = () =>{
    setDuplicateData(prevData => [...prevData, newRecord]);
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
    <div className='app'>
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
          setOpenCalendarPage={setOpenCalendarPage}
          setMembersPage={setMembersPage}
          setResourcePage={setResourcePage}
          setTodosPage={setTodosPage}
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
              <div className='table'>
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
              <div className='grid'>
                {duplicateData.map((item) => (
                    <NameCard key={item.id}
                      customerId={item.id}
                      customerName={item.customerName}
                      phoneNumber={item.phoneNumber}
                      address={item.address}
                      status={item.status}
                      comments={item.comments}
                      subscriptions={item.subscriptions}
                      setDuplicateData={setDuplicateData}
                      commentBox = {commentBox}
                      setCommentBox = {setCommentBox}
                      />
                ))}
                  <div
                    className={dataView === "grid" ? 'nameCard' : 'table'}
                    onClick={()=>setIsAddNewNameCardModalOpen(true)}
                    style= {{
                      display:'flex',
                      alignItems:'center',
                      justifyContent:'center',
                    }}>
                    <Button style={{border:'transparent',fontSize:'40px'}}>+</Button>
                  </div>
              </div>)}
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
              <Row className='graph'>
                <Col>
                  <Bar data={graphData} options={options} height="300px" width="400px"  ></Bar> 
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
    </div>
  );
}

export default App;
