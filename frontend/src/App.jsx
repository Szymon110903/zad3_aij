import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import RouteProtect from './api/RouteProtect.jsx';
import Layout from './components/Layout';
import MainPage from './pages/MainPage';
import CartPage from './pages/CartPage';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import LoginModal from './components/LoginModal.jsx';
import RegisterModal from './components/RegisterModal.jsx';
import OrderPage from './pages/OrderPage.jsx';

const GlobalModals = () => {
    const { showLoginModal, setShowLoginModal,
            showRegisterModal, setShowRegisterModal
    } = useAuth();
    const handleSwitchToRegister = () => {
        setShowLoginModal(false);   
        setShowRegisterModal(true); 
    };

    const handleSwitchToLogin = () => {
        setShowRegisterModal(false);
        setShowLoginModal(true);
    };

    return ( 
        <>
            <LoginModal 
                show={showLoginModal} 
                onClose={() => setShowLoginModal(false)} 
                onSwitchToRegister={handleSwitchToRegister}     
            />
            
            <RegisterModal 
                show={showRegisterModal} 
                onClose={() => setShowRegisterModal(false)}
                onSwitchToLogin={handleSwitchToLogin}
            />
        </>
    );
  


}


function App() {
  return (
    <AuthProvider>
      <GlobalModals />
    <Routes>
        {/* publiczne*/}
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          {/* chronione */}
          <Route element={<RouteProtect><Outlet /></RouteProtect>}>
              <Route path="koszyk" element={<CartPage/>} />
              <Route path="Zamowienie" element = {<OrderPage/>}/>
              <Route path="profile" element={
                  <div className="text-center mt-5">
                      <h2> Twój Profil</h2>
                      <p className="text-muted">Ta strona jest w trakcie budowy.</p>
                  </div>
              } />

              <Route path="orders" element={
                  <div className="text-center mt-5">
                      <h2> Zamówienia</h2>
                      <p className="text-muted">Tutaj pojawi się lista zamówień.</p>
                  </div>
              } />
          </Route>

        </Route>
    </Routes>
    </AuthProvider>

  );
}

export default App;