import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import MainPage from './pages/MainPage';

function App() {
  return (
    <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          
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

          <Route path="koszyk" element={
              <div className="text-center mt-5">
                  <h2>Koszyk</h2>
                  <p className="text-muted">Twój koszyk jest pusty (na razie).</p>
              </div>
          } />

        </Route>
    </Routes>
  );
}

export default App;