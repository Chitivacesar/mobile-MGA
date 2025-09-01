import axios from 'axios';
import { API_BASE_URL, API_CONFIG } from '@/constants/config';

export class ApiService {
  private static instance: ApiService;
  private token: string | null = null;

  constructor() {
    if (ApiService.instance) {
      return ApiService.instance;
    }

    // Configuración simple de axios
    axios.defaults.baseURL = API_BASE_URL;
    axios.defaults.timeout = API_CONFIG.timeout;
    axios.defaults.headers.common['Content-Type'] = 'application/json';

    ApiService.instance = this;
  }

  setToken(token: string) {
    this.token = token;
    if (this.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }

  async get(endpoint: string) {
    try {
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('GET error:', error);
      throw error;
    }
  }

  async post(endpoint: string, data?: any) {
    try {
      const response = await axios.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('POST error:', error);
      throw error;
    }
  }

  async put(endpoint: string, data?: any) {
    try {
      const response = await axios.put(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('PUT error:', error);
      throw error;
    }
  }

  async delete(endpoint: string) {
    try {
      const response = await axios.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error('DELETE error:', error);
      throw error;
    }
  }

  // Login simple como estaba antes
  async login(correo: string, contrasena: string) {
    try {
      console.log('=== SIMPLE LOGIN ===');
      console.log('Email:', correo);
      console.log('Password:', contrasena);

      const loginData = {
        correo,
        contrasena
      };

      console.log('Login data:', loginData);
      console.log('Making request to:', `${API_BASE_URL}/login`);

      const response = await axios.post('/login', loginData);
      console.log('Server response:', response.data);

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
export const api = apiService;