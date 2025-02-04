import React, { useState } from 'react';
import './App.css';
import NameCard from './NameCard';
import AddNewNameCard from './AddNewNameCard';
import { Button, Modal } from "antd";
import { SwapOutlined } from "@ant-design/icons";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registering necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {

  const [ isAddNewNameCardModalOpen, setIsAddNewNameCardModalOpen ] = useState(false);
  const [ dataView, setDataView ] = useState("grid");
  const [ newRecordName, setNewRecordName ] = useState('');
  const [ newRecordPhone, setNewRecordPhone ] = useState('');
  const [ newRecordAddress, setNewRecordAddress ] = useState('');
  const [ newRecordStatus, setNewRecordStatus ] = useState("New");



  const [ data, setData]  = useState([
      { id: 1, Name: "Name 1", Phone:"9700xxx", Address:'home 1', Status: "In-progress" },
      { id: 2, Name: "Name 2", Phone:"9767xxx", Address:'home 2', Status: "New" },
      { id: 3, Name: "Name 3", Phone:"9993xxx", Address:'home 3', Status: "Complete" },
      { id: 4, Name: "Name 4", Phone:"8324xxx", Address:'home 4', Status: "New" },
      { id: 5, Name: "Name 5", Phone:"6304xxx", Address:'home 5', Status: "New" },
      { id: 6, Name: "Name 6", Phone:"8121xxx", Address:'home 6', Status: "Complete" },
  ]);

  const statusCount = data.reduce((acc,item) => {
    acc[item.Status] = (acc[item.Status] || 0) + 1;
    return acc;
  }, {});

  console.log("StatusCount:",statusCount);
  
  const BarGraphData = {
    labels: Object.keys(statusCount),
    datasets: [
        {
          label: 'Status Count',
          data: Object.values(statusCount),
          backgroundColor: ['#FF5733', '#4CAF50', '#00B0FF'],
          borderColor: ['#FF5733', '#4CAF50', '#00B0FF'],
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
    },
  };

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

  return (
    <div className="app">
      <div >
        <Bar data={BarGraphData} options={options} height="300px" width="400px"></Bar>
      </div>
      <div className={dataView === "grid" ? "grid" : "list"}>
        {data.map((item) => (
          <NameCard key={item.id}
            Name={item.Name}
            Phone={item.Phone}
            Address={item.Address}
            Status={item.Status}
            dataView={dataView}
            />
        ))}
          <div
            className= { dataView === "grid" ? 'nameCard' : 'list-item'}
            onClick={()=>setIsAddNewNameCardModalOpen(true)}
            style= {{
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
            }}>
            <Button style={{border:'transparent',fontSize:'40px'}}>+</Button>
          </div>
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
      <div 
        className='fixed-div' 
        onClick={()=>{ dataView === "grid" ? setDataView("list") : setDataView("grid")}}
        >
        Switch View {<SwapOutlined/>}
        </div>
    </div>
  );
}

export default App;
