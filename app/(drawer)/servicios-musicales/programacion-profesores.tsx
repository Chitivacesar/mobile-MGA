import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import { colors, spacing, typography, radii, shadows } from '@/constants/theme';
import CardList from '@/components/CardList';
import RefreshButton from '@/components/RefreshButton';
import HorariosProfesorModal from '@/components/HorariosProfesorModal';
import { api } from '@/shared/services/api';
import { useAuth } from '@/shared/contexts/AuthContext';

const ProgramacionProfesoresScreen = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProfesor, setSelectedProfesor] = useState('');
  const [selectedHorarios, setSelectedHorarios] = useState<any[]>([]);
  const { user } = useAuth();

  console.log('ProgramacionProfesoresScreen: Rendering with', data.length, 'programaciones, loading:', loading, 'user role:', user?.rol?.nombre);

  const columns = [
    { key: 'profesor', label: 'Profesor' },
    { key: 'totalHorarios', label: 'Horarios' },
  ];

  useEffect(() => {
    console.log('ProgramacionProfesoresScreen: useEffect triggered, fetching data...');
    fetchData();
  }, [user]);

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
      
      // Agrupar por profesor
      const profesoresMap = new Map();
      
      let filteredProgramaciones = programacionesList;
      
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
        filteredProgramaciones = programacionesList.filter((prog: any) => programacionesAsociadas.includes(prog._id));
      } else if (user?.rol?.nombre?.toLowerCase() === 'profesor') {
        // Para profesores, usar el mismo filtro robusto que en Programación de Clases
        console.log('ProgramacionProfesoresScreen: 🎯 ENTRANDO AL FILTRO DE PROFESOR');
        console.log('ProgramacionProfesoresScreen: Filtering for profesor with user data:', {
          id: user.id,
          nombre: user.nombre,
          apellido: user.apellido,
          role: user?.rol?.nombre
        });
        
        // Filtrar solo las programaciones del profesor logueado
        filteredProgramaciones = programacionesList.filter((prog: any) => {
          const profesorData = prog.profesor;
          
          if (!profesorData) {
            console.log('ProgramacionProfesoresScreen: No profesor data found, excluding this programacion');
            return false;
          }
          
          // Datos del profesor de la programación
          const profesorId = profesorData._id || profesorData.id;
          const profesorFullName = `${profesorData.nombres || profesorData.nombre} ${profesorData.apellidos || profesorData.apellido}`;
          const userFullName = `${user.nombre} ${user.apellido}`;
          
          // Solo usar ID y nombre como criterios seguros
          const matchesId = profesorId && profesorId === user.id;
          const matchesName = profesorFullName.toLowerCase().trim() === userFullName.toLowerCase().trim();
          
          // Filtro conservador: Solo ID o nombre exacto
          const isAssigned = matchesId || matchesName;
          
          console.log('🔍 PROFESOR PROGRAMACION COMPARISON:', {
            profesorName: profesorFullName,
            userName: userFullName,
            profesorId: profesorId,
            userId: user.id,
            matchesId: matchesId,
            matchesName: matchesName,
            FINAL_RESULT: isAssigned
          });
          
          if (isAssigned) {
            console.log('ProgramacionProfesoresScreen: ✅ PROGRAMACION INCLUIDA - Asignada al profesor logueado');
          } else {
            console.log('ProgramacionProfesoresScreen: ❌ PROGRAMACION EXCLUIDA - No asignada al profesor logueado');
          }
          
          return isAssigned;
        });
        
        console.log('ProgramacionProfesoresScreen: Filtered programaciones for profesor:', filteredProgramaciones.length);
      }
      
      // Procesar y agrupar por profesor
      filteredProgramaciones.forEach((prog: any) => {
        const profesorNombre = prog.profesor?.nombres 
          ? `${prog.profesor.nombres} ${prog.profesor.apellidos}`
          : prog.profesor?.nombre 
          ? `${prog.profesor.nombre} ${prog.profesor.apellido}`
          : 'N/A';
        
        if (!profesoresMap.has(profesorNombre)) {
          profesoresMap.set(profesorNombre, {
            profesor: profesorNombre,
            horarios: [],
            totalHorarios: 0
          });
        }
        
        const profesorData = profesoresMap.get(profesorNombre);
        
        if (prog.horariosPorDia && Array.isArray(prog.horariosPorDia)) {
          prog.horariosPorDia.forEach((horario: any) => {
            profesorData.horarios.push({
              dia: horario.dia || 'N/A',
              horaInicio: horario.horaInicio || 'N/A',
              horaFin: horario.horaFin || 'N/A'
            });
            profesorData.totalHorarios++;
          });
        }
      });
      
      // Convertir a array y formatear para mostrar
      const processedData = Array.from(profesoresMap.values()).map(profesorData => ({
        profesor: profesorData.profesor,
        totalHorarios: profesorData.totalHorarios,
        horarios: profesorData.horarios // Mantener horarios para el modal
      }));

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

  const handleCardPress = (item: any) => {
    console.log('ProgramacionProfesoresScreen: Card pressed for profesor:', item.profesor);
    setSelectedProfesor(item.profesor);
    setSelectedHorarios(item.horarios || []);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedProfesor('');
    setSelectedHorarios([]);
  };

  if (error) {
    console.log('ProgramacionProfesoresScreen: Showing error state:', error);
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar en programación de profesores..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholderTextColor={colors.textSecondary}
            />
            <RefreshButton onPress={fetchData} loading={loading} />
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
        
        <HorariosProfesorModal
          visible={modalVisible}
          onClose={closeModal}
          profesor={selectedProfesor}
          horarios={selectedHorarios}
        />
      </View>
    );
  }

  // Estado especial para beneficiarios sin programaciones
  if (user?.rol?.nombre?.toLowerCase() === 'beneficiario' && data.length === 0 && !loading) {
    console.log('ProgramacionProfesoresScreen: Beneficiario with no programaciones, showing empty state');
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar en programación de profesores..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholderTextColor={colors.textSecondary}
            />
            <RefreshButton onPress={fetchData} loading={loading} />
          </View>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No hay programaciones disponibles</Text>
          <Text style={styles.emptyText}>
            No tienes programaciones de clases asignadas actualmente.
          </Text>
        </View>
        
        <HorariosProfesorModal
          visible={modalVisible}
          onClose={closeModal}
          profesor={selectedProfesor}
          horarios={selectedHorarios}
        />
      </View>
    );
  }

  console.log('ProgramacionProfesoresScreen: Rendering normal view with', data.length, 'items');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar en programación de profesores..."
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
        emptyMessage={
          user?.rol?.nombre?.toLowerCase() === 'profesor' 
            ? "No tienes programación disponible" 
            : "No hay programación de profesores disponible"
        }
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCardPress={handleCardPress}
      />
      
      <HorariosProfesorModal
        visible={modalVisible}
        onClose={closeModal}
        profesor={selectedProfesor}
        horarios={selectedHorarios}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
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