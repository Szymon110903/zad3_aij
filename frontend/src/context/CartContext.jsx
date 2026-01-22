import React, {createContext, useState, useContext} from "react";

const CartContext = React.createContext();

export const CartProvider = ({children}) => {
    const [cartItems, setCartItems] = useState([]);
    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => item._id === product._id);

            if (existingItem) {
                return prevItems.map(item => item._id === product._id ? {...item, quantity: item.quantity + product.quantity} : item);
            }
            return [...prevItems, product];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter(item => item._id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        setCartItems((prevItems) =>
            prevItems.map(item =>
                item._id === productId ? {...item, quantity: newQuantity} : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};