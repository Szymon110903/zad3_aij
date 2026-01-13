import React, {useState} from "react";
import Alert from "./alert.jsx";
import { useCart } from "../context/CartContext.jsx";
import CounterButtons from "./CounterButtons.jsx";

function ActionAddToCart({ product}) {
    const [licznik, setLicznik] = useState(Number(0));
    const [showAlert, setShowAlert] = useState(
    {
        show: false,
        message: '',
        type: ''
    });
    const { addToCart } = useCart();

    const HandleAddToCart = () => {
        if (licznik > 0) {
            console.log(`Dodano ${licznik} sztuk produktu ${product.nazwa} do koszyka.`);
            setShowAlert({
                show: true,
                message: `Dodano ${licznik} sztuk produktu ${product.nazwa} do koszyka.`,
                type: "success"
            });
            
            addToCart({ ...product, quantity: licznik });
        }else
        {
            setShowAlert({
                show: true,
                message: `Wybierz ilość produktu ${product.nazwa} przed dodaniem do koszyka.`,
                type: "danger"
            });
        }
        setTimeout(() => {
            setShowAlert(prev => ({ ...prev, show: false }));
        }, 3000);
    };

    return (
        <div>
          
            <CounterButtons 
                value = {licznik}
                onChange={setLicznik}
             />
             <button className="btn btn-primary btn-sm"
                onClick={HandleAddToCart}
            >Dodaj do koszyka</button>
            <Alert 
                message={showAlert.message} 
                show={showAlert.show} 
                type={showAlert.type}
                onClose={() => setShowAlert(prev => ({ ...prev, show: false }))}
            />
        </div>
    );
}
export default ActionAddToCart;