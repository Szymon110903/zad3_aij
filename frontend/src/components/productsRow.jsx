function ProductsRow({ product, ActionElement }) {

    return (
        <tr>
            <td>{product.nazwa}</td>
            <td>{product.cena_jednostkowa} zł</td>
            <td>{product.opis}</td>
            <td colSpan={2}>{<ActionElement product={product} />}</td>
        </tr>
        
    )
    
}
export default ProductsRow