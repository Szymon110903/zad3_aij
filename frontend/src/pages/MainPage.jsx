import { useState, useEffect } from "react";
import api from "../api/axios.js";
import ProductsTable from "../components/productsTable.jsx";
// import TopNavbar from "../components/TopNavbar.jsx";

function MainPage() {
    // useState - przechowywanie produktów i stanu ładowania
    // stan ładowania to informacja czy dane są w trakcie pobierania
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // useEffect - pobieranie produktów z API po załadowaniu komponentu
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                setProducts(response.data);
            } catch (error) {
                console.error("Błąd podczas pobierania produktów:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div>
            <h1>Witamy na stronie głównej!</h1>
            <ProductsTable products={products} loading={loading} />
        </div>
    );
}
export default MainPage;