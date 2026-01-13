import React, { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import ProductsTable from "../components/productsTable.jsx"; 
import ActionOrder from "../components/ActionOrder.jsx";

function OrderPage() {
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const [recipient, setRecipient] = useState({
        username: "",
        email: "",
        phone: "",
        city: "",
        postal_number: "",
        street: "",
        number: "" 
    });

    const [errors, setErrors] = useState({});

    const totalOrderValue = cartItems.reduce((acc, item) => acc + (item.cena_jednostkowa * item.quantity), 0).toFixed(2);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecipient(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        
        if (!recipient.username.trim()) newErrors.username = "Nazwa jest wymagana.";
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!recipient.email) newErrors.email = "Email jest wymagany.";
        else if (!emailRegex.test(recipient.email)) newErrors.email = "Błędny format email.";

        const phoneRegex = /^[0-9]{9,15}$/;
        if (!recipient.phone) newErrors.phone = "Telefon jest wymagany.";
        else if (!phoneRegex.test(recipient.phone)) newErrors.phone = "Błędny format telefonu.";

        if (!recipient.city.trim()) {
            newErrors.city = "Miejscowość jest wymagana.";
        }

        const postalRegex = /^[0-9]{2}-[0-9]{3}$/;
        if (!recipient.postal_number) {
            newErrors.postal_number = "Kod pocztowy jest wymagany.";
        } else if (!postalRegex.test(recipient.postal_number)) {
            newErrors.postal_number = "Format: XX-XXX (np. 00-123).";
        }
        if (!recipient.street.trim()) {
            newErrors.street = "Ulica jest wymagana.";
        }
        if (!recipient.number.trim()) {
            newErrors.number = "Numer domu jest wymagany.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            console.log("Wysyłanie zamówienia:", { recipient, products: cartItems, total: totalOrderValue });
            alert("Zamówienie przyjęte!");
            navigate('/');
        } else {
            alert("Popraw błędy w formularzu.");
        }
    };

    if (cartItems.length === 0) return <div className="text-center mt-5">Koszyk pusty</div>;

    return (
        <div className="container mt-5 mb-5">
            <h2 className="mb-4 text-center">Finalizacja Zamówienia</h2>
            
            <div className="row">
                {/* FORMULARZ */}
                <div className="col-lg-5 mb-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-dark text-white">
                            <h4 className="mb-0 fs-5">Dane Odbiorcy</h4>
                        </div>
                        <div className="card-body p-4">
                            <form>
                                {/* DANE KONTAKTOWE */}
                                <h6 className="text-muted text-uppercase small fw-bold mb-3">Kontakt</h6>
                                
                                <div className="mb-3">
                                    <label className="form-label">Imię i Nazwisko</label>
                                    <input type="text" className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                        name="username" value={recipient.username} onChange={handleChange} />
                                    {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Email</label>
                                        <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            name="email" value={recipient.email} onChange={handleChange} />
                                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Telefon</label>
                                        <input type="tel" className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                            name="phone" value={recipient.phone} onChange={handleChange} />
                                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                                    </div>
                                </div>

                                <hr className="my-4"/>

                                {/* ADRES */}
                                <h6 className="text-muted text-uppercase small fw-bold mb-3">Adres dostawy</h6>

                                <div className="row">
                                    <div className="col-md-8 mb-3">
                                        <label className="form-label">Ulica</label>
                                        <input type="text" className={`form-control ${errors.street ? 'is-invalid' : ''}`}
                                            name="street" value={recipient.street} onChange={handleChange} placeholder="np. Marszałkowska"/>
                                        {errors.street && <div className="invalid-feedback">{errors.street}</div>}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label">Nr domu</label>
                                        <input type="text" className={`form-control ${errors.number ? 'is-invalid' : ''}`}
                                            name="number" value={recipient.number} onChange={handleChange} placeholder="np. 10/24"/>
                                        {errors.number && <div className="invalid-feedback">{errors.number}</div>}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-5 mb-3">
                                        <label className="form-label">Kod pocztowy</label>
                                        <input type="text" className={`form-control ${errors.postal_number ? 'is-invalid' : ''}`}
                                            name="postal_number" value={recipient.postal_number} onChange={handleChange} placeholder="00-000"/>
                                        {errors.postal_number && <div className="invalid-feedback">{errors.postal_number}</div>}
                                    </div>
                                    <div className="col-md-7 mb-3">
                                        <label className="form-label">Miejscowość</label>
                                        <input type="text" className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                                            name="city" value={recipient.city} onChange={handleChange} placeholder="np. Warszawa"/>
                                        {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>

                {/* PODSUMOWANIE*/}
                <div className="col-lg-7">
                    <div className="card shadow-lg border-0">
                        
                        <div className="card-header bg-dark text-white py-3">
                            <h4 className="mb-0 fs-5">Twoje produkty</h4>
                        </div>

                        <div className="card-body p-0">
                            <div className="table-responsive"> 
                                <ProductsTable 
                                    products={cartItems} 
                                    ActionElement={ActionOrder} 
                                />
                            </div>
                        </div>
                        
                        <div className="card-footer bg-light p-4 border-top">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="fs-5 text-muted">Do zapłaty:</span>
                                <span className="fs-2 fw-bold text-success">{totalOrderValue} zł</span>
                            </div>
                            
                            <button 
                                className="btn btn-success w-100 btn-lg fw-bold shadow-sm py-3 text-uppercase"
                                style={{ letterSpacing: '1px' }}
                                onClick={handleSubmit}
                            >
                                Zamów i zapłać
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderPage;