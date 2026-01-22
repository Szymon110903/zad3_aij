import React, { createContext, useState, useContext } from 'react';
import authService from '../services/authService.jsx';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(localStorage.getItem('token'));
    const [username, setUsername] = useState(localStorage.getItem('username') || "");

    const [type, setType] = useState(localStorage.getItem('type') || "CUSTOMER");
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    const navigate = useNavigate();

    const login = async (loginData) => {
        try {
            const responseData = await authService.loginFunc(loginData);
            
            const { token, username: newUsername, type } = responseData;

            if (!token) throw new Error("Backend nie zwrócił tokena!");

            localStorage.setItem('token', token);
            
            const finalUsername = newUsername || loginData.username;
            if (finalUsername) {
                localStorage.setItem('username', finalUsername);
                setUsername(finalUsername);
            }
            if (type) {
                localStorage.setItem('type', type);
                setType(type);
            }
            setUser(token);
            setShowLoginModal(false);
            
            return true;
        } catch (error) {
            console.error("Błąd w AuthContext:", error);
            throw error;
        }
    };

    const register = async (registerData) => {
        try {
            await authService.registerFunc(registerData);
            setShowRegisterModal(false);
            setShowLoginModal(true); 
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setUser(null);
        setUsername("");
        navigate('/')
    };

    const isAdmin = type === 'ADMIN';
    return (
        <AuthContext.Provider value={{ user,username, login, register, logout, showLoginModal, setShowLoginModal, showRegisterModal, 
            setShowRegisterModal, isAdmin, type }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);