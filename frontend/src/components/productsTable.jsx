import React from "react";
import ProductRow from "./productsRow";
function ProductsTable ({ products }) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Nazwa</th>
                    <th>Cena jednostkowa</th>
                    <th>Opis</th>
                </tr>
            </thead>
            <tbody>
                {products.length > 0 ? (
                 products.map((product) => (
                    <ProductRow key={product._id} product={product} />
                ))
                ) : (
                <tr>
                    <td>
                    Brak produktów do wyświetlenia.
                    </td>
                </tr>
                )}
            </tbody>
        </table>
    )
}
export default ProductsTable;