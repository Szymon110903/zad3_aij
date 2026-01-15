import api from "../api/axios";

const getProducts = async(category) => {
    let url = '/products';
    if (category.nazwa && category.nazwa !== 'Wszystkie') {
        url = `/products/category/${category._id}`;
    }
    const response = await api.get(url);
    return response.data;
}

const productsService = {
    getProducts
}

export default productsService;