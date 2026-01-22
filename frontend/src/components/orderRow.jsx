import React from "react";

const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pl-PL", {
        year: 'numeric', month: '2-digit', day: '2-digit', 
        hour: '2-digit', minute: '2-digit'
    });
};

function OrderRow({ order, onClick }) {
    
    const getStatusBadgeClass = (statusName) => {
        switch (statusName) {
            case 'ZREALIZOWANE': return 'bg-success';
            case 'ANULOWANE': return 'bg-danger';
            case 'WYSŁANE': return 'bg-primary';
            case 'NIEZATWIERDZONE': return 'bg-warning text-dark';
            default: return 'bg-secondary';
        }
    };

    return (
        <tr 
            onClick={() => onClick(order)} 
            style={{ cursor: "pointer" }} 
            className="align-middle border-bottom"
        >
            <td className="fw-bold ps-4 text-primary font-monospace">
                #{order._id.slice(-6).toUpperCase()}
            </td>
            <td className="text-muted small">
                {formatDate(order.createdAt)}
            </td>
            <td className="text-center text-muted">
                {order.pozycje?.length || 0}
            </td>
            <td className="fw-bold text-end pe-3">
                {order.sumaCalkowita?.toFixed(2)} zł
            </td>
            <td className="text-center pe-3">
                <span className={`badge rounded-pill px-3 py-2 fw-normal ${getStatusBadgeClass(order.stan?.nazwa)}`}>
                    {order.stan?.nazwa || 'Nieznany'}
                </span>
            </td>
        </tr>
    );
}

export default OrderRow;