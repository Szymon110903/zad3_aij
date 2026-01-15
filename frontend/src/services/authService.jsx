import api from "../api/axios";

const loginFunc = async(credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

const registerFunc = async(credentials) => {
    const response = await api.post('/auth/register', credentials);
    return response.data;
};

const authService = {loginFunc, registerFunc};
export default authService;


