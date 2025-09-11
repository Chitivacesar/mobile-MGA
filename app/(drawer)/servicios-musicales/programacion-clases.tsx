import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { colors, spacing, typography, radii, shadows } from '@/constants/theme';
import CardList from '@/components/CardList';
import RefreshButton from '@/components/RefreshButton';
import HorariosModal from '@/components/HorariosModal';
import { api } from '@/shared/services/api';
import { useAuth } from '@/shared/contexts/AuthContext';

const ProgramacionClasesScreen = () => {
  const { user, getUserRole } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCurso, setSelectedCurso] = useState('');
  const [selectedHorarios, setSelectedHorarios] = useState<any[]>([]);

  console.log('ProgramacionClasesScreen: Rendering with', data.length, 'clases, loading:', loading);
  console.log('ProgramacionClasesScreen: Current user:', user?.nombre, 'Role:', getUserRole());

  const columns = [
    { key: 'curso', label: 'Curso' },
    { key: 'totalHorarios', label: 'Horarios' },
  ];

  useEffect(() => {
    console.log('ProgramacionClasesScreen: useEffect triggered, fetching data...');
    console.log('ProgramacionClasesScreen: Current user data:', user);
    console.log('ProgramacionClasesScreen: User role:', getUserRole());
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      console.log('ProgramacionClasesScreen: Starting to fetch programacion de clases...');
      setLoading(true);
      const response = await api.get('/programacion_de_clases');
      
      console.log('ProgramacionClasesScreen: API response received:', response);
      
      // La API puede devolver directamente un array o un objeto con la propiedad programacion_de_clases
      let programacionesList;
      if (Array.isArray(response)) {
        // Respuesta directa como array
        programacionesList = response;
      } else if (response && (response as any).programacion_de_clases && Array.isArray((response as any).programacion_de_clases)) {
        // Respuesta como objeto con propiedad
        programacionesList = (response as any).programacion_de_clases;
      } else {
        console.log('ProgramacionClasesScreen: Invalid response structure:', response);
        setData([]);
        return;
      }
      
      console.log('ProgramacionClasesScreen: Programaciones list:', programacionesList);
      
      // Filtrar solo las clases según el rol del usuario
      let filteredProgramaciones = programacionesList;
      
      if (getUserRole() === 'beneficiario' && user) {
        console.log('ProgramacionClasesScreen: Filtering for beneficiario with user data:', {
          id: user.id,
          correo: user.correo,
          numeroDocumento: (user as any).numeroDocumento,
          nombre: user.nombre
        });
        
        filteredProgramaciones = programacionesList.filter((item: any) => {
          // Verificar si el beneficiario logueado está en la lista de beneficiarios de esta clase
          const isInscribed = item.beneficiarios?.some((beneficiario: any) => {
            const beneficiarioData = beneficiario.beneficiarioId;
            
            if (!beneficiarioData) {
              console.log('ProgramacionClasesScreen: No beneficiario data found');
              return false;
            }
            
            // Múltiples criterios de comparación
            const matchesId = beneficiarioData._id === user.id || beneficiarioData.id === user.id;
            const matchesEmail = beneficiarioData.correo === user.correo || beneficiarioData.email === user.correo;
            const matchesDocument = beneficiarioData.numero_de_documento === (user as any).numeroDocumento;
            const matchesName = (beneficiarioData.nombre === user.nombre && beneficiarioData.apellido === user.apellido);
            
            const isMatch = matchesId || matchesEmail || matchesDocument || matchesName;
            
            console.log('ProgramacionClasesScreen: Beneficiario comparison:', {
              beneficiarioId: beneficiarioData._id,
              beneficiarioEmail: beneficiarioData.correo || beneficiarioData.email,
              beneficiarioDocument: beneficiarioData.numero_de_documento,
              beneficiarioName: `${beneficiarioData.nombre} ${beneficiarioData.apellido}`,
              userInfo: `${user.nombre} ${user.apellido}`,
              matchesId,
              matchesEmail,
              matchesDocument,
              matchesName,
              finalMatch: isMatch
            });
            
            return isMatch;
          });
          
          if (isInscribed) {
            console.log('ProgramacionClasesScreen: Class inscribed for user:', {
              dia: item.dia,
              horaInicio: item.horaInicio,
              especialidad: item.especialidad
            });
          }
          
          return isInscribed;
        });
        console.log('ProgramacionClasesScreen: Filtered programaciones for beneficiario:', filteredProgramaciones.length);
      } else if (getUserRole() === 'profesor' && user) {
        console.log('ProgramacionClasesScreen: 🎯 ENTRANDO AL FILTRO DE PROFESOR');
        console.log('ProgramacionClasesScreen: Filtering for profesor with user data:', {
          id: user.id,
          correo: user.correo,
          numeroDocumento: (user as any).numeroDocumento,
          nombre: user.nombre,
          role: getUserRole(),
          totalClasesBeforeFilter: programacionesList.length
        });
        
        filteredProgramaciones = programacionesList.filter((item: any) => {
          // Verificar si la clase está asignada al profesor logueado
          const profesorData = item.programacionProfesor?.profesor;
          
          if (!profesorData) {
            console.log('ProgramacionClasesScreen: No profesor data found, excluding this class');
            return false;
          }
          
          // Datos del profesor de la clase
          const profesorId = profesorData._id || profesorData.id;
          const profesorFullName = `${profesorData.nombres || profesorData.nombre} ${profesorData.apellidos || profesorData.apellido}`;
          const userFullName = `${user.nombre} ${user.apellido}`;
          
          // Solo usar ID y nombre como criterios seguros
          const matchesId = profesorId && profesorId === user.id;
          const matchesName = profesorFullName.toLowerCase().trim() === userFullName.toLowerCase().trim();
          
          // Filtro conservador: Solo ID o nombre exacto
          const isAssigned = matchesId || matchesName;
          
          console.log('🔍 DETAILED COMPARISON:', {
            profesorName: profesorFullName,
            userName: userFullName,
            profesorId: profesorId,
            userId: user.id,
            matchesId: matchesId,
            matchesName: matchesName,
            FINAL_RESULT: isAssigned
          });
          
          if (isAssigned) {
            console.log('ProgramacionClasesScreen: ✅ CLASE INCLUIDA - Asignada al profesor logueado');
          } else {
            console.log('ProgramacionClasesScreen: ❌ CLASE EXCLUIDA - No asignada al profesor logueado');
          }
          
          return isAssigned;
        });
        console.log('ProgramacionClasesScreen: Filtered programaciones for profesor:', filteredProgramaciones.length);
      }
      
      // Agrupar por curso
      const cursosMap = new Map();
      
      filteredProgramaciones.forEach((item: any) => {
        const especialidad = item.especialidad || 'N/A';
        const cursoNombre = item.beneficiarios?.[0]?.cursoId?.nombre || especialidad;
        
        // Mapear días completos
        const diaCompleto = (() => {
          switch(item.dia) {
            case 'L': return 'Lunes';
            case 'M': return 'Martes';
            case 'X': return 'Miércoles';
            case 'J': return 'Jueves';
            case 'V': return 'Viernes';
            case 'S': return 'Sábado';
            case 'D': return 'Domingo';
            default: return item.dia || 'N/A';
          }
        })();
        
        const profesor = item.programacionProfesor?.profesor?.nombres 
          ? `${item.programacionProfesor.profesor.nombres} ${item.programacionProfesor.profesor.apellidos}`
          : item.programacionProfesor?.profesor?.nombre 
          ? `${item.programacionProfesor.profesor.nombre} ${item.programacionProfesor.profesor.apellido}`
          : 'N/A';
        
        const aula = item.aula?.numeroAula || item.aula?.nombre || 'N/A';
        
        // Obtener beneficiarios
        const beneficiarios = item.beneficiarios?.map((benef: any) => 
          benef.beneficiarioId?.nombre 
            ? `${benef.beneficiarioId.nombre} ${benef.beneficiarioId.apellido}`
            : 'N/A'
        ) || [];
        
        if (!cursosMap.has(cursoNombre)) {
          cursosMap.set(cursoNombre, {
            curso: cursoNombre,
            horarios: [],
            totalHorarios: 0
          });
        }
        
        const cursoData = cursosMap.get(cursoNombre);
        cursoData.horarios.push({
          dia: diaCompleto,
          horaInicio: item.horaInicio || 'N/A',
          horaFin: item.horaFin || 'N/A',
          aula: aula,
          profesor: profesor,
          beneficiarios: beneficiarios
        });
        cursoData.totalHorarios++;
      });
      
      // Convertir a array y formatear para mostrar
      const processedData = Array.from(cursosMap.values()).map(cursoData => ({
        curso: cursoData.curso,
        totalHorarios: cursoData.totalHorarios,
        horarios: cursoData.horarios // Mantener horarios para el modal
      }));
      
      console.log('ProgramacionClasesScreen: Processed data:', processedData);
      setData(processedData);
    } catch (error) {
      console.error('ProgramacionClasesScreen: Error fetching programacion de clases:', error);
    } finally {
      setLoading(false);
      console.log('ProgramacionClasesScreen: Fetch completed, loading set to false');
    }
  };

  const handleCardPress = (item: any) => {
    console.log('ProgramacionClasesScreen: Card pressed for curso:', item.curso);
    setSelectedCurso(item.curso);
    setSelectedHorarios(item.horarios || []);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedCurso('');
    setSelectedHorarios([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar en programación de clases..."
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
          getUserRole() === 'beneficiario' 
            ? "No tienes clases programadas" 
            : getUserRole() === 'profesor'
            ? "No tienes clases asignadas"
            : "No hay programación de clases disponible"
        }
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCardPress={handleCardPress}
      />
      
      <HorariosModal
        visible={modalVisible}
        onClose={closeModal}
        curso={selectedCurso}
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
});

export default ProgramacionClasesScreen;