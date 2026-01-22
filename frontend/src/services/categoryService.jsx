import api from "../api/axios";

const getAllCategories = async () => {
    const response = await api.get('/category');
    return response.data;
};

const createCategory = async (data) => {
    const response = await api.post('/category', data);
    return response.data;
};

const updateCategory = async (id, data) => {
    const response = await api.put(`/category/${id}`, data);
    return response.data;
};

const deleteCategory = async (id) => {
    const response = await api.delete(`/category/${id}`);
    return response.data;
};

const categoryService = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
};

export default categoryService;