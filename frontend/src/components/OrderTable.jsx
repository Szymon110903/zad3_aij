import React, { useState, useEffect } from "react";
import OrderRow from "./orderRow"; 
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
            <div className="card shadow-lg border-0">
                
                <div className="card-header bg-dark text-white py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <h4 className="mb-0 fs-5">
                        Lista zamówień <span className="badge bg-secondary ms-2 fs-6">{filteredOrders.length}</span>
                    </h4>

                    <div className="d-flex align-items-center">
                        <label className="me-2 small text-white-50 text-uppercase fw-bold">Status:</label>
                        <select 
                            className="form-select form-select-sm w-auto shadow-none border-secondary text-bg-dark"
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

                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0 align-middle">
                            <thead className="table-light text-secondary small text-uppercase">
                                <tr>
                                    <th scope="col" className="ps-4 py-3">ID Zamówienia</th>
                                    <th scope="col" className="py-3">Data</th>
                                    <th scope="col" className="text-center py-3">Poz.</th>
                                    <th scope="col" className="text-end py-3">Wartość</th>
                                    <th scope="col" className="text-center py-3">Status</th>
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
                                            <div className="py-4">
                                                <i className="bi bi-inbox fs-1 d-block mb-3 text-secondary opacity-50"></i>
                                                {orders && orders.length > 0 
                                                    ? "Brak zamówień o wybranym statusie." 
                                                    : "Brak zamówień do wyświetlenia."}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card-footer bg-light p-3 border-top">
                     <div className="d-flex justify-content-center">
                        <Pagination 
                            itemsPerPage={itemsPerPage} 
                            totalItems={filteredOrders.length} 
                            paginate={paginate} 
                            currentPage={currentPage}
                        />
                    </div>
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