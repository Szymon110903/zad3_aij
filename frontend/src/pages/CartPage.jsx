import React from "react";
import { useCart } from "../context/CartContext.jsx";
import ProductsTable from "../components/productsTable.jsx";
import ActionOrder from "../components/ActionOrder.jsx";
import { useNavigate } from "react-router-dom";

function CartPage() {
    const { cartItems } = useCart();
    const navigate = useNavigate();
    const handleMoveToOrder = () =>
    {
        navigate('/zamowienie');
    }


    return (
        <div className="text-center mt-5">
            <h2>Twój koszyk</h2>
            <div className="container mt-4">
            <div className="card shadow-lg">
            <div className="card-body p-4">
                    <ProductsTable products={cartItems} ActionElement={ActionOrder} />
            </div>
            <div>{
                cartItems.length === 0 ? (
                     <button className="" >
                        Zamów - wyszarzone nie do kliknięcia
                    </button>
                    
                ) : (
                    <button className=""
                        onClick={handleMoveToOrder}                    
                    >
                        Zamów - można // w przyszłosci przeniesie dalej
                    </button>
                )
                }</div>
            </div>
            </div>
        </div>
    );
}
export default CartPage;