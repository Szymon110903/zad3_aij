import OrderRow from "./orderRow";

function OrderTable ({orders}){
    //bedzie wywoływanie modala po kliknięciu, 
    //trzeba przebudować zamówienie żeby dodawało date złożenia zamówienia

    return (
        <>
            <div> 
                <table >
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Data zaówienia</th>
                            <th scope="col">Ilość Produktów</th>
                            <th scope="col">Kwota</th>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(orders && orders.length > 0 )? (
                            orders.map((order) => (
                                <OrderRow 
                                    key={order._id} 
                                    order={order} 
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-muted">
                                    Brak zamówień do wyświetlenia.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        
        
        </>
    )
}

export default OrderTable;