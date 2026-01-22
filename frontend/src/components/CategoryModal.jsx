import React, { useState, useEffect } from "react";

function CategoryModal({ show, onClose, onSave, categoryToEdit }) {
    const [nazwa, setNazwa] = useState("");

    useEffect(() => {
        if (show) {
            if (categoryToEdit) {
                setNazwa(categoryToEdit.nazwa);
            } else {
                setNazwa("");
            }
        }
    }, [show, categoryToEdit]);

    const handleSubmit = () => {
        if (!nazwa.trim()) return alert("Podaj nazwę kategorii!");
        
        onSave({ nazwa });
        onClose();
    };

    if (!show) return null;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1050 }}>
            <div className="modal-backdrop show" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}></div>
            <div className="modal fade show d-block" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content shadow">
                        <div className="modal-header bg-dark text-white">
                            <h5 className="modal-title">
                                {categoryToEdit ? "Edytuj kategorię" : "Nowa kategoria"}
                            </h5>
                            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <label className="form-label fw-bold">Nazwa kategorii</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={nazwa} 
                                onChange={(e) => setNazwa(e.target.value)} 
                                placeholder="np. Laptopy"
                                autoFocus
                            />
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={onClose}>Anuluj</button>
                            <button className="btn btn-success" onClick={handleSubmit}>Zapisz</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoryModal;