import React, { useState, useEffect } from "react";
import orderService from "../services/orderService"; 
import { useAuth } from "../context/AuthContext"; // 👇 Importujemy AuthContext

function OrderDetailsModal({ show, order, onClose, onOrderUpdated }) {
    const { isAdmin } = useAuth(); // 👇 Sprawdzamy, kto ogląda modal
    
    const [loading, setLoading] = useState(false);
    const [allStatuses, setAllStatuses] = useState([]); // Lista wszystkich możliwych statusów
    const [selectedStatusId, setSelectedStatusId] = useState(""); // Wybrany status (dla Admina)

    // Stany Usera (ocenianie)
    const [isRatingMode, setIsRatingMode] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    
    // Inicjalizacja przy otwarciu
    useEffect(() => {
        if (show && order) {
            // 1. Pobierz możliwe statusy z bazy
            const fetchStatuses = async () => {
                try {
                    const statuses = await orderService.getOrderStatuses();
                    setAllStatuses(statuses);
                    
                    // Ustaw aktualny status w selectcie (jeśli to admin)
                    if (order.stan && (typeof order.stan === 'object')) {
                        setSelectedStatusId(order.stan._id);
                    } else {
                        setSelectedStatusId(order.stan); // jeśli to samo ID
                    }
                } catch (err) {
                    console.error("Błąd statusów:", err);
                }
            };
            fetchStatuses();
            
            // Reset widoków
            setIsRatingMode(false);
            setRating(5);
            setComment("");
        }
    }, [show, order]);

    if (!show || !order) return null;

    const statusName = order.stan?.nazwa || "Nieznany";
    const hasOpinion = order.opinia && (order.opinia.ocena || order.opinia.komentarz);
    const adres = order.zamieszkanie || order.adres || {};

    // --- AKCJE ADMINA (Zmiana statusu) ---
    const handleAdminStatusChange = async () => {
        if (!selectedStatusId) return;
        setLoading(true);
        try {
            await orderService.updateOrderStatus(order._id, selectedStatusId);
            alert("Status zamówienia został zmieniony.");
            if (onOrderUpdated) onOrderUpdated();
            onClose();
        } catch (error) {
            alert("Błąd zmiany statusu: " + (error.response?.data?.message || "Nieznany błąd"));
        } finally {
            setLoading(false);
        }
    };

    // --- AKCJE USERA (Anulowanie / Ocenianie) ---
    // ... (Tu wklej funkcje handleCancel i submitRating z poprzedniej wersji - bez zmian) ...
    // Dla czytelności skróciłem ten fragment, użyj kodu z poprzedniej odpowiedzi dla handleCancel/submitRating
    
    // Pomocniczy render statusu
    const renderStatusSection = () => {
        if (isAdmin) {
            return (
                <div className="bg-warning-subtle p-3 rounded mb-3 border border-warning">
                    <label className="form-label fw-bold text-dark mb-1">Zmień status (Admin):</label>
                    <div className="d-flex gap-2">
                        <select 
                            className="form-select border-dark" 
                            value={selectedStatusId} 
                            onChange={(e) => setSelectedStatusId(e.target.value)}
                        >
                            {allStatuses.map(status => (
                                <option key={status._id} value={status._id}>
                                    {status.nazwa}
                                </option>
                            ))}
                        </select>
                        <button 
                            className="btn btn-dark text-nowrap" 
                            onClick={handleAdminStatusChange}
                            disabled={loading}
                        >
                            Zapisz
                        </button>
                    </div>
                </div>
            );
        } else {
            // Dla Usera tylko wyświetlamy
            return (
                <div className="mb-2">
                    <span className="fw-bold text-dark">Status: </span>
                    <span className={`badge ${statusName === 'ZREALIZOWANE' ? 'bg-success' : 'bg-secondary'}`}>
                        {statusName}
                    </span>
                </div>
            );
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1050 }}>
            <div className="modal-backdrop show" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}></div>

            <div className="modal fade show d-block" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content shadow border-0">
                        
                        <div className="modal-header bg-dark text-white">
                            <h5 className="modal-title">
                                {isAdmin ? `Edycja Zamówienia` : `Szczegóły zamówienia`} #{order._id.slice(-6)}
                            </h5>
                            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                        </div>
                        
                        <div className="modal-body">
                            {/* Sekcja zmiany statusu widoczna na górze dla Admina */}
                            {isAdmin && renderStatusSection()}

                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <h6 className="border-bottom pb-2 mb-3 text-uppercase small text-muted fw-bold">Informacje</h6>
                                    
                                    {/* User widzi status tutaj, Admin widział go wyżej w edytorze */}
                                    {!isAdmin && renderStatusSection()}
                                    
                                    <div className="mb-2">
                                        <span className="fw-bold text-dark">Data: </span>
                                        <span className="text-secondary">{order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}</span>
                                    </div>
                                    <div className="mb-2">
                                        <span className="fw-bold text-dark">ID: </span>
                                        <span className="text-secondary font-monospace">{order._id}</span>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                     <h6 className="border-bottom pb-2 mb-3 text-uppercase small text-muted fw-bold">Klient</h6>
                                     <div className="mb-1"><span className="fw-bold">Odbiorca:</span> {order.imie} {order.nazwisko}</div>
                                     <div className="mb-1"><span className="fw-bold">Email:</span> {order.email}</div>
                                     <div className="mb-3"><span className="fw-bold">Adres:</span> {adres.miejscowosc}, {adres.ulica} {adres.nrDomu}</div>
                                </div>
                            </div>
                            
                            {/* ... (Reszta: Opinie, Tabela Produktów - bez zmian, użyj z poprzedniego) ... */}
                            <h6 className="border-bottom pb-2 mt-4 text-uppercase small text-muted fw-bold">Produkty</h6>
                             <div className="table-responsive">
                                {/* ... Twoja tabela produktów ... */}
                                <table className="table table-sm align-middle">
                                    <thead className="table-light">
                                        <tr><th>Produkt</th><th className="text-end">Suma</th></tr>
                                    </thead>
                                    <tbody>
                                        {order.pozycje?.map((poz, idx) => (
                                            <tr key={idx}>
                                                <td>{poz.produkt?.nazwa} (x{poz.ilosc})</td>
                                                <td className="text-end fw-bold">{(poz.cenaWChwiliZakupu * poz.ilosc).toFixed(2)} zł</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                             </div>
                        </div>

                        {/* STOPKA: Różna dla Admina i Usera */}
                        <div className="modal-footer bg-light d-flex justify-content-between">
                            <div>
                                {/* User: Anuluj / Oceń */}
                                {!isAdmin && statusName === 'NIEZATWIERDZONE' && (
                                    <button className="btn btn-danger me-2" onClick={() => {/* Twoja funkcja handleCancel */}}>Anuluj</button>
                                )}
                                {!isAdmin && statusName === 'ZREALIZOWANE' && !hasOpinion && (
                                    <button className="btn btn-warning" onClick={() => setIsRatingMode(true)}>Oceń</button>
                                )}
                                
                                {/* Admin: Nie ma przycisków akcji w stopce, bo ma panel na górze */}
                            </div>
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Zamknij</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetailsModal;