import React, { useState, useEffect } from "react";
import OrderRow from "./OrderRow"; 
import OrderDetailsModal from "./OrderDetailsModal";
import Pagination from "./Pagination"; 
import orderService from "../services/orderService"; 

function OrderTable({ orders, onRefresh }) {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    
    const [statusFilter, setStatusFilter] = useState("Wszystkie");
    const [availableStatuses, setAvailableStatuses] = useState([]);

   
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); 

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const data = await orderService.getOrderStatuses();
                setAvailableStatuses(data);
            } catch (error) {
                console.error("Błąd pobierania statusów:", error);
            }
        };
        fetchStatuses();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter, orders]);

    const filteredOrders = orders ? orders.filter(order => {
        if (statusFilter === "Wszystkie") return true;
        return order.stan?.nazwa === statusFilter;
    }) : [];

    const indexOfLastItem = currentPage * itemsPerPage; 
    const indexOfFirstItem = indexOfLastItem - itemsPerPage; 
    
    const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleRowClick = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    return (
        <>
            <div className="bg-white rounded shadow-sm overflow-hidden">
                
                <div className="p-3 bg-light border-bottom d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <h5 className="mb-0 text-muted">
                        Lista zamówień <span className="badge bg-secondary rounded-pill ms-2">{filteredOrders.length}</span>
                    </h5>
                    
                    <div className="d-flex align-items-center">
                        <label className="me-2 fw-bold small text-uppercase text-muted">Status:</label>
                        <select 
                            className="form-select form-select-sm w-auto shadow-sm border-secondary-subtle"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="Wszystkie">Wszystkie</option>
                            {availableStatuses.map(status => (
                                <option key={status._id} value={status.nazwa}>
                                    {status.nazwa}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover mb-0 align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th scope="col" className="ps-4">ID</th>
                                <th scope="col">Data</th>
                                <th scope="col" className="text-center">Produkty</th>
                                <th scope="col" className="text-end">Kwota</th>
                                <th scope="col" className="text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrders.length > 0 ? (
                                currentOrders.map((order) => (
                                    <OrderRow 
                                        key={order._id} 
                                        order={order} 
                                        onClick={handleRowClick} 
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">
                                        {orders && orders.length > 0 
                                            ? "Brak zamówień o wybranym statusie." 
                                            : "Brak zamówień do wyświetlenia."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="pb-3 px-3">
                    <Pagination 
                        itemsPerPage={itemsPerPage} 
                        totalItems={filteredOrders.length} 
                        paginate={paginate} 
                        currentPage={currentPage}
                    />
                    
                    {filteredOrders.length > 0 && (
                        <div className="text-center text-muted small mt-2">
                            Strona {currentPage} z {Math.ceil(filteredOrders.length / itemsPerPage)}
                        </div>
                    )}
                </div>
            </div>
            
            <OrderDetailsModal 
                show={showModal} 
                order={selectedOrder} 
                onClose={handleCloseModal}
                onOrderUpdated={onRefresh} 
            />
        </>
    );
}

export default OrderTable;