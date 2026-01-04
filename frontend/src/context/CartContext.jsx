import React, {createContext, useState, useContext} from "react";

// kontekst koszyka
const CartContext = React.createContext();

// provider - udostepnianie stanu - wykonawca
export const CartProvider = ({children}) => {
    const [cartItems, setCartItems] = useState([]);
    //add
    const addToCart = (product) => {
        setCartItems((prevItems) => {
            //sprawdzenie czy produkt jest w koszyku
            const existingItem = prevItems.find(item => item._id === product._id);

            if (existingItem) {
                //zwiekszanie ilości jeśli istnieje
                return prevItems.map(item => item._id === product._id ? {...item, quantity: item.quantity + product.quantity} : item);
            }
            //dodanie produktu
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

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity }}>
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