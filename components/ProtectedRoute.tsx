import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/shared/contexts/AuthContext';
import { colors } from '@/constants/theme';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const { isAuthenticated, loading, getUserRole } = useAuth();

  useEffect(() => {
    console.log('ProtectedRoute: useEffect triggered', { loading, isAuthenticated, allowedRoles });
    
    if (!loading) {
      if (!isAuthenticated) {
        console.log('ProtectedRoute: Usuario no autenticado, redirigiendo a login');
        router.replace('/(auth)/login');
        return;
      }

      console.log('ProtectedRoute: Usuario autenticado, verificando roles');
      // Verificar si el usuario tiene un rol permitido
      if (allowedRoles.length > 0) {
        const userRole = getUserRole();
        console.log('ProtectedRoute: Rol del usuario:', userRole, 'Roles permitidos:', allowedRoles);
        if (!userRole || !allowedRoles.includes(userRole)) {
          // Redirigir a una página de acceso denegado o pantalla apropiada
          console.log('ProtectedRoute: Rol no permitido, redirigiendo a pantalla apropiada');
          // Redirigir al dashboard para todos los roles
          router.replace('/(drawer)/dashboard');
          return;
        }
      }
      
      console.log('ProtectedRoute: Usuario autorizado, mostrando contenido');
    }
  }, [isAuthenticated, loading, allowedRoles, getUserRole]);

  console.log('ProtectedRoute: Renderizando', { loading, isAuthenticated, allowedRoles });
  
  if (loading) {
    console.log('ProtectedRoute: Mostrando loading');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute: Usuario no autenticado, retornando null');
    return null; // El useEffect manejará la redirección
  }

  if (allowedRoles.length > 0) {
    const userRole = getUserRole();
    if (!userRole || !allowedRoles.includes(userRole)) {
      console.log('ProtectedRoute: Rol no permitido, retornando null');
      return null; // El useEffect manejará la redirección
    }
  }

  console.log('ProtectedRoute: Mostrando contenido protegido');
  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
