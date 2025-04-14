import React, { useState } from "react";
import { Badge, Button, Row } from "antd";
import {
  ShoppingCartOutlined,
  ReloadOutlined,
  LogoutOutlined,
  HomeOutlined,
  LeftOutlined,
} from "@ant-design/icons";
// import "antd/dist/reset.css";
import "./InventoryHeader.css";
import { ChevronLeft } from "lucide-react";

function InventoryHeader({ setOpenShoppingApp, resetCart, cartCount, isAdmin, signOut, switchView }) {
  const [isCartPageLoaded, setIsCartPageLoaded] = useState(false);

  const handleStartOver = () => {
    resetCart(); // Reset the cart
    setIsCartPageLoaded(false);
    switchView("home");
    window.location.reload();
  };

  const proceedToCheckout = () => {
    setIsCartPageLoaded(true);
    switchView("checkout");
  };

  const goToHomePage = () => {
    setIsCartPageLoaded(false);
    switchView("home");
  };

  return (
    <header className="App-header">
      <div className="header-left">
        <h1>SNR's Inventory Store</h1>
        <h2>Round Rock, Tx.</h2>
      </div>
      <div className="header-buttons">
        <Row >
          <Button style={{margin:'10px',marginTop:'0px'}} className="icon-expand-button" icon={<LeftOutlined/>} onClick={() => setOpenShoppingApp(false)}>
            <span className="button-text">Back</span>
          </Button>
        </Row>
        <Row >
          {/* Shopping Cart or Home Button */}
          {!isCartPageLoaded ? (
            <Badge count={cartCount} overflowCount={99} offset={[10, 0]}>
              <Button
                style={{ margin: "0px" }}
                icon={<ShoppingCartOutlined />}
                onClick={proceedToCheckout}
                size="default"
              />
            </Badge>
          ) : (
            <Button
              icon={<HomeOutlined />}
              onClick={goToHomePage}
              style={{ marginLeft: "-10px" }}
            />
          )}

          {/* Sign Out Button */}
          <Button onClick={signOut} icon={<LogoutOutlined />} />
        </Row>

          {/* Start Over Button */}
        <Button style={{margin:'10px'}} type="primary" size="medium" icon={<ReloadOutlined />} onClick={handleStartOver}>
            Start Over
          </Button>
        

        {/* Admin Login Section */}
        {/* {isAdmin && <div style={{ margin: "5px" }}>Admin Login</div>} */}
      </div>
    </header>
  );
}

export default InventoryHeader;