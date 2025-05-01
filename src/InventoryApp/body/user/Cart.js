import React, { useState } from 'react';
import { Row, Col, Button } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, DeleteTwoTone } from '@ant-design/icons';
import './Cart.css';

const CartComponent = ({ setAvailableItems, cartItems, setCartItems }) => {
   
    
    const increaseCart = (id) => {
      console.log('cartItems:', cartItems);
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          selectedQuantity: item.selectedQuantity + 1,
                          quantityAvailable: item.quantityAvailable - 1,
                      }
                    : item
            )
        );

        setAvailableItems((prevItems)=>{
            return prevItems.map((category)=>{
              return {
                ...category,
                items:category.items.map((product)=>{
                  if(product.id === id){
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

    const decreaseCart = (id) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          selectedQuantity: item.selectedQuantity - 1,
                          quantityAvailable: item.quantityAvailable + 1,
                      }
                    : item
            )
        );

        setAvailableItems((prevItems)=>{
            return prevItems.map((category)=>{
              return {
                ...category,
                items:category.items.map((product)=>{
                  if(product.id === id){
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
    const removeCartItem = (ItemID) =>{

      const updateCart = cartItems.filter(prev => prev.id !== ItemID);
      setCartItems(updateCart);

      setAvailableItems((prevItems)=>{
        return prevItems.map((category)=>{
              return {
                ...category,
                items:category.items.map((product)=>{
                  if(product.id === ItemID){
                    return {
                      ...product,
                      selectedQuantity:1,
                      quantityAvailable:product.quantityAvailable + product.selectedQuantity - 1,
                    };
                  }
                  return product;
                }
                ),
              };
            });
          });
    };

    return (
        <div classname="cart">
             <Row gutter={[16, 16]} className="cart-header">
                 <Col span={4}><strong>ItemId</strong></Col>
                 <Col span={5}><strong>ItemName</strong></Col>
                 <Col span={4}><strong>Price</strong></Col>
                 <Col span={4}><strong>Quantity</strong></Col>
                 <Col span={4}><strong>Total</strong></Col>
            </Row>
            {cartItems.length === 0 ? (<h3 style={{color:'red'}}>Your cart is Empty</h3>):
            (cartItems.map((item) => (
                <Row key={item.id} gutter={[16, 16]} className="cart-item-row">
                    <Col span={4}>
                        <p>{item.id}</p>
                    </Col>
                    <Col span={5}>
                        <p>{item.name}</p>
                    </Col>
                    <Col span={4}>
                        <p>₹{item.price}</p>
                    </Col>
                    <Col span={4}>
                        <Row
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-around',
                            }}
                        >
                            <Button
                                onClick={() => decreaseCart(item.id)}
                                size="small"
                                icon={<ArrowDownOutlined />}
                                style={{
                                    outline: 'none',
                                    border: '1px solid transparent',
                                    backgroundColor: 'transparent',
                                }}
                                disabled={item.selectedQuantity === 1} // Disable if selectedQuantity is 0
                            ></Button>
                            {item.selectedQuantity}
                            <Button
                                onClick={() => increaseCart(item.id)}
                                size="small"
                                icon={<ArrowUpOutlined />}
                                style={{
                                    outline: 'none',
                                    border: '1px solid transparent',
                                    backgroundColor: 'transparent',
                                }}
                                disabled={item.quantityAvailable <= 0} // Disable if quantityAvailable is 0
                            ></Button>
                        </Row>
                    </Col>
                    <Col span={4}>
                        ₹ {item.price * item.selectedQuantity}{' '}
                        {/* Calculating total price */}
                    </Col>
                    <Col span={2}>
                      <DeleteTwoTone twoToneColor="#FF5733" onClick={()=>removeCartItem(item.id)}/>
                    </Col>
                </Row>
            )))}
        </div>
    );
};

export default CartComponent;
