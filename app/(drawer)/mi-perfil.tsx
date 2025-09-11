import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { colors, spacing, typography, radii, shadows } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/shared/contexts/AuthContext';

const MiPerfilScreen = () => {
  const { user, getUserRole } = useAuth();
  const userRole = getUserRole();

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'administrador':
      case 'admin':
        return 'Administrador';
      case 'profesor':
        return 'Profesor';
      case 'beneficiario':
        return 'Beneficiario';
      case 'cliente':
        return 'Cliente';
      default:
        return 'Usuario';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.nombre?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
        </View>
        <Text style={styles.userName}>
          {user?.nombre} {user?.apellido}
        </Text>
        <Text style={styles.userRole}>
          {getRoleDisplayName(userRole || '')}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <MaterialIcons name="person" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nombre Completo</Text>
                <Text style={styles.infoValue}>
                  {user?.nombre} {user?.apellido}
                </Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <MaterialIcons name="email" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Correo Electrónico</Text>
                <Text style={styles.infoValue}>{user?.correo || 'N/A'}</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <MaterialIcons name="badge" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Rol</Text>
                <Text style={styles.infoValue}>{getRoleDisplayName(userRole || '')}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del Sistema</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <MaterialIcons name="info" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>ID de Usuario</Text>
                <Text style={styles.infoValue}>{user?.id || 'N/A'}</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <MaterialIcons name="security" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Estado</Text>
                <Text style={[styles.infoValue, styles.activeStatus]}>Activo</Text>
              </View>
            </View>
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
    alignItems: 'center',
    paddingTop: spacing.xxl,
  },
  avatarContainer: {
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.elevation[4],
  },
  avatarText: {
    color: colors.primary,
    fontSize: 36,
    fontWeight: typography.weights.bold,
  },
  userName: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.white,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  userRole: {
    fontSize: typography.sizes.md,
    color: colors.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  content: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.lg,
    ...shadows.elevation[2],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  infoContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  infoLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: typography.sizes.md,
    color: colors.text,
    fontWeight: typography.weights.medium,
  },
  activeStatus: {
    color: colors.success || '#4CAF50',
  },
});

export default MiPerfilScreen;
