import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/shared/contexts/AuthContext';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing, radii, typography, shadows } from '@/constants/theme';
import RoleSelector from '@/shared/components/RoleSelector';

function CustomDrawerContent(props: any) {
  const { user, logout, getUserRole } = useAuth();
  const userRole = getUserRole();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.drawerContainer}>
      <DrawerContentScrollView {...props} style={styles.drawerContent}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.nombre?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>
            {user?.nombre} {user?.apellido}
          </Text>
          <Text style={styles.userRole}>
            {userRole === 'administrador' ? 'Administrador' :
             userRole === 'profesor' ? 'Profesor' :
             userRole === 'beneficiario' ? 'Beneficiario' :
             userRole === 'cliente' ? 'Cliente' : 'Usuario'}
          </Text>
        </View>
        {/* Listado normal; ocultaremos 'mi-perfil' declarando la Screen con drawerItemStyle hidden */}
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      
      {/* Mi Perfil - Justo arriba de Cerrar Sesión */}
      <View style={styles.miPerfilContainer}>
        <TouchableOpacity 
          style={styles.miPerfilButton} 
          onPress={() => router.push('/(drawer)/mi-perfil')}
        >
          <MaterialIcons name="account-circle" size={18} color={colors.primary} />
          <Text style={styles.miPerfilText}>Mi Perfil</Text>
        </TouchableOpacity>
      </View>
      
      {/* Selector de Rol - Solo se muestra si tiene más de 2 roles */}
      <RoleSelector />
      
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={18} color={colors.white} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function DrawerLayout() {
  const { getUserRole } = useAuth();
  const userRole = getUserRole();

  console.log('DrawerLayout: Rendering with user role:', userRole);

  const getScreenOptions = (allowedRoles: string[], screenName?: string) => {
    console.log(`getScreenOptions called for ${screenName}, userRole: ${userRole}`);
    
    // Si es beneficiario, mostrar dashboard, programación de clases y pagos
    if (userRole === 'beneficiario') {
      console.log(`Beneficiario detected, checking if ${screenName} should be shown`);
      if (screenName === 'dashboard' || screenName === 'programacion-clases' || screenName === 'pagos') {
        console.log(`Showing ${screenName} for beneficiario`);
        return {};
      }
      console.log(`Hiding ${screenName} for beneficiario`);
      return {
        drawerItemStyle: { display: 'none' as const }
      };
    }
    
    // Si es cliente, mostrar dashboard y pagos
    if (userRole === 'cliente') {
      console.log(`Cliente detected, checking if ${screenName} should be shown`);
      if (screenName === 'dashboard' || screenName === 'pagos') {
        console.log(`Showing ${screenName} for cliente`);
        return {};
      }
      console.log(`Hiding ${screenName} for cliente`);
      return {
        drawerItemStyle: { display: 'none' as const }
      };
    }
    
    // Si es profesor, mostrar dashboard, programación de profesores, programación de clases y asistencia
    if (userRole === 'profesor') {
      console.log(`Profesor detected, checking if ${screenName} should be shown`);
      if (screenName === 'dashboard' || screenName === 'programacion-profesores' || screenName === 'programacion-clases' || screenName === 'asistencia') {
        console.log(`Showing ${screenName} for profesor`);
        return {};
      }
      console.log(`Hiding ${screenName} for profesor`);
      return {
        drawerItemStyle: { display: 'none' as const }
      };
    }
    
    // Para otros roles, usar la lógica normal
    const shouldShow = allowedRoles.includes(userRole || '');
    console.log(`Other role detected, shouldShow: ${shouldShow}`);
    return {
      drawerItemStyle: shouldShow ? {} : { display: 'none' as const },
    };
  };

  console.log('DrawerLayout: Rendering drawer with role:', userRole);

  return (
    <ProtectedRoute>
      <Drawer
        drawerContent={CustomDrawerContent}
        screenOptions={{
          drawerActiveTintColor: colors.primary, // #0455a2 - Color exacto de tu web
          drawerInactiveTintColor: colors.text, // #333333 - Texto exacto de tu web
          drawerActiveBackgroundColor: colors.hoverBackground, // rgba(124, 148, 39, 0.1) - Hover exacto
          drawerItemStyle: {
            borderRadius: radii.sm, // 8px - Igual a tu web
            marginHorizontal: spacing.xs,
            marginVertical: 2,
          },
          drawerLabelStyle: {
            fontSize: typography.sizes.sm, // 14px - Igual a tu web
            fontWeight: typography.weights.medium,
            fontFamily: typography.fontFamily,
          },
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.primary, // #0455a2 - Header exacto de tu web
            elevation: 4,
            shadowOpacity: 0.1,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontSize: typography.sizes.lg,
            fontWeight: typography.weights.semibold,
            fontFamily: typography.fontFamily,
          },
        }}
      >
        {/* Ocultar la ruta mi-perfil declarando su Screen con estilo hidden */}
        <Drawer.Screen
          name="mi-perfil"
          options={{
            title: 'mi-perfil',
            drawerItemStyle: { display: 'none' as const },
          }}
        />

        {/* Dashboard - Primera pantalla para todos los roles */}
        <Drawer.Screen 
          name="dashboard" 
          options={{ 
            title: 'Dashboard', 
            drawerIcon: ({ color, size }) => (<MaterialIcons name="dashboard" color={color} size={size} />),
            ...getScreenOptions(['administrador', 'admin', 'profesor', 'beneficiario', 'cliente'], 'dashboard')
          }} 
        />

        {/* Configuración - Solo Admin */}
        <Drawer.Screen 
          name="configuracion/usuarios" 
          options={{ 
            title: 'Usuarios', 
            drawerIcon: ({ color, size }) => (<MaterialIcons name="person" color={color} size={size} />),
            ...getScreenOptions(['administrador', 'admin'], 'usuarios')
          }} 
        />

        {/* Servicios Musicales - Admin y Profesores */}
        <Drawer.Screen 
          name="servicios-musicales/programacion-profesores" 
          options={{ 
            title: 'Programación de Profesores', 
            drawerIcon: ({ color, size }) => (<MaterialIcons name="schedule" color={color} size={size} />),
            ...getScreenOptions(['administrador', 'admin', 'profesor'], 'programacion-profesores')
          }} 
        />
        <Drawer.Screen
          name="servicios-musicales/asistencia"
          options={{
            title: 'Asistencia',
            drawerIcon: ({ color, size }) => (<MaterialIcons name="check-circle" color={color} size={size} />),
            ...getScreenOptions(['administrador', 'admin', 'profesor'], 'asistencia')
          }}
        />
        <Drawer.Screen 
          name="servicios-musicales/programacion-clases" 
          options={{ 
            title: 'Programación de Clases', 
            drawerIcon: ({ color, size }) => (<MaterialIcons name="schedule" color={color} size={size} />),
            ...getScreenOptions(['administrador', 'admin', 'profesor', 'beneficiario'], 'programacion-clases')
          }} 
        />

        {/* Venta de Servicios - Admin */}
        <Drawer.Screen 
          name="venta-servicios/ventas" 
          options={{ 
            title: 'Reporte de Ventas', 
            drawerIcon: ({ color, size }) => (<MaterialIcons name="shopping-cart" color={color} size={size} />),
            ...getScreenOptions(['administrador', 'admin'], 'ventas')
          }} 
        />
        <Drawer.Screen 
          name="venta-servicios/pagos" 
          options={{ 
            title: 'Pagos', 
            drawerIcon: ({ color, size }) => (<MaterialIcons name="payment" color={color} size={size} />),
            ...getScreenOptions(['administrador', 'admin', 'cliente', 'beneficiario'], 'pagos')
          }} 
        />
      </Drawer>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: colors.surface, // #ffffff - Fondo exacto de tu web
  },
  drawerContent: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  userInfo: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border, // #e0e0e0 - Borde exacto
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: radii.round,
    backgroundColor: colors.primary, // #0455a2 - Color exacto de tu web
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.elevation[4], // Sombra con color primario
  },
  avatarText: {
    color: colors.white,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fontFamily,
  },
  userName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text, // #333333 - Texto exacto de tu web
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily,
  },
  userRole: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary, // #666666 - Color exacto de tu web
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.medium,
  },
  logoutContainer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: colors.surface,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dc2626', // Color de error más suave
    padding: 12,
    borderRadius: 8, // Bordes más redondeados como Material-UI
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  logoutText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: spacing.sm,
    fontFamily: 'System',
  },
  miPerfilContainer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: colors.surface,
  },
  miPerfilButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0455a2', // Color primario de la web
    shadowColor: '#0455a2',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  miPerfilText: {
    color: '#0455a2', // Color primario de la web
    fontSize: 14,
    fontWeight: '600',
    marginLeft: spacing.sm,
    fontFamily: 'System',
  },
});


