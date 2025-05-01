import React, { useState } from 'react';
import OperationCategories from "./OperationCategories";
import { Divider } from 'antd';
import AdminCategories from "./AdminCategories";
import AdminItems from "./AdminItems";
import AdminDashboards from "./AdminDashboards";
import AdminUsers from "./AdminUsers";
import AdminHelpPage from "./AdminHelpPage";
import { AdminViewOrders } from "./AdminViewOrders";
const AdminBody = () => {
    const [selectedCategory, setSelectedCategory] = useState('dashboards');

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    return (
        <div>
            <OperationCategories onCategorySelect={handleCategorySelect} />
            <Divider style={{ borderColor: '#129bc4' }}>{selectedCategory}</Divider>
            
            {selectedCategory === 'categories' && <AdminCategories />}
            {selectedCategory === 'items' && <AdminItems />}
            {selectedCategory === 'dashboards' && <AdminDashboards />}
            {selectedCategory === 'users' && <AdminUsers />}
            {selectedCategory === 'viewOrders' && <AdminViewOrders/>}
            {selectedCategory === 'help' && <AdminHelpPage />}
        </div>
    );
}

export default AdminBody;