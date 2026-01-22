import React from "react";

function ProductRow({ product, ActionElement, onClick }) {
    const quantity = product.quantity || 0;
    const totalRowPrice = (product.cena_jednostkowa * quantity).toFixed(2);
    
    return (
        <tr 
            onClick={() => onClick(product)} 
            style={{ cursor: "pointer" }}
        >
            <td className="ps-4">
                <div className="fw-bold text-dark">{product.nazwa}</div>
                
                <div className="d-md-none mt-1">
                    <div className="small text-muted">
                        Cena: {product.cena_jednostkowa} zł
                    </div>
                    {quantity > 0 && (
                        <div className="small fw-bold text-primary">
                            Suma: {totalRowPrice} zł
                        </div>
                    )}
                    {quantity === 0 && product.opis && (
                        <div className="small text-muted text-truncate" style={{maxWidth: "150px"}}>
                            {product.opis}
                        </div>
                    )}
                </div>
            </td>

            <td className="text-nowrap d-none d-md-table-cell">
                {product.cena_jednostkowa} zł
            </td>

            <td className="d-none d-md-table-cell">
                {quantity > 0 ? (
                    <span className="fw-bold text-primary text-nowrap">
                        Suma: {totalRowPrice} zł
                    </span>
                ) : (
                    <span className="text-muted small text-truncate d-block" style={{maxWidth: "250px"}}>
                        {product.opis}
                    </span>
                )}
            </td>
            
            <td className="text-end pe-4" onClick={(e) => e.stopPropagation()}>
                <div className="d-flex justify-content-end align-items-center">
                    <ActionElement product={product} />
                </div>
            </td>
        </tr>
    );
}

export default ProductRow;