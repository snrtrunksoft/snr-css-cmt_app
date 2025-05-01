import React, { useState } from "react";
import { Row,Col,Button } from "antd";
import { useForm } from 'react-hook-form';

export const AddNewCategory = ({data,setNewCategoryName,setIsAddNewCategoryModelOpen,handleAdd}) =>{
    const {register,reset} = useForm();

    const handleReset = () =>{
        reset();
    };

    const handleChange = (categoryName)=>{
        setNewCategoryName(categoryName);
    };
    return(
        <div>
            {data?(<div>
                <Row>
                    <Col>
                        <h2>Category Name :</h2>
                    </Col>
                    <Col style={{marginLeft:'5px'}}>
                        <form >
                            <input 
                                type="text" {...register('name')}
                                onChange={(e)=>handleChange(e.target.value)}
                                style={{border:'2px solid transparent',outline:'none',fontSize:'20px'}}
                                placeholder="Enter Category"
                            />
                        </form>
                    </Col>
                </Row>
                <Row style={{display:'flex',alignItems:'flex-end',justifyContent:'flex-end'}}>
                    <Button 
                        onClick={()=>{setIsAddNewCategoryModelOpen(false);handleReset();}}
                        style={{margin:'0px 5px',border:'1px solid black',backgroundColor:'transparent',color:"black"}}>Cancel</Button>
                    <Button type="primary" onClick={()=>{handleAdd();setIsAddNewCategoryModelOpen(false);handleReset();}}>Add</Button>
                </Row>
            </div>
            ):('loading...')}
        </div>
    );
};