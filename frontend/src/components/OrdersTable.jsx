import React from "react";
function OrdersTable ({ orders }) {
    return (
        <table>
            <tbody>
                {/* {orders.length > 0 ? (
                 orders.map((order) => (
                    //tu bedzie komponent - zasada jak z produktami, bedzie można kliknąc na każdy z row, który da wiecej info i możliwośc oceny
                )) */}
                {/* ) : (
                <tr>
                    <td>
                    Brak produktów do wyświetlenia.
                    </td>
                </tr>
                )} */}
            </tbody>
        </table>
    )
}
export default OrdersTable;