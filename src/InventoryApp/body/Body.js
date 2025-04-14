import React, { useState, useEffect } from 'react';
import ItemCategories from './user/ItemCategories';
import ItemsStore from './user/ItemsStore';
import './Body.css';
import AdminBody from './admin/AdminBody';
import NonAdminBody from './user/NonAdminBody';
import {LoadingOutlined} from '@ant-design/icons';

const Body = ({ filteredItems, setFilteredItems, availableItems, setAvailableItems, cartItems, setCartItems, isAdmin, user, isLoadingItems }) => {

  const [searchText, setSearchText] = useState("");
  const [selectedFilter,setSelectedFilter] = useState("categories");

  return (
    <div className="cart-page">
      {user.userId === '015b35a0-7011-7020-020f-5be611f8a749' ? (
        <AdminBody  setCartItems={setCartItems}/>
      ) : (
        <div>
            <ItemCategories selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} setFilteredItems={setFilteredItems} availableItems={availableItems} searchText={searchText} setSearchText={setSearchText}/>
            {isLoadingItems ? (<p style={{marginTop:'20px'}}>{<LoadingOutlined/>} Loading Store Items..!</p>) : (
              <ItemsStore
                filteredItems={filteredItems}
                setFilteredItems={setFilteredItems}
                setCartItems={setCartItems}
                availableItems={availableItems}
                setAvailableItems={setAvailableItems}
                isLoadingItems={isLoadingItems}
              />
            )}
        </div>
      )}      
    </div>
  );
};

export default Body;