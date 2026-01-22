import React, { useState } from "react";
import ProductsTable from "./productsTable"; 
import ActionOrder from "./ActionOrder"; 
import Pagination from "./Pagination"; 

function OrderSummary({ cartItems, totalValue, loading, onSubmit }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); 

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = cartItems.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="card shadow-lg border-0 h-100">
            <div className="card-header bg-dark text-white py-3">
                <h4 className="mb-0 fs-5">Twoje produkty</h4>
            </div>

            <div className="card-body p-0 d-flex flex-column">
                <div className="table-responsive flex-grow-1"> 
                    <ProductsTable 
                        products={currentItems} 
                        ActionElement={ActionOrder} 
                    />
                </div>
                
                <div className="p-3">
                    {cartItems.length > itemsPerPage && (
                        <Pagination 
                            itemsPerPage={itemsPerPage} 
                            totalItems={cartItems.length} 
                            paginate={paginate}
                            currentPage={currentPage}
                        />
                    )}
                </div>
            </div>
            
            <div className="card-footer bg-light p-4 border-top mt-auto">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fs-5 text-muted">Do zapłaty:</span>
                    <span className="fs-2 fw-bold text-success text-nowrap">{totalValue} zł</span>
                </div>
                
                <button 
                    className="btn btn-success w-100 btn-lg fw-bold shadow-sm py-3 text-uppercase"
                    style={{ letterSpacing: '1px' }}
                    onClick={onSubmit}
                    disabled={loading}
                >
                    {loading ? 'Przetwarzanie...' : 'Zamów i zapłać'}
                </button>
            </div>
        </div>
    );
}

export default OrderSummary;