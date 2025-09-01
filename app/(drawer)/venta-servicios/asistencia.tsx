import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import CardList from '@/components/CardList';
import { api } from '@/shared/services/api';
import { useAuth } from '@/shared/contexts/AuthContext';

const AsistenciaScreen = () => {
  const { user, getUserRole } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('AsistenciaScreen: Rendering with', data.length, 'asistencias, loading:', loading);
  console.log('AsistenciaScreen: Current user:', user?.nombre, 'Role:', getUserRole());

  const columns = getUserRole() === 'beneficiario' ? [
    { key: 'curso', label: 'Curso' },
    { key: 'profesor', label: 'Profesor' },
    { key: 'dia', label: 'Día' },
    { key: 'hora', label: 'Hora' },
    { key: 'aula', label: 'Aula' },
    { key: 'estado', label: 'Estado' },
    { key: 'fecha', label: 'Fecha' },
  ] : [
    { key: 'beneficiario', label: 'Beneficiario' },
    { key: 'curso', label: 'Curso' },
    { key: 'profesor', label: 'Profesor' },
    { key: 'dia', label: 'Día' },
    { key: 'hora', label: 'Hora' },
    { key: 'aula', label: 'Aula' },
    { key: 'estado', label: 'Estado' },
    { key: 'fecha', label: 'Fecha' },
  ];

  useEffect(() => {
    console.log('AsistenciaScreen: useEffect triggered, fetching data...');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('AsistenciaScreen: Starting to fetch asistencias...');
      setLoading(true);
      const response = await api.get('/asistencias');
      
      console.log('AsistenciaScreen: API response received:', response);
      
      // Filtrar solo las asistencias del beneficiario logueado
      let filteredAsistencias = response || [];
      
      if (getUserRole() === 'beneficiario' && user?.id) {
        console.log('AsistenciaScreen: Filtering for beneficiario with ID:', user.id);
        filteredAsistencias = (response || []).filter((asistencia: any) => {
          // Verificar si la asistencia pertenece al beneficiario logueado
          const isOwnAsistencia = asistencia.ventaId?.beneficiarioId?._id === user.id || 
                                  asistencia.ventaId?.beneficiarioId?.id === user.id;
          console.log('AsistenciaScreen: Asistencia item:', asistencia.estado, 'Is own:', isOwnAsistencia);
          return isOwnAsistencia;
        });
        console.log('AsistenciaScreen: Filtered asistencias for beneficiario:', filteredAsistencias.length);
      }
      
      const processedData = filteredAsistencias.map((asistencia: any) => {
        console.log('AsistenciaScreen: Processing asistencia:', JSON.stringify(asistencia, null, 2));
        
        // Obtener nombre del beneficiario
        let beneficiarioNombre = 'N/A';
        if (asistencia.ventaId?.beneficiarioId?.nombre) {
          beneficiarioNombre = `${asistencia.ventaId.beneficiarioId.nombre} ${asistencia.ventaId.beneficiarioId.apellido || ''}`;
        }

        // Obtener nombre del curso
        let cursoNombre = 'N/A';
        if (asistencia.ventaId?.cursoId?.nombre) {
          cursoNombre = asistencia.ventaId.cursoId.nombre;
        }

        // Obtener nombre del profesor
        let profesorNombre = 'N/A';
        if (asistencia.programacionClaseId?.programacionProfesor?.profesor?.nombres) {
          profesorNombre = `${asistencia.programacionClaseId.programacionProfesor.profesor.nombres} ${asistencia.programacionClaseId.programacionProfesor.profesor.apellidos || ''}`;
        }

        // Obtener información de día y hora
        let dia = 'N/A';
        let hora = 'N/A';
        if (asistencia.programacionClaseId) {
          // Formatear el día correctamente
          const diaMap: { [key: string]: string } = {
            'L': 'Lunes',
            'M': 'Martes',
            'X': 'Miércoles',
            'J': 'Jueves',
            'V': 'Viernes',
            'S': 'Sábado',
            'D': 'Domingo'
          };
          const diaCodigo = asistencia.programacionClaseId.dia;
          dia = diaMap[diaCodigo] || diaCodigo || 'N/A';
          
          if (asistencia.programacionClaseId.horaInicio && asistencia.programacionClaseId.horaFin) {
            hora = `${asistencia.programacionClaseId.horaInicio} - ${asistencia.programacionClaseId.horaFin}`;
          }
        }

        // Obtener número de aula
        let aulaNumero = 'N/A';
        if (asistencia.programacionClaseId?.aula?.numeroAula) {
          aulaNumero = asistencia.programacionClaseId.aula.numeroAula;
        }

        const baseAsistencia = {
          curso: cursoNombre,
          profesor: profesorNombre,
          dia: dia,
          hora: hora,
          aula: aulaNumero,
          estado: asistencia.estado || 'N/A',
          fecha: asistencia.createdAt ? new Date(asistencia.createdAt).toLocaleDateString() : 'N/A',
        };
        
        // Solo agregar beneficiario si no es beneficiario logueado
        if (getUserRole() !== 'beneficiario') {
          return {
            ...baseAsistencia,
            beneficiario: beneficiarioNombre,
          };
        }
        
        return baseAsistencia;

        const finalAsistencia = getUserRole() !== 'beneficiario' ? {
          ...baseAsistencia,
          beneficiario: beneficiarioNombre,
        } : baseAsistencia;
        
        console.log('AsistenciaScreen: Processed asistencia:', finalAsistencia);
        return finalAsistencia;
      });

      console.log('AsistenciaScreen: Processed data:', processedData);
      setData(processedData);
    } catch (error) {
      console.error('AsistenciaScreen: Error fetching asistencias:', error);
    } finally {
      setLoading(false);
      console.log('AsistenciaScreen: Fetch completed, loading set to false');
    }
  };

  return (
    <View style={styles.container}>
      <CardList
        data={data}
        columns={columns}
        loading={loading}
        searchPlaceholder="Buscar en asistencias..."
        emptyMessage={
          getUserRole() === 'beneficiario' 
            ? "No tienes asistencias registradas" 
            : "No hay asistencias disponibles"
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

export default AsistenciaScreen;


