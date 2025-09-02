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
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { KeyboardAvoidingView, Platform } from 'react-native';
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
      // Datos a enviar al servidor
      const updateData: any = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        numeroDocumento: formData.numeroDocumento,
        correo: formData.correo,
      };

      // Solo incluir contraseña si se está cambiando
      if (formData.contrasena && formData.contrasena.length > 0) {
        updateData.contrasena = formData.contrasena;
      }

      console.log('MiPerfilScreen: Updating profile with data:', updateData);

      // TODO: Implementar la llamada real a la API
      // const response = await apiService.put(`/usuarios/${user?.id}`, updateData);
      
      // Por ahora simulamos el guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('MiPerfilScreen: Save completed successfully');
      Alert.alert('Éxito', 'Perfil actualizado correctamente', [
        {
          text: 'OK',
          onPress: () => {
            // Limpiar campos de contraseña
            setFormData(prev => ({
              ...prev,
              contrasena: '',
              confirmarContrasena: '',
            }));
          }
        }
      ]);
      
    } catch (error) {
      console.error('MiPerfilScreen: Error saving profile:', error);
      Alert.alert('Error', 'No se pudo actualizar el perfil. Verifique su conexión e intente nuevamente.');
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
      {/* Header con título y botón de cerrar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Contenido principal con KeyboardAvoidingView y scroll */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
        {/* Icono de perfil con nombre */}
        <View style={styles.profileIconContainer}>
          <View style={styles.profileIcon}>
            <MaterialIcons name="person" size={50} color={colors.white} />
          </View>
          <Text style={styles.welcomeText}>
            ¡Hola, {user?.nombre || 'Usuario'}!
          </Text>
          <Text style={styles.roleText}>
            {user?.rol?.nombre || 'Sin rol asignado'}
          </Text>
        </View>

        {/* Formulario vertical optimizado para móvil */}
        <View style={styles.formContainer}>
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
            <Text style={styles.label}>Tipo de documento</Text>
            <View style={styles.selectContainer}>
              <Text style={styles.selectText}>{formData.tipoDocumento}</Text>
              <MaterialIcons name="keyboard-arrow-down" size={24} color={colors.textSecondary} />
            </View>
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
            <Text style={styles.label}>Rol Principal</Text>
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              value={formData.rolPrincipal}
              editable={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nueva Contraseña (opcional)</Text>
            <TextInput
              style={styles.input}
              value={formData.contrasena}
              onChangeText={(value) => handleInputChange('contrasena', value)}
              placeholder="••••••••"
              secureTextEntry
              editable={!loading}
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

          {/* Botones de acción */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveChanges}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Guardar Cambios</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: spacing.sm,
    marginRight: spacing.sm,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginRight: spacing.xl, // Para centrar compensando el botón back
  },
  headerSpacer: {
    width: 40, // Mismo ancho que el botón back para centrar el título
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  profileIconContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  profileIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: spacing.md,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  roleText: {
    fontSize: 16,
    color: colors.textSecondary,
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    overflow: 'hidden',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 16,
    backgroundColor: colors.white,
    color: colors.textPrimary,
    minHeight: 50,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  readOnlyInput: {
    backgroundColor: colors.backgroundSecondary,
    color: colors.textSecondary,
    borderColor: colors.disabled,
  },
  selectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    backgroundColor: colors.white,
    minHeight: 50,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  selectText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.white,
    minHeight: 50,
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cancelButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

