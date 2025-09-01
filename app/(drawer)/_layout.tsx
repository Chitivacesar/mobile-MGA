import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/shared/contexts/AuthContext';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing } from '@/constants/theme';
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
        {/* Filtrar las pantallas para ocultar mi-perfil ya que tenemos un botón personalizado */}
        <DrawerItemList 
          {...props} 
          itemStyle={(route: any) => {
            // Ocultar mi-perfil del drawer ya que tenemos un botón personalizado
            if (route.name === 'mi-perfil') {
              return { display: 'none' };
            }
            return {};
          }}
        />
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
    
    // Si es beneficiario, solo mostrar programación de clases y asistencia
    if (userRole === 'beneficiario') {
      console.log(`Beneficiario detected, checking if ${screenName} should be shown`);
      if (screenName === 'programacion-clases' || screenName === 'asistencia') {
        console.log(`Showing ${screenName} for beneficiario`);
        return {};
      }
      console.log(`Hiding ${screenName} for beneficiario`);
      return {
        drawerItemStyle: { display: 'none' as const }
      };
    }
    
    // Si es cliente, solo mostrar beneficiarios y pagos
    if (userRole === 'cliente') {
      console.log(`Cliente detected, checking if ${screenName} should be shown`);
      if (screenName === 'beneficiarios' || screenName === 'pagos') {
        console.log(`Showing ${screenName} for cliente`);
        return {};
      }
      console.log(`Hiding ${screenName} for cliente`);
      return {
        drawerItemStyle: { display: 'none' as const }
      };
    }
    
    // Si es profesor, solo mostrar programación de profesores y programación de clases
    if (userRole === 'profesor') {
      console.log(`Profesor detected, checking if ${screenName} should be shown`);
      if (screenName === 'programacion-profesores' || screenName === 'programacion-clases') {
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
          drawerActiveTintColor: colors.primary,
          drawerInactiveTintColor: colors.textSecondary,
          headerShown: true, // Mostrar el header nativo del drawer
        }}
      >
        <Drawer.Screen 
          name="dashboard" 
          options={{ 
            title: 'Dashboard', 
            drawerIcon: ({ color, size }) => (<MaterialIcons name="dashboard" color={color} size={size} />),
            ...getScreenOptions(['administrador', 'admin', 'profesor', 'cliente'], 'dashboard')
          }} 
        />

        {/* Configuración - Solo Admin */}
        <Drawer.Screen 
          name="configuracion/roles" 
          options={{ 
            title: 'Roles', 
            drawerIcon: ({ color, size }) => (<MaterialIcons name="vpn-key" color={color} size={size} />),
            ...getScreenOptions(['administrador', 'admin'], 'roles')
          }} 
        />
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
          name="servicios-musicales/profesores" 
          options={{ 
            title: 'Profesores', 
            drawerIcon: ({ color, size }) => (<MaterialIcons name="people" color={color} size={size} />),
            ...getScreenOptions(['administrador', 'admin'], 'profesores')
          }} 
        />
        <Drawer.Screen 
          name="servicios-musicales/programacion-profesores" 
          options={{ 
            title: 'Programación de Profesores', 
            drawerIcon: ({ color, size }) => (<MaterialIcons name="schedule" color={color} size={size} />),
            ...getScreenOptions(['administrador', 'admin', 'profesor'], 'programacion-profesores')
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
        <Drawer.Screen 
          name="servicios-musicales/cursos-matriculas" 
          options={{ 
            title: 'Cursos/Matrículas', 
            drawerIcon: ({ color, size }) => (<MaterialIcons name="school" color={color} size={size} />),
            ...getScreenOptions(['administrador', 'admin', 'profesor', 'beneficiario'], 'cursos-matriculas')
          }} 
        />
        <Drawer.Screen 
          name="servicios-musicales/aulas" 
          options={{ 
            title: 'Aulas', 
            drawerIcon: ({ color, size }) => (<MaterialIcons name="meeting-room" color={color} size={size} />),
            ...getScreenOptions(['administrador', 'admin', 'profesor'], 'aulas')
          }} 
        />

        {/* Venta de Servicios - Admin, algunos para Cliente */}
        <Drawer.Screen 
          name="venta-servicios/clientes" 
          options={{ 
            title: 'Clientes', 
            drawerIcon: ({ color, size }) => (<MaterialIcons name="people" color={color} size={size} />),
            ...getScreenOptions(['administrador', 'admin'], 'clientes')
          }} 
        />
        <Drawer.Screen 
          name="venta-servicios/beneficiarios" 
          options={{ 
            title: 'Beneficiarios', 
            drawerIcon: ({ color, size }) => (<MaterialIcons name="school" color={color} size={size} />),
            ...getScreenOptions(['administrador', 'admin', 'cliente'], 'beneficiarios')
          }} 
        />
        <Drawer.Screen 
          name="venta-servicios/venta-matriculas" 
          options={{ 
            title: 'Venta de Matrículas', 
            drawerIcon: ({ color, size }) => (<MaterialIcons name="shopping-cart" color={color} size={size} />),
            ...getScreenOptions(['administrador', 'admin'], 'venta-matriculas')
          }} 
        />
        <Drawer.Screen 
          name="venta-servicios/venta-cursos" 
          options={{ 
            title: 'Venta de Cursos', 
            drawerIcon: ({ color, size }) => (<MaterialIcons name="shopping-cart" color={color} size={size} />),
            ...getScreenOptions(['administrador', 'admin'], 'venta-cursos')
          }} 
        />
        <Drawer.Screen 
          name="venta-servicios/pagos" 
          options={{ 
            title: 'Pagos', 
            drawerIcon: ({ color, size }) => (<MaterialIcons name="payment" color={color} size={size} />),
            ...getScreenOptions(['administrador', 'admin', 'cliente'], 'pagos')
          }} 
        />
        <Drawer.Screen 
          name="venta-servicios/asistencia" 
          options={{ 
            title: 'Asistencia', 
            drawerIcon: ({ color, size }) => (<MaterialIcons name="assignment-turned-in" color={color} size={size} />),
            ...getScreenOptions(['administrador', 'admin', 'profesor', 'beneficiario'], 'asistencia')
          }} 
        />
      </Drawer>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  drawerContent: {
    flex: 1,
  },
  userInfo: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  userRole: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  logoutContainer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
    padding: spacing.sm,
    borderRadius: 6,
  },
  logoutText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: spacing.sm,
  },
  miPerfilContainer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  miPerfilButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    padding: spacing.sm,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  miPerfilText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: spacing.sm,
  },
});


