//plik ramka dla aplikacji - wspólny dla wszystkich podstron
import api from "../api/axios";
import React, {useEffect, useState} from "react";
import { Outlet } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext.jsx";

import TopNavbar from "./TopNavbar";

function Layout() {
    const {login} = useAuth();
    const [searchText, setSearchText] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState('Wszystkie');
    const [kategorie, setKategorie] = useState([]);
    
    useEffect(() => {
        api.get('/category')
            .then(res => {
                setKategorie(res.data);
            })
            .catch(err => console.error("Błąd kategorii:", err));
    }, []);

    return (
        <div>
            <TopNavbar 
                kategorie={kategorie}
                onSearch={setSearchText}
                onCategorySelect={setSelectedCategory}
            />
            
            <div className="container mt-4">
                <Outlet context={{ category: selectedCategory, searchText: searchText }} />
            </div>

        </div>
    );
}
export default Layout;