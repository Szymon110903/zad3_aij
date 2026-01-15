
import React, {useEffect, useState} from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import OrdersTable from "../components/OrdersTable";


function OrdersPage(){
    const { username} = useAuth();

    const [Loading, setLoading] = useState(false);
    const [Error, setError] = useState(''); 
    const [Orders, setOrders] = useState([]);


     useEffect(() => {
        if (!username) return;
        //pobieranie zamówenia po username
        const pobierzZamówienia = async () => {
            setLoading(true);
            setError('');

            try {
                let url = '/orders/' + username;
                const response = await api.get(url);
                setOrders(response.data);
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

                    {/* Obsługa błędów i ładowania */}
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