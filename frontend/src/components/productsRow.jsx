import React, { use, useState } from 'react';
import Alert from './alert.jsx';

function ProductsRow({ product}) {
    const [licznik = 0, setLicznik] = useState(0);
    const [showAlert, setShowAlert] = useState(
    {
        show: false,
        message: '',
        type: ''
    });

    
    const HandleAddToCart = () => {
        if (licznik > 0) {
            console.log(`Dodano ${licznik} sztuk produktu ${product.nazwa} do koszyka.`);
            setShowAlert({
                show: true,
                message: `Dodano ${licznik} sztuk produktu ${product.nazwa} do koszyka.`,
                type: "success"
            });
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

    const HandleIncrement = () => {
        setLicznik(licznik + 1);
    };

    const HandleDecrement = () => {
        if (licznik > 0) {
            setLicznik(licznik - 1);
        }
    };

    return (
        <tr>
            <td>{product.nazwa}</td>
            <td>{product.cena_jednostkowa} zł</td>
            <td>{product.opis}</td>
            <td> 
                <button className="btn btn-outline-dark btn-sm"
                    onClick={HandleDecrement}
                >&lt;</button>
                <button className="btn btn-outline-dark btn-sm">{licznik}</button>
                <button className="btn btn-outline-dark btn-sm" 
                    onClick={HandleIncrement}
                >&gt;</button>
            </td>
            <td>
                <button className="btn btn-primary btn-sm"
                    onClick={HandleAddToCart}
                >Dodaj do koszyka</button>
                <Alert 
                    message={showAlert.message} 
                    show={showAlert.show} 
                    type={showAlert.type}
                    onClose={() => setShowAlert(prev => ({ ...prev, show: false }))}
                />
            </td>
        </tr>
        
    )
    
}
export default ProductsRow