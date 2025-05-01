
import React from 'react';
import { Row, Col, Button, Input} from 'antd';
import './AddToCart.css';

const AddToCart = ({ index,addToCart,handleIncrement,handleDecrement,filteredItems}) => {

    return (
        <div class='item-cart-main-div' >
            {filteredItems[index] ? (
            <div>
              <Row >
                <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={filteredItems[index].image} alt={filteredItems[index].name} className="inventory-image-cart" />
                </Col>
              </Row>
              <Row>
                <div style={{ fontSize: '15px', marginBottom: '2px' }}>BarCode: {filteredItems[index].barCode} , {+" "}</div>
                <div style={{ fontSize: '15px', marginBottom: '2px' }}> {filteredItems[index].quantityAvailable} left in Store</div>
              </Row>
              <Row style={{ alignItems: 'right', marginBottom: '10px' }}>
                <Button onClick={()=>handleDecrement(filteredItems[index].id)} style={{ marginRight: '5px' }} disabled={(filteredItems[index].selectedQuantity<=1 ? true:false)}>-</Button>
                <Input
                  value={filteredItems[index].selectedQuantity}
                  // onChange={(e) => setItemCount(parseInt(e.target.value) || 1)}
                  style={{ width: '50px', textAlign: 'center' }}
                />

                <Button onClick={()=>handleIncrement(filteredItems[index].id)} style={{ marginLeft: '5px' }} disabled={(filteredItems[index].quantityAvailable===0 ? true:false)}>+</Button>
                <Button disabled={filteredItems[index].selectedQuantity===0} type="primary" onClick={()=> addToCart(filteredItems[index])}>
                    Add to Cart
                  </Button>
              </Row>
            </div>
          ) : (
            'Loading...'
          )}
        </div>
    )
}

export default AddToCart;