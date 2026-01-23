import React, { useState } from "react";
import ProductRow from "./ProductRow"; 
import ActionAddToCart from "./ActionAddToCart";
import ProductDetailsModal from "./ProductDetailsModal"; 
import productsService from "../services/ProductService";

function ProductsTable({ products, ActionElement = ActionAddToCart, error, onRefresh }) {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleRowClick = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    const handleAdminSave = async (updatedProduct) => {
        await productsService.updateProduct(updatedProduct._id, updatedProduct);
        
        if (onRefresh) onRefresh();
    };

    return (
        <>
            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4">Produkt</th>
                                    <th className="d-none d-md-table-cell">Cena</th>
                                    <th className="d-none d-md-table-cell">Opis / Suma</th>
                                    <th className="text-end pe-4">Akcja</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <ProductRow 
                                            key={product._id} 
                                            product={product} 
                                            ActionElement={ActionElement}
                                            onClick={handleRowClick} 
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center text-danger py-4">
                                            {error || "Brak produktów do wyświetlenia"}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <ProductDetailsModal 
                show={showModal} 
                product={selectedProduct} 
                onClose={handleCloseModal} 
                onSave={handleAdminSave}
            />
        </>
    );
}

export default ProductsTable;