import React, { useEffect, useState } from "react";
import './AdminViewOrders.css';
import dayjs from 'dayjs';
import { LoadingOutlined } from '@ant-design/icons';
import { GetInvoice } from "./GetInvoice";
import { Row, Col, Input, Checkbox, Divider, DatePicker, Pagination, Button, Modal } from "antd";

export const AdminViewOrders = () => {
  const [rowData, setRowData] = useState([
    {
      id: "10032", //for all we're using id but rest of the checkboxes we're using orderId instead of id
          status: "available",
          phone: "Not Available",
          createdTime: "30/6/2025",
          updatedTime: "25/8/2025",
          placedBy: "sandy@2323",
          totalAmount: "23000",
          // items: order.items.length > 0 ? order.items.join(", ") : "None",
    }
  ]);
  const [filterCriteria, setFilterCriteria] = useState('all');
  const [filterValue, setFilterValue] = useState();
  const [text, setText] = useState("Please select Day");
  const [loading, setLoading] = useState(true);
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ itemsPerPage ] = useState(10);
  const [error, setError] = useState(null);
  const [ isInvoiceModalOpen, setIsInvoiceModalOpen ] = useState(false);
  const [ invoiceData, setInvoiceData ] = useState([]);

  const invoiceFooter = (
  <div 
    style={{display:'flex',alignItems:'center',justifyContent:'center'}}
    ><Button type="primary" onClick={()=>setIsInvoiceModalOpen(false)}>Close</Button>
    </div>
  );

  const handleInvoice = (values) => {
    setIsInvoiceModalOpen(true);
    setInvoiceData(values);
  };

  // Fetch orders data from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Construct the API URL based on filterCriteria and filterValue
        // let apiUrl = "https://ft9zc297k7.execute-api.us-east-2.amazonaws.com/orders/";

        // if (filterCriteria === 'day' && filterValue) {
        //   apiUrl = `https://ft9zc297k7.execute-api.us-east-2.amazonaws.com/orders/daily/${filterValue}`;
        // } else if (filterCriteria === 'month' && filterValue) {
        //   apiUrl = `https://ft9zc297k7.execute-api.us-east-2.amazonaws.com/orders/monthly/${filterValue}`;
        // } else if (filterCriteria === 'year' && filterValue) {
        //   apiUrl = `https://ft9zc297k7.execute-api.us-east-2.amazonaws.com/orders/yearly/${filterValue}`;
        // }
        
        // // Fetch the orders data
        // console.log('fetching orders, apiURL:', apiUrl);
        // const response = await fetch(apiUrl);
        // if (!response.ok) {
        //   throw new Error(`Error fetching orders: ${response.statusText}`);
        // }

        // const data = await response.json();
        // console.log('fetched orders:', data);

        // // Format the fetched data
        // const formattedData = data.map(order => ({
        //   id: order.id || order.orderId, //for all we're using id but rest of the checkboxes we're using orderId instead of id
        //   status: order.status,
        //   phone: order.phone || "Not Available",
        //   createdTime: order.createdTime,
        //   updatedTime: order.updatedTime,
        //   placedBy: order.placedBy,
        //   totalAmount: order.totalAmount,
        //   items: order.items.length > 0 ? order.items.join(", ") : "None",
        // }));

        // // Update rowData with the formatted data
        // setRowData(formattedData);
        // setError(null);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch orders if filterCriteria and filterValue are set
    if (filterCriteria && (filterValue || filterCriteria === 'all')) {
        setLoading(true);
        fetchOrders();
      }
  }, [filterCriteria, filterValue]); // Dependencies: trigger on filterCriteria or filterValue change

  const handleDate = (value) => {
    setFilterCriteria(value);
    setCurrentPage(1);

    let formattedDate;
    const currentDate = dayjs();

    if (value === "day") {
      // Set filterValue for day: 'YYYY-MM-DD'
      formattedDate = currentDate.format('YYYY-MM-DD');
      setText("Please select Day");
    } else if (value === "month") {
      // Set filterValue for month: 'YYYY-MM'
      formattedDate = currentDate.format('YYYY-MM');
      setText("Please select Month");
    } else if (value === "year") {
      // Set filterValue for year: 'YYYY'
      formattedDate = currentDate.format('YYYY');
      setText("Please select Year");
    }

    // Set the formatted date to filterValue state
    setFilterValue(formattedDate);

    console.log('filterValue:', formattedDate); // Check the formatted value
  };

  const handleDateChange = (date) => {
    console.log('date selected:', date);
    console.log('filterCriteria:', filterCriteria);

    let formattedDate;

    if (filterCriteria === 'day') {
      // Format the date as 'YYYY-MM-DD'
      formattedDate = date.format('YYYY-MM-DD');
    } else if (filterCriteria === 'month') {
      // Format the date as 'YYYY-MM'
      formattedDate = date.format('YYYY-MM');
    } else if (filterCriteria === 'year') {
      // Format the date as 'YYYY'
      formattedDate = date.format('YYYY');
    }
    setCurrentPage(1);
    setFilterValue(formattedDate);
    console.log('Formatted date:', formattedDate);
    // Do something with the formatted date (e.g., update state)
  };

  // const handleTitleChange = (index, newTitle) => {
  //   const updatedRows = [...rowData];
  //   updatedRows[index].title = newTitle;
  //   setRowData(updatedRows);
  // };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = rowData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Row style={{ margin: '10px 0px', marginLeft: '30px', display: "flex", alignItems: 'center', justifyContent: 'center' }}>
        <Col >
          <Checkbox checked={filterCriteria === 'all'} style={{ marginRight: '10px' }} onClick={() => handleDate("all")}>All</Checkbox>
          <Checkbox checked={filterCriteria === 'day'} style={{ marginRight: '10px' }} onClick={() => handleDate("day")}>Day</Checkbox>
          <Checkbox checked={filterCriteria === "month"} style={{ marginRight: '10px' }} onClick={() => handleDate('month')}>Month</Checkbox>
          <Checkbox checked={filterCriteria === "year"} onClick={() => handleDate('year')}>Year</Checkbox>
        </Col>
        <Col >
          <Divider type='vertical' style={{ height: 20, backgroundColor: 'black' }} />
        </Col>
        <Col style={{ width: '300px' }}>
          <Row>
            <p style={{ margin: '7px' }}>{text}</p>
            <DatePicker
              disabled={filterCriteria === "all" ? true : false}
              picker={filterCriteria}
              defaultValue={dayjs()}
              onChange={handleDateChange}
            />
          </Row>
        </Col>
      </Row>
      <Row gutter={0} justify="start" className="rowBox-top-vo">
        <Col key="category-id-header" flex="1 1 100px">
          <div className="rowBox-id-vo">Order ID</div>
        </Col>
        <Col key="category-status-header" flex="1 1 100px">
          <div className="rowBox-id-vo">Status</div>
        </Col>
        <Col key="category-phone-header" flex="1 1 100px">
          <div className="rowBox-id-vo">Phone</div>
        </Col>
        <Col key="category-createTime-header" flex="1 1 100px">
          <div className="rowBox-id-vo">Create Time</div>
        </Col>
        <Col key="category-updatedTime-header" flex="1 1 100px">
          <div className="rowBox-id-vo">Update Time</div>
        </Col>
        <Col key="category-placedBy-header" flex="1 1 100px">
          <div className="rowBox-id-vo">Placed By</div>
        </Col>
        <Col key="category-orderAmount-header" flex="1 1 100px">
          <div className="rowBox-id-vo-end">Order Amount</div>
        </Col>
        <Col className="rowBox-end-col">
          <Button disabled>Get Invoice</Button>
        </Col>
      </Row>
      {loading ? (
        <p style={{ marginTop: '20px' }}>{<LoadingOutlined />} Loading</p>
      ) : error ? ( 
          <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div>
          {rowData.length === 0 ? (<h2 style={{marginTop:'20px'}}>No Order found for this date</h2>) : (
          <div>
            {currentItems.map((row, index) => (
            <Row key={index} gutter={0} justify="start">
              <Col key="category-id" flex="1 1 100px">
                <div className="rowBox-id-vo">{row.id}</div>
              </Col>
              <Col key="category-status" flex="1 1 100px">
                <div className="rowBox-id-vo">
                  <Input
                    value={row.status}
                    readOnly
                    // onChange={(e) => handleTitleChange(index, e.target.value)}
                    bordered={false}
                  />
                </div>
              </Col>
              <Col key="category-phone" flex="1 1 100px">
                <div className="rowBox-id-vo">
                  <Input
                    value={row.phone || "Not Available"}
                    readOnly
                    // onChange={(e) => handleTitleChange(index, e.target.value)}
                    bordered={false}
                  />
                </div>
              </Col>
              <Col key="category-createTime" flex="1 1 100px">
                <div className="rowBox-id-vo">
                  <Input
                    value={row.createdTime}
                    readOnly
                    // onChange={(e) => handleTitleChange(index, e.target.value)}
                    bordered={false}
                  />
                </div>
              </Col>
              <Col key="category-updateTime" flex="1 1 100px">
                <div className="rowBox-id-vo">
                  <Input
                    value={row.updatedTime}
                    readOnly
                    // onChange={(e) => handleTitleChange(index, e.target.value)}
                    bordered={false}
                  />
                </div>
              </Col>
              <Col key="category-placedBy" flex="1 1 100px">
                <div className="rowBox-id-vo">
                  <Input
                    value={row.placedBy}
                    readOnly
                    // onChange={(e) => handleTitleChange(index, e.target.value)}
                    bordered={false}
                  />
                </div>
              </Col>
              <Col key="category-orderAmount" flex="1 1 100px">
                <div className="rowBox-id-vo-end">
                  <Input
                    value={row.totalAmount}
                    readOnly
                    // onChange={(e) => handleTitleChange(index, e.target.value)}
                    bordered={false}
                  />
                </div>
              </Col>
              <Col className="rowBox-end-col">
                <Button onClick={() => handleInvoice(row)}>Get Invoice</Button>
              </Col>
            </Row>
          ))}
          </div>
          )}
          <Modal
            title="Tax Invoice"
            open={isInvoiceModalOpen}
            onCancel={()=>setIsInvoiceModalOpen(false)}
            footer={invoiceFooter}
            >
            <GetInvoice 
              invoiceData={invoiceData}
              />
          </Modal>
          <Row style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Pagination
                current={currentPage}
                pageSize={itemsPerPage}
                total={rowData.length}
                onChange={paginate}
                showSizeChanger={false}
                style={{ marginTop: '20px', textAlign: 'center' }}
            />
           </Row>
        </div>
      )}
    </>
  );
};