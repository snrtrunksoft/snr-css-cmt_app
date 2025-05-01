import ItemCategories from "./ItemCategories";
import ItemsStore from "./ItemsStore";

const NonAdminBody = ({selectedItemType, setSelectedItemType, filteredItems, setCartItems,setTextToFilterItems,setAvailableItems,setSelectionCriteria}) => {
    return(
        <div>
            <ItemCategories selectedItemType={selectedItemType} setSelectedItemType={setSelectedItemType} setTextToFilterItems={setTextToFilterItems} setSelectionCriteria={setSelectionCriteria}/>
            <ItemsStore filteredItems={filteredItems} setCartItems={setCartItems} setAvailableItems={setAvailableItems}/>
        </div>
    )
}

export default NonAdminBody;