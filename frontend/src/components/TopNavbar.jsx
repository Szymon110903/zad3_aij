import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TopNavbar({ onSearch, onOpenLogin }) {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Wszystkie');
    
    const isLoggedIn = !!localStorage.getItem('token');

    const handleSearchChange = (e) => {
        const text = e.target.value;
        setSearchText(text);
        if (onSearch) onSearch(text);
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        window.location.reload(); 
    };

    const clearSearch = () => {
        setSearchText('');
        if (onSearch) onSearch('');
    };

    const handleCategorySelect = (categoryName) => {
        setSelectedCategory(categoryName);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 py-3 shadow">
            <div className="container d-flex flex-wrap flex-lg-nowrap align-items-center justify-content-between">

                {/* SEKCJA WYSZUKIWANIA */}
                <div className="order-2 order-lg-1 w-100 flex-grow-1 mt-3 mt-lg-0 me-lg-4">
                    
                    <div className="input-group shadow-sm rounded-pill bg-white" style={{ height: '50px' }}>
                        
                        {/* Dropdown Kategorii */}
                        <button 
                            className="btn dropdown-toggle rounded-start-pill px-3 border-0 fw-bold text-secondary d-flex align-items-center bg-transparent" 
                            type="button" 
                            data-bs-toggle="dropdown" 
                            aria-expanded="false"
                            style={{ borderRight: '1px solid #dee2e6' }} 
                        >
                            <span className="text-truncate" style={{ maxWidth: '100px' }}>
                                {selectedCategory}
                            </span>
                        </button>

                        {/* Input */}
                        <div className="form-floating flex-grow-1 position-relative">
                            <input 
                                type="text" 
                                className="form-control border-0 shadow-none rounded-end-pill ps-4 pe-5 bg-transparent md-3" 
                                id="floatingSearch" 
                                placeholder="Szukaj produktu" 
                                value={searchText || ""} 
                                onChange={handleSearchChange}
                                style={{ height: '100%' }} 
                            />
                            <label htmlFor="floatingSearch" className="ps-4 text-muted">
                                Szukaj produktu...
                            </label>

                            {searchText && searchText.length > 0 && (
                                <button 
                                    type="button"
                                    className="btn border-0 position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
                                    style={{ zIndex: 10 }}
                                    onClick={clearSearch}
                                >
                                    ✕ 
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* LOGOWANIE / PROFIL */}
                <div className="d-flex align-items-center ms-auto order-1 order-lg-2">
                    {isLoggedIn ? (
                        <div className="position-relative">
                            <button 
                                className="btn btn-outline-light d-flex align-items-center gap-2 border-0"
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                onBlur={() => setTimeout(() => setShowProfileMenu(false), 200)}
                            >
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#adb5bd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    👤
                                </div>
                                <span className="d-none d-md-inline">Profil</span>
                            </button>
                            {showProfileMenu && (
                                <div className="dropdown-menu show position-absolute end-0 mt-2 shadow-lg" style={{ minWidth: '200px', zIndex: 1050 }}>
                                    <button className="dropdown-item text-danger" onClick={handleLogout}>Wyloguj</button>
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