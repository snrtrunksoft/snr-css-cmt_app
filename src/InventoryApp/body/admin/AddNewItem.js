import { Col, Row,Button, Dropdown, Menu, Upload, message} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import "./AddNewItem.css";
import AWS from "aws-sdk";

const AddNewItem = ({
    data,
    setIsModelOpen,
    handleAdd,
    setName,
    setImage,
    setPrice,
    setItemQuantity,
    setCategory,
    setDescription,
    newItemCategory,
    image,
    }) =>{

    const { register,reset } = useForm();
    const [searchText, setSearchText] = useState('');
    const [loading,setLoading] = useState(false);

    const handleMenuClick = (e) => {
        console.log('Selected:', e.key);
        setSearchText(e.domEvent.target.textContent);
        setCategory(e.domEvent.target.textContent);
    };

    const filteredData = newItemCategory.filter((itemType) => itemType.name.toLowerCase().includes(searchText.toLowerCase()));
    const menu = (
        <Menu onClick={handleMenuClick}>
            {filteredData.map((item)=>(<Menu.Item key={item.name}>{item.name}</Menu.Item>))}
        </Menu>
    );
    const handleDropDown = (value) => {
        setSearchText(value);
        setCategory(value);
    }

    const handleReset = () =>{
        reset();
    };

     // Configure AWS S3
        AWS.config.update({
            region: 'us-east-2',  // your region
            accessKeyId: 'AKIA5CBGTOHNRRXF24QT',  // your access key
            secretAccessKey: 'jizfjfKsF6/RHTdawWcwF8dtWypD+hNYBOV0OwLI',  // your secret access key
        });
    
        const s3 = new AWS.S3();

        const handleUpload = (file) => {
        console.log('uploading to s3');
        const params = {
            Bucket: 'css-inventory-item-images',
            Key: `items/${file.name}`, // Specify the file path in your bucket
            Body: file,
        };

        s3.upload(params, (err, data) => {
            if (err) {
                console.error('Error uploading file:', err);
                message.error('Upload failed');
            } else {
                console.log('Upload successful', data);
                setImage(data.Location);  // Set the image URL returned by S3
                message.success('Upload successful');
            }
        });
    };

    const handleCancel = () => {
        setIsModelOpen(false);
        setSearchText("");
        setImage("");
        handleReset();
    }

    return(
        <div>
            {data?(
                <div>
                    <form>
                        <Row>
                        <Col>
                            <h2>Item Name :</h2>
                        </Col>
                        <Col style={{marginLeft:'5px'}}>
                            <input 
                                style={{border:'2px solid transparent',outline:'none',fontSize:'20px'}}
                                placeholder="Enter name"
                                type="text" {...register('name')}
                                onChange={(e)=>setName(e.target.value)}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h2>Item Image :</h2>
                        </Col>
                        <Col style={{marginLeft:'5px'}}>
                            <input 
                                style={{border:'2px solid transparent',outline:'none',fontSize:'20px',width:'150px'}}
                                placeholder="Enter image url"
                                type="url" {...register('image')}
                                value={image}
                                onChange={(e)=>setImage(e.target.value)}
                            /><span style={{fontSize:'20px',marginRight:'10px'}}>or</span>
                            <Upload
                                customRequest={({ file, onSuccess, onError }) => {
                                try {
                                    handleUpload(file);
                                    onSuccess();
                                } catch (error) {
                                    onError(error);
                                }
                                }}
                                showUploadList={false}
                                accept="image/*"
                            >
                                <Button icon={<UploadOutlined />} loading={loading}>
                                Upload Image
                                </Button>
                            </Upload>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h2>Item Price :</h2>
                        </Col>
                        <Col style={{marginLeft:'5px'}}>
                            <input 
                                type="number"
                                style={{border:'2px solid transparent',outline:'none',fontSize:'20px'}}
                                placeholder="Enter price" {...register('price')}
                                onChange={(e)=>{
                                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                                    setPrice(numericValue);
                                    }}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h2>Item Quantity :</h2>
                        </Col>
                        <Col style={{ marginLeft: '5px' }}>
                            <input
                                style={{ border: '2px solid transparent', outline: 'none', fontSize: '20px' }}
                                placeholder="Enter description of item"
                                type="number" {...register('quantity')}
                                onChange={(e) =>{
                                    const quantity = e.target.value.replace(/[^0-9]/g, '');
                                    setItemQuantity(quantity);
                                    }}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h2>Item category :</h2>
                        </Col>
                        <Col style={{ marginLeft: '5px' }}>
                        <Dropdown overlay={menu} trigger={['click']}>
                            <input
                                style={{ border: '2px solid transparent', outline: 'none', fontSize: '20px' }}
                                placeholder="Search or select an item"
                                type="text" {...register('itemCategory')}
                                value={searchText}
                                onChange={(e) => {handleDropDown(e.target.value);}}
                            />
                        </Dropdown>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h2>Item Description :</h2>
                        </Col>
                        <Col style={{ marginLeft: '5px' }}>
                            <input
                                style={{ border: '2px solid transparent', outline: 'none', fontSize: '20px' }}
                                placeholder="Enter description of item"
                                type="text" {...register('description')}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Col>
                    </Row>
                    <Row style={{display:'flex',alignItems:'flex-end',justifyContent:'flex-end'}}>
                    <Button 
                        onClick={handleCancel}
                        style={{margin:'0px 5px',border:'1px solid black',backgroundColor:'transparent',color:"black"}}
                        >Cancel</Button>
                    <Button 
                        type="primary" 
                        onClick={()=>{
                            handleAdd();
                            setIsModelOpen(false);
                            setSearchText("");
                            setImage("");
                            handleReset();
                        }}>Add</Button>
                </Row>
                    </form>
                </div>
            ):("loading...")}
        </div>
    );
};
export default AddNewItem;