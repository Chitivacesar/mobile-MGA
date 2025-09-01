import React from 'react';
import { SafeAreaView, Text, View, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '@/shared/contexts/AuthContext';
import { colors, spacing } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';


export default function DashboardScreen() {
  const { user, getUserRole } = useAuth();
  const userRole = getUserRole();

  console.log('Dashboard: Rendering with user:', user?.nombre, 'role:', userRole);

  const getDashboardContent = () => {
    console.log('Dashboard: Getting content for role:', userRole);
    
    switch (userRole) {
      case 'administrador':
      case 'admin':
        console.log('Dashboard: Admin role detected');
        return {
          title: 'Dashboard Administrativo',
          subtitle: 'Gestión completa del sistema',
          features: [
            { icon: 'people', title: 'Gestión de Usuarios', description: 'Administrar roles y permisos' },
            { icon: 'school', title: 'Servicios Musicales', description: 'Profesores, aulas y programación' },
            { icon: 'shopping-cart', title: 'Ventas', description: 'Cursos, matrículas y pagos' },
            { icon: 'assignment', title: 'Reportes', description: 'Asistencia y estadísticas' }
          ]
        };
      case 'profesor':
        console.log('Dashboard: Profesor role detected');
        return {
          title: 'Dashboard del Profesor',
          subtitle: 'Gestión de clases y estudiantes',
          features: [
            { icon: 'schedule', title: 'Mi Programación', description: 'Horarios y clases asignadas' },
            { icon: 'assignment-turned-in', title: 'Asistencia', description: 'Registrar asistencia de estudiantes' },
            { icon: 'school', title: 'Mis Cursos', description: 'Cursos y matrículas activas' },
            { icon: 'meeting-room', title: 'Aulas', description: 'Espacios de clase asignados' }
          ]
        };
      case 'beneficiario':
        console.log('Dashboard: Beneficiario role detected');
        return {
          title: 'Mi Portal Estudiantil',
          subtitle: 'Información de mis cursos y clases',
          features: [
            { icon: 'school', title: 'Mis Matrículas', description: 'Cursos en los que estoy inscrito' },
            { icon: 'assignment-turned-in', title: 'Mi Asistencia', description: 'Historial de asistencia a clases' },
            { icon: 'schedule', title: 'Horarios de Clase', description: 'Programación de mis clases' },
            { icon: 'payment', title: 'Estado de Pagos', description: 'Información de pagos realizados' }
          ]
        };
      case 'cliente':
        console.log('Dashboard: Cliente role detected');
        return {
          title: 'Portal del Cliente',
          subtitle: 'Gestión de beneficiarios y servicios',
          features: [
            { icon: 'school', title: 'Mis Beneficiarios', description: 'Personas a mi cargo inscritas' },
            { icon: 'shopping-cart', title: 'Mis Compras', description: 'Historial de matrículas y cursos' },
            { icon: 'payment', title: 'Pagos Realizados', description: 'Información de transacciones' },
            { icon: 'assignment-turned-in', title: 'Asistencia', description: 'Seguimiento de asistencia' }
          ]
        };
      default:
        console.log('Dashboard: Unknown role detected:', userRole);
        return {
          title: 'Dashboard',
          subtitle: 'Bienvenido al sistema',
          features: []
        };
    }
  };

  const dashboardContent = getDashboardContent();
  console.log('Dashboard: Content for role', userRole, ':', dashboardContent.title);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            ¡Hola, {user?.nombre}!
          </Text>
          <Text style={styles.title}>{dashboardContent.title}</Text>
          <Text style={styles.subtitle}>{dashboardContent.subtitle}</Text>
        </View>

        <View style={styles.featuresContainer}>
          {dashboardContent.features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <MaterialIcons 
                  name={feature.icon as any} 
                  size={32} 
                  color={colors.primary} 
                />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userInfoTitle}>Información de Usuario</Text>
          <Text style={styles.userInfoText}>Correo: {user?.correo}</Text>
          <Text style={styles.userInfoText}>
            Rol: {userRole === 'administrador' ? 'Administrador' :
                  userRole === 'profesor' ? 'Profesor' :
                  userRole === 'beneficiario' ? 'Beneficiario' :
                  userRole === 'cliente' ? 'Cliente' : 'Usuario'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  welcomeSection: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: spacing.xl,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  featureIcon: {
    width: 60,
    height: 60,
    backgroundColor: colors.background,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  featureContent: {
    flex: 1,
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  userInfo: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  userInfoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
});


