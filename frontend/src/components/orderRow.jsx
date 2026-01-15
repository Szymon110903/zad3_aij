import React from "react";

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pl-PL", {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};

function OrderRow({ order }) {
    return (
        <tr 
            // onClick={() => onClick(order)} 
            style={{ cursor: "pointer" }} 
            className="align-middle"
        >
            <td className="fw-bold">#{order._id.slice(-6)}</td>
            <td>{formatDate(order.createdAt || new Date())}</td>
            <td className="text-center">{order.pozycje?.length || 0}</td>
            <td className="fw-bold text-success">
                {order.sumaCalkowita?.toFixed(2)} zł
            </td>
            <td>
                <span className={`badge ${order.stan?.nazwa === 'ZREALIZOWANE' ? 'bg-success' : ' text-dark'}`}>
                    {order.stan?.nazwa || 'Nieznany'}
                </span>
            </td>
        </tr>
    );
}

export default OrderRow;