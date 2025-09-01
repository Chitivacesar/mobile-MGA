import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';

interface User {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
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
  console.log('AuthContext: isAuthenticated updated:', isAuthenticated, 'user:', !!user, 'token:', !!token);

  const getUserRole = (): string | null => {
    const role = user?.rol?.nombre?.toLowerCase() || null;
    console.log('AuthContext: getUserRole called, user:', user?.nombre, 'role:', role);
    return role;
  };

  const getCurrentRoleId = (): string | null => {
    const roleId = user?.rol?.id || null;
    console.log('AuthContext: getCurrentRoleId called, roleId:', roleId);
    return roleId;
  };

  const checkAuthState = async () => {
    try {
      setLoading(true);
      console.log('Checking auth state...');
      
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');

      console.log('Stored token:', storedToken ? 'exists' : 'null');
      console.log('Stored user:', storedUser ? 'exists' : 'null');

      if (storedToken && storedUser) {
        const userData = JSON.parse(storedUser);
        console.log('Restoring user session:', userData.nombre);
        
        setToken(storedToken);
        setUser(userData);
        apiService.setToken(storedToken);
        
        console.log('Session restored successfully');
      } else {
        console.log('No stored session found');
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
      console.log('=== AUTH CONTEXT LOGIN ===');
      setLoading(true);
      
      const response: any = await apiService.login(correo, contrasena);
      console.log('API Service response:', response);

      if (response.success && response.usuario && response.token) {
        console.log('Login successful!');
        
        // Configurar el token en el servicio
        apiService.setToken(response.token);
        
        // Guardar en AsyncStorage
        await AsyncStorage.setItem('token', response.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.usuario));
        
        // Actualizar el estado
        setUser(response.usuario);
        setToken(response.token);
        
        console.log('User and token set successfully');
        return { success: true };
      } else {
        console.log('Login failed:', response.message);
        return { success: false, message: response.message || 'Error al iniciar sesión' };
      }
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      return { success: false, message: 'Error de conexión' };
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
