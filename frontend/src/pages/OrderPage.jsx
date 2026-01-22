import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import orderService from "../services/orderService.jsx";
import AddressForm from "../components/AddressForm";
import OrderSummary from "../components/OrderSummary";

function OrderPage() {
    const { username } = useAuth();
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [idStatusu, setIdStatusu] = useState(null);
    const [recipient, setRecipient] = useState({
        firstname: "",
        lastname: "", 
        email: "", 
        phone: "",
        city: "", 
        postal_number: "", 
        street: "", 
        number: "" 
    });
    const [errors, setErrors] = useState({});

    const totalOrderValue = cartItems.reduce((acc, item) => acc + (item.cena_jednostkowa * item.quantity), 0).toFixed(2);


    useEffect(() => {
        const pobierzStatusy = async () => {
            try {
                const statusy = await orderService.getOrderStatuses();
                const statusNiezatwierdzony = statusy.find(item => item.nazwa === 'NIEZATWIERDZONE');
                if (statusNiezatwierdzony) setIdStatusu(statusNiezatwierdzony._id);
            } catch (err) {
                console.error("Błąd statusów:", err);
            }
        };
        pobierzStatusy();
    }, []); 

    const validate = () => {
        const newErrors = {};
        if (!recipient.firstname.trim()) newErrors.firstname = "Imie jest wymagane.";
        if (!recipient.lastname.trim()) newErrors.lastname = "Nazwisko jest wymagane.";
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!recipient.email) newErrors.email = "Email jest wymagany.";
        else if (!emailRegex.test(recipient.email)) newErrors.email = "Błędny format email.";

        const phoneRegex = /^[0-9]{9,15}$/;
        if (!recipient.phone) newErrors.phone = "Telefon jest wymagany.";
        else if (!phoneRegex.test(recipient.phone)) newErrors.phone = "Błędny format telefonu.";

        if (!recipient.city.trim()) newErrors.city = "Miejscowość jest wymagana.";
        const postalRegex = /^[0-9]{2}-[0-9]{3}$/;
        if (!recipient.postal_number) newErrors.postal_number = "Kod pocztowy jest wymagany.";
        else if (!postalRegex.test(recipient.postal_number)) newErrors.postal_number = "Format: XX-XXX.";

        if (!recipient.street.trim()) newErrors.street = "Ulica jest wymagana.";
        if (!recipient.number.trim()) newErrors.number = "Numer domu jest wymagany.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecipient(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleSubmit = async () => {
        if (!validate()) {
            alert("Popraw błędy w formularzu.");
            return;
        }
        setLoading(true);
        try {
            const zmapowanyKoszyk = cartItems.map(item => ({
                produkt: item._id,
                ilosc: Number(item.quantity),
                cenaWChwiliZakupu: parseFloat(item.cena_jednostkowa), 
                stawkaVat: 23, rabat: 0
            }));

            const order = {
                stan: idStatusu,
                nazwaUzytkownika: username,
                imie: recipient.firstname,
                nazwisko: recipient.lastname,
                email: recipient.email,
                telefon: recipient.phone,
                pozycje: zmapowanyKoszyk,
                sumaCalkowita: Number(totalOrderValue),
                zamieszkanie: {
                    miejscowosc: recipient.city,
                    kod_pocztowy: recipient.postal_number,
                    ulica: recipient.street,
                    nrDomu: recipient.number
                }
            };

            await orderService.createOrder(order);
            alert("Zamówienie złożone pomyślnie!");
            if (clearCart) clearCart();
            navigate('/'); 

        } catch (err) {
            console.error("Błąd wysyłania:", err);
            const msg = err.response?.data?.error || err.response?.data?.message || err.message;
            alert(`Błąd: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) return <div className="text-center mt-5">Koszyk pusty</div>;

    return (
        <div className="container mt-5 mb-5">
            <h2 className="mb-4 text-center fw-bold">Finalizacja Zamówienia</h2>
            
            <div className="row g-4 align-items-stretch">
                
                <div className="col-lg-5 mb-4 mb-lg-0">
                    <AddressForm 
                        recipient={recipient}
                        errors={errors}
                        onChange={handleChange} 
                    />
                </div>

                <div className="col-lg-7">
                    <OrderSummary 
                        cartItems={cartItems}
                        totalValue={totalOrderValue}
                        loading={loading}
                        onSubmit={handleSubmit} 
                    />
                </div>
            </div>
        </div>
    );
}

export default OrderPage;