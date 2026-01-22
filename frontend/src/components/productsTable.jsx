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
        try {
            console.log("Wysyłanie PATCH dla ID:", updatedProduct._id);
            
            await productsService.updateProduct(updatedProduct._id, updatedProduct);
            
            alert("Produkt został zaktualizowany!");
            handleCloseModal();
            
            if (onRefresh) onRefresh();
            
        } catch (err) {
            console.error("Błąd edycji produktu:", err);
            alert("Wystąpił błąd podczas zapisywania zmian.");
        }
    };

    return (
        <>
            <table className="table table-hover">
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
                            <td colSpan="4" className="text-center text-danger">
                                {error}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <ProductDetailsModal 
                show={showModal} 
                product={selectedProduct} 
                onClose={handleCloseModal}
                onSave={handleAdminSave}
            />
        </>
    )
}
export default ProductsTable;