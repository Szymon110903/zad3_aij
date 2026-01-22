import React from "react";
import { useCart } from "../context/CartContext.jsx";
import CounterButtons from "./CounterButtons.jsx";

function ActionOrder({ product }) {
    const { removeFromCart, updateQuantity } = useCart();

    const handleQuantityChange = (newVal) => {
        if (newVal < 1) return;
        updateQuantity(product._id, newVal);
    };

    const handleRemoveFromCart = () => {
            removeFromCart(product._id);
    };

    return (
        <div className="d-flex flex-column align-items-end gap-1">
            
            <CounterButtons
                value={product.quantity}
                onChange={handleQuantityChange}
            />
            
            <button 
                onClick={handleRemoveFromCart}
                className="btn btn-link text-danger p-0 text-decoration-none small opacity-75 hover-opacity-100"
                style={{ fontSize: '0.85rem' }}
                title="Usuń z koszyka"
            >
                <i className="bi bi-trash me-1"></i> usuń
            </button>
        </div>
    );
}

export default ActionOrder;