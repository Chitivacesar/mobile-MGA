import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { colors, spacing } from '@/constants/theme';
import CardList from '@/components/CardList';
import { api } from '@/shared/services/api';
import { useAuth } from '@/shared/contexts/AuthContext';

const ProgramacionProfesoresScreen = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  console.log('ProgramacionProfesoresScreen: Rendering with', data.length, 'programaciones, loading:', loading, 'user role:', user?.rol?.nombre);

  const columns = user?.rol?.nombre?.toLowerCase() === 'profesor' ? [
    { key: 'dia', label: 'Día' },
    { key: 'horaInicio', label: 'Inicio' },
    { key: 'horaFin', label: 'Fin' },
  ] : [
    { key: 'profesor', label: 'Profesor' },
    { key: 'dia', label: 'Día' },
    { key: 'horaInicio', label: 'Inicio' },
    { key: 'horaFin', label: 'Fin' },
  ];

  useEffect(() => {
    console.log('ProgramacionProfesoresScreen: useEffect triggered, fetching data...');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('ProgramacionProfesoresScreen: Starting to fetch programacion de profesores...');
      setLoading(true);
      const response = await api.get('/programacion_de_profesores');
      
      console.log('ProgramacionProfesoresScreen: API response received:', response);
      
      // La API puede devolver directamente un array o un objeto con la propiedad programacion_de_profesores
      let programacionesList;
      if (Array.isArray(response)) {
        // Respuesta directa como array
        programacionesList = response;
      } else if (response && response.programacion_de_profesores && Array.isArray(response.programacion_de_profesores)) {
        // Respuesta como objeto con propiedad
        programacionesList = response.programacion_de_profesores;
      } else {
        console.log('ProgramacionProfesoresScreen: Invalid response structure:', response);
        setError('Error en la estructura de datos recibida');
        return;
      }
      
      console.log('ProgramacionProfesoresScreen: Programaciones list:', programacionesList);
      
      let processedData = [];

      if (user?.rol?.nombre?.toLowerCase() === 'beneficiario') {
        // Para beneficiarios, filtrar solo las programaciones asociadas
        console.log('ProgramacionProfesoresScreen: Beneficiario detected, filtering programaciones...');
        const programacionesClases = await api.get('/programacion_de_clases');
        const beneficiarioId = user.id;
        
        console.log('ProgramacionProfesoresScreen: Beneficiario ID:', beneficiarioId);
        console.log('ProgramacionProfesoresScreen: Programaciones de clases received:', programacionesClases);
        
        // Validar que programacionesClases tenga la estructura esperada
        if (!programacionesClases || !programacionesClases.programacion_de_clases || !Array.isArray(programacionesClases.programacion_de_clases)) {
          console.log('ProgramacionProfesoresScreen: Invalid programacionesClases structure:', programacionesClases);
          setError('Error en la estructura de programaciones de clases');
          return;
        }
        
        // Obtener programaciones de profesores asociadas a este beneficiario
        const programacionesAsociadas = programacionesClases.programacion_de_clases
          .filter((clase: any) => clase.ventaId?.beneficiarioId?._id === beneficiarioId)
          .map((clase: any) => clase.programacionProfesorId);

        console.log('ProgramacionProfesoresScreen: Programaciones asociadas:', programacionesAsociadas);

        // Filtrar programaciones de profesores
        processedData = programacionesList
          .filter((prog: any) => programacionesAsociadas.includes(prog._id))
          .flatMap((prog: any) => {
            if (!prog.horariosPorDia || !Array.isArray(prog.horariosPorDia)) return [];
            
            return prog.horariosPorDia.map((horario: any) => ({
              profesor: prog.profesor?.nombres 
                ? `${prog.profesor.nombres} ${prog.profesor.apellidos}`
                : 'N/A',
              dia: horario.dia || 'N/A',
              horaInicio: horario.horaInicio || 'N/A',
              horaFin: horario.horaFin || 'N/A',
            }));
          });
      } else if (user?.rol?.nombre?.toLowerCase() === 'profesor') {
        // Para profesores, filtrar solo su propia programación
        console.log('ProgramacionProfesoresScreen: Profesor detected, filtering own programaciones...');
        const profesorId = user.id;
        
        console.log('ProgramacionProfesoresScreen: Profesor ID:', profesorId);
        
        // Filtrar solo las programaciones del profesor logueado
        processedData = programacionesList
          .filter((prog: any) => prog.profesor?._id === profesorId)
          .flatMap((prog: any) => {
            if (!prog.horariosPorDia || !Array.isArray(prog.horariosPorDia)) return [];
            
            return prog.horariosPorDia.map((horario: any) => ({
              dia: horario.dia || 'N/A',
              horaInicio: horario.horaInicio || 'N/A',
              horaFin: horario.horaFin || 'N/A',
            }));
          });
        
        console.log('ProgramacionProfesoresScreen: Filtered programaciones for profesor:', processedData.length);
      } else {
        // Para otros roles (admin), mostrar todas las programaciones
        console.log('ProgramacionProfesoresScreen: Admin role detected, showing all programaciones...');
        processedData = programacionesList.flatMap((prog: any) => {
          if (!prog.horariosPorDia || !Array.isArray(prog.horariosPorDia)) return [];
          
          return prog.horariosPorDia.map((horario: any) => ({
            profesor: prog.profesor?.nombres 
              ? `${prog.profesor.nombres} ${prog.profesor.apellidos}`
              : 'N/A',
            dia: horario.dia || 'N/A',
            horaInicio: horario.horaInicio || 'N/A',
            horaFin: horario.horaFin || 'N/A',
          }));
        });
      }

      console.log('ProgramacionProfesoresScreen: Processed data:', processedData);
      setData(processedData);
      setError(null);
    } catch (error) {
      console.error('ProgramacionProfesoresScreen: Error fetching programacion de profesores:', error);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
      console.log('ProgramacionProfesoresScreen: Fetch completed, loading set to false');
    }
  };

  if (error) {
    console.log('ProgramacionProfesoresScreen: Showing error state:', error);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Estado especial para beneficiarios sin programaciones
  if (user?.rol?.nombre?.toLowerCase() === 'beneficiario' && data.length === 0 && !loading) {
    console.log('ProgramacionProfesoresScreen: Beneficiario with no programaciones, showing empty state');
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No hay programaciones disponibles</Text>
        <Text style={styles.emptyText}>
          No tienes programaciones de clases asignadas actualmente.
        </Text>
      </View>
    );
  }

  console.log('ProgramacionProfesoresScreen: Rendering normal view with', data.length, 'items');

  return (
    <View style={styles.container}>
      <CardList
        data={data}
        columns={columns}
        loading={loading}
        searchPlaceholder="Buscar en programación de profesores..."
        emptyMessage={
          user?.rol?.nombre?.toLowerCase() === 'profesor' 
            ? "No tienes programación disponible" 
            : "No hay programación de profesores disponible"
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: 18,
    color: colors.error,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default ProgramacionProfesoresScreen;


