import React from "react";

const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pl-PL", {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};

// 1. Dodajemy onClick do propsów
function OrderRow({ order, onClick }) {
    return (
        <tr 
            onClick={() => onClick(order)} 
            style={{ cursor: "pointer" }} 
            className="align-middle"
        >
            <td className="fw-bold">#{order._id.slice(-6)}</td>
            <td>{formatDate(order.createdAt)}</td>
            <td className="text-center">{order.pozycje?.length || 0}</td>
            <td className="fw-bold text-success">
                {order.sumaCalkowita?.toFixed(2)} zł
            </td>
            <td>
                <span className={`badge ${order.stan?.nazwa === 'ZREALIZOWANE' ? 'bg-success' : 'bg-warning text-dark'}`}>
                    {order.stan?.nazwa || 'Nieznany'}
                </span>
            </td>
        </tr>
    );
}

export default OrderRow;