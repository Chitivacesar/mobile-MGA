import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { colors, spacing } from '@/constants/theme';
import { api } from '@/shared/services/api';
import { useLocalSearchParams, router } from 'expo-router';

const ResetPasswordScreen = () => {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  // Obtener el token de los parámetros de la ruta
  const token = params.token as string;

  useEffect(() => {
    if (!token) {
      Alert.alert('Error', 'Token de restablecimiento no válido');
      router.replace('/(auth)/login');
      return;
    }

    // Verificar validez del token
    const verifyToken = async () => {
      try {
        const response = await api.verifyResetToken(token);
        setTokenValid(response.valid);
        if (!response.valid) {
          Alert.alert('Error', response.message || 'Token inválido o expirado');
        }
      } catch (error: any) {
        console.error('Error al verificar token:', error);
        setTokenValid(false);
        Alert.alert('Error', 'Error al verificar el token');
      }
    };

    verifyToken();
  }, [token]);

  const handleInputChange = (field: string, value: string) => {
    setPasswords(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!passwords.newPassword) {
      Alert.alert('Error', 'Por favor, ingrese la nueva contraseña');
      return false;
    }
    if (passwords.newPassword.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return false;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.resetPassword(token, passwords.newPassword);

      if (response.success) {
        Alert.alert(
          'Éxito',
          response.message || 'Contraseña restablecida correctamente',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(auth)/login')
            }
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'Error al restablecer la contraseña');
      }
    } catch (error: any) {
      console.error('Error en resetPassword:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Error al restablecer la contraseña';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Verificando token...</Text>
      </View>
    );
  }

  if (tokenValid === false) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Token Inválido</Text>
        <Text style={styles.errorText}>
          El enlace de restablecimiento no es válido o ha expirado.
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace('/(auth)/login')}
        >
          <Text style={styles.backButtonText}>Volver al Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Restablecer Contraseña</Text>
        
        <Text style={styles.description}>
          Ingresa tu nueva contraseña. Asegúrate de que tenga al menos 8 caracteres.
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nueva Contraseña</Text>
          <TextInput
            style={styles.input}
            value={passwords.newPassword}
            onChangeText={(value) => handleInputChange('newPassword', value)}
            placeholder="Mínimo 8 caracteres"
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirmar Contraseña</Text>
          <TextInput
            style={styles.input}
            value={passwords.confirmPassword}
            onChangeText={(value) => handleInputChange('confirmPassword', value)}
            placeholder="Repite la nueva contraseña"
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace('/(auth)/login')}
          disabled={loading}
        >
          <Text style={styles.backButtonText}>Volver al Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: spacing.lg,
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
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: colors.textPrimary,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  submitButtonDisabled: {
    backgroundColor: colors.disabled,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    padding: spacing.md,
    alignItems: 'center',
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 18,
    color: colors.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
});

export default ResetPasswordScreen;
