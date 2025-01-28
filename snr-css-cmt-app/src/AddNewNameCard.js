import { Form, Input } from "antd";
import React from "react";
const AddNewNameCard = () =>{

    return(
        <div>
            <form>
                <h2>Name : <input/></h2>
                <h2>Phone : <input/></h2>
                <h2>Address : <input/></h2>
                <h2>Status : <input/></h2>
            </form>
        </div>
    );
};

export default AddNewNameCard;