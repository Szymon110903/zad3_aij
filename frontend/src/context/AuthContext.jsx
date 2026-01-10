import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(localStorage.getItem('token'));
    const [showLoginModal, setShowLoginModal] = useState(false);

    const [showRegisterModal, setShowRegisterModal] = useState(false);


    const navigate = useNavigate(); 

    const login = (token) => {
        localStorage.setItem('token', token);
        setUser(token);
        setShowLoginModal(false);
    };

    const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/'; 
};

    return (
        <AuthContext.Provider value={{ user, login, logout, showLoginModal, setShowLoginModal, showRegisterModal, 
            setShowRegisterModal }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);