import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useCart} from "../context/CartContext.jsx";
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function TopNavbar({ kategorie, onSearch, onOpenLogin, onCategorySelect }) {
    const navigate = useNavigate();
    const { user, logout, setShowLoginModal } = useAuth();
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Wszystkie');
    
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);
    
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    
    const isLoggedIn = !!localStorage.getItem('token');

    const { cartItems } = useCart();
    let cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const handleSelect = (kategoriaName) => {
        setSelectedCategory(kategoriaName);
        if (onCategorySelect) onCategorySelect(kategoriaName);
        setShowCategoryMenu(false); 
    };

    // Obsługa wylogowania
    const handleLogout = () => {
        localStorage.removeItem('token'); 
        window.location.href = '/';
    };

    // Obsługa wyszukiwania
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchText(value);
        if (onSearch) onSearch(value);
    };

    const clearSearch = () => {
        setSearchText('');
        if (onSearch) onSearch('');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 py-3 shadow">
            <div className="container d-flex flex-wrap flex-lg-nowrap align-items-center justify-content-between ">

                {/* WYSZUKIWANIe  */}
                <div className="order-2 order-lg-1 w-100 flex-grow-1 mt-3 mt-lg-0 me-lg-4">
                    <div className="input-group shadow-sm rounded-pill bg-white" style={{ height: '50px' }}>

                        {/* KATEGORIE  */}
                        <div className="position-relative d-flex align-items-center">
                            <Link 
                                to="/" 
                                className="btn border-0 rounded-start-pill fw-bold text-secondary d-flex align-items-center bg-transparent px-3 mb-2"
                                style={{ 
                                    borderRight: '1px solid #dee2e6', // Ta sama linia oddzielająca co w Twoim kodzie
                                    height: '100%',
                                    textDecoration: 'none' // Usuwa podkreślenie linku
                                }}
                            >
                                {/* Opcjonalnie możesz dodać ikonę, np. Bootstrap Icons */}
                                <i className="bi bi-shop me-2"></i> 
                                Sklep
                            </Link>
                            <button 
                                className="btn dropdown-toggle px-3 border-0 fw-bold text-secondary d-flex align-items-center bg-transparent mb-2" 
                                type="button" 
                                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                                onBlur={() => setTimeout(() => setShowCategoryMenu(false), 200)}
                                style={{ borderRight: '1px solid #dee2e6', height: '100%' }} 
                            >
                                <span className="text-truncate" style={{ maxWidth: '100px' }}>
                                    {selectedCategory.nazwa || selectedCategory}
                                </span>
                            </button>

                            {/* Lista Kategorii */}
                            {showCategoryMenu && (
                                <ul 
                                    className="dropdown-menu show" 
                                    style={{ 
                                        position: 'absolute', 
                                        top: '100%', 
                                        left: 0, 
                                        marginTop: '5px',
                                        zIndex: 1000 
                                    }}
                                >
                                    <li>
                                        <button className="dropdown-item" onMouseDown={() => handleSelect('Wszystkie')}>
                                            Wszystkie
                                        </button>
                                    </li>
                                    <li><hr className="dropdown-divider"/></li>

                                    {kategorie && kategorie.length > 0 ? (
                                        kategorie.map((kat) => (
                                            <li key={kat._id}>
                                                <button 
                                                    className="dropdown-item" 
                                                    onMouseDown={() => handleSelect(kat)} 
                                                >
                                                    {kat.nazwa}
                                                </button>
                                            </li>
                                        ))
                                    ) : (
                                        <li><span className="dropdown-item text-muted">Ładowanie...</span></li>
                                    )}
                                </ul>
                            )}
                        </div>

                        {/* Input Wyszukiwania */}
                        <div className="form-floating flex-grow-1 position-relative">
                            <input 
                                type="text" 
                                className="form-control border-0 shadow-none rounded-end-pill ps-4 pe-5 bg-transparent" 
                                id="floatingSearch" 
                                placeholder="Szukaj produktu" 
                                value={searchText || ""} 
                                onChange={handleSearchChange}
                                style={{ height: '100%' }} 
                            />
                            <label htmlFor="floatingSearch" className="ps-4 text-muted mb-2">
                                Szukaj produktu...
                            </label>
                            {searchText && searchText.length > 0 && (
                                <button type="button" className="btn border-0 position-absolute top-50 end-0 translate-middle-y me-3 text-muted mb-2" style={{ zIndex: 10 }} onClick={clearSearch}>✕</button>
                            )}
                        </div>
                    </div>
                </div>

                {/*  PROFIL / LOGOWANIE */}
                <div className="d-flex align-items-center ms-auto order-1 order-lg-2">
                    {isLoggedIn ? (
                        <div className="position-relative">
                            {/* Przycisk Profilu */}
                            <button 
                                className="btn btn-outline-light d-flex align-items-center gap-2 border-0"
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                onBlur={() => setTimeout(() => setShowProfileMenu(false), 200)}
                            >
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#adb5bd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    
                                </div>
                                <span className="d-none d-md-inline">Profil</span>
                            </button>

                            {/* Menu Profilu */}
                            {showProfileMenu && (
                                <div 
                                    className="dropdown-menu show position-absolute end-0 mt-2 shadow-lg border-0 rounded-4 p-2" 
                                    style={{ minWidth: '220px', zIndex: 1050 }}
                                >
                                    <h6 className="dropdown-header text-uppercase small fw-bold text-muted my-1 ps-3">
                                        Konto
                                    </h6>

                                    <button className="dropdown-item fw-bold text-secondary rounded-2 py-2 mb-1" 
                                        onMouseDown={() => navigate('/profile')}
                                    >
                                        Profil
                                    </button>
                                    
                                    <button className="dropdown-item fw-bold text-secondary rounded-2 py-2 mb-1" 
                                        onMouseDown={() => navigate('/orders')}
                                    >
                                        Moje zamówienia
                                    </button>
                                    
                                    <button className="dropdown-item fw-bold text-secondary rounded-2 py-2 mb-1" 
                                        onMouseDown={() => navigate('/koszyk')}
                                    > 
                                        Koszyk {' '}
                                        {cartItemsCount > 0 && (
                                            <span className="badge bg-primary rounded-pill">
                                                {cartItemsCount}
                                            </span>
                                        )}

                                    </button>

                                    <div className="dropdown-divider my-2"></div>
                                    <button className="dropdown-item fw-bold text-danger rounded-2 py-2" 
                                        onMouseDown={handleLogout}
                                    >
                                        Wyloguj się
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button 
                            className="btn btn-primary fw-bold px-4 shadow-sm text-nowrap"
                            onClick={onOpenLogin} 
                        >
                            Zaloguj się
                        </button>
                    )}
                </div>

            </div>
        </nav>
    );
}

export default TopNavbar;