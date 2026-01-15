import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', 
});

// interceptor żądań - przed wysyłaniem zapytania sprawdza w localStorage i jeśli jest to dokleja go do nagłówka
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// intercetor odpowiedzi - globalne obsłużenie 401 - wygasły token, jeśli nie jest zautoryzowany to usuwa token z localStorage
api.interceptors.response.use(
  response => response,
  error => {
    const isAuthRequest = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');

    if (error.response && error.response.status === 401 && !isAuthRequest) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;