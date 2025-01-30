import React, { useState } from 'react';
import './App.css';
import NameCard from './NameCard';
import AddNewNameCard from './AddNewNameCard';
import { Button, Modal } from "antd";
import { SwapOutlined } from "@ant-design/icons";

function App() {

  const [ isAddNewNameCardModalOpen, setIsAddNewNameCardModalOpen ] = useState(false);
  const [ dataView, setDataView ] = useState("grid");
  const [ newRecordId, setNewRecordID ] = useState(null);
  const [ newRecordName, setNewRecordName ] = useState('');
  const [ newRecordPhone, setNewRecordPhone ] = useState('');
  const [ newRecordAddress, setNewRecordAddress ] = useState('');
  const [ newRecordStatus, setNewRecordStatus ] = useState('');



  const [ data, setData]  = useState([
      { id: 1, Name: "Name 1", Phone:"9700xxx", Address:'home 1', Status: "This is the first" },
      { id: 2, Name: "Name 2", Phone:"9767xxx", Address:'home 2', Status: "This is the second" },
      { id: 3, Name: "Name 3", Phone:"9993xxx", Address:'home 3', Status: "This is the third" },
      { id: 4, Name: "Name 4", Phone:"8324xxx", Address:'home 4', Status: "This is the fourth" },
      { id: 5, Name: "Name 5", Phone:"6304xxx", Address:'home 5', Status: "This is the fifth" },
      { id: 6, Name: "Name 6", Phone:"8121xxx", Address:'home 6', Status: "This is the sixth" },
  ]);

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
          setNewRecordID={setNewRecordID}
          setNewRecordName={setNewRecordName}
          setNewRecordPhone={setNewRecordPhone}
          setNewRecordAddress={setNewRecordAddress}
          setNewRecordStatus={setNewRecordStatus}
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
