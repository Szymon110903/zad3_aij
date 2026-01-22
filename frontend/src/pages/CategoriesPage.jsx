import React, { useState, useEffect } from "react";
import categoryService from "../services/categoryService";
import CategoryModal from "../components/CategoryModal";
import ImportModal from "../components/ImportModal"; 

function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    
    const [selectedCategory, setSelectedCategory] = useState(null);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await categoryService.getAllCategories();
            setCategories(data);
        } catch (error) {
            console.error("Błąd pobierania:", error);
            alert("Nie udało się pobrać kategorii.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Czy na pewno usunąć tę kategorię?")) return;
        try {
            await categoryService.deleteCategory(id);
            fetchCategories();
        } catch (error) { alert("Błąd usuwania."); }
    };

    const handleSaveCategory = async (formData) => {
        try {
            if (selectedCategory) {
                await categoryService.updateCategory(selectedCategory._id, formData);
            } else {
                await categoryService.createCategory(formData);
            }
            fetchCategories();
            setShowCategoryModal(false);
        } catch (error) { alert("Błąd zapisu."); }
    };

    const openAddCategory = () => {
        setSelectedCategory(null);
        setShowCategoryModal(true);
    };

    const openEditCategory = (cat) => {
        setSelectedCategory(cat);
        setShowCategoryModal(true);
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="card shadow-lg border-0">
                
                <div className="card-header bg-dark text-white py-3 d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <h4 className="mb-0 fs-5">
                        Zarządzanie Kategoriami 
                        <span className="badge bg-secondary ms-3 fs-6">{categories.length}</span>
                    </h4>
                    
                    <div className="d-flex gap-2">
                        <button className="btn btn-success btn-sm fw-bold px-3" onClick={() => setShowImportModal(true)}>
                            <i className="bi bi-file-earmark-arrow-up me-2"></i> Importuj
                        </button>
                        
                        <button className="btn btn-primary btn-sm fw-bold px-3" onClick={openAddCategory}>
                            <i className="bi bi-plus-lg me-2"></i> Dodaj kategorię
                        </button>
                    </div>
                </div>

                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary"></div>
                            <p className="mt-2 text-muted">Ładowanie kategorii...</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light text-secondary small text-uppercase">
                                    <tr>
                                        <th className="ps-4 py-3">Nazwa kategorii</th>
                                        <th className="py-3">ID Techniczne</th>
                                        <th className="text-end py-3 pe-4">Akcje</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.length > 0 ? (
                                        categories.map((cat) => (
                                            <tr key={cat._id}>
                                                <td className="ps-4 fw-bold text-dark">
                                                    {cat.nazwa}
                                                </td>
                                                <td>
                                                    <span className="badge bg-light text-secondary border font-monospace">
                                                        {cat._id}
                                                    </span>
                                                </td>
                                                <td className="text-end pe-4">
                                                    <button 
                                                        className="btn btn-sm btn-outline-primary me-2" 
                                                        onClick={() => openEditCategory(cat)}
                                                        title="Edytuj"
                                                    >
                                                        <i className="bi bi-pencil">Edytuj</i>
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm btn-outline-danger" 
                                                        onClick={() => handleDelete(cat._id)}
                                                        title="Usuń"
                                                    >
                                                        <i className="bi bi-trash">Ususń</i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="text-center py-5 text-muted">
                                                <i className="bi bi-tags fs-1 d-block mb-3 opacity-50"></i>
                                                Brak kategorii w systemie. Dodaj pierwszą!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <CategoryModal 
                show={showCategoryModal} 
                onClose={() => setShowCategoryModal(false)} 
                onSave={handleSaveCategory} 
                categoryToEdit={selectedCategory} 
            />

            <ImportModal 
                show={showImportModal}
                onClose={() => setShowImportModal(false)}
                onSuccess={fetchCategories} 
            />
        </div>
    );
}

export default CategoriesPage;