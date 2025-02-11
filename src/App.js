import React, { useEffect, useState } from 'react';
import './App.css';
import NameCard from './NameCard';
import Header from './Header';
import Footer from './Footer';
import AddNewNameCard from './AddNewNameCard';
import { Button, Col, Divider, Modal, Row, Steps, Table, } from "antd";
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Registering necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function App() {

  const [ isAddNewNameCardModalOpen, setIsAddNewNameCardModalOpen ] = useState(false);
  const [current, setCurrent] = useState(0);
  const [ dataView, setDataView ] = useState("grid");
  const [ newRecordName, setNewRecordName ] = useState('');
  const [ newRecordPhone, setNewRecordPhone ] = useState('');
  const [ newRecordAddress, setNewRecordAddress ] = useState('');
  const [ newRecordStatus, setNewRecordStatus ] = useState("New");
  const [ statusSelection, setStatusSelection ] = useState("All");
  const [ hideDashboard, setHideDashboard ] = useState(false);

  const [ data, setData]  = useState([
      { id: 1, Name: "Test User 1", Phone:"9700697999", Age:20, Address: {
        street1: 'test address st1',
        stree2: 'test address st1',
        aptNo: '1234',
        city: 'Austin',
        state: 'Tx',
        Country: 'USA',
      }, Status: "New",Comments:["hii1","Hello"] },
      { id: 2, Name: "Test User 2", Phone:"9767203040", Age:24, Address: {
        street1: 'test address st2',
        stree2: 'test address st2',
        aptNo: '2235',
        city: 'Dallas',
        state: 'Tx',
        Country: 'USA',
      }, Status: "In-progress",Comments:["hii2"] },
      { id: 3, Name: "Test User 3", Phone:"9992344760", Age:14, Address: {
        street1: 'test address st3',
        stree2: 'test address st3',
        aptNo: '3236',
        city: 'Boston',
        state: 'Tx',
        Country: 'USA',
      }, Status: "Complete",Comments:["hii3"] },
      { id: 4, Name: "Test User 4", Phone:"8324940232", Age:25, Address: {
        street1: 'test address st4',
        stree2: 'test address st4',
        aptNo: '4237',
        city: 'Houston',
        state: 'Tx',
        Country: 'USA',
      }, Status: "New",Comments:["hii4"] },
      { id: 5, Name: "Test User 5", Phone:"6304904959", Age:28, Address: {
        street1: 'test address st5',
        stree2: 'test address st5',
        aptNo: '5238',
        city: 'Florida',
        state: 'Tx',
        Country: 'USA',
      }, Status: "New",Comments:["hii5"] },
      { id: 6, Name: "Test User 6", Phone:"8121223412", Age:35, Address: {
        street1: 'test address st6',
        stree2: 'test address st6',
        aptNo: '6239',
        city: 'Forth Worh',
        state: 'Tx',
        Country: 'USA',
      }, Status: "Complete",Comments:["hii6"] },
      {id: 7, Name: "Test User 7", Phone:"6304904959", Age:28, Address: {
        street1: 'test address st1',
        stree2: 'test address st1',
        aptNo: '1234',
        city: 'Austin',
        state: 'Tx',
        Country: 'USA',
      }, Status: "Cancelled",Comments:["hii5"] },
      { id: 8, Name: "Test User 8", Phone:"8121223412", Age:35, Address: {
        street1: 'test address st1',
        stree2: 'test address st1',
        aptNo: '1234',
        city: 'Austin',
        state: 'Tx',
        Country: 'USA',
      }, Status: "Cancelled",Comments:["hii6"] }
  ]);

  const [ duplicateData, setDuplicateData ] = useState(data);
  const [ commentBox, setCommentBox ] = useState([]);

  console.log("comment Box:",commentBox);

  useEffect(()=>{
    setDuplicateData(data);
  },[data]);

  const statusCount = data.reduce((acc,item) => {
    acc[item.Status] = (acc[item.Status] || 0) + 1;
    return acc;
  }, {});

  const stepsData = Object.keys(statusCount).map((status) => ({
    title: `${status} (${statusCount[status]})`,
    description: `${statusCount[status]} ${status} items`,
  }));

  if(!("New" in statusCount)){
    statusCount["New"] = 0;
  };
  if(!("In-progress" in statusCount)){
    statusCount["In-progress"] = 0;
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
    "In-progress": "In Progress Status",
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
      dataIndex :'Name',
      key:'Name',
      render: (text) => <a>{text}</a>,
    },
    {
      title:'Phone',
      dataIndex:'Phone',
      key:'Phone',
    },
    {
      title:'Age',
      dataIndex:'Age',
      key:'Age',
      sorter: (a, b) => a.Age - b.Age,
      sortDirections : ['ascend', 'descend'],
    },
    {
      title:'Address',
      dataIndex:'Address',
      key:'Address',
    },
    {
      title:'Status',
      dataIndex:'Status',
      key:'Status',
      sorter: (a, b) => a.Status.localeCompare(b.Status),  // Sorting by status alphabetically
      sortDirections: ['ascend','descend'],
    },
  ]

  const newRecord = {
    id: parseInt(data[data.length - 1]['id']) + 1,
    Name: newRecordName,
    Phone: newRecordPhone,
    Address: newRecordAddress,
    Status: newRecordStatus
  }
  const handleAddNewNameCard = () =>{
    setData(prevData => [...prevData, newRecord]);
    setIsAddNewNameCardModalOpen(false);
  };

  const handleStatusSelection = (value) =>{
    setStatusSelection(value);
    setHideDashboard(true);
    if(value === "All"){
      setDuplicateData(data);
      setHideDashboard(false);
    }else{
      const filteredRecords = data.filter((prev)=> prev.Status === value);
      setDuplicateData(filteredRecords);
    };
  };

  const dropDownList = (
    <select
      value={statusSelection}
      style={{borderRadius:'5px',padding:'5px',margin:'0px 10px',outline:'none'}}
      onChange={(e) => handleStatusSelection(e.target.value)}
    >
      <option value="All">All</option>
      <option value="New">New</option>
      <option value="In-progress">In-progress</option>
      <option value="Complete">Complete</option>
      <option value="Cancelled">Cancelled</option>
    </select>
  );

  return (
    <div className="app">
      <Header 
        dropDownList={dropDownList} 
        dataView={dataView} 
        setDataView={setDataView} 
        setHideDashboard={setHideDashboard} 
        hideDashboard={hideDashboard}
        commentBox={commentBox}
        />

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
                Id={item.id}
                Name={item.Name}
                Phone={item.Phone}
                Age={item.Age}
                address={item.Address}
                Status={item.Status}
                comments={item.Comments}
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
        <Row className='graph'>
          <Col>
            {/* <Pie data={graphData} options={options}></Pie> */}
            <Steps
              width="100%"
              current={current}
              items={stepsData}
            />
            <center>
              <Button style={{marginTop:'40px'}} onClick={() => setCurrent((prev) => (prev + 1) % stepsData.length)}>
                Next Step
              </Button>
            </center>
          </Col>
          <Col>
            <Divider type='vertical' style={{height:250,backgroundColor:'black'}}></Divider>
          </Col>
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
          setNewRecordAddress={setNewRecordAddress}
          setNewRecordStatus={setNewRecordStatus}
          newRecordStatus={newRecordStatus}
          setIsAddNewNameCardModalOpen={setIsAddNewNameCardModalOpen}
          handleAddNewNameCard={handleAddNewNameCard}
          />
      </Modal>
      <Divider type='horizontal'/>
      {<Footer/>}
    </div>
  );
}

export default App;
