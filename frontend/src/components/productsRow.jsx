function ProductsRow({ product }) {
    return (
        <tr>
            <td>{product.nazwa}</td>
            <td>{product.cena_jednostkowa} zł</td>
            <td>{product.opis}</td>
        </tr>
    )
}
export default ProductsRow