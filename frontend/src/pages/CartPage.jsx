import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext.jsx";
import ProductsTable from "../components/productsTable.jsx";
import ActionOrder from "../components/ActionOrder.jsx";
import Pagination from "../components/Pagination"; 
import { useNavigate } from "react-router-dom";

function CartPage() {
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); 

    const handleMoveToOrder = () => {
        navigate('/zamowienie');
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = cartItems.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        const totalPages = Math.ceil(cartItems.length / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [cartItems.length, currentPage, itemsPerPage]);

    return (
        <div className="text-center mt-5">
            <h2>Twój koszyk</h2>
            <div className="container mt-4">
                <div className="card shadow-lg">
                    <div className="card-body p-4">
                        <ProductsTable products={currentItems} ActionElement={ActionOrder} />

                        {cartItems.length > itemsPerPage && (
                            <Pagination
                                itemsPerPage={itemsPerPage}
                                totalItems={cartItems.length}
                                paginate={paginate}
                                currentPage={currentPage}
                            />
                        )}
                    </div>

                    <div className="card-footer bg-light p-3">
                        {cartItems.length === 0 ? (
                            <button className="btn btn-secondary btn-lg disabled" disabled>
                                Koszyk jest pusty
                            </button>
                        ) : (
                            <div className="d-flex justify-content-end align-items-center gap-3">
                                <div className="text-muted">
                                    Łącznie produktów: <strong>{cartItems.length}</strong>
                                </div>
                                <button 
                                    className="btn btn-success btn-lg px-5 fw-bold shadow-sm"
                                    onClick={handleMoveToOrder}                    
                                >
                                    Przejdź do dostawy <i className="bi bi-arrow-right ms-2"></i>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartPage;