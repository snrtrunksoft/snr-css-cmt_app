import React, { useState } from "react";
import { Modal, Row, Col, Checkbox, Form, Button, Input } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Cart from "./user/Cart";
import TotalSummary from "./TotalSummary";
import OrderSuccess from "./OrderSuccess";
import CardDetailsForm from "./CardDetailsForm"; // Updated form
import "./Checkout.css";
import img from "../assets/upi-icon.webp";

const stripePromise = loadStripe(
  "pk_test_51QDx1zI0lYouuTUdsrdngky9PqFFnM1msIqya6vohTYK8BvmyIaPBlbjIOlptsOAsKo4gRY4VhHj9m9LTlEVROel00CmHobYmB"
); // Replace with your Stripe publishable key

const Checkout = ({
  availableItems,
  setAvailableItems,
  resetCart,
  cartItems,
  setCartItems,
  switchView,
  user,
}) => {
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.selectedQuantity,
    0
  );
  const [isSuccessModalPageVisible, setIsSuccessModalPageVisible] =
    useState(false);
  const [status, setStatus] = useState("success");
  const [title, setTitle] = useState("Successfully Placed New Order");
  const [paymentMode, setPaymentMode] = useState("cash");
  const [upiId, setUpiId] = useState("");
  const [isValid, setIsValid] = useState(null);
  const [message, setMessage] = useState("");
  const [subTitle, setSubTitle] = useState(
    "Unexpected error occured, Please contact admin..!!"
  );
  const upiRegex = /^[a-zA-Z0-9.]+@[a-zA-Z0-9]{3,6}$/;

  const handleModalClose = () => {
    if(status === "success"){
      resetCart(); // Reset the cart
      window.location.reload();
      switchView('home');
    } else {
      setIsSuccessModalPageVisible(false);
    };
  };

  const saveOrder = async () => {
    setIsSuccessModalPageVisible(true);
    setIsLoading(true);
    console.log('user', user);
    console.log('mail:', user.signInDetails.loginId);
    console.log('cartItems:', cartItems);

    const apiUrl =
      "https://ft9zc297k7.execute-api.us-east-2.amazonaws.com/orders/";

    const orderData = {
      createdTime: new Date().toISOString(),
      updatedTime: new Date().toISOString(),
      placedBy: user?.signInDetails?.loginId || "Guest",
      status: paymentMode === "cash" ? "CashPaid" : "Pending",
      items: cartItems.map((item) => ({
        id: item.id,
        quantity: item.selectedQuantity,
        category: item.category
      })),
      totalAmount: totalPrice.toString(),
    };
    console.log('orderData:', orderData);
    
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save order: ${response.statusText}`);
      }

      const data = await response.json();
      setIsLoading(false);
      setStatus("success");
      setTitle("Successfully Placed New Order");
      setSubTitle(
        <span>
          Your Order number is: <b>{data.orderId}</b>. Thank you!!
        </span>
      );
    } catch (error) {
      setIsLoading(false);
      setStatus("warning");
      setTitle("Failed to Place Order");
      setSubTitle("Failed to place the order, please try again.");
    }
  };

  const handleInputChange = (e) => {
    setUpiId(e.target.value);
  };

  const handleVerify = () => {
    if (upiRegex.test(upiId)) {
      setIsValid(true);
      setMessage("UPI ID is valid!");
    } else {
      setIsValid(false);
      setMessage("Invalid UPI ID. Please check the format.");
    }
  };

  const [isLoading,setIsLoading] = useState(false);

  return (
    <Elements stripe={stripePromise}>
      <div className="checkout-page">
        <h2>Checkout Summary</h2>
        <Row gutter={16} className="checkout-container">
          {/* Left Column - Cart Items */}
          <Col span={12} className="cart-column">
            <Cart
              setAvailableItems={setAvailableItems}
              cartItems={cartItems}
              setCartItems={setCartItems}
            />
            <TotalSummary totalPrice={totalPrice} />
          </Col>

          {/* Right Column - Payment Modes */}
          <Col span={12}>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              <Checkbox
                checked={paymentMode === "cash"}
                onClick={() => setPaymentMode("cash")}
              >
                Cash
              </Checkbox>
              <Checkbox
                checked={paymentMode === "card"}
                onClick={() => setPaymentMode("card")}
              >
                Card
              </Checkbox>
              <Checkbox
                checked={paymentMode === "upi"}
                onClick={() => setPaymentMode("upi")}
              >
                UPI
              </Checkbox>
            </div>

            {/* Payment Forms */}
            <Row style={{margin:'15px 0px'}}>
              {paymentMode === "card" && (
                <Col span={24}>
                  <h3>Enter Card Details</h3>
                  <CardDetailsForm
                    setIsModalVisible={setIsSuccessModalPageVisible}
                    resetCart={resetCart}
                    setStatus={setStatus}
                    setTitle={setTitle}
                    setSubTitle={setSubTitle}
                  />
                </Col>
              )}
              {paymentMode === "upi" && (
                <Col span={24}>
                  <Form className="custom-card-form">
                    <Form.Item>
                      <img
                        src={img}
                        alt="upi-icon"
                        style={{ width: "50px", marginRight: "10px" }}
                      />
                      Enter your UPI ID
                    </Form.Item>
                    <Form.Item>
                      <Input
                        value={upiId}
                        onChange={handleInputChange}
                        placeholder="example@upi"
                      />
                      <Button onClick={handleVerify}>Verify</Button>
                    </Form.Item>
                    <Form.Item>
                      <div
                        style={{
                          fontWeight: "bold",
                          color: isValid === null ? "black" : isValid ? "green" : "red",
                        }}
                      >
                        {message}
                      </div>
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" onClick={saveOrder}>
                        Pay Now
                      </Button>
                    </Form.Item>
                  </Form>
                </Col>
              )}
              {paymentMode === "cash" && (
                <Col span={24}>
                  <Form className="custom-card-form">
                    <Form.Item>
                      <Input
                        type="number"
                        placeholder="Enter Cash Amount (e.g., 600)"
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" onClick={saveOrder}>
                        Complete Purchase
                      </Button>
                    </Form.Item>
                  </Form>
                </Col>
              )}
            </Row>
          </Col>
        </Row>

        {/* Modal for Order Success */}
        <Modal
          title={isLoading ? '' : title}
          visible={isSuccessModalPageVisible}
          onOk={handleModalClose}
          onCancel={handleModalClose}
          maskClosable= {true}
          footer={null}
        >
          {isLoading ? <h2 style={{display:'flex',alignItems:'center',justifyContent:'center',margin:'20px'}}><LoadingOutlined style={{margin:'10px'}}/> Loading...</h2>:(
            <div>
              <OrderSuccess
                switchView={switchView}
                resetCart={resetCart}
                status={status}
                title={title}
                subTitle={subTitle}
              />
          </div>
          )} 
          
        </Modal>
      </div>
    </Elements>
  );
};

export default Checkout;