import { API_BASE_URL, API_CONFIG } from '@/constants/config';
import axios from 'axios';

export class ApiService {
  private static instance: ApiService;
  private token: string | null = null;

  constructor() {
    if (ApiService.instance) {
      return ApiService.instance;
    }

    console.log('🔧 ApiService constructor - API_BASE_URL:', API_BASE_URL);
    this.configureAxios();
    ApiService.instance = this;
  }

  private configureAxios() {
    // Configuración optimizada de axios
    console.log('🔧 Configuring Axios with baseURL:', API_BASE_URL);
    axios.defaults.baseURL = API_BASE_URL;
    axios.defaults.timeout = API_CONFIG.timeout;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    
    // Configuraciones adicionales para mejor rendimiento
    axios.defaults.maxRedirects = 3;
    axios.defaults.validateStatus = (status) => status < 500; // No lanzar error para códigos 4xx
    
    console.log('🔧 Axios configured. Current baseURL:', axios.defaults.baseURL);
    
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

  // Login optimizado con reintentos rápidos
  async login(correo: string, contrasena: string) {
    const loginData = { correo, contrasena };
    
    console.log('🚀 LOGIN ATTEMPT');
    console.log('📧 Email:', correo);
    console.log('🌐 URL:', API_BASE_URL);
    
    // Intentar con timeout más corto primero
    const quickTimeout = 3000; // 3 segundos
    const maxRetries = 1;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Intento ${attempt}/${maxRetries}`);
        
        const response = await this.makeLoginRequestWithTimeout('/api/login', loginData, quickTimeout);
        console.log('✅ Login successful!');
        return response;
        
      } catch (error: any) {
        console.log(`❌ Intento ${attempt} falló:`, error.message);
        
        // Si es el último intento, lanza el error
        if (attempt === maxRetries) {
          if (error.code === 'ECONNABORTED') {
            throw new Error('Timeout: El servidor está tardando mucho en responder. Verifica que el backend esté funcionando y tu conexión a internet.');
          } else if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
            throw new Error('No se puede conectar al servidor. Verifica tu conexión a internet.');
          }
          throw error;
        }
        
        // Esperar un poco antes del siguiente intento
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  private async makeLoginRequest(endpoint: string, data: any) {
    const response = await axios.post(endpoint, data);
    console.log('Server response status:', response.status);
    console.log('Server response data:', response.data);
    return response.data;
  }
  
  private async makeLoginRequestWithTimeout(endpoint: string, data: any, timeout: number) {
    const response = await axios.post(endpoint, data, { timeout });
    console.log('Server response status:', response.status);
    console.log('Server response data:', response.data);
    return response.data;
  }
  
  private logDetailedError(error: any) {
    console.error('=== ERROR DETAILS ===');
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }

  // Recuperar contraseña
  async forgotPassword(email: string) {
    try {
      console.log('=== FORGOT PASSWORD ===');
      console.log('Email:', email);
      
      const response = await axios.post('/api/password-reset/forgot-password', {
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
      
      const response = await axios.post('/api/password-reset/reset-password', {
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
      
      const response = await axios.get(`/api/password-reset/verify-token/${token}`);

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