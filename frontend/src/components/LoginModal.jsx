import React, { useState } from 'react';
import api from '../api/axios';
import {useAuth} from "../context/AuthContext.jsx";

function LoginModal({ show, onClose, onLoginSuccess, onSwitchToRegister }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();

    if (!show) return null;

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setLoading(true); 
        setError('');

        try {
            const response = await api.post('/auth/login', {
                username: username,
                password: password
            });
            const token = response.data.token;
            login(token, username);
            onLoginSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Błąd logowania');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999 }}>
            
            {/* TŁO */}
            <div 
                className="modal-backdrop show" 
                style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%', 
                    backgroundColor: 'rgba(0, 0, 0, 0.6)' 
                }} 
                onClick={onClose}
            ></div>

            {/* MODAL */}
            <div 
                className="modal fade show" 
                tabIndex="-1"
                style={{ 
                    display: 'block',
                    position: 'relative',
                    zIndex: 10000 
                }} 
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content shadow-lg border-0"> 
                        <div className="modal-header border-bottom-0 pb-0 bg-dark"> 
                            <h5 className="modal-title w-100 text-center fw-bold fs-4 text-white mb-3">
                                Zaloguj się
                            </h5>
                            
                            <button 
                                type="button" 
                                className="btn-close btn-close-white mb-2" 
                                onClick={onClose}
                            ></button>
                        </div>

                        <div className="modal-body p-4 pt-3">

                            {error && <div className="alert alert-danger">{error}</div>}
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold small text-muted">NAZWA UŻYTKOWNIKA</label>
                                    <input
                                        type="text"
                                        className="form-control border-dark" 
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        required
                                        placeholder="Nazwa użytkownika" 
                                        autoFocus
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-bold small text-muted">HASŁO</label>
                                    <input 
                                        type="password" 
                                        className="form-control border-dark" 
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                        placeholder="Hasło"
                                    />
                                </div>
                                
                                <div className="d-grid mt-4">
                                    <button 
                                        type="submit" 
                                        className="btn btn-outline-dark btn-lg py-2 fw-bold" 
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Logowanie
                                            </>
                                        ) : 'Zaloguj się'}
                                    </button>
                                </div>
                            </form>
                            <div>
                                <p className="text-center small text-muted mt-3">
                                    Nie masz konta? 
                                    <br/>
                                    <button className="btn btn-link text-decoration-none p-0 ms-1"
                                        onClick={() => {
                                        onSwitchToRegister();}}
                                    >
                                        Zarejestruj się
                                    </button>
                                </p>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginModal;