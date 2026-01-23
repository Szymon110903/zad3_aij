import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import orderService from "../services/orderService";
import OrderTable from "../components/OrderTable"; 

function OrdersPage() {
    const { username } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const pobierzZamowienia = useCallback(async () => {
        if (!username) return;
        
        setLoading(true);
        setError('');
        try {
            const data = await orderService.getUserOrders(username);
            
            const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            setOrders(sortedData);
        } catch (err) {
            console.error("Błąd pobierania zamówień:", err);
            setError('Nie udało się pobrać historii zamówień.');
        } finally {
            setLoading(false);
        }
    }, [username]);

    useEffect(() => {
        pobierzZamowienia();
    }, [pobierzZamowienia]);

    return (
        <div className="container mt-5 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-0 text-dark">Twoje Zamówienia</h2>
                    <p className="text-muted small mb-0">Historia i statusy Twoich zakupów</p>
                </div>
                
                <button 
                    className="btn btn-outline-primary btn-sm shadow-sm" 
                    onClick={pobierzZamowienia}
                    disabled={loading}
                >
                    <i className={`bi bi-arrow-clockwise me-1 ${loading ? 'spinner-border spinner-border-sm' : ''}`}></i> 
                    {loading ? 'Odświeżanie...' : 'Odśwież'}
                </button>
            </div>
            
            {error && (
                <div className="alert alert-danger shadow-sm border-0">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
                </div>
            )}
            
            {loading && orders.length === 0 ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-2 text-muted">Ładowanie zamówień...</p>
                </div>
            ) : (
                <OrderTable 
                    orders={orders} 
                    onRefresh={pobierzZamowienia} 
                />
            )}
        </div>
    );
}

export default OrdersPage;