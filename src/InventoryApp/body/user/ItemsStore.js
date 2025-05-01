import React, { useState } from 'react';
import { Modal, Row, Col, Button, Card, Input } from 'antd';
import AddToCart from './AddToCart';
import './ItemsStore.css';

const ItemsStore = ({ filteredItems, setFilteredItems, setCartItems, availableItems, setAvailableItems, isLoadingItems }) => {

  const [isItemImageZoomed, setIsItemImageZoomed] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [zoomedItemIndex,setZoomedItemIndex] = useState(null);

  const handleIncrement = (itemId) => {
    setAvailableItems((prevItems)=>{
      return prevItems.map((category)=>{
        return {
          ...category,
          items:category.items.map((product)=>{
            if(product.id === itemId){
              if(product.quantityAvailable>0){
                return {
                  ...product,
                  selectedQuantity:product.selectedQuantity + 1,
                  quantityAvailable:product.quantityAvailable - 1,
                };
              }else{
                return product;
              }
            }
            return product;
          }
          ),
        };
      });
    });
  };

  const handleDecrement = (itemId) => {
    setAvailableItems((prevItems)=>{
      return prevItems.map((category)=>{
        return {
          ...category,
          items:category.items.map((product)=>{
            if(product.id === itemId){
              if(product.selectedQuantity>1){
                return {
                  ...product,
                  selectedQuantity:product.selectedQuantity - 1,
                  quantityAvailable:product.quantityAvailable + 1,
                };
              }else{
                return product;
              }
            }
            return product;
          }
          ),
        };
      });
    });
  };

  const handleModalOpen = (item) => {
    setSelectedItem(item);
    setIsItemImageZoomed(true);
  };

  const handleModalClose = () => {
    setIsItemImageZoomed(false);
  };

  const addToCart = (item) => {

    console.log('items:', item);
    
    item.selectedQuantity !== 0 && setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => cartItem.id === item.id);
      console.log('existingItem:', existingItem);
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem,
            quantityAvailable:cartItem.quantityAvailable-cartItem.selectedQuantity,
            selectedQuantity:item.selectedQuantity } : cartItem
        );
      }
      return [...prevItems, { ...item,quantityAvailable:item.quantityAvailable,selectedQuantity:item.selectedQuantity }];
    });

    handleModalClose();
  };

  return (
    <div>
      {filteredItems.length === 0 && <div>oh..ooo... No Items found currently..!</div>}
      <Row gutter={[16, 16]} className="available-items">
        {filteredItems.map((item,index) => 
          (
            <Col
              key={item.id}
              xs={24}
              sm={12}
              md={8}
              lg={6}
              style={{ cursor: 'pointer' }}
            >
              <Card 
                className="shadow-card"
                title={
                  <div>
                   <span style={{
                      marginBottom: '-5px',
                      display: 'inline-block',
                      width: `${(item.name).length > 20 ? 180 : '' }px`,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                   > {item.name} </span> - <span style={{ color: 'black' }}>Price: ₹{item.price}</span>
                  </div>
                }
                bordered={true}
              >
                <Row className="inventory-item">
                  <Col span={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      onClick={() => {handleModalOpen(item);setZoomedItemIndex(index);}}
                      src={item.image || '/path/to/default-image.png'} // Add fallback image
                      alt={item.name}
                      className="inventory-image"
                    />
                  </Col>
                  <Col span={12} className="inventory-item-data">
                    <div style={{ fontSize: '15px', marginBottom: '2px' }}>BarCode: {item.barCode}</div>
                    <div style={{ fontSize: '16px', marginBottom: '4px' }}>{item.quantityAvailable} left in Store</div>
                    <Row style={{ paddingBottom: '5px' }}>
                      <Button onClick={()=>handleDecrement(item.id)} style={{ marginRight: '5px' }} size="small" disabled={(item.selectedQuantity<=1 ? true:false)}>-</Button>
                      <Input
                        size="small"
                        readOnly
                        value={item.selectedQuantity}
                        style={{ width: '50px', textAlign: 'center' }}
                      />
                      <Button onClick={()=>handleIncrement(item.id)} style={{ marginLeft: '5px' }} size="small" disabled={(item.quantityAvailable===0 ? true:false)}>+</Button>
                    </Row>
                    <Button disabled={item.selectedQuantity === 0} type="primary" onClick={()=> addToCart(item)}> 
                      Add to Cart
                    </Button>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))
        }
      </Row>

      <Modal
        title={selectedItem ? selectedItem.name : 'Item Details'}
        open={isItemImageZoomed}
        onOk={handleModalClose}
        onCancel={handleModalClose}
        footer={null}
        width="800px"
        bodyStyle={{ height: '600px', overflowY: 'auto' }}
      >
        <AddToCart index={zoomedItemIndex} addToCart={addToCart} handleIncrement={handleIncrement} handleDecrement={handleDecrement} filteredItems={filteredItems}/>
      </Modal>
    </div>
  );
};

export default ItemsStore;
