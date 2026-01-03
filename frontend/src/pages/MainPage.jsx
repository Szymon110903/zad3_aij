import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom'; 
import api from '../api/axios';
import ProductsTable from '../components/ProductsTable';

function MainPage() {
    //pobranie danych z Layoutu
    const { category, searchText } = useOutletContext();

    // Stan lokalny 
    const [produkty, setProdukty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Pobranie produktów
    useEffect(() => {
        const pobierzProdukty = async () => {
            setLoading(true);
            setError('');

            try {
                let url = '/products';
                console.log("Wybrana kategoria:", category.nazwa);
                // Obsługa kategorii
                if (category.nazwa && category.nazwa !== 'Wszystkie') {
                    url = `/products/category/${category._id}`;
                }
                const response = await api.get(url);
                
                setProdukty(response.data);
            } catch (err) {
                console.error(err);
                setError('Nie udało się pobrać produktów.');
            } finally {
                setLoading(false);
            }
        };

        pobierzProdukty();

    }, [category, searchText]); 

    return (
        <div className="container mt-4">
            <div className="card shadow-lg">
                <div className="card-body p-4">

                    {/* Obsługa błędów i ładowania */}
                    {error && <div className="alert alert-danger">{error}</div>}
                    
                    {loading ? (
                        <div className="text-center p-5">
                            <div className="spinner-border text-primary" role="status"></div>
                            <p className="mt-2">Ładowanie produktów...</p>
                        </div>
                    ) : (
                        <ProductsTable products={produkty} />
                    )}
                    
                </div>
            </div>
        </div>
    );
}

export default MainPage;