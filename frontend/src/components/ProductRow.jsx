import React from "react";

function ProductRow({ product, ActionElement, onClick }) {
    const quantity = product.quantity || 0;
    const totalRowPrice = (product.cena_jednostkowa * quantity).toFixed(2);
    
    return (
        <tr 
            onClick={() => onClick(product)} 
            style={{ cursor: "pointer" }}
        >
            <td>{product.nazwa}</td>
            <td>{product.cena_jednostkowa} zł</td>
            <td>
                {quantity > 0 ? (
                     <span className="fw-bold text-primary">
                        Suma: {totalRowPrice} zł
                    </span>
                ) : (
                    <span className="text-muted small">{product.opis}</span>
                )}
            </td>
            
            <td colSpan={2} onClick={(e) => e.stopPropagation()}>
                {<ActionElement product={product} />}
            </td>
        </tr>
    );
}
export default ProductRow;