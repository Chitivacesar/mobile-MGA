import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/shared/contexts/AuthContext';
import { colors, spacing } from '@/constants/theme';

interface HeaderProps {
  title?: string;
  showMenuButton?: boolean;
  onMenuPress?: () => void;
}

export default function Header({ 
  title = 'Panel', 
  showMenuButton = true, 
  onMenuPress 
}: HeaderProps) {
  const { user } = useAuth();
  
  // Verificar que el router esté disponible
  console.log('Header: Router disponible:', !!router);

  const handleMenuPress = () => {
    console.log('Header: Botón de menú presionado');
    if (onMenuPress) {
      onMenuPress();
    } else {
      // No hacer nada - el drawer se abrirá automáticamente
      console.log('Header: Botón de menú presionado - drawer se abrirá automáticamente');
    }
  };

  const handleProfilePress = () => {
    console.log('Header: Botón de perfil presionado, navegando a mi-perfil');
    router.push('/(drawer)/mi-perfil');
  };

  return (
    <View style={styles.header}>
      {/* Centro - Título */}
      <Text style={styles.title}>{title}</Text>

      {/* Lado derecho - Mi Perfil */}
      <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{user?.nombre || 'Usuario'}</Text>
          <Text style={styles.userRole}>
            {user?.rol?.nombre === 'administrador' ? 'Administrador' :
             user?.rol?.nombre === 'profesor' ? 'Profesor' :
             user?.rol?.nombre === 'beneficiario' ? 'Beneficiario' :
             user?.rol?.nombre === 'cliente' ? 'Cliente' : 'Usuario'}
          </Text>
        </View>
        <MaterialIcons name="account-circle" size={24} color={colors.white} />
      </TouchableOpacity>

      {/* Línea separadora */}
      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  menuButton: {
    position: 'absolute',
    left: spacing.lg,
    top: spacing.xl,
    zIndex: 1,
    padding: spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    paddingTop: spacing.sm,
    flex: 1, // Ocupar el espacio disponible
  },
  profileButton: {
    position: 'absolute',
    right: spacing.lg,
    top: spacing.xl,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  profileInfo: {
    alignItems: 'flex-end',
    marginRight: spacing.sm,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  userRole: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.8,
  },
  separator: {
    height: 1,
    backgroundColor: colors.white,
    opacity: 0.2,
    marginTop: spacing.md,
  },
});
