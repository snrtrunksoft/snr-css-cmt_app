import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, Button, Divider, Checkbox } from "antd";
import { DoubleRightOutlined } from "@ant-design/icons";
import "./ItemCategories.css";

const ItemCategories = ({ selectedFilter, setSelectedFilter, setFilteredItems, availableItems, searchText, setSearchText }) => {

  const [maxVisibleRows, setMaxVisibleRows] = useState(1);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
  const [itemCategories, setItemCategories] = useState([
    { id: "all", name: "All" } // Default option
  ]);
  const [filteredItemCategories, setFilteredItemCategories] = useState(itemCategories);
  const [selectedItemCategory, setSelectedItemCategory] = useState("all");
  const [selectedCriteria,setSelectionCriteria] = useState("categories");
  const [textToFilterItems,setTextToFilterItems] = useState("");
  
  const expandCategoriesSection = () => {
    setMaxVisibleRows(!isCategoriesExpanded ? Math.ceil(filteredItemCategories.length / 5) : 1);
    setIsCategoriesExpanded(!isCategoriesExpanded);
  };

  // Intial load, Fetch item categories from database
  useEffect(() => {
    const fetchItemCategories = async () => {
      try {
        const response = await fetch(
          "https://l2wifnx033.execute-api.us-east-2.amazonaws.com/categories/"
        ); // Updated API endpoint
  
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
  
        const data = await response.json();
  
        // New response structure is already a JSON array
        const fetchedItemCategories = data.map((category) => ({
          id: category.id,
          name: category.name,
        }));
  
        setItemCategories([
          { id: "all", name: "All" }, // Add default "All" category
          ...fetchedItemCategories,
        ]);

        setFilteredItemCategories([
          { id: "all", name: "All" }, // Add default "All" category
          ...fetchedItemCategories,
        ]); // Initialize filtered data

      } catch (error) {
        console.error("Error fetching item categories:", error);
      }
    };
  
    fetchItemCategories();
  }, []);

  // update filtereditems when a category is selected.
  useEffect(() => {
    console.log('selectedCriteria is updated:', selectedCriteria);
    console.log('selectedItemCategory:', selectedItemCategory);
    console.log('availableItems:', availableItems);

    if(selectedCriteria === "categories"){
      if (selectedItemCategory === 'all') {
        // Include all items if "all" is selected
        if(selectedFilter === "barCode"){
          setFilteredItems((availableItems.flatMap(category => category.items).filter(Boolean)).filter(item => item.barCode.toString().includes(textToFilterItems)));
        }else{
          setFilteredItems((availableItems.flatMap(category => category.items).filter(Boolean)).filter(item => item.name.toLowerCase().includes(textToFilterItems.toLocaleLowerCase())));
        };
      } else {
        // Filter items based on selectedItemType
        const selectedCategory = availableItems.find(category => category.category === selectedItemCategory);
        if (textToFilterItems === ""){
          setFilteredItems(selectedCategory ? selectedCategory.items : []);
        } else {
          if (selectedFilter === "items"){
            setFilteredItems((selectedCategory.items.filter(Boolean)).filter(item => item.name.toLowerCase().includes(textToFilterItems.toLowerCase())));
          };
          if (selectedFilter === "barCode"){
            setFilteredItems((selectedCategory.items.filter(Boolean)).filter(item => item.barCode.toString().includes(textToFilterItems)));
          };
        }
      }
    } else {
      if (textToFilterItems === "" ){
        setFilteredItems(availableItems.flatMap(category => category.items).filter(Boolean));
      } else {
          if(selectedCriteria === "items"){
            setFilteredItems((availableItems.flatMap(category => category.items).filter(Boolean)).filter(item => item.name.toLowerCase().includes(textToFilterItems.toLowerCase())));
          };
          if(selectedCriteria === "barCode"){
            setFilteredItems((availableItems.flatMap(category => category.items).filter(Boolean)).filter(item => item.barCode.toString().includes(textToFilterItems)));
          };
        };
    }
  }, [selectedItemCategory,textToFilterItems,selectedCriteria,availableItems]);

  // Filter itemTypes based on search text
  useEffect(() => {
    
    if (searchText.trim() === "") {
      setSearchText(""); // Show all item types when search box is empty
      setTextToFilterItems("");
      setFilteredItemCategories(itemCategories);
    } else {
        if(selectedFilter === "categories"){
          setFilteredItemCategories(
            itemCategories.filter((itemType) =>
              itemType.name.toLowerCase().includes(searchText.toLowerCase())
            )
          );
        }else{
          setTextToFilterItems(searchText.trim());
        }
        // if(selectedFilter === "items"){
        // }
        // if(selectedFilter === "barCode"){
        //   setTextToFilterItems(searchText.trim());
        // }
      };
  }, [searchText, itemCategories]);

  // Split filteredItemTypes into groups of 5
  const groupedCategories = useMemo(() => {
    const groups = [];
    for (let i = 0; i < filteredItemCategories.length; i += 5) {
      groups.push(filteredItemCategories.slice(i, i + 5));
    }
    return groups;
  }, [filteredItemCategories]);

  return (
    <div>
      <Row>
        <Col>
          {groupedCategories.slice(0, maxVisibleRows).map((rowGroupedCategories, index) => (
            <Row
              key={index}
              gutter={[16, 16]}
              justify="center"
              className="item-type-row"
              style={{ margin: "5px" }}
            >
              {rowGroupedCategories.map((itemCategory) => (
                <Col key={itemCategory.id}>
                  <Button
                    type="default"
                    onClick={() => {setSelectedItemCategory(itemCategory.name.toLocaleLowerCase());setSelectionCriteria('categories');}}
                    style={{
                      width: "220px",
                      textAlign: "center",
                      backgroundColor:
                        selectedItemCategory === itemCategory.name.toLocaleLowerCase() ? "#0582f7" : "inherit",
                      color:
                        selectedItemCategory === itemCategory.name.toLocaleLowerCase() ? "#fff" : "inherit",
                      borderColor:
                        selectedItemCategory === itemCategory.name.toLocaleLowerCase()
                          ? "#52c41a"
                          : "inherit",
                    }}
                    size="large"
                  >
                    {itemCategory.name}
                  </Button>
                </Col>
              ))}
            </Row>
          ))}
        </Col>
        <Col style={{ marginTop: "0px", marginLeft: "0px" }}>
          <Row>
            <Checkbox
              checked={selectedFilter === "categories"}
              onClick={() => {
                setSelectedFilter("categories");
                setSelectedItemCategory("all");
                setTextToFilterItems("");
                setSelectionCriteria("categories");
                setSearchText("");
                }}
            >
              Categories
            </Checkbox>
            <Checkbox
              checked={selectedFilter === "items"}
              onClick={() => {
                setSelectedFilter("items");
                setSelectedItemCategory("all");
                setSelectionCriteria("items");
                setSearchText("");
                }}
            >
              Items
            </Checkbox>
            <Checkbox
            checked={selectedFilter === "barCode"}
            onClick={() =>{
              setSelectedFilter("barCode");
              setSelectedItemCategory("all");
              setSelectionCriteria("barCode");
              setSearchText("");
              setTextToFilterItems("");
            }}
            >
              Barcode
            </Checkbox>
          </Row>
          <input
            type={selectedFilter === "barCode" ? "number" : "search"}
            style={{ outline: "none", borderRadius: "5px", margin: "2px",marginLeft:'-75px' }}
            placeholder="Search Text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)} // Update search text
          />
        </Col>
        <Divider style={{ borderColor: "#129bc4" }}>
          <Button
            style={{
              transform: isCategoriesExpanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
            icon={
              <DoubleRightOutlined style={{ transform: "rotate(90deg)" }} />
            }
            onClick={expandCategoriesSection}
          />
        </Divider>
      </Row>
    </div>
  );
};

export default ItemCategories;
