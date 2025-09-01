import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/shared/contexts/AuthContext';
import { colors, spacing } from '@/constants/theme';


export default function MiPerfilScreen() {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    tipoDocumento: 'Cédula de ciudadanía',
    numeroDocumento: '',
    correo: '',
    rolPrincipal: '',
    contrasena: '',
    confirmarContrasena: '',
  });

  console.log('MiPerfilScreen: Rendering with user:', user?.nombre, 'token exists:', !!token);

  useEffect(() => {
    if (user) {
      console.log('MiPerfilScreen: Setting form data from user:', user);
      setFormData({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        tipoDocumento: 'Cédula de ciudadanía',
        numeroDocumento: user.numeroDocumento || '',
        correo: user.correo || '',
        rolPrincipal: user.rol?.nombre || 'Sin rol',
        contrasena: '',
        confirmarContrasena: '',
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    console.log('MiPerfilScreen: Input change:', field, value);
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveChanges = async () => {
    console.log('MiPerfilScreen: Save changes triggered');
    
    if (formData.contrasena !== formData.confirmarContrasena) {
      console.log('MiPerfilScreen: Password mismatch');
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (formData.contrasena && formData.contrasena.length < 6) {
      console.log('MiPerfilScreen: Password too short');
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    console.log('MiPerfilScreen: Starting save process...');
    
    try {
      // Aquí iría la lógica para actualizar el perfil
      // Por ahora solo simulamos el guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('MiPerfilScreen: Save completed successfully');
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      
      // Limpiar campos de contraseña
      setFormData(prev => ({
        ...prev,
        contrasena: '',
        confirmarContrasena: '',
      }));
    } catch (error) {
      console.error('MiPerfilScreen: Error saving profile:', error);
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    } finally {
      setLoading(false);
      console.log('MiPerfilScreen: Save process completed, loading set to false');
    }
  };

  const handleCancel = () => {
    console.log('MiPerfilScreen: Cancel triggered, restoring original data');
    // Restaurar datos originales del usuario
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        tipoDocumento: 'Cédula de ciudadanía',
        numeroDocumento: user.numeroDocumento || '',
        correo: user.correo || '',
        rolPrincipal: user.rol?.nombre || 'Sin rol',
        contrasena: '',
        confirmarContrasena: '',
      });
    }
  };

  if (!user) {
    console.log('MiPerfilScreen: No user, showing unauthenticated message');
    return (
      <View style={styles.container}>
        <Text>Usuario no autenticado</Text>
      </View>
    );
  }

  console.log('MiPerfilScreen: Rendering profile form');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.modalContainer}>
        {/* Header con título y botón de cerrar */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Configuración de cuenta</Text>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <MaterialIcons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Icono de perfil */}
        <View style={styles.profileIconContainer}>
          <View style={styles.profileIcon}>
            <MaterialIcons name="person" size={40} color={colors.white} />
          </View>
        </View>

        {/* Formulario en dos columnas */}
        <View style={styles.formContainer}>
          <View style={styles.formRow}>
            {/* Columna izquierda */}
            <View style={styles.column}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nombre</Text>
                <TextInput
                  style={styles.input}
                  value={formData.nombre}
                  onChangeText={(value) => handleInputChange('nombre', value)}
                  placeholder="Ingrese su nombre"
                  editable={!loading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Tipo de documento</Text>
                <View style={styles.selectContainer}>
                  <Text style={styles.selectText}>{formData.tipoDocumento}</Text>
                  <MaterialIcons name="keyboard-arrow-down" size={24} color={colors.textSecondary} />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Correo electrónico</Text>
                <TextInput
                  style={styles.input}
                  value={formData.correo}
                  onChangeText={(value) => handleInputChange('correo', value)}
                  placeholder="correo@ejemplo.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Contraseña</Text>
                <TextInput
                  style={styles.input}
                  value={formData.contrasena}
                  onChangeText={(value) => handleInputChange('contrasena', value)}
                  placeholder="••••••••"
                  secureTextEntry
                  editable={!loading}
                />
              </View>
            </View>

            {/* Columna derecha */}
            <View style={styles.column}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Apellido</Text>
                <TextInput
                  style={styles.input}
                  value={formData.apellido}
                  onChangeText={(value) => handleInputChange('apellido', value)}
                  placeholder="Ingrese su apellido"
                  editable={!loading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Número de documento</Text>
                <TextInput
                  style={styles.input}
                  value={formData.numeroDocumento}
                  onChangeText={(value) => handleInputChange('numeroDocumento', value)}
                  placeholder="Ingrese su número de documento"
                  keyboardType="numeric"
                  editable={!loading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Rol Principal</Text>
                <TextInput
                  style={[styles.input, styles.readOnlyInput]}
                  value={formData.rolPrincipal}
                  editable={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirmar Contraseña</Text>
                <TextInput
                  style={styles.input}
                  value={formData.confirmarContrasena}
                  onChangeText={(value) => handleInputChange('confirmarContrasena', value)}
                  placeholder="••••••••"
                  secureTextEntry
                  editable={!loading}
                />
              </View>
            </View>
          </View>

          {/* Botones de acción */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>CANCELAR</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveChanges}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <Text style={styles.saveButtonText}>GUARDAR CAMBIOS</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.xl,
    margin: spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: spacing.sm,
  },
  profileIconContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  profileIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    flex: 1,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
  },
  column: {
    flex: 1,
    marginHorizontal: spacing.sm,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 16,
    backgroundColor: colors.white,
    color: colors.textPrimary,
    minHeight: 48,
  },
  readOnlyInput: {
    backgroundColor: colors.disabled,
    color: colors.textSecondary,
  },
  selectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    backgroundColor: colors.white,
    minHeight: 48,
  },
  selectText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    padding: spacing.lg,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  cancelButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.lg,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

