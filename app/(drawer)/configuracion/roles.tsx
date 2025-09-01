import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import CardList from '@/components/CardList';
import { api } from '@/shared/services/api';

const RolesScreen = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('RolesScreen: Rendering with', data.length, 'roles, loading:', loading);

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'estado', label: 'Estado' },
  ];

  useEffect(() => {
    console.log('RolesScreen: useEffect triggered, fetching data...');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('RolesScreen: Starting to fetch roles...');
      setLoading(true);
      const response = await api.get('/roles');
      
      console.log('RolesScreen: API response received:', response);
      
      const processedData = (response.roles || []).map((rol: any) => ({
        nombre: rol.nombre || 'N/A',
        descripcion: rol.descripcion || 'N/A',
        estado: rol.estado ? 'Activo' : 'Inactivo',
      }));
      
      console.log('RolesScreen: Processed data:', processedData);
      setData(processedData);
    } catch (error) {
      console.error('RolesScreen: Error fetching roles:', error);
    } finally {
      setLoading(false);
      console.log('RolesScreen: Fetch completed, loading set to false');
    }
  };

  return (
    <View style={styles.container}>
      <CardList
        data={data}
        columns={columns}
        loading={loading}
        searchPlaceholder="Buscar en roles..."
        emptyMessage="No hay roles disponibles"
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

export default RolesScreen;


