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
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary fw-bold">Zarządzanie Zamówieniami</h2>
                <button className="btn btn-outline-primary btn-sm" onClick={fetchAllOrders}>
                    <i className="bi bi-arrow-clockwise me-1"></i> Odśwież
                </button>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Ładowanie...</span>
                    </div>
                    <p className="mt-2 text-muted">Pobieranie zamówień...</p>
                </div>
            ) : (
                <div className="card shadow-lg border-0">
                    <div className="card-body p-0">
                        <OrderTable 
                            orders={orders} 
                            onRefresh={fetchAllOrders} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminOrderPage;