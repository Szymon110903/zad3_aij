import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; 
import productsService from "../services/ProductService"; 
import categoryService from "../services/categoryService"; 

function ProductDetailsModal({ show, product, onClose, onSave }) {
    const { isAdmin } = useAuth();
    
    const [formData, setFormData] = useState({ ...product });
    
    const [categories, setCategories] = useState([]);
    
    const [seoDescription, setSeoDescription] = useState("");
    const [loadingSeo, setLoadingSeo] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (show && product) {
            setFormData({ ...product });

            if (isAdmin) {
                categoryService.getAllCategories()
                    .then(data => setCategories(data))
                    .catch(err => console.error("Błąd pobierania kategorii:", err));
            } 
            else {
                setSeoDescription(""); 
                setLoadingSeo(true);
                productsService.getProductSeoDescription(product._id)
                    .then(data => { 
                         let htmlToDisplay = "";
                         if (data.seoDescription) htmlToDisplay = data.seoDescription;
                         else if (data.choices && data.choices[0]?.message?.content) htmlToDisplay = data.choices[0].message.content;
                         setSeoDescription(htmlToDisplay || product.opis);
                    })
                    .catch(() => setSeoDescription(product.opis || "<p>Brak opisu</p>"))
                    .finally(() => setLoadingSeo(false));
            }
        }
    }, [show, product, isAdmin]);

    const handleGenerateAI = async () => {
        setIsGenerating(true);
        try {
            const data = await productsService.generateAndSaveDescription(product._id);
            setFormData(prev => ({ ...prev, opis: data.seoDescription }));
            alert("Opis zaktualizowany!");
        } catch (e) { alert("Błąd AI"); } 
        finally { setIsGenerating(false); }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (onSave) onSave(formData);
        onClose();
    };

    const getCategoryId = (kategoria) => {
        if (!kategoria) return "";
        return kategoria._id || kategoria; 
    };

    if (!show || !product) return null;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1050 }}>
            <div className="modal-backdrop show" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}></div>
            <div className="modal fade show d-block" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content shadow border-0">
                        
                        <div className={`modal-header text-white ${isAdmin ? 'bg-danger' : 'bg-primary'}`}>
                            <h5 className="modal-title">{isAdmin ? `Edycja: ${product.nazwa}` : product.nazwa}</h5>
                            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                        </div>

                        <div className="modal-body">
                            {isAdmin ? (
                                <form>
                                    <div className="row mb-3">
                                        <div className="col-md-8">
                                            <label className="form-label fw-bold">Nazwa</label>
                                            <input type="text" className="form-control" name="nazwa" value={formData.nazwa || ""} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label fw-bold">Cena</label>
                                            <input type="number" className="form-control" name="cena_jednostkowa" value={formData.cena_jednostkowa || 0} onChange={handleChange} />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Kategoria</label>
                                        <select 
                                            className="form-select" 
                                            name="kategoria" 
                                            value={getCategoryId(formData.kategoria)} 
                                            onChange={handleChange}
                                        >
                                            <option value="">-- Wybierz kategorię --</option>
                                            {categories.map(cat => (
                                                <option key={cat._id} value={cat._id}>
                                                    {cat.nazwa}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Opis AI */}
                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <label className="form-label fw-bold mb-0">Opis</label>
                                            <button type="button" className="btn btn-sm btn-outline-primary fw-bold" onClick={handleGenerateAI} disabled={isGenerating}>
                                                {isGenerating ? "Tworzenie..." : "Generuj AI"}
                                            </button>
                                        </div>
                                        <textarea className="form-control font-monospace small" rows="5" name="opis" value={formData.opis || ""} onChange={handleChange}></textarea>
                                    </div>
                                    
                                </form>
                            ) : (
                                <div>
                                    <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                        <h3 className="text-primary fw-bold mb-0">{product.cena_jednostkowa} zł</h3>
                                        <span className="text-muted small">
                                            Kategoria: {product.kategoria?.nazwa || "Ogólna"}
                                        </span>
                                    </div>
                                    <div dangerouslySetInnerHTML={{ __html: seoDescription }} />
                                </div>
                            )}
                        </div>

                        <div className="modal-footer bg-light">
                            {isAdmin ? (
                                <>
                                    <button className="btn btn-secondary" onClick={onClose}>Anuluj</button>
                                    <button className="btn btn-danger" onClick={handleSave}>Zapisz zmiany</button>
                                </>
                            ) : (
                                <button className="btn btn-primary px-4" onClick={onClose}>Zamknij</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailsModal;