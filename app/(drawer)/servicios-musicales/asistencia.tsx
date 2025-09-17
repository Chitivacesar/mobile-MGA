import CardList from '@/components/CardList';
import RefreshButton from '@/components/RefreshButton';
import { colors, radii, shadows, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/shared/contexts/AuthContext';
import { api } from '@/shared/services/api';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

const AsistenciaScreen = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { key: 'curso', label: 'Curso' },
    { key: 'beneficiario', label: 'Beneficiario' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'estado', label: 'Estado' },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('AsistenciaScreen: Iniciando fetch de asistencias...');
      const resp = await api.get('/api/asistencias');
      console.log('AsistenciaScreen: Respuesta completa:', resp);
      
      const list = Array.isArray(resp) ? resp : ((resp as any)?.asistencias || (resp as any)?.data || []);
      console.log('AsistenciaScreen: Lista de asistencias:', list.length);

      const processed = list.map((a: any) => {
        // Extraer datos del beneficiario desde ventaId
        const beneficiario = a.ventaId?.beneficiarioId;
        const beneficiarioNombre = beneficiario ? 
          `${beneficiario.nombre || ''} ${beneficiario.apellido || ''}`.trim() : 'N/A';
        
        // Extraer datos del curso desde ventaId
        const curso = a.ventaId?.cursoId;
        const cursoNombre = curso ? 
          (typeof curso === 'object' ? curso.nombre : curso) : 'N/A';
        
        // Extraer datos de la programación de clase
        const programacion = a.programacionClaseId;
        const fecha = programacion?.createdAt ? 
          new Date(programacion.createdAt).toLocaleDateString() : 'N/A';
        
        // Estado de asistencia
        const estado = a.estado === 'asistio' ? 'Presente' : 
                      a.estado === 'no_asistio' ? 'Ausente' : 'N/A';

        return {
          curso: cursoNombre,
          beneficiario: beneficiarioNombre,
          fecha: fecha,
          estado: estado,
        };
      });

      console.log('AsistenciaScreen: Datos procesados:', processed);
      setData(processed);
    } catch (error) {
      console.error('AsistenciaScreen: Error fetching asistencias:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [user]);

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Asistencia',
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontSize: typography.sizes.lg,
            fontWeight: '600' as const,
            fontFamily: typography.fontFamily,
          },
        }}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar en asistencia..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholderTextColor={colors.textSecondary}
            />
            <RefreshButton onPress={fetchData} loading={loading} />
          </View>
        </View>

        <CardList
          data={data}
          columns={columns}
          loading={loading}
          emptyMessage={'No hay registros de asistencia'}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.elevation[2],
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.sm,
    padding: 12,
    fontSize: typography.sizes.md,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    fontFamily: typography.fontFamily,
    ...shadows.elevation[1],
  },
});

export default AsistenciaScreen;


