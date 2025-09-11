import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { colors, spacing, typography, radii, shadows } from '@/constants/theme';
import CardList from '@/components/CardList';
import RefreshButton from '@/components/RefreshButton';
import { api } from '@/shared/services/api';

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

  // Función auxiliar para extraer roles de un usuario
  const extractUserRoles = (usuarioId: string, rolesData: any[]): string => {
    console.log(`Extracting roles for usuario: ${usuarioId}`);
    
    // Filtrar roles que coincidan con este usuario
    const rolesUsuario = rolesData.filter((r: any) => {
      const match = r.usuarioId?._id === usuarioId;
      console.log(`Checking role: usuarioId._id=${r.usuarioId?._id}, usuario._id=${usuarioId}, match=${match}`);
      if (match) {
        console.log(`Match found! Role data:`, JSON.stringify(r, null, 2));
      }
      return match;
    });
    
    console.log(`Found ${rolesUsuario.length} roles for usuario ${usuarioId}`);
    
    if (rolesUsuario.length === 0) {
      console.log('No roles found, returning "Sin roles asignados"');
      return 'Sin roles asignados';
    }
    
    // Extraer nombres de roles
    const rolesNombres = rolesUsuario.map((r: any) => {
      const roleName = r.rolId?.nombre;
      console.log(`Extracting role name: ${roleName} from:`, JSON.stringify(r.rolId, null, 2));
      return roleName;
    }).filter(Boolean);
    
    const result = rolesNombres.join(', ');
    console.log(`Final roles string for usuario ${usuarioId}: "${result}"`);
    return result || 'Sin roles asignados';
  };

  const fetchData = async () => {
    try {
      console.log('UsuariosScreen: Starting to fetch usuarios...');
      setLoading(true);
      
      const [usuariosResponse, rolesResponse] = await Promise.all([
        api.get('/usuarios'),
        api.get('/usuarios_has_rol')
      ]);
      
      console.log('UsuariosScreen: API responses received:', {
        usuarios: usuariosResponse,
        roles: rolesResponse
      });
      
      const usuarios = usuariosResponse.usuarios || [];
      // Verificar si la respuesta tiene la estructura usuarios_has_rol o es un array directo
      const roles = rolesResponse.usuarios_has_rol || rolesResponse || [];
      
      console.log('Usuarios encontrados:', usuarios.length);
      console.log('Roles encontrados:', roles.length);
      console.log('Primer usuario ejemplo:', usuarios[0]);
      console.log('Primer rol ejemplo:', roles[0]);
      console.log('Estructura completa de roles:', JSON.stringify(roles[0], null, 2));

      const processedData = usuarios.map((usuario: any) => {
        console.log(`Processing usuario: ${usuario._id} - ${usuario.nombre} ${usuario.apellido}`);
        
        // Usar la función auxiliar para extraer roles
        const rolesNombres = extractUserRoles(usuario._id, roles);

        return {
          nombreCompleto: `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim() || 'N/A',
          documento: `${usuario.tipo_de_documento || 'N/A'}: ${usuario.documento || 'N/A'}`,
          correo: usuario.correo || 'N/A',
          roles: rolesNombres,
          estado: usuario.estado ? 'Activo' : 'Inactivo',
        };
      });

      console.log('UsuariosScreen: Processed data:', processedData);
      setData(processedData);
    } catch (error) {
      console.error('UsuariosScreen: Error fetching usuarios:', error);
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
        emptyMessage="No hay usuarios disponibles"
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


