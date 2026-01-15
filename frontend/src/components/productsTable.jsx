import React from "react";
import ProductRow from "./productsRow";
import ActionAddToCart from "./ActionAddToCart";
    
function ProductsTable ({ products, ActionElement = ActionAddToCart, error}) {
    return (
        <table>
          
            <tbody>
                {products.length > 0 ? (
                 products.map((product) => (
                    <ProductRow key={product._id} product={product} ActionElement={ActionElement} />
                ))
                ) : (
                <tr>
                    <td>
                    {error}
                    </td>
                </tr>
                )}
            </tbody>
        </table>
    )
}
export default ProductsTable;