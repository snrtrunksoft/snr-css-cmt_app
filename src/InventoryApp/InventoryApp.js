import React, { useState, useEffect, useRef} from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import awsmobile from '../aws-exports';
import '@aws-amplify/ui-react/styles.css';
import InventoryHeader from './header/InventoryHeader';
import Body from './body/Body';
import Checkout from './body/Checkout';
import UpdateOrder from './body/UpdateOrder';
import { Modal, Result,Button } from 'antd';
import './InventoryApp.css';

Amplify.configure(awsmobile);

function App({setOpenShoppingApp}) {
  const [cartItems, setCartItems] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentView, setCurrentView] = useState("home"); // Tracks the current view
  const isInitialLoad = useRef(true); 
  const [availableItems, setAvailableItems] = useState([]);
  const [availableItemsForReset, setAvailableItemsForReset] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [status,setStatus] = useState(null);
  const [statusMessage,setStatusMessage] = useState("");
  const [isModalOpen,setIsModalOpen] = useState(false);
  const [isLoadingItems, setIsLoadingItems] = useState(true);

   // Initial load, fetch availableItems from database
   useEffect(() => {
    console.log('Initial load, fetching availableItems from database');
    if (isInitialLoad.current) {
      console.log("Initial load, fetching availableItems from database");
  
      const fetchAvailableItems = async () => {
        try {
          // Fetch categories
          console.log('fetching categories');
          const categoriesResponse = await fetch(
            "https://l2wifnx033.execute-api.us-east-2.amazonaws.com/categories/"
          );
          const categories = await categoriesResponse.json();
          console.log('fetching categories complete');
  
          // Fetch all items
          console.log('fetching items');
          const itemsResponse = await fetch(
            "https://ze6vrasiw6.execute-api.us-east-2.amazonaws.com/items"
          );
          const items = await itemsResponse.json();
          console.log('fetching items complete');
  
          // Merge items with categories
          const mergedData = categories.map((category) => {
            // Filter items by category
            const categoryItems = items.filter(item => item.category.toLowerCase() === category.name.toLowerCase());
  
            return {
              category: category.name.toLowerCase(),
              items: categoryItems.map((item) => ({
                name: item.itemName,
                image: item.image,
                quantityAvailable: item.quantityAvailable,
                id: item.itemId,
                price: item.price,
                barCode: item.itemId || "",
                category: item.category
              })),
            };
          });
  
          console.log('mergedData:', mergedData);
  
          // Add selectedQuantity to each item and update state
          const updatedAvailableItems = mergedData.map((category) => ({
            ...category,
            items: category.items.map((item) => ({
              ...item,
              selectedQuantity: item.quantityAvailable > 0 ? 1 : 0,
              quantityAvailable: item.quantityAvailable > 0 ? item.quantityAvailable - 1 : 0,
            })),
          }));
  
          setAvailableItemsForReset(updatedAvailableItems);
          setAvailableItems(updatedAvailableItems);
  
          // Flatten and set filteredItems by default
          const flattenedItems = updatedAvailableItems.flatMap(
            (category) => category.items
          );
          setFilteredItems(flattenedItems);
          setIsLoadingItems(false);
  
          console.log("filteredItems:", flattenedItems);
        } catch (error) {
          setIsLoadingItems(false);
          console.error("Error fetching item types:", error);
          setIsModalOpen(true);
          setStatus("error");
          setStatusMessage("unable to fetch Data");
        }
      };
  
      fetchAvailableItems();
  
      // Mark initial load as complete
      isInitialLoad.current = false;
    }
  }, []);

  // Fetch user details.
  useEffect(() => {
    const poolData = {
      UserPoolId: awsmobile.aws_user_pools_id,
      ClientId: awsmobile.aws_user_pools_web_client_id,
    };
    const userPool = new CognitoUserPool(poolData);
    const currentUser = userPool.getCurrentUser();

    if (currentUser) {
      currentUser.getSession((err, session) => {
        if (err) {
          console.error("Error getting session:", err);
          return;
        }

        // Fetch attributes once session is established
        currentUser.getUserAttributes((err, attributes) => {
          if (err) {
            console.error("Error fetching attributes:", err);
            return;
          }

          // Find the 'custom:profile' attribute
          const profileAttribute = attributes.find(attr => attr.getName() === 'profile');
          const userProfile = profileAttribute ? profileAttribute.getValue() : '';
          setIsAdmin(userProfile === 'admin');
        });
      });
    } else {
      console.log("No user is currently signed in.");
    }
  }, []); // Only run once when the component mounts

  const resetCart = () => {
    
    setCartItems([]);
    console.log('reset setAvailableItemsForReset', setAvailableItemsForReset)
    // todo - use Rourter instead of this.??
    setAvailableItems(availableItemsForReset);
  };

  const cartCount = cartItems.length;

  // Define a function to switch views
  const switchView = (view) => {
    setCurrentView(view);
  };

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="App">
          {/* <InventoryHeader
            setOpenShoppingApp={setOpenShoppingApp}
            resetCart={resetCart}
            cartCount={cartCount}
            isAdmin={isAdmin}
            signOut={signOut}
            switchView={switchView} // Pass function to change views
          /> */}
          {currentView === "home" && (
            <Body
              filteredItems={filteredItems}
              setFilteredItems={setFilteredItems}
              availableItems={availableItems}
              setAvailableItems={setAvailableItems}
              cartItems={cartItems}
              setCartItems={setCartItems}
              isAdmin={isAdmin}
              user={user}
              isLoadingItems={isLoadingItems}
            />
          )}
          {currentView === "checkout" && (
            <Checkout
              availableItems={availableItems}
              setAvailableItems={setAvailableItems}
              resetCart={resetCart}
              cartItems={cartItems}
              setCartItems={setCartItems}
              switchView={switchView}
              user={user}
            />
          )}
          {currentView === "update-order" && <UpdateOrder resetCart={resetCart} />}
          <Modal
            title="Error"
            open={isModalOpen}
            onCancel={()=>setIsModalOpen(false)}
            footer={null}
            >
            <Result status={status} title={statusMessage}
            extra={[
              <Button type="primary" key="console" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>]}
            ></Result>
          </Modal>
        </div>
      )}
    </Authenticator>
  );
}

export default App;