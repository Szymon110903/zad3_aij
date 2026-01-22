import React, { useState, useEffect, useCallback } from "react";
import orderService from "../services/orderService";
import OrderTable from "../components/OrderTable"; 

function AdminOrderPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchAllOrders = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = await orderService.getAllOrders();
            const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sortedData);
        } catch (err) {
            console.error("Błąd pobierania zamówień:", err);
            setError("Nie udało się pobrać listy wszystkich zamówień.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllOrders();
    }, [fetchAllOrders]);

    return (
        <div className="container mt-5 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-0 text-dark">Panel Administratora</h2>
                    <p className="text-muted small mb-0">Zarządzaj wszystkimi zamówieniami w systemie</p>
                </div>
                
                <button 
                    className="btn btn-primary shadow-sm" 
                    onClick={fetchAllOrders}
                    disabled={loading}
                >
                    <i className={`bi bi-arrow-clockwise me-2 ${loading ? 'spinner-border spinner-border-sm' : ''}`}></i> 
                    {loading ? 'Odświeżanie...' : 'Odśwież listę'}
                </button>
            </div>

            {error && (
                <div className="alert alert-danger shadow-sm border-0" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
                </div>
            )}

            {loading && orders.length === 0 ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status" style={{width: "3rem", height: "3rem"}}>
                        <span className="visually-hidden">Ładowanie...</span>
                    </div>
                    <p className="mt-3 text-muted fw-bold">Pobieranie danych...</p>
                </div>
            ) : (
                <OrderTable 
                    orders={orders} 
                    onRefresh={fetchAllOrders} 
                />
            )}
        </div>
    );
}

export default AdminOrderPage;