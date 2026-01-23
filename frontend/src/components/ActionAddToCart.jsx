import React, { useState } from "react";
import Alert from "./alert.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx"; 
import CounterButtons from "./CounterButtons.jsx";

function ActionAddToCart({ product }) {
    const [licznik, setLicznik] = useState(0);
    const [showAlert, setShowAlert] = useState({
        show: false,
        message: '',
        type: ''
    });
    
    const { addToCart } = useCart();
    const { isAdmin } = useAuth(); 

    const handleAddToCart = () => {
        if (isAdmin) {
            setShowAlert({
                show: true,
                message: 'Administrator nie może składać zamówień.',
                type: 'danger'
            });
            
            setTimeout(() => {
                setShowAlert(prev => ({ ...prev, show: false }));
            }, 3000);
            return; 
        }

        if (licznik > 0) {
            addToCart({ ...product, quantity: licznik });
            
            setShowAlert({
                show: true,
                message: `Dodano ${licznik} szt. "${product.nazwa}" do koszyka.`,
                type: "success"
            });

            setLicznik(0); 

        } else {
            setShowAlert({
                show: true,
                message: `Wybierz ilość produktu przed dodaniem.`,
                type: "danger"
            });
        }

        setTimeout(() => {
            setShowAlert(prev => ({ ...prev, show: false }));
        }, 3000);
    };

    return (
        <div className="position-relative">
            <div className="d-flex align-items-center gap-2">
                <CounterButtons 
                    value={licznik}
                    onChange={setLicznik}
                />
                <button 
                    className="btn btn-primary btn-sm text-nowrap"
                    onClick={handleAddToCart}
                    disabled={licznik === 0} 
                >
                    <i className="bi bi-cart-plus me-1"></i> Dodaj
                </button>
            </div>

            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, marginTop: '5px' }}>
                <Alert 
                    message={showAlert.message} 
                    show={showAlert.show} 
                    type={showAlert.type}
                    onClose={() => setShowAlert(prev => ({ ...prev, show: false }))}
                />
            </div>
        </div>
    );
}

export default ActionAddToCart;