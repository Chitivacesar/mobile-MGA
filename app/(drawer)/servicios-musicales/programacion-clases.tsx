import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import CardList from '@/components/CardList';
import { api } from '@/shared/services/api';
import { useAuth } from '@/shared/contexts/AuthContext';

const ProgramacionClasesScreen = () => {
  const { user, getUserRole } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('ProgramacionClasesScreen: Rendering with', data.length, 'clases, loading:', loading);
  console.log('ProgramacionClasesScreen: Current user:', user?.nombre, 'Role:', getUserRole());

  const columns = getUserRole() === 'beneficiario' ? [
    { key: 'curso', label: 'Curso' },
    { key: 'dia', label: 'Día' },
    { key: 'horaInicio', label: 'Inicio' },
    { key: 'horaFin', label: 'Fin' },
    { key: 'aula', label: 'N° Aula' },
    { key: 'profesor', label: 'Profesor' },
  ] : [
    { key: 'curso', label: 'Curso' },
    { key: 'dia', label: 'Día' },
    { key: 'horaInicio', label: 'Inicio' },
    { key: 'horaFin', label: 'Fin' },
    { key: 'aula', label: 'N° Aula' },
    { key: 'profesor', label: 'Profesor' },
    { key: 'beneficiario', label: 'Beneficiario' },
  ];

  useEffect(() => {
    console.log('ProgramacionClasesScreen: useEffect triggered, fetching data...');
    fetchData();
  }, []);

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
      } else if (response && response.programacion_de_clases && Array.isArray(response.programacion_de_clases)) {
        // Respuesta como objeto con propiedad
        programacionesList = response.programacion_de_clases;
      } else {
        console.log('ProgramacionClasesScreen: Invalid response structure:', response);
        setData([]);
        return;
      }
      
      console.log('ProgramacionClasesScreen: Programaciones list:', programacionesList);
      
      // Filtrar solo las clases según el rol del usuario
      let filteredProgramaciones = programacionesList;
      
      if (getUserRole() === 'beneficiario' && user?.id) {
        console.log('ProgramacionClasesScreen: Filtering for beneficiario with ID:', user.id);
        filteredProgramaciones = programacionesList.filter((item: any) => {
          // Verificar si el beneficiario logueado está en la lista de beneficiarios de esta clase
          const isInscribed = item.beneficiarios?.some((beneficiario: any) => 
            beneficiario.beneficiarioId?._id === user.id || 
            beneficiario.beneficiarioId?.id === user.id
          );
          console.log('ProgramacionClasesScreen: Class item:', item.dia, item.horaInicio, 'Is inscribed:', isInscribed);
          return isInscribed;
        });
        console.log('ProgramacionClasesScreen: Filtered programaciones for beneficiario:', filteredProgramaciones.length);
      } else if (getUserRole() === 'profesor' && user?.id) {
        console.log('ProgramacionClasesScreen: Filtering for profesor with ID:', user.id);
        filteredProgramaciones = programacionesList.filter((item: any) => {
          // Verificar si la clase está asignada al profesor logueado
          const isAssigned = item.programacionProfesor?.profesor?._id === user.id;
          console.log('ProgramacionClasesScreen: Class item:', item.dia, item.horaInicio, 'Is assigned:', isAssigned);
          return isAssigned;
        });
        console.log('ProgramacionClasesScreen: Filtered programaciones for profesor:', filteredProgramaciones.length);
      }
      
      const processedData = filteredProgramaciones.map((item: any) => {
        const baseData = {
          curso: item.beneficiarios?.[0]?.cursoId?.nombre || 'N/A',
          dia: item.dia || 'N/A',
          horaInicio: item.horaInicio || 'N/A',
          horaFin: item.horaFin || 'N/A',
          aula: item.aula?.numeroAula || 'N/A',
          profesor: item.programacionProfesor?.profesor?.nombres 
            ? `${item.programacionProfesor.profesor.nombres} ${item.programacionProfesor.profesor.apellidos}`
            : 'N/A',
        };
        
        // Solo agregar beneficiario si no es beneficiario logueado
        if (getUserRole() !== 'beneficiario') {
          return {
            ...baseData,
            beneficiario: item.beneficiarios?.[0]?.beneficiarioId?.nombre 
              ? `${item.beneficiarios[0].beneficiarioId.nombre} ${item.beneficiarios[0].beneficiarioId.apellido}`
              : 'N/A',
          };
        }
        
        return baseData;
      });
      
      console.log('ProgramacionClasesScreen: Processed data:', processedData);
      setData(processedData);
    } catch (error) {
      console.error('ProgramacionClasesScreen: Error fetching programacion de clases:', error);
    } finally {
      setLoading(false);
      console.log('ProgramacionClasesScreen: Fetch completed, loading set to false');
    }
  };

  return (
    <View style={styles.container}>
      <CardList
        data={data}
        columns={columns}
        loading={loading}
        searchPlaceholder="Buscar en programación de clases..."
        emptyMessage={
          getUserRole() === 'beneficiario' 
            ? "No tienes clases programadas" 
            : getUserRole() === 'profesor'
            ? "No tienes clases asignadas"
            : "No hay programación de clases disponible"
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
});

export default ProgramacionClasesScreen;


