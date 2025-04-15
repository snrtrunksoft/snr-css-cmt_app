import { Row, Col, Input, Button, Modal, Result, Pagination, Upload, message} from "antd";
import React, { useEffect, useState } from "react";
import AddNewItem from "./AddNewItem";
import { DeleteTwoTone, SaveTwoTone, LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import "./AdminItems.css";
import AWS from 'aws-sdk';

const AdminItems = () => {
    const [rowData, setRowData] = useState([{
        id: "1000000",
        name: { value: "Toys", color: "transparent" },
        image: { value: "Chair", color: 'transparent' },
        price: { value: "500", color: 'transparent' },
        description: "toy chair",
        quantityAvailable: "30",
        category: "Toys",
    }]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItemCategory, setNewItemCategory] = useState([]);
    const [name, setName] = useState(null);
    const [image, setImage] = useState(null);
    const [price, setPrice] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [status, setStatus] = useState(null);
    const [currentStatusMessage, setCurrentStatusMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStoreItems = async () => {
            try {
                // const response = await fetch("https://ze6vrasiw6.execute-api.us-east-2.amazonaws.com/items");
                // if (!response.ok) {
                //     throw new Error(`Error fetching store Items: ${response.statusText}`);
                // }
                // const storeItems = await response.json();
                // const formattedStoreItems = storeItems.map((item) => ({
                //     id: item.itemId,
                //     name: { value: item.itemName, color: "transparent" },
                //     image: { value: item.image, color: 'transparent' },
                //     price: { value: item.price, color: 'transparent' },
                //     description: item.description,
                //     quantityAvailable: item.quantityAvailable,
                //     category: item.category,
                //     isUpdated: false,
                // }));
                // setRowData(formattedStoreItems);
                // setError(null);
            } catch (error) {
                console.log("Error fetching store items", error);
                setError("Failed to fetch data.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchStoreItems();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("https://l2wifnx033.execute-api.us-east-2.amazonaws.com/categories");
                if (!response.ok) {
                    throw new Error(`Error fetching categories: ${response.statusText}`);
                }
                const categories = await response.json();
                setNewItemCategory(categories);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const [description, setDescription] = useState("");
    const [itemQuantity, setItemQuantity] = useState(null);
    const [category, setCategory] = useState(null);
    const [uploadButtonHide, setUploadButtonHide] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsForPage] = useState(10);

    const indexOfLastItem = currentPage * itemsForPage;
    const indexOfFirstItem = indexOfLastItem - itemsForPage;
    const availableItems = rowData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const newRecord = {
        id: "TBD",
        name: { value: name, color: "transparent" },
        image: { value: image, color: "transparent" },
        price: { value: price, color: "transparent" },
        description: description,
        category: category,
        quantityAvailable: itemQuantity,
        isUpdated: false,
    };

    const handleSave = (idToSave) => {
        setRowData((prevData) => {
            const existingItem = prevData.find((item) => item.id === idToSave );
            if (existingItem) {
                if (existingItem.isUpdated === true) {
                    const updatedFields = async () => {
                        try {
                            fetch(`https://ze6vrasiw6.execute-api.us-east-2.amazonaws.com/items/${idToSave}`, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    itemName: existingItem.name.value,
                                    image: existingItem.image.value,
                                    price: existingItem.price.value,
                                    description: existingItem.description,
                                    category: existingItem.category,
                                    quantityAvailable: existingItem.quantityAvailable,
                                }),
                            })
                                .then(response => response.json())
                                .then(data => console.log("updated data:", data));
                            setIsStatusModalOpen(true);
                            setStatus("success");
                            setCurrentStatusMessage("Updated successfully");
                        } catch (error) {
                            console.log("unable to update field", error);
                            setIsStatusModalOpen(true);
                            setStatus("error");
                            setCurrentStatusMessage("unable to update Item");
                        }
                    };
                    updatedFields();
                }
            }
            return prevData.map((prev) => 
                prev.id === idToSave ? { ...prev,
                name: { value: prev.name.value, color: 'transparent'},
                image: { value: prev.image.value, color: 'transparent'},
                price: { value: prev.price.value, color: 'transparent'},
                isUpdated: false,
                } : prev );
        });
        
        setUploadButtonHide(true);

    };

    const handleAdd = () => {
        setIsLoading(true);
        const newItem = async () => {
            try {
                const response = await fetch(`https://ze6vrasiw6.execute-api.us-east-2.amazonaws.com/items/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        itemName: newRecord.name.value,
                        image: newRecord.image.value,
                        price: newRecord.price.value,
                        description: newRecord.description,
                        category: newRecord.category,
                        quantityAvailable: newRecord.quantityAvailable,
                    }),
                });
                if (!response.ok) {
                    setStatus("error");
                    setIsStatusModalOpen(true);
                    setCurrentStatusMessage("Failed to create new Category, try again..!");
                    throw new Error(`Error adding new Item: ${response.statusText}`);
                }
                const data = await response.json();
                console.log("New Item added:", data);
                const updatedItem = {
                    ...newRecord,
                    id: data.itemId, // Update with the itemId from the response
                };
                setRowData(prevData => [...prevData, updatedItem]);
                setStatus("success");
                setIsStatusModalOpen(true);
                setCurrentStatusMessage("New Item Added Successfully");
                setIsLoading(false);
            } catch (error) {
                console.log("unable to add new Item", error);
                setStatus("error");
                setIsStatusModalOpen(true);
                setCurrentStatusMessage("Failed to create new Item, try again..!");
            }
        };
        newItem();
    };

    const handleDelete = (idToDelete) => {
        if (rowData.length >= 1) {
            const deleteField = async () => {
                try {
                    fetch(`https://ze6vrasiw6.execute-api.us-east-2.amazonaws.com/items/${idToDelete}`, {
                        method: "DELETE",
                    })
                        .then(response => response.json());
                    setIsStatusModalOpen(true);
                    setStatus("success");
                    setCurrentStatusMessage("Deleted Successfully");
                } catch (error) {
                    console.log("unable to delete Field", error);
                    setIsStatusModalOpen(true);
                    setStatus("error");
                    setCurrentStatusMessage("unable to Delete Item");
                }
            };
            deleteField();
            const updatedRows = rowData.filter((prevData) => prevData.id !== idToDelete);
            setRowData(updatedRows);
        } else {
            setRowData([]);
        }
    };

    const handleFieldChange = (ItemId, field, newValue) => {
        setRowData((prevData) => {
            const existingItem = prevData.find((item) => item.id === ItemId );
            if(existingItem){
                if(field === "name"){
                    return prevData.map((prev) => 
                    prev.id === ItemId ? {...prev,
                        name: { value: newValue, color: 'red'},
                        isUpdated: true,
                    } : prev);
                }
                if(field === "image"){
                    return prevData.map((prev) => 
                    prev.id === ItemId ? {...prev,
                        image: { value: newValue, color: 'red'},
                        isUpdated: true,
                    } : prev);
                }
                if(field === "price"){
                    return prevData.map((prev) => 
                    prev.id === ItemId ? {...prev,
                        price: { value: newValue, color: 'red'},
                        isUpdated : true,
                    } : prev);
                }
            }
        })
    };

    const handleImage = () => {
        setUploadButtonHide(false);
    };

    const [loading, setLoading] = useState(false);

    // Configure AWS S3
    AWS.config.update({
        region: 'us-east-2',  // your region
        accessKeyId: 'AKIA5CBGTOHNRRXF24QT',  // your access key
        secretAccessKey: 'jizfjfKsF6/RHTdawWcwF8dtWypD+hNYBOV0OwLI',  // your secret access key
    });

    const s3 = new AWS.S3();

    const handleUpload = (itemId, file) => {
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
                handleFieldChange(itemId, 'image', `https://css-inventory-item-images.s3.us-east-2.amazonaws.com/items/${file.name}`)
                setUploadButtonHide(true);
            }
        });
    };

    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
        }
        if (info.file.status === 'done') {
            setLoading(false);
        }
    };

    return (
        <>
            <Row gutter={0} justify="start" className="rowBox-top-item">
                <Col span={2} key="Item-id-header" flex="1 1 100px">
                    <div className="rowBox-id-item">ID</div>
                </Col>
                <Col xl={10} key="Item-name-header" flex="1 1 100px">
                    <div className="rowBox-id-item">Name</div>
                </Col>
                <Col span={10} key="Item-image-header" flex="1 1 100px">
                    <div className="rowBox-id-item">Image</div>
                </Col>
                <Col span={3} key="Item-price-header" flex="1 1 100px">
                    <div className="rowBox-id-item">Price</div>
                </Col>
                <Col span={2} key="Item-remove-header" className="rowBox-remove-end">
                    <Button icon={<DeleteTwoTone twoToneColor={"red"}/>} style={{border:'2px solid transparent'}} disabled></Button>
                </Col>
                <Col span={2} key="Item-remove-header" className="rowBox-save-end">
                    <Button icon={<SaveTwoTone twoToneColor={"#36ed11"}/>} style={{border:'2px solid transparent'}} disabled></Button>
                </Col>
            </Row>
            {isLoading ? (
                <p style={{margin:'20px 0px'}}> {<LoadingOutlined/>} Loading...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
            <div>
            {availableItems.map((row) => (
                <Row key={row.id} gutter={0} justify="start">
                    <Col span={2} style={{textOverflow:'ellipsis',whiteSpace:'nowrap',overflow:'hidden',textAlign:'left'}} key="category-id" flex="1 1 100px">
                        <div className="rowBox-id-item">{row.id}</div>
                    </Col>
                    <Col span={10} key="category-name" flex="1 1 100px">
                        <span className="rowBox-id-item" style={{width:'100%',textOverflow:'ellipsis',overflow:'hidden',whiteSpace:'nowrap'}}>
                            <Input
                                value={row.name.value}
                                placeholder="Enter name"
                                onChange={(e) => handleFieldChange(row.id, 'name', e.target.value)}
                                style={{ border: `2px solid ${row.name.color || 'transparent'}` }}
                                bordered={false}
                            />
                        </span>
                    </Col>
                    <Col span={10} key="category-image" flex="1 1 100px">
                        <div className="rowBox-id-item" style={{width:'100%',textOverflow:'ellipsis',overflow:'hidden',whiteSpace:'nowrap'}}>
                            <Input
                                value={row.image.value}
                                placeholder="Enter Image url"
                                onClick={()=>handleImage()}
                                onChange={(e) => handleFieldChange(row.id, 'image', e.target.value)}
                                style={{ border: `2px solid ${row.image.color || 'transparent'}` }}
                                bordered={false}
                            />
                            <Upload
                                customRequest={({ file, onSuccess, onError }) => {
                                try {
                                    handleUpload(row.id, file);
                                    onSuccess();
                                } catch (error) {
                                    onError(error);
                                }
                                }}
                                showUploadList={false}
                                accept="image/*"
                            >
                                <Button icon={<UploadOutlined />} loading={loading} style={{width:'70px'}}>
                                    <span style={{width:'100%',textOverflow:'ellipsis',overflow:'hidden',whiteSpace:'nowrap'}}>Upload Image</span>
                                </Button>
                            </Upload>
                        </div>
                    </Col>
                    <Col span={3} key="category-price" flex="1 1 100px" style={{position:'relative'}}>
                        <div className="rowBox-id-item" style={{width:'100%',textOverflow:'ellipsis',overflow:'hidden',whiteSpace:'nowrap'}}>
                            <Input
                                value={row.price.value}
                                placeholder="Enter Price"
                                onChange={(e) => {
                                        const numericValue = e.target.value.replace(/[^0-9]/g, '');
                                        handleFieldChange(row.id, 'price', numericValue);
                                    }
                                }
                                style={{ border: `2px solid ${row.price.color || 'transparent'}` }}
                                bordered={false}
                            />
                        
                        </div>
                    </Col>
                    <Col span={2} className="rowBox-remove-end">
                        <Button
                        icon={<DeleteTwoTone twoToneColor={"red"}/>} 
                        onClick={()=>handleDelete(row.id)} 
                        style={{border:"2px solid transparent"}}
                        ></Button>
                    </Col>
                    <Col span={2} className="rowBox-save-end">
                        <Button
                        icon={<SaveTwoTone twoToneColor={"#36ed11"}/>} 
                        onClick={()=>handleSave(row.id)} 
                        style={{border:"2px solid transparent"}}
                        ></Button>
                    </Col>
                </Row>
            ))}
            </div>
            )}
            <Row style={{ display: 'flex', justifyContent: 'flex-end',margin:'10px 0px'}}>
            <Button type="primary" onClick={()=>setIsModalOpen(true)} >Add new item</Button>
            </Row>
            <Modal
                title="Add New Item"
                open={isModalOpen}
                onCancel={()=>setIsModalOpen(false)}
                footer={null}
                >
                <AddNewItem 
                    data={rowData} 
                    setIsModelOpen={setIsModalOpen} 
                    handleAdd={handleAdd} 
                    setName={setName} 
                    setImage={setImage} 
                    setPrice={setPrice}
                    setItemQuantity={setItemQuantity}
                    setCategory={setCategory}
                    setDescription={setDescription}
                    newItemCategory={newItemCategory}
                    image={image}
                    />
            </Modal>
            <Modal
              title="Status"
              open={isStatusModalOpen}
              onCancel={()=>setIsStatusModalOpen(false)}
              footer={null}
              >
              <Result status={status} title={currentStatusMessage}
                extra={[
                    <Button type="primary" key="console" onClick={() => setIsStatusModalOpen(false)}>
                      Close
                    </Button>]}
              ></Result>
            </Modal>
            <Row style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Pagination
                    current={currentPage}
                    pageSize={itemsForPage}
                    total={rowData.length}
                    onChange={paginate}
                    showSizeChanger={false}
                    style={{ marginTop: '20px', textAlign: 'center' }}
                 >
                </Pagination>
            </Row>
        </>
    );
};

export default AdminItems;