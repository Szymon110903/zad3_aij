import api from "../api/axios";

const getUserOrders = async (username) => {
    const responce = await api.get(`/orders/${encodeURIComponent(username)}`);
    return responce.data;
}

const createOrder = async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
};

const getOrderStatuses = async () => {
        const response = await api.get('/orders/status');
        return response.data;
}

const orderService = {
    getUserOrders,
    createOrder,
    getOrderStatuses
}

export default orderService;