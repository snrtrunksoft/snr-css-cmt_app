import React from "react";
import "./NameCard.css";
import { Row,Col } from "antd";

const NameCard = ({ Name, Phone, Address, Status, dataView }) => {
    return(
        <div>
            {dataView === "grid" ? (<div className="nameCard">
            <h3>Name : { Name }</h3>
            <p>Phone : { Phone }</p>
            <p>Address : { Address }</p>
            <p>Status : { Status }</p>
        </div>) : (
            <Row gutter={[10, 10]} className="list-item">
                 <Col span={5}>{Name}</Col>
                 <Col span={5}>{Phone}</Col>
                 <Col span={5}>{Address}</Col>
                 <Col span={5}>{Status}</Col>
            </Row>
        )}
        </div>
    )
}

export default NameCard;