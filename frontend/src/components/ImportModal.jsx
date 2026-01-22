import React, { useState } from "react";
import productsService from "../services/ProductService";

function ImportModal({ show, onClose, onSuccess }) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // Reset stanów przy otwarciu/zamknięciu
    if (!show) return null;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setError("");
        setSuccessMsg("");

        // WALIDACJA KLIENTA (Wymaganie D3)
        if (selectedFile) {
            const validExtensions = ['json', 'csv', 'xls', 'xlsx'];
            const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
            
            if (!validExtensions.includes(fileExtension)) {
                setError("Nieprawidłowy format pliku. Dozwolone: .json, .csv, .xls");
                setFile(null); // Resetuj plik
                e.target.value = null; // Wyczyść input
            }
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            setError("Wybierz plik do importu.");
            return;
        }

        setLoading(true);
        setError("");
        setSuccessMsg("");

        try {
            const response = await productsService.initDatabase(file);
            setSuccessMsg(`Sukces! Dodano ${response.dodano} produktów. Nowe kategorie zostały utworzone automatycznie.`);
            setFile(null);
            
            // Po 2 sekundach zamknij modal i odśwież widok rodzica
            setTimeout(() => {
                if (onSuccess) onSuccess();
                onClose();
                setSuccessMsg("");
            }, 2500);

        } catch (err) {
            console.error(err);
            // Obsługa błędów z backendu (np. brak uprawnień)
            setError(err.response?.data?.error || "Wystąpił błąd podczas importu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1060 }}>
            <div className="modal-backdrop show" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}></div>
            <div className="modal fade show d-block" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content shadow border-0">
                        
                        <div className="modal-header bg-success text-white">
                            <h5 className="modal-title"><i className="bi bi-cloud-upload me-2"></i>Import Produktów</h5>
                            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                        </div>

                        <div className="modal-body">
                            <p className="small text-muted">
                                Wybierz plik JSON lub CSV. Jeśli wpiszesz kategorię, która nie istnieje, 
                                system <strong>automatycznie ją utworzy</strong>.
                            </p>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Plik z danymi</label>
                                <input 
                                    type="file" 
                                    className="form-control" 
                                    accept=".json,.csv,.xls,.xlsx"
                                    onChange={handleFileChange} 
                                />
                            </div>

                            {/* Komunikaty */}
                            {error && <div className="alert alert-danger py-2 small"><i className="bi bi-exclamation-triangle me-2"></i>{error}</div>}
                            {successMsg && <div className="alert alert-success py-2 small"><i className="bi bi-check-circle me-2"></i>{successMsg}</div>}
                        </div>

                        <div className="modal-footer bg-light">
                            <button className="btn btn-secondary" onClick={onClose} disabled={loading}>Anuluj</button>
                            <button 
                                className="btn btn-success" 
                                onClick={handleSubmit} 
                                disabled={loading || !file}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Importowanie...
                                    </>
                                ) : (
                                    "Rozpocznij import"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ImportModal;