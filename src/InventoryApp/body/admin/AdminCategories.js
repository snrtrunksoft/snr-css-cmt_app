import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Modal, Button, Result, Pagination, } from 'antd';
import { AddNewCategory } from './AddNewCategory';
import { DeleteTwoTone,SaveTwoTone,LoadingOutlined } from '@ant-design/icons';
import './AdminCategories.css';

const AdminCategories = () => {
  const [rowData, setRowData] = useState([]);
  const [isAddNewCategoryModelOpen, setIsAddNewCategoryModelOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState(null);
  const [isStatusModalOpen,setIsStatusModalOpen] = useState(false);
  const [status,setStatus] = useState(null);
  const [currentStatusMessage,setCurrentStatusMessage] = useState(null);
  const [isLoading,setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage,setCurrentPage] = useState(1);
  const [itemsForPage] = useState(10);

  const indexOfLastItem = currentPage * itemsForPage;
  const indexOfFirstItem = indexOfLastItem - itemsForPage;
  const availableCategories = rowData.slice(indexOfFirstItem,indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const newRecord = {
    id: {
      value: "TBD",
      color: "transparent"
    },
    name: {
      value: newCategoryName,
      color: "transparent"
    },
    isUpdated:false,
  };

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://cx8712tt7e.execute-api.us-east-1.amazonaws.com/dev/categories");
        if (!response.ok) {
          throw new Error(`Error fetching categories: ${response.statusText}`);
        }

        const categories = await response.json();

        // Transform API response to match rowData structure
        const formattedCategories = categories.map((category) => ({
          id: {
            value: category.id,
            color: "transparent",
          },
          name: {
            value: category.name,
            color: "transparent",
          },
          isUpdated: false,
        }));

        setRowData(formattedCategories);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setError("Failed to fetch data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle title change
  const handleTitleChange = (ItemId, newTitle) => {
    setRowData((prev) => {
      const existingItem = prev.find((item) => item.id.value === ItemId);
      if (existingItem) {
        return prev.map((prevItems) => 
          prevItems.id.value === ItemId ? {...prevItems,
            name: { value: newTitle, color: 'red' },
            isUpdated: true,
          } : prevItems );
      };
    });
  };

  const handleSave = (idToSave) => {
    setRowData((prev) => {
      const existingItem = prev.find((items) => items.id.value === idToSave );
      if (existingItem) {
        if (existingItem.isUpdated === true) {
          const fetchUpdatedField = async () => {
            try {
              fetch(`https://cx8712tt7e.execute-api.us-east-1.amazonaws.com/dev/categories/${idToSave}`,{
              method: "PUT",
              headers: {
                'Content-Type': 'application/json',
              },
              body:JSON.stringify({name: existingItem.name.value})
            })
              .then(response =>response.json())
              .then(data => console.log('Updated Data:', data))
              setIsStatusModalOpen(true);
              setStatus("success");
              setCurrentStatusMessage("Updated successfully");
            }catch(error){
              console.error("unable to update the column",error);
              setIsStatusModalOpen(true);
              setStatus("error");
              setCurrentStatusMessage("unable to update category");
            }
          }
          fetchUpdatedField();
        }
      }
      return prev.map((prevItems) => 
      prevItems.id.value === idToSave ? {
        ...prevItems,
        name: { value: prevItems.name.value, color: 'transparent'},
        isUpdated: false,
      } : prevItems );
    });
  };

  const handleDelete = (idToDelete) => {
    if (rowData.length > 0) {
      const deleteCategory = async () => {
        try {
            fetch(`https://cx8712tt7e.execute-api.us-east-1.amazonaws.com/dev/categories/${idToDelete}`,{
            method:'DELETE',
          })
            .then(responce =>responce.json())
            .then(data => console.log("deleted category",data))
            setIsStatusModalOpen(true);
            setStatus("success");
            setCurrentStatusMessage("Deleted successfully");
        }catch(error){
          console.log("unable to delete category",error);
          setIsStatusModalOpen(true);
          setStatus("error");
          setCurrentStatusMessage("unable to delete category");
        }
      }
      deleteCategory();
      const updatedRows = rowData.filter((prevData) => prevData.id.value !== idToDelete);
      setRowData(updatedRows);
    }
  };

  const handleAdd = () => {
    setIsLoading(true);
    const newCategory = async () => {
      try {
        const response = await fetch("https://cx8712tt7e.execute-api.us-east-1.amazonaws.com/dev/categories/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newRecord.name.value,
          }),
        });
  
        if (!response.ok) {
          setStatus("error");
          setIsStatusModalOpen(true);
          setCurrentStatusMessage("Failed to create new Category, try again..!");
          throw new Error(`Error adding category: ${response.statusText}`);
        }
  
        const data = await response.json();
  
        console.log("New category added:", data);
  
        // Update newRecord with the categoryId from the response
        const updatedRecord = {
          ...newRecord,
          id: {
            value: data.categoryId, // Update with the categoryId from the response
            color: "transparent",
          },
        };
  
        // Add the updatedRecord to the rowData
        setRowData((prevData) => [...prevData, updatedRecord]);
        setIsAddNewCategoryModelOpen(false);
        setNewCategoryName(null);
        setIsStatusModalOpen(true);
        setStatus("success");
        setCurrentStatusMessage("New Category added successfully");
        setIsLoading(false);
      } catch (error) {
        console.error("Unable to add new category:", error);
        setStatus("error");
        setIsStatusModalOpen(true);
        setCurrentStatusMessage("Failed to create new Category, try again..!");
      }
    };
  
    newCategory();
  };

    return (
        <> {isLoading===true ? ( 
            <p>{<LoadingOutlined/>} Loading... </p> 
            ) : error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : (
            <div>
            <Row gutter={0} justify="start" className="rowBox-top">
                <Col key="category-id-header" flex="1 1 100px">
                    <div className="rowBox-id">Category ID</div>
                </Col>
                <Col key="category-title-header" flex="2 1 150px">
                    <div className="rowBox-right">Category Name</div>
                </Col>
                <Col className="category-remove-end">
                    <Button icon={<DeleteTwoTone twoToneColor={"red"}/>} style={{border:'2px solid transparent'}} disabled></Button>
                </Col>
                <Col className="category-remove-end">
                    <Button icon={<SaveTwoTone twoToneColor={"#36ed11"}/>} style={{border:'2px solid transparent'}} disabled></Button>
                </Col>
            </Row>
            {availableCategories.map((row) => (
                <Row key={row.id} gutter={0} justify="start">
                    <Col key="category-id" flex="1 1 100px">
                        <div className="rowBox-id">{row.id.value}</div>
                    </Col>
                    <Col key="category-title" flex="2 1 150px">
                        <div className="rowBox-right">
                            <Input
                                value={row.name.value}
                                placeholder='Enter category'
                                style={{border:`2px solid ${row.name.color}`|| 'transparent'}}
                                onChange={(e) => handleTitleChange(row.id.value, e.target.value)}
                                bordered={false}
                            />
                        </div>
                    </Col>
                    <Col className="category-remove-end">
                        <Button
                            onClick={()=>handleDelete(row.id.value)} 
                            icon={<DeleteTwoTone twoToneColor={"red"}/>}
                            style={{border:"2px solid transparent"}}
                        ></Button>
                    </Col>
                    <Col className="category-remove-end">
                        <Button
                            icon={<SaveTwoTone twoToneColor={"#36ed11"}/>}
                            onClick={()=>handleSave(row.id.value)} 
                            style={{border:"2px solid transparent"}}
                        ></Button>
                    </Col>
                </Row>
            ))}
            <Row style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px 0px' }}>
                <Button type='primary' onClick={()=>setIsAddNewCategoryModelOpen(true)} >Add new category</Button>
            </Row>
            <Modal
                title="Add new Category"
                open={isAddNewCategoryModelOpen}
                onCancel={()=>setIsAddNewCategoryModelOpen(false)}
                footer={null}
                >
                <AddNewCategory data={rowData} setNewCategoryName={setNewCategoryName} setIsAddNewCategoryModelOpen={setIsAddNewCategoryModelOpen} handleAdd={handleAdd}/>
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
            </div>
          )}
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

export default AdminCategories;
