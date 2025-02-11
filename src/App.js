import React, { useEffect, useState } from 'react';
import './App.css';
import NameCard from './NameCard';
import Header from './Header';
import Footer from './Footer';
import AddNewNameCard from './AddNewNameCard';
import { Badge, Button, Col, Divider, Modal, Drawer, Space, Card, Row, Table, } from "antd";
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { InboxOutlined } from '@ant-design/icons';

// Registering necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function App() {

  const [ isAddNewNameCardModalOpen, setIsAddNewNameCardModalOpen ] = useState(false);
  const [ dataView, setDataView ] = useState("grid");
  const [ newRecordName, setNewRecordName ] = useState('');
  const [ newRecordPhone, setNewRecordPhone ] = useState('');
  const [ newRecordAddress, setNewRecordAddress ] = useState('');
  const [ newRecordStatus, setNewRecordStatus ] = useState("New");
  const [ statusSelection, setStatusSelection ] = useState("All");
  const [ hideDashboard, setHideDashboard ] = useState(false);
  const [ handleInboxDrawer, setHandleInboxDrawer ] = useState(false);

  const [ data, setData]  = useState([]);

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
      style={{borderRadius:'5px',padding:'5px',marginRight:'10px'}}
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
        />
        <div style={{position:'absolute',top:'130px',right:'50px'}}>
          <Badge count={commentBox.length}>
            <Button icon={<InboxOutlined/>} style={{fontSize:'20px'}} onClick={() => setHandleInboxDrawer(true)}>Inbox</Button>
          </Badge>
        </div>
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
                Address={item.Address}
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
            <Bar data={graphData} options={options} height="300px" width="400px"  ></Bar> 
          </Col>
          <Col>
            <Divider type='vertical' style={{height:250,backgroundColor:'black'}}></Divider>
          </Col>
          <Col>
            <Pie data={graphData} options={options}></Pie>
          </Col>
        </Row>
      </div>
      <Drawer
          open={handleInboxDrawer}
          title="Inbox"
          onClose={() => setHandleInboxDrawer(false)}
        >
        {commentBox.map((item) => (
          <Space
              direction="vertical"
              size="middle"
              style={{
                width: '100%',
              }}
            >
            <Badge.Ribbon text={item.Name} color={item.color}>
                <Card title={item.Name} size="small">
                  {item.comment[item.comment.length - 1]}
                </Card>
            </Badge.Ribbon>
          </Space>
        ))}
        </Drawer>
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
