import React, { useState } from "react";
import Alert from "./alert.jsx";
import { useCart } from "../context/CartContext.jsx";
import CounterButtons from "./CounterButtons.jsx";

function ActionAddToCart({ product }) {
    const [licznik, setLicznik] = useState(0); // Domyślnie 0
    const [showAlert, setShowAlert] = useState({
        show: false,
        message: '',
        type: ''
    });
    
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        if (licznik > 0) {
            // Dodanie do koszyka
            addToCart({ ...product, quantity: licznik });
            
            // Powiadomienie
            setShowAlert({
                show: true,
                message: `Dodano ${licznik} szt. "${product.nazwa}" do koszyka.`,
                type: "success"
            });

            // 👇 UX: Reset licznika po dodaniu, aby uniknąć dublowania kliknięć
            setLicznik(0); 

        } else {
            // Błąd walidacji
            setShowAlert({
                show: true,
                message: `Wybierz ilość produktu przed dodaniem.`,
                type: "danger"
            });
        }

        // Ukrycie alertu po 3 sek
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
                    disabled={licznik === 0} // Opcjonalnie: zablokuj przycisk gdy 0
                >
                    <i className="bi bi-cart-plus me-1"></i> Dodaj
                </button>
            </div>

            {/* Alert wyświetlany absolutnie pod przyciskami lub obok */}
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