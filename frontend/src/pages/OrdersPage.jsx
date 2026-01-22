import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import orderService from "../services/orderService";
import OrderTable from "../components/OrderTable"; 

function OrdersPage() {
    const { username } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const pobierzZamowienia = async () => {
        if (!username) return;
        setLoading(true);
        try {
            const data = await orderService.getUserOrders(username);
            const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sortedData);
        } catch (err) {
            console.error(err);
            setError('Nie udało się pobrać zamówień.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        pobierzZamowienia();
    }, [username]);

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Twoje zamówienia</h2>
            
            {loading && <div className="text-center">Ładowanie...</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            
            {!loading && (
                <OrderTable 
                    orders={orders} 
                    onRefresh={pobierzZamowienia} 
                />
            )}
        </div>
    );
}

export default OrdersPage;