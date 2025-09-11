import axios from 'axios';
import { API_BASE_URL, API_CONFIG, ALTERNATIVE_URLS } from '@/constants/config';

export class ApiService {
  private static instance: ApiService;
  private token: string | null = null;

  constructor() {
    if (ApiService.instance) {
      return ApiService.instance;
    }

    this.configureAxios();
    ApiService.instance = this;
  }

  private configureAxios() {
    // Configuración mejorada de axios
    axios.defaults.baseURL = API_BASE_URL;
    axios.defaults.timeout = API_CONFIG.timeout;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    
    // Interceptor para manejar errores de conexión
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.log('Axios interceptor - Error detected:', error.code, error.message);
        
        // Si es un error de conexión, intenta con URLs alternativas
        if (error.code === 'ECONNABORTED' || error.code === 'NETWORK_ERROR') {
          console.log('Connection error detected, will be handled by retry mechanism');
        }
        
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    console.log('ApiService: Setting token:', token ? token.substring(0, 20) + '...' : 'null');
    this.token = token;
    if (this.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      console.log('ApiService: Authorization header set:', axios.defaults.headers.common['Authorization']);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      console.log('ApiService: Authorization header removed');
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

  // Login con reintentos y URLs alternativas
  async login(correo: string, contrasena: string) {
    const loginData = { correo, contrasena };
    
    console.log('=== ENHANCED LOGIN ===');
    console.log('Email:', correo);
    console.log('Password length:', contrasena?.length);
    
    // Primero intenta con la URL configurada
    try {
      console.log('Trying primary URL:', `${API_BASE_URL}/login`);
      const response = await this.makeLoginRequest('/login', loginData);
      console.log('Primary URL successful!');
      return response;
    } catch (primaryError: any) {
      console.log('Primary URL failed:', primaryError.message);
      
      // Si falla, intenta con URLs alternativas
      for (let i = 0; i < ALTERNATIVE_URLS.length; i++) {
        const altUrl = ALTERNATIVE_URLS[i];
        if (altUrl === API_BASE_URL) continue; // Skip if it's the same as primary
        
        try {
          console.log(`Trying alternative URL ${i + 1}:`, altUrl);
          
          // Temporalmente cambia la baseURL
          const originalBaseURL = axios.defaults.baseURL;
          axios.defaults.baseURL = altUrl;
          
          const response = await this.makeLoginRequest('/login', loginData);
          
          console.log(`Alternative URL ${i + 1} successful!`);
          console.log('Consider updating your config to use:', altUrl);
          
          // Restaura la baseURL original
          axios.defaults.baseURL = originalBaseURL;
          
          return response;
        } catch (altError: any) {
          console.log(`Alternative URL ${i + 1} failed:`, altError.message);
          // Restaura la baseURL original antes de continuar
          axios.defaults.baseURL = API_BASE_URL;
        }
      }
      
      // Si todas las URLs fallan, lanza el error original
      console.error('All URLs failed. Original error:');
      this.logDetailedError(primaryError);
      throw primaryError;
    }
  }
  
  private async makeLoginRequest(endpoint: string, data: any) {
    const response = await axios.post(endpoint, data);
    console.log('Server response status:', response.status);
    console.log('Server response data:', response.data);
    return response.data;
  }
  
  private logDetailedError(error: any) {
    console.error('=== LOGIN ERROR DETAILS ===');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Response status:', error.response?.status);
    console.error('Response data:', error.response?.data);
    console.error('Config URL:', error.config?.url);
  }

  // Recuperar contraseña
  async forgotPassword(email: string) {
    try {
      console.log('=== FORGOT PASSWORD ===');
      console.log('Email:', email);
      
      const response = await axios.post('/password-reset/forgot-password', {
        email: email,
      });

      console.log('Forgot password response:', response.data);
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Error en forgotPassword:', error);
      return {
        success: false,
        message: error.response?.data?.error || "Error al recuperar contraseña",
      };
    }
  }

  // Restablecer contraseña con token
  async resetPassword(token: string, newPassword: string) {
    try {
      console.log('=== RESET PASSWORD ===');
      console.log('Token:', token ? token.substring(0, 20) + '...' : 'null');
      
      const response = await axios.post('/password-reset/reset-password', {
        token: token,
        newPassword: newPassword,
      });

      console.log('Reset password response:', response.data);
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Error en resetPassword:', error);
      return {
        success: false,
        message: error.response?.data?.error || "Error al restablecer contraseña",
      };
    }
  }

  // Verificar token de restablecimiento
  async verifyResetToken(token: string) {
    try {
      console.log('=== VERIFY RESET TOKEN ===');
      console.log('Token:', token ? token.substring(0, 20) + '...' : 'null');
      
      const response = await axios.get(`/password-reset/verify-token/${token}`);

      console.log('Verify token response:', response.data);
      return {
        valid: response.data.valid,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Error en verifyResetToken:', error);
      return {
        valid: false,
        message: error.response?.data?.error || "Error al verificar token",
      };
    }
  }
}

export const apiService = new ApiService();
export const api = apiService;