import React, { useEffect, useState } from "react";
import orderService from "../services/orderService";
import OrderTable from "../components/OrderTable";

function AdminOrdersPage() {
    const [allOrders, setAllOrders] = useState([]);    
    const [filteredOrders, setFilteredOrders] = useState([]); 
    const [statuses, setStatuses] = useState([]);        
    const [currentFilter, setCurrentFilter] = useState("Wszystkie");
    
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [ordersData, statusesData] = await Promise.all([
                orderService.getAllOrders(),
                orderService.getOrderStatuses()
            ]);
            
            const sorted = ordersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            setAllOrders(sorted);
            setFilteredOrders(sorted);
            setStatuses(statusesData);
        } catch (err) {
            console.error(err);
            alert("Błąd pobierania danych admina.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (currentFilter === "Wszystkie") {
            setFilteredOrders(allOrders);
        } else {
            const filtered = allOrders.filter(order => 
                order.stan?.nazwa === currentFilter || order.stan === currentFilter
            );
            setFilteredOrders(filtered);
        }
    }, [currentFilter, allOrders]);

    return (
        <div className="container mt-4">
             <h2 className="mb-4 text-danger">Panel Administratora</h2>
             <OrderTable orders={allOrders} onRefresh={fetchData} />
        </div>
    );
}

export default AdminOrdersPage;