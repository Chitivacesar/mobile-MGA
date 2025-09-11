import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/shared/contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { colors } from '@/constants/theme';

export default function Index() {
  const { isAuthenticated, loading, user, token } = useAuth();

  console.log('=== INDEX RENDER ===');
  console.log('Loading:', loading);
  console.log('IsAuthenticated:', isAuthenticated);
  console.log('User:', user ? `${user.nombre} ${user.apellido}` : 'null');
  console.log('Token:', token ? token.substring(0, 20) + '...' : 'null');

  if (loading) {
    console.log('Showing loading screen...');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isAuthenticated) {
    console.log('User is authenticated, redirecting to dashboard...');
    // Redirigir al dashboard para todos los roles
    return <Redirect href="/(drawer)/dashboard" />;
  }

  console.log('User is not authenticated, redirecting to login...');
  return <Redirect href="/(auth)/login" />;
}


