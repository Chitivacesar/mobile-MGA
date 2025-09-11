import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';

interface User {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  numeroDocumento?: string;
  tipoDocumento?: string;
  rol?: {
    id: string;
    nombre: string;
    descripcion?: string;
  };
  todosLosRoles?: Array<{
    id: string;
    nombre: string;
    descripcion?: string;
  }>;
  permissions?: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (correo: string, contrasena: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  checkAuthState: () => Promise<void>;
  getUserRole: () => string | null;
  getCurrentRoleId: () => string | null;
  changeRole: (newRoleId: string) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  const getUserRole = (): string | null => {
    return user?.rol?.nombre?.toLowerCase() || null;
  };

  const getCurrentRoleId = (): string | null => {
    return user?.rol?.id || null;
  };

  const checkAuthState = async () => {
    try {
      setLoading(true);
      
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');

      if (storedToken && storedUser) {
        const userData = JSON.parse(storedUser);
        
        console.log('AuthContext: Setting token from storage:', storedToken ? storedToken.substring(0, 20) + '...' : 'null');
        setToken(storedToken);
        setUser(userData);
        apiService.setToken(storedToken);
        console.log('AuthContext: Token configured in API service from storage');
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      await logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (correo: string, contrasena: string) => {
    try {
      setLoading(true);
      
      const response: any = await apiService.login(correo, contrasena);

      if (response.success && response.usuario && response.token) {
        // Configurar el token en el servicio
        console.log('AuthContext: Setting token from login:', response.token ? response.token.substring(0, 20) + '...' : 'null');
        apiService.setToken(response.token);
        
        // Guardar en AsyncStorage
        await AsyncStorage.setItem('token', response.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.usuario));
        
        // Actualizar el estado
        setUser(response.usuario);
        setToken(response.token);
        console.log('AuthContext: Token configured in API service from login');
        
        return { success: true };
      } else {
        return { success: false, message: response.message || 'Error al iniciar sesión' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Mensajes de error más específicos
      let errorMessage = 'Error de conexión';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Timeout: El servidor está tardando mucho en responder. Verifica que el backend esté funcionando y tu conexión a internet.';
      } else if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        errorMessage = 'No se puede conectar al servidor. Verifica tu conexión a internet y que el backend esté funcionando.';
      } else if (error.code === 'ENOTFOUND' || error.message?.includes('getaddrinfo ENOTFOUND')) {
        errorMessage = 'No se puede encontrar el servidor. Verifica la URL del backend en la configuración.';
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Conexión rechazada. El servidor no está disponible en la URL configurada.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Credenciales incorrectas';
      } else if (error.response?.status === 500) {
        errorMessage = 'Error del servidor. Intenta de nuevo más tarde.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setUser(null);
      setToken(null);
      apiService.setToken('');

      // Limpiar AsyncStorage
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeRole = async (newRoleId: string) => {
    try {
      console.log('=== CHANGE ROLE ===');
      console.log('Changing to role ID:', newRoleId);
      
      const response: any = await apiService.post('/login/cambiar-rol', {
        usuarioId: user?.id,
        nuevoRolId: newRoleId
      });
      
      console.log('Change role response:', response);
      
      if (response.success && response.usuario && response.token) {
        console.log('Role changed successfully!');
        
        // Configurar el token en el servicio
        apiService.setToken(response.token);
        
        // Guardar en AsyncStorage
        await AsyncStorage.setItem('token', response.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.usuario));
        
        // Actualizar el estado
        setUser(response.usuario);
        setToken(response.token);
        
        console.log('User and token updated after role change');
        return { success: true, message: 'Rol cambiado exitosamente' };
      } else {
        console.log('Role change failed:', response.message);
        return { success: false, message: response.message || 'Error al cambiar de rol' };
      }
    } catch (error) {
      console.error('Error in changeRole:', error);
      return { success: false, message: 'Error de conexión al cambiar de rol' };
    }
  };

  useEffect(() => {
    checkAuthState();
  }, []);

  const value: AuthContextType = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuthState,
    getUserRole,
    getCurrentRoleId,
    changeRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
