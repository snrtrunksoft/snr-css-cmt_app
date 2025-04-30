import React from "react";
import "./AddNewNameCard.css";
import { Row, Col, Button } from "antd";
import { useForm } from "react-hook-form";

const AddNewNameCard = ({ 
    data,
    setNewRecordName,
    setNewRecordPhone,
    // setNewRecordAge,
    setNewRecordAddress,
    setNewRecordStatus,
    newRecordStatus,
    setIsAddNewNameCardModalOpen,
    handleAddNewNameCard,
    }) => {

    const { register, reset } = useForm();

    const handleReset = () => {
        reset();
        setNewRecordName("");
        setNewRecordPhone("");
        // setNewRecordAge("")
        setNewRecordAddress("");
        setNewRecordStatus("New");
    };

    const dropDownList = (
        <select
            value={newRecordStatus}
            style={{borderRadius:'5px',padding:'5px'}}
            onChange={(e) => setNewRecordStatus(e.target.value)}
            >
            <option value="New">New</option>
            <option value="In-progress">In-progress</option>
            <option value="Complete">Complete</option>
        </select>
    );

    return(
        <div>
            <form>
                {/* <Row>
                    <h2>Id : {parseInt(data[data.length - 1]['id']) + 1}</h2>
                </Row> */}
                <Row>
                    <Col>
                        <h2>Name : </h2>
                    </Col>
                    <Col>
                        <h2><input
                            type="text" {...register("name")}
                            onChange={(e) => {setNewRecordName(e.target.value)}}
                        /></h2>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h2>Phone : </h2>
                    </Col>
                    <Col>
                        <h2><input
                            type="number" {...register("phone")}
                            onChange={(e) => {setNewRecordPhone(e.target.value)}}
                        /></h2>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h2>Age : </h2>
                    </Col>
                    {/* <Col>
                        <h2><input
                            type="number" {...register("Age")}
                            onChange={(e) => {setNewRecordAge(e.target.value)}}
                        /></h2>
                    </Col> */}
                </Row>
                <Row>
                    <Col>
                        <h2>Address : </h2>
                    </Col>
                    <Col>
                        <h2><input {...register('Address')}
                            onChange={(e) => {setNewRecordAddress(e.target.value)}}
                        /></h2>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h2>Status : </h2>
                    </Col>
                    <Col>
                        <h2>{dropDownList}</h2>
                    </Col>
                </Row>
                <Row style={{display:'flex',alignItems:'flex-end',justifyContent:'flex-end'}}>
                    <Button 
                        onClick={()=>{handleReset();setIsAddNewNameCardModalOpen(false)}}
                        style={{margin:'0px 5px',border:'1px solid black',backgroundColor:'transparent',color:"black"}}
                        >Cancel</Button>
                    <Button
                        type="primary"
                        onClick={()=>{
                            handleAddNewNameCard();
                            handleReset();
                        }}>Add</Button>
                </Row>
            </form>
        </div>
    );
};

export default AddNewNameCard;