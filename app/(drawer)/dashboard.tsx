import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, radii, typography, shadows } from '@/constants/theme';
import { useAuth } from '@/shared/contexts/AuthContext';
import { router } from 'expo-router';

const DashboardScreen = () => {
  const { user, getUserRole } = useAuth();
  const userRole = getUserRole();

  const getWelcomeMessage = () => {
    switch (userRole) {
      case 'administrador':
      case 'admin':
        return 'Panel de Administración';
      case 'profesor':
        return 'Panel del Profesor';
      case 'beneficiario':
        return 'Mi Panel de Estudiante';
      case 'cliente':
        return 'Mi Panel de Cliente';
      default:
        return 'Bienvenido';
    }
  };

  const getQuickActions = () => {
    switch (userRole) {
      case 'administrador':
      case 'admin':
        return [
          { title: 'Usuarios', icon: 'person', route: '/(drawer)/configuracion/usuarios', color: colors.primary },
          { title: 'Programación de Profesores', icon: 'schedule', route: '/(drawer)/servicios-musicales/programacion-profesores', color: colors.secondary },
          { title: 'Programación de Clases', icon: 'schedule', route: '/(drawer)/servicios-musicales/programacion-clases', color: colors.secondary },
          { title: 'Asistencia', icon: 'check-circle', route: '/(drawer)/servicios-musicales/asistencia', color: colors.success },
          { title: 'Reporte de Ventas', icon: 'shopping-cart', route: '/(drawer)/venta-servicios/ventas', color: colors.warning },
          { title: 'Pagos', icon: 'payment', route: '/(drawer)/venta-servicios/pagos', color: colors.info },
        ];
      case 'profesor':
        return [
          { title: 'Programación de Profesores', icon: 'schedule', route: '/(drawer)/servicios-musicales/programacion-profesores', color: colors.primary },
          { title: 'Programación de Clases', icon: 'schedule', route: '/(drawer)/servicios-musicales/programacion-clases', color: colors.secondary },
          { title: 'Asistencia', icon: 'check-circle', route: '/(drawer)/servicios-musicales/asistencia', color: colors.success },
        ];
      case 'beneficiario':
        return [
          { title: 'Programación de Clases', icon: 'schedule', route: '/(drawer)/servicios-musicales/programacion-clases', color: colors.primary },
          { title: 'Pagos', icon: 'payment', route: '/(drawer)/venta-servicios/pagos', color: colors.info },
        ];
      case 'cliente':
        return [
          { title: 'Pagos', icon: 'payment', route: '/(drawer)/venta-servicios/pagos', color: colors.primary },
        ];
      default:
        return [];
    }
  };

  const quickActions = getQuickActions();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>¡Hola, {user?.nombre}!</Text>
          <Text style={styles.roleText}>{getWelcomeMessage()}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Accesos Rápidos</Text>
        
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionCard, { borderLeftColor: action.color }]}
              onPress={() => router.push(action.route as any)}
            >
              <View style={styles.actionIcon}>
                <MaterialIcons name={action.icon as any} size={24} color={action.color} />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoCard}>
          <MaterialIcons name="info" size={24} color={colors.primary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Sistema de Gestión Musical</Text>
            <Text style={styles.infoText}>
              Bienvenido al sistema de gestión de la academia musical. 
              Utiliza los accesos rápidos para navegar por las diferentes secciones.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    padding: spacing.xl,
    paddingTop: spacing.xxl,
  },
  welcomeSection: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  roleText: {
    fontSize: typography.sizes.lg,
    color: colors.white,
    opacity: 0.9,
  },
  content: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.lg,
    borderLeftWidth: 4,
    ...shadows.elevation[2],
  },
  actionIcon: {
    marginBottom: spacing.sm,
  },
  actionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.lg,
    ...shadows.elevation[1],
  },
  infoContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  infoTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  infoText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

export default DashboardScreen;
