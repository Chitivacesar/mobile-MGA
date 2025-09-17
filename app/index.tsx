import { Redirect } from 'expo-router';

export default function Index() {
  // Redirigir directamente al login por ahora para evitar errores
  return <Redirect href="/(auth)/login" />;
}


