function ProductsRow({ product, ActionElement }) {
    const quantity = product.quantity || 0;
    const totalRowPrice = (product.cena_jednostkowa * quantity).toFixed(2);
    return (
        <tr>
            <td>{product.nazwa}</td>
            <td>{product.cena_jednostkowa} zł</td>
            <td>{
                quantity > 0 ? (
                    <span className="fw-bold text-primary">
                        Suma: {totalRowPrice} zł
                    </span>
                ): (
                <span className="text-muted small">{product.opis}</span>
                )}
                </td>
            <td colSpan={2}>{<ActionElement product={product} />}</td>
        </tr>
        
    )
    
}
export default ProductsRow