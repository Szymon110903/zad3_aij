import { useEffect, useState, useCallback } from 'react'; 
import { useOutletContext } from 'react-router-dom'; 
import ProductsTable from '../components/productsTable';
import productsService from "../services/ProductService";
import Pagination from '../components/Pagination'; 

function MainPage() {
    const { category, searchText } = useOutletContext();

    const [produkty, setProdukty] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10); 

    const pobierzProdukty = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await productsService.getProducts(category);

            if (searchText && searchText.trim() !== '') {
                const filteredProducts = response.filter(product => 
                    product.nazwa.toLowerCase().includes(searchText.toLowerCase())
                );
                setProdukty(filteredProducts);
            } else {
                setProdukty(response);
            }
        } catch (err) {
            console.error(err);
            setError('Nie udało się pobrać produktów.');
        } finally {
            setLoading(false);
        }
    }, [category, searchText]);

    useEffect(() => {
        pobierzProdukty();
    }, [pobierzProdukty]);

    useEffect(() => {
        setCurrentPage(1);
    }, [category, searchText]);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = produkty.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container mt-4">
            <div className="card shadow-lg">
                <div className="card-body p-4">

                    {error && <div className="alert alert-danger">{error}</div>}
                    
                    {loading ? (
                        <div className="text-center p-5">
                            <div className="spinner-border text-primary" role="status"></div>
                            <p className="mt-2">Ładowanie produktów...</p>
                        </div>
                    ) : (
                        <>
                            <ProductsTable 
                                products={currentProducts} 
                                error={error} 
                                onRefresh={pobierzProdukty} 
                            />
                            
                            <Pagination 
                                itemsPerPage={productsPerPage} 
                                totalItems={produkty.length} 
                                paginate={paginate}
                                currentPage={currentPage}
                            />
                            
                            {!loading && produkty.length > 0 && (
                                <div className="text-center text-muted small mt-2">
                                    Wyświetlono {indexOfFirstProduct + 1} - {Math.min(indexOfLastProduct, produkty.length)} z {produkty.length} produktów
                                </div>
                            )}
                        </>
                    )}
                    
                </div>
            </div>
        </div>
    );
}

export default MainPage;