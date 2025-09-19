import CardList from '@/components/CardList';
import RefreshButton from '@/components/RefreshButton';
import { colors, radii, shadows, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/shared/contexts/AuthContext';
import { api } from '@/shared/services/api';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

const AsistenciaScreen = () => {
  const { user, getUserRole } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  console.log('AsistenciaScreen: Rendering with', data.length, 'asistencias, loading:', loading);
  console.log('AsistenciaScreen: Current user:', user?.nombre, 'Role:', getUserRole());

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
      console.log('AsistenciaScreen: Current user data:', user);
      console.log('AsistenciaScreen: User role:', getUserRole());
      
      const resp = await api.get('/api/asistencias');
      console.log('AsistenciaScreen: Respuesta completa:', resp);
      
      const list = Array.isArray(resp) ? resp : ((resp as any)?.asistencias || (resp as any)?.data || []);
      console.log('AsistenciaScreen: Lista de asistencias antes del filtro:', list.length);

      // Filtrar asistencias según el rol del usuario
      let filteredAsistencias = list;
      
      if (getUserRole() === 'profesor' && user) {
        console.log('AsistenciaScreen: 🎯 ENTRANDO AL FILTRO DE PROFESOR');
        console.log('AsistenciaScreen: Filtering for profesor with user data:', {
          id: user.id,
          correo: user.correo,
          nombre: user.nombre,
          role: getUserRole(),
          totalAsistenciasBeforeFilter: list.length
        });
        
        filteredAsistencias = list.filter((asistencia: any) => {
          // Verificar si la asistencia pertenece a una clase del profesor logueado
          const programacionClase = asistencia.programacionClaseId;
          
          if (!programacionClase || !programacionClase.programacionProfesor) {
            console.log('AsistenciaScreen: No programacion data found, excluding this asistencia');
            return false;
          }
          
          const profesorData = programacionClase.programacionProfesor.profesor;
          
          if (!profesorData) {
            console.log('AsistenciaScreen: No profesor data found, excluding this asistencia');
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
            console.log('AsistenciaScreen: ✅ ASISTENCIA INCLUIDA - Pertenece al profesor logueado');
          } else {
            console.log('AsistenciaScreen: ❌ ASISTENCIA EXCLUIDA - No pertenece al profesor logueado');
          }
          
          return isAssigned;
        });
        
        console.log('AsistenciaScreen: Filtered asistencias for profesor:', filteredAsistencias.length);
      } else if (getUserRole() === 'beneficiario' && user) {
        console.log('AsistenciaScreen: Filtering for beneficiario with user data:', {
          id: user.id,
          correo: user.correo,
          numeroDocumento: (user as any).numeroDocumento,
          nombre: user.nombre
        });
        
        filteredAsistencias = list.filter((asistencia: any) => {
          // Verificar si la asistencia pertenece al beneficiario logueado
          const beneficiarioData = asistencia.ventaId?.beneficiarioId;
          
          if (!beneficiarioData) {
            console.log('AsistenciaScreen: No beneficiario data found');
            return false;
          }
          
          // Múltiples criterios de comparación
          const matchesId = beneficiarioData._id === user.id || beneficiarioData.id === user.id;
          const matchesEmail = beneficiarioData.correo === user.correo || beneficiarioData.email === user.correo;
          const matchesDocument = beneficiarioData.numero_de_documento === (user as any).numeroDocumento;
          const matchesName = (beneficiarioData.nombre === user.nombre && beneficiarioData.apellido === user.apellido);
          
          const isMatch = matchesId || matchesEmail || matchesDocument || matchesName;
          
          console.log('AsistenciaScreen: Beneficiario comparison:', {
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
        
        console.log('AsistenciaScreen: Filtered asistencias for beneficiario:', filteredAsistencias.length);
      }

      const processed = filteredAsistencias.map((a: any) => {
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

  useEffect(() => {
    console.log('AsistenciaScreen: useEffect triggered, fetching data...');
    fetchData();
  }, [user]);

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
          emptyMessage={
            getUserRole() === 'beneficiario' 
              ? "No tienes registros de asistencia" 
              : getUserRole() === 'profesor'
              ? "No hay registros de asistencia para tus clases"
              : "No hay registros de asistencia"
          }
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