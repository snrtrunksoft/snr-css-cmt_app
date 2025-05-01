import { Row, Col, Checkbox, DatePicker, Divider } from 'antd';
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { PieChart, Pie, Cell, Tooltip, Legend, Label } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A0E7E5', '#B4F8C8', '#FFAEBC'];

const AdminDashboards = () => {
    const [selected, setSelected] = useState("day");
    const [text, setText] = useState("Please select Day");
    const [itemTypes, setItemTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [defaultDate,setDefaultDate] = useState(dayjs());

    // Fetch data based on the selected date
     const fetchData = async (date,value) => {
        let calendar,formattedDate;
        if (value === "day"){
            calendar = "daily";
            formattedDate = dayjs(date).format("MMM_DD_YYYY").toLowerCase();
        } else if (value === "month"){
            calendar = "monthly";
            formattedDate = dayjs(date).format("MMM_YYYY").toLowerCase();
        } else if(value === "year") {
            calendar = "yearly";
            formattedDate = dayjs(date).format("YYYY").toLowerCase();
        }
        console.log("formattedDate:",formattedDate);
        const url = `https://n82x1bmdef.execute-api.us-east-1.amazonaws.com/dev/dashboard/${calendar}/${formattedDate}`;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.get(url);
            const parsedData = response.data.items || [];
            setItemTypes(parsedData);
            console.log('Parsed dashboards data items:', parsedData);
            setError(null);
        } catch (err) {
            setError("Failed to fetch data.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    const handleDate = (value) => {
        setSelected(value);
        let formattedDate;

        if (value === "day") {
            setText("Please select Day");
            formattedDate = defaultDate.format('YYYY-MM-DD');
        } else if (value === "month") {
            setText("Please select Month");
            formattedDate = defaultDate.format('YYYY-MM');
        } else if (value === "year") {
            setText("Please select Year");
            formattedDate = defaultDate.format('YYYY');
        }
        fetchData(formattedDate,value);
    };

    const handleDateChange = (date) => {
        if (date) {
            fetchData(date,selected);
            setDefaultDate(date);
        }
    };

    useEffect(() => {
        // Fetch data for today's date on initial render
        fetchData(dayjs(),"day");
    }, []);

    return (
        <div>
            <Row style={{ margin: '10px 0px',marginLeft:'90px', display: "flex", alignItems: 'center', justifyContent: 'center' }}>
                <Col >
                    <Checkbox checked={selected === 'day'} style={{ marginRight: '10px' }} onClick={() => handleDate("day")}>Day</Checkbox>
                    <Checkbox checked={selected === "month"} style={{ marginRight: '10px' }} onClick={() => handleDate('month')}>Month</Checkbox>
                    <Checkbox checked={selected === "year"} onClick={() => handleDate('year')}>Year</Checkbox>
                </Col>
                <Col >
                    <Divider type='vertical' style={{height:20,backgroundColor:'black'}}/>
                </Col>
                <Col style={{ width: '300px' }}>
                    <Row>
                        <p style={{ margin: '7px' }}>{text}</p>
                        <DatePicker
                            picker={selected}
                            defaultValue={dayjs()}
                            onChange={handleDateChange}
                        />
                    </Row>
                </Col>
            </Row>
            {loading ? (
                <p style={{margin:'20px'}}><LoadingOutlined/> Loading...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <Row style={{display:'flex',alignItems:'center',justifyContent:'space-around',marginLeft:'90px'}}>
                    <Col>
                        <PieChart width={400} height={400}>
                            <Pie
                                data={itemTypes}
                                dataKey="count"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={150}
                                fill="#8884d8"
                                label
                            >
                                {itemTypes.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                                <Label
                                    value="Item Types Distribution"
                                    position="center"
                                    style={{
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        fill: '#333'
                                    }}
                                />
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </Col>
                    <Col>
                        <Divider type='vertical' style={{height:300,backgroundColor:'black',marginLeft:'15px'}}/>
                    </Col>
                    <Col>
                        <BarChart width={500} height={300} data={itemTypes} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#8884d8">
                                {itemTypes.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default AdminDashboards;