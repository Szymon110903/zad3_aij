import React from "react";
import { useCart } from "../context/CartContext.jsx";
import ProductsTable from "../components/ProductsTable.jsx";
import ActionOrder from "../components/ActionOrder.jsx";

function CartPage() {
    const { cartItems } = useCart();
    
    return (
        <div className="text-center mt-5">
            <h2>Twój koszyk</h2>
            <div className="container mt-4">
            <div className="card shadow-lg">
                <div className="card-body p-4">

                        <ProductsTable products={cartItems} ActionElement={ActionOrder} />
            </div>
            </div>
            </div>
        </div>
    );
}
export default CartPage;