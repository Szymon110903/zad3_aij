import { useCart } from "../context/CartContext.jsx";
import React from "react";
import CounterButtons from "./CounterButtons.jsx";

function ActionOrder({ product }) {
    const {removeFromCart, updateQuantity } = useCart();

    const handleQuantityChange = (newVal) => {
        if (newVal <1) return;
        updateQuantity(product._id, newVal);
    }
    const handleRemoveFromCart = () => {
        removeFromCart(product._id);
    }
    return (
        <div>
            <CounterButtons
            value={product.quantity}
            onChange={handleQuantityChange}
            />
            <button onClick={handleRemoveFromCart}>
                usuń
            </button>
        </div>
    )
}
export default ActionOrder;