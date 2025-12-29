import { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductsTable from '../components/ProductsTable';
import TopNavbar from '../components/TopNavbar';
import LoginModal from '../components/LoginModal';

function MainPage() {
    const [produkty, setProdukty] = useState([]);
    const [kategorie, setKategorie] = useState([]);
    const [wybranaKategoria, setWybranaKategoria] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        api.get('/category')
            .then(res => setKategorie(res.data))
            .catch(err => console.error("Błąd kategorii:", err));
        pobierzProdukty();
    }, []);

    const pobierzProdukty = (idKategorii = '') => {
        setLoading(true);
        setError('');
        
        const url = idKategorii ? `/products/category/${idKategorii}` : '/products';

        api.get(url)
            .then(res => {
                setProdukty(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Nie udało się pobrać produktów.');
                setLoading(false);
            });
    };

    const handleZmianaKategorii = (e) => {
        const noweId = e.target.value;
        setWybranaKategoria(noweId); // Zapisz wybór w stanie
        pobierzProdukty(noweId);     // Pobierz nowe dane z API
    };

    const handleLoginSuccess = () => {
        setShowLoginModal(false); 
        window.location.reload(); 
    };

    return (
        <div>
            <TopNavbar 
                onSearch={(text) => console.log("Szukam:", text)} 
                onOpenLogin={() => {
                    console.log("1. Odebrano sygnał otwarcia!"); 
                    setShowLoginModal(true);
                }}
            />

            <div className="container mt-4">
                <div className="card shadow-lg">
                 

                    <div className="card-body p-4">

                        {/* TABELA Z PRODUKTAMI */}
                        {error && <div className="alert alert-danger">{error}</div>}
                        
                        {loading ? (
                            <div className="text-center p-5">
                                <div className="spinner-border text-primary" role="status"></div>
                                <p className="mt-2">Ładowanie...</p>
                            </div>
                        ) : (
                            <ProductsTable products={produkty} />
                        )}
                        
                    </div>
                </div>
            </div>

            {/* MODAL LOGOWANIA */}
            <LoginModal 
                show={showLoginModal} 
                onClose={() => setShowLoginModal(false)}
                onLoginSuccess={handleLoginSuccess}
            />
        </div>
    );
}

export default MainPage;