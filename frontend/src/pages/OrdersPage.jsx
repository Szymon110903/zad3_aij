
import React, {useEffect, useState} from "react";
import { useAuth } from "../context/AuthContext";
import OrdersTable from "../components/OrdersTable";
import orderService from "../services/orderService";


function OrdersPage(){
    const { username} = useAuth();

    const [Loading, setLoading] = useState(false);
    const [Error, setError] = useState(''); 
    const [Orders, setOrders] = useState([]);

    //pobieranie zamówień 
     useEffect(() => {
        if (!username) return;
        const pobierzZamówienia = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await orderService.getUserOrders(username);
                setOrders(response);
            } catch (err) {
                console.error(err);
                setError('Nie udało się pobrać zamowien.');
            } finally {
                setLoading(false);
            }
        };
        pobierzZamówienia();
    }, [username]); 


    return (
         <div className="container mt-4">
            <div className="card shadow-lg">
                <div className="card-body p-4">

                    {Error && <div className="alert alert-danger">{Error}</div>}
                    
                    {Loading ? (
                        <div className="text-center p-5">
                            <div className="spinner-border text-primary" role="status"></div>
                            <p className="mt-2">Ładowanie zamówień...</p>
                        </div>
                    ) : (
                        <OrdersTable orders={Orders} />
                    )}
                    
                </div>
            </div>
        </div>
    )
}
export default OrdersPage;