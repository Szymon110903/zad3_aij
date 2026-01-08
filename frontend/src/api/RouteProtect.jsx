import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';

const RouteProtect = ({ children }) => {
    const { user, setShowLoginModal } = useAuth();

    useEffect(() => {
        if (!user) {
            console.log("Brak tokena, otwieram modal logowania.");
            setShowLoginModal(true);
        }
    }, [user, setShowLoginModal]);

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children ? children : <Outlet />;
};

export default RouteProtect;