import React, { useState, useEffect } from "react";
import categoryService from "../services/categoryService";
import CategoryModal from "../components/CategoryModal";
import ImportModal from "../components/ImportModal"; // 👇 1. Importujemy nowy modal

function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Stany dla modali
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false); // 👇 2. Stan dla modalu importu
    
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

    // Funkcje otwierania modali
    const openAddCategory = () => {
        setSelectedCategory(null);
        setShowCategoryModal(true);
    };

    const openEditCategory = (cat) => {
        setSelectedCategory(cat);
        setShowCategoryModal(true);
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Zarządzanie Kategoriami</h2>
                
                <div className="d-flex gap-2">
                    <button className="btn btn-success" onClick={() => setShowImportModal(true)}>
                        <i className="bi bi-file-earmark-arrow-up me-2"></i> Importuj Produkty
                    </button>
                    
                    <button className="btn btn-primary" onClick={openAddCategory}>
                        <i className="bi bi-plus-lg me-2"></i> Dodaj kategorię
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center"><div className="spinner-border text-primary"></div></div>
            ) : (
                <div className="card shadow-sm">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Nazwa kategorii</th>
                                    <th>ID</th>
                                    <th className="text-end">Akcje</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((cat) => (
                                    <tr key={cat._id}>
                                        <td className="fw-bold">{cat.nazwa}</td>
                                        <td className="text-muted small font-monospace">{cat._id}</td>
                                        <td className="text-end">
                                            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditCategory(cat)}>
                                                <i className="bi bi-pencil">Edytuj</i>
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(cat._id)}>
                                                <i className="bi bi-trash">Usuń</i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {categories.length === 0 && (
                                    <tr><td colSpan="3" className="text-center py-4 text-muted">Brak kategorii.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

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