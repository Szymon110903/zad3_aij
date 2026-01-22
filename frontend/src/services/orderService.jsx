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
const updateOrderStatus = async (orderId, newStatusId) => {
    const response = await api.patch(`/orders/${orderId}`, {
        stan: newStatusId
    });
    return response.data;
};

const addOrderOpinion = async (orderId, opinionData) => {
    const response = await api.post(`/orders/${orderId}/opinia`, opinionData);
    return response.data;
};

const getAllOrders = async () => {
    const response = await api.get('/orders');
    return response.data;
};

const orderService = {
    getUserOrders,
    createOrder,
    getOrderStatuses,
    updateOrderStatus,
    addOrderOpinion,
    getAllOrders
}

export default orderService;