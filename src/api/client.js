import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Votre IP WiFi
const API_URL = __DEV__ 
  ? 'http://192.168.1.108:5000/api'  // ← Votre IP WiFi !
  : 'https://api.production.com/api';

console.log('🌐 API URL:', API_URL);

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token
apiClient.interceptors.request.use(
  async (config) => {
    console.log('📤 Request:', config.method.toUpperCase(), config.url);
    console.log('📦 Data:', config.data);
    
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔐 Token ajouté');
      }
    } catch (error) {
      console.error('Erreur récupération token:', error);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    console.log('📦 Data:', response.data);
    return response;
  },
  async (error) => {
    console.error('❌ Response Error:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('URL:', error.config?.url);
    } else if (error.request) {
      console.error('❌ Pas de réponse du serveur');
      console.error('URL tentée:', error.config?.url);
    }
    
    if (error.response?.status === 401) {
      console.log('🚪 Token invalide, déconnexion...');
      await SecureStore.deleteItemAsync('authToken');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
