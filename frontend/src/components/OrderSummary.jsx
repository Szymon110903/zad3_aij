import React from "react";
import ProductsTable from "./productsTable"; 
import ActionOrder from "./ActionOrder";     

function OrderSummary({ cartItems, totalValue, loading, onSubmit }) {
    return (
        <div className="card shadow-lg border-0">
            <div className="card-header bg-dark text-white py-3">
                <h4 className="mb-0 fs-5">Twoje produkty</h4>
            </div>

            <div className="card-body p-0">
                <div className="table-responsive"> 
                    <ProductsTable 
                        products={cartItems} 
                        ActionElement={ActionOrder} 
                    />
                </div>
            </div>
            
            <div className="card-footer bg-light p-4 border-top">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fs-5 text-muted">Do zapłaty:</span>
                    <span className="fs-2 fw-bold text-success">{totalValue} zł</span>
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