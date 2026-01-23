import React, { useState, useEffect } from "react";
import orderService from "../services/orderService"; 
import { useAuth } from "../context/AuthContext"; 
import Alert from "./alert"; 

function OrderDetailsModal({ show, order, onClose, onOrderUpdated }) {
    const { isAdmin } = useAuth(); 
    
    const [loading, setLoading] = useState(false);
    const [allStatuses, setAllStatuses] = useState([]); 
    const [selectedStatusId, setSelectedStatusId] = useState(""); 

    const [isRatingMode, setIsRatingMode] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    
    const [alertState, setAlertState] = useState({
        show: false,
        message: '',
        type: ''
    });

    const showAlert = (message, type = 'danger') => {
        setAlertState({ show: true, message, type });
        setTimeout(() => setAlertState(prev => ({ ...prev, show: false })), 4000);
    };

    useEffect(() => {
        if (show && order) {
            const fetchStatuses = async () => {
                try {
                    const statuses = await orderService.getOrderStatuses();
                    setAllStatuses(statuses);
                    
                    if (order.stan && (typeof order.stan === 'object')) {
                        setSelectedStatusId(order.stan._id);
                    } else {
                        setSelectedStatusId(order.stan); 
                    }
                } catch (err) {
                    console.error("Błąd statusów:", err);
                }
            };
            fetchStatuses();
            
            setIsRatingMode(false);
            setRating(5);
            setComment("");
            setAlertState({ show: false, message: '', type: '' });
        }
    }, [show, order]);

    if (!show || !order) return null;

    const statusName = order.stan?.nazwa || "Nieznany";
    const hasOpinion = order.opinia && (order.opinia.ocena || order.opinia.komentarz);
    const adres = order.zamieszkanie || order.adres || {};

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'ZREALIZOWANE': return 'bg-success';
            case 'ANULOWANE': return 'bg-danger';
            case 'WYSŁANE': return 'bg-primary';
            case 'NIEZATWIERDZONE': return 'bg-warning text-dark';
            default: return 'bg-secondary';
        }
    };

    const handleAdminStatusChange = async () => {
        if (!selectedStatusId) return;
        setLoading(true);
        try {
            await orderService.updateOrderStatus(order._id, selectedStatusId);
            showAlert("Status zamówienia został zmieniony.", "success");
            
            setTimeout(() => {
                if (onOrderUpdated) onOrderUpdated();
                onClose();
            }, 2000);

        } catch (error) {
            showAlert("Błąd zmiany statusu: " + (error.response?.data?.message || "Nieznany błąd"), "danger");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        
        const cancelledStatus = allStatuses.find(s => s.nazwa === "ANULOWANE");
        if (!cancelledStatus) {
            showAlert("Błąd: Nie znaleziono statusu 'ANULOWANE' w systemie.", "danger");
            return;
        }

        setLoading(true);
        try {
            await orderService.updateOrderStatus(order._id, cancelledStatus._id);
            
            showAlert("Zamówienie zostało pomyślnie anulowane.", "success");
            
            setTimeout(() => {
                if (onOrderUpdated) onOrderUpdated();
                onClose();
            }, 2000);

        } catch (error) {
            showAlert("Błąd anulowania: " + (error.response?.data?.error || error.message), "danger");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitRating = async () => {
        setLoading(true);
        try {
            await orderService.rateOrder(order._id, { ocena: rating, komentarz: comment });
            showAlert("Dziękujemy za opinię!", "success");
            
            setTimeout(() => {
                if (onOrderUpdated) onOrderUpdated();
                onClose();
            }, 2000);
            
        } catch (error) {
            showAlert("Błąd wysyłania opinii: " + (error.response?.data?.error || error.message), "danger");
        } finally {
            setLoading(false);
        }
    };

    const renderStatusSection = () => {
        if (isAdmin) {
             return (
                <div className="bg-light p-3 rounded mb-3 border">
                    <label className="form-label fw-bold text-dark mb-2">Zmień status (Admin):</label>
                    <div className="d-flex gap-2">
                        <select className="form-select border-secondary" value={selectedStatusId} onChange={(e) => setSelectedStatusId(e.target.value)}>
                            {allStatuses.map(status => <option key={status._id} value={status._id}>{status.nazwa}</option>)}
                        </select>
                        <button className="btn btn-dark text-nowrap px-4" onClick={handleAdminStatusChange} disabled={loading}>
                            {loading ? "Zapis..." : "Zapisz"}
                        </button>
                    </div>
                </div>
            );
        } else {
             return (
                <div className="mb-2">
                    <span className="fw-bold text-dark me-2">Status:</span>
                    <span className={`badge rounded-pill px-3 py-2 fw-normal ${getStatusBadgeClass(statusName)}`}>{statusName}</span>
                </div>
            );
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1050 }}>
            <div className="modal-backdrop show" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}></div>

            <div className="modal fade show d-block" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content shadow border-0 position-relative">
                        
                        <div className="modal-header bg-dark text-white">
                            <h5 className="modal-title fs-5">
                                {isAdmin ? `Edycja Zamówienia` : `Szczegóły zamówienia`} <span className="text-secondary ms-2 opacity-75">#{order._id.slice(-6).toUpperCase()}</span>
                            </h5>
                            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                        </div>

                        <Alert 
                            show={alertState.show} 
                            message={alertState.message} 
                            type={alertState.type} 
                            onClose={() => setAlertState(prev => ({ ...prev, show: false }))}
                        />
                        
                        <div className="modal-body pt-4">
                            {isAdmin && renderStatusSection()}
                            
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <h6 className="border-bottom pb-2 mb-3 text-uppercase small text-muted fw-bold">Informacje</h6>
                                    {!isAdmin && renderStatusSection()}
                                    <div className="mb-2"><span className="fw-bold text-dark">Data: </span><span className="text-secondary">{order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}</span></div>
                                    <div className="mb-2"><span className="fw-bold text-dark">ID Pełne: </span><span className="text-secondary font-monospace small">{order._id}</span></div>
                                </div>
                                <div className="col-md-6">
                                     <h6 className="border-bottom pb-2 mb-3 text-uppercase small text-muted fw-bold">Klient</h6>
                                     <div className="mb-1"><span className="fw-bold">Odbiorca:</span> {order.imie} {order.nazwisko}</div>
                                     <div className="mb-1"><span className="fw-bold">Email:</span> {order.email}</div>
                                     <div className="mb-1"><span className="fw-bold">Telefon:</span> {order.telefon || "-"}</div>
                                     <div className="mb-3"><span className="fw-bold">Adres:</span> {adres.miejscowosc}, {adres.ulica} {adres.nrDomu} {adres.kod_pocztowy}</div>
                                </div>
                            </div>
                            
                             {isRatingMode && !isAdmin ? (
                                <div className="bg-light p-3 rounded mb-4 border shadow-sm">
                                    <h6 className="fw-bold mb-3">Oceń zamówienie</h6>
                                    <div className="mb-3">
                                        <label className="form-label small text-uppercase fw-bold">Ocena (1-5)</label>
                                        <select className="form-select w-auto" value={rating} onChange={e => setRating(Number(e.target.value))}>
                                            <option value="5">5 - Rewelacja</option>
                                            <option value="4">4 - Dobrze</option>
                                            <option value="3">3 - Przeciętnie</option>
                                            <option value="2">2 - Słabo</option>
                                            <option value="1">1 - Fatalnie</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small text-uppercase fw-bold">Komentarz</label>
                                        <textarea className="form-control" rows="3" value={comment} onChange={e => setComment(e.target.value)} placeholder="Napisz co myślisz..."></textarea>
                                    </div>
                                    <div className="d-flex gap-2 justify-content-end">
                                        <button className="btn btn-outline-secondary" onClick={() => setIsRatingMode(false)}>Anuluj</button>
                                        <button className="btn btn-success px-4" onClick={handleSubmitRating} disabled={loading}>Wyślij opinię</button>
                                    </div>
                                </div>
                            ) : hasOpinion && (
                                <div className="alert alert-info mb-4 border-info">
                                    <h6 className="alert-heading fw-bold"><i className="bi bi-star-fill text-warning me-2"></i>Opinia klienta</h6>
                                    <hr />
                                    <p className="mb-1"><strong>Ocena:</strong> {order.opinia.ocena}/5</p>
                                    <p className="mb-0"><strong>Komentarz:</strong> {order.opinia.komentarz || "Brak komentarza"}</p>
                                </div>
                            )}

                            <h6 className="border-bottom pb-2 mt-4 text-uppercase small text-muted fw-bold">Produkty</h6>
                             <div className="table-responsive border rounded">
                                <table className="table table-sm align-middle mb-0">
                                    <thead className="table-light text-secondary small text-uppercase">
                                        <tr>
                                            <th className="py-2 ps-3">Produkt</th>
                                            <th className="text-center py-2">Ilość</th>
                                            <th className="text-end py-2">Cena jedn.</th>
                                            <th className="text-end py-2 pe-3">Suma</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.pozycje?.map((poz, idx) => (
                                            <tr key={idx}>
                                                <td className="ps-3">{poz.produkt?.nazwa || <span className="text-danger fst-italic">Produkt usunięty</span>}</td>
                                                <td className="text-center">{poz.ilosc}</td>
                                                <td className="text-end text-muted small">{poz.cenaWChwiliZakupu?.toFixed(2)} zł</td>
                                                <td className="text-end fw-bold pe-3">{(poz.cenaWChwiliZakupu * poz.ilosc).toFixed(2)} zł</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="table-light">
                                        <tr>
                                            <td colSpan="3" className="text-end fw-bold py-3">RAZEM:</td>
                                            <td className="text-end fw-bold fs-6 py-3 pe-3 text-success">{order.sumaCalkowita?.toFixed(2)} zł</td>
                                        </tr>
                                    </tfoot>
                                </table>
                             </div>
                        </div>

                        <div className="modal-footer bg-light d-flex justify-content-between">
                            <div>
                                {!isAdmin && statusName === 'NIEZATWIERDZONE' && (
                                    <button className="btn btn-outline-danger me-2" onClick={handleCancelOrder} disabled={loading}>
                                        <i className="bi bi-x-circle me-1"></i> Anuluj zamówienie
                                    </button>
                                )}
                                {!isAdmin && statusName === 'ZREALIZOWANE' && !hasOpinion && !isRatingMode && (
                                    <button className="btn btn-warning shadow-sm" onClick={() => setIsRatingMode(true)}>
                                        <i className="bi bi-star me-1"></i> Oceń zamówienie
                                    </button>
                                )}
                            </div>
                            
                            <button type="button" className="btn btn-secondary px-4" onClick={onClose}>Zamknij</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetailsModal;