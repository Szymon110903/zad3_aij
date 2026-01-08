//plik ramka dla aplikacji - wspólny dla wszystkich podstron
import api from "../api/axios";
import React, {useEffect, useState} from "react";
import { Outlet } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext.jsx";

import TopNavbar from "./TopNavbar";
import LoginModal from "./LoginModal";

function Layout() {
    const [searchText, setSearchText] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState('Wszystkie');
    const [kategorie, setKategorie] = useState([]);
    
    //pobranie kategorii
    useEffect(() => {
        api.get('/category')
            .then(res => {
                setKategorie(res.data);})
            .catch(err => console.error("Błąd kategorii:", err));
    }, []);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleLoginSuccess = () => {
        setShowLoginModal(false);
        window.location.reload(); 
    };

    return (
        <div>
            <TopNavbar 
                kategorie={kategorie}
                onSearch={setSearchText}
                onCategorySelect={setSelectedCategory}
                onOpenLogin={() => setShowLoginModal(true)}
            />
           <div className="container mt-4">
            <Outlet context={{ category: selectedCategory, searchText: searchText }} />
            
            </div>
            <LoginModal 
                show={showLoginModal} 
                onClose={() => setShowLoginModal(false)}
                onLoginSuccess={handleLoginSuccess}
            />
        </div>
    );
}
export default Layout;