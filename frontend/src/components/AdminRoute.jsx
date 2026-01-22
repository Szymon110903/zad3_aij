import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
    const { user, isAdmin } = useAuth();

    if (!user) {
        return <Navigate to="/" />; 
    }
    if (!isAdmin) {
      
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;