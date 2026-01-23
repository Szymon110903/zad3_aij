import api from "../api/axios";

const getProducts = async(category) => {
    let url = '/products';
    if (category.nazwa && category.nazwa !== 'Wszystkie') {
        url = `/products/category/${category._id}`;
    }
    const response = await api.get(url);
    return response.data;
}

const getProductSeoDescription = async (id) => {
    const response = await api.get(`/products/${id}/seo-description`);
    return response.data; 
};

const updateProduct = async (id, productData) => {
    const response = await api.patch(`/products/${id}`, productData);
    return response.data;
};
const generateAndSaveDescription = async (id) => {
    const response = await api.patch(`/products/${id}/desc`);
    return response.data; 
};

const initDatabase = async (file) => {
    const formData = new FormData();
    formData.append('file', file); 

    const response = await api.post('/products/init', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

const productsService = {
    getProducts,
    getProductSeoDescription,
    updateProduct,
    generateAndSaveDescription,
    initDatabase
}

export default productsService;