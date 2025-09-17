import CardList from '@/components/CardList';
import RefreshButton from '@/components/RefreshButton';
import { colors, radii, shadows, spacing, typography } from '@/constants/theme';
import { usersService, Usuario } from '@/shared/services/users';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

const UsuariosScreen = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  console.log('UsuariosScreen: Rendering with', data.length, 'usuarios, loading:', loading);

  const columns = [
    { key: 'nombreCompleto', label: 'Nombre Completo' },
    { key: 'documento', label: 'Documento' },
    { key: 'correo', label: 'Correo' },
    { key: 'roles', label: 'Roles' },
    { key: 'estado', label: 'Estado' },
  ];

  useEffect(() => {
    console.log('UsuariosScreen: useEffect triggered, fetching data...');
    fetchData();
  }, []);


  const fetchData = async () => {
    try {
      console.log('UsuariosScreen: Starting to fetch usuarios...');
      setLoading(true);
      
      // Timeout de 4 segundos para la carga de usuarios
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout: La carga de usuarios está tardando demasiado')), 4000)
      );
      
      const usuariosPromise = usersService.list();
      
      const usuariosResponse = await Promise.race([usuariosPromise, timeoutPromise]) as any;
      
      console.log('UsuariosScreen: API response received:', usuariosResponse);
      
      const usuarios = usuariosResponse.usuarios || [];
      
      console.log('Usuarios encontrados:', usuarios.length);
      console.log('Primer usuario ejemplo:', usuarios[0]);

      const processedData = usuarios.map((usuario: Usuario) => {
        console.log(`Processing usuario: ${usuario._id} - ${usuario.nombre} ${usuario.apellido}`);

        return {
          nombreCompleto: `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim() || 'N/A',
          documento: `${usuario.tipo_de_documento || 'N/A'}: ${usuario.documento || 'N/A'}`,
          correo: usuario.correo || 'N/A',
          roles: usuario.rol || 'Sin rol asignado',
          estado: usuario.estado ? 'Activo' : 'Inactivo',
        };
      });

      console.log('UsuariosScreen: Processed data:', processedData);
      setData(processedData);
    } catch (error: any) {
      console.error('UsuariosScreen: Error fetching usuarios:', error);
      
      // Mostrar mensaje de error más específico
      if (error.message?.includes('Timeout')) {
        console.error('Timeout error - servidor muy lento');
      } else if (error.code === 'ECONNABORTED') {
        console.error('Connection timeout');
      } else {
        console.error('Other error:', error.message);
      }
      
      // Mantener datos vacíos en caso de error
      setData([]);
    } finally {
      setLoading(false);
      console.log('UsuariosScreen: Fetch completed, loading set to false');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar en usuarios..."
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
        emptyMessage={loading ? "Cargando usuarios..." : "No hay usuarios disponibles"}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
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

export default UsuariosScreen;


