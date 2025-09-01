import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import CardList from '@/components/CardList';
import { api } from '@/shared/services/api';

const ProfesoresScreen = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('ProfesoresScreen: Rendering with', data.length, 'profesores, loading:', loading);

  const columns = [
    { key: 'nombres', label: 'Nombres' },
    { key: 'apellidos', label: 'Apellidos' },
    { key: 'correo', label: 'Correo' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'especialidades', label: 'Especialidades' },
  ];

  useEffect(() => {
    console.log('ProfesoresScreen: useEffect triggered, fetching data...');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('ProfesoresScreen: Starting to fetch profesores...');
      setLoading(true);
      const response = await api.get('/profesores');
      
      console.log('ProfesoresScreen: API response received:', response);
      
      // La API devuelve un array directamente, no dentro de una propiedad
      const processedData = (response || []).map((profesor: any) => ({
        nombres: profesor.nombres || 'N/A',
        apellidos: profesor.apellidos || 'N/A',
        correo: profesor.correo || 'N/A',
        telefono: profesor.telefono || 'N/A',
        especialidades: Array.isArray(profesor.especialidades) 
          ? profesor.especialidades.join(', ') 
          : 'N/A',
      }));
      
      console.log('ProfesoresScreen: Processed data:', processedData);
      setData(processedData);
    } catch (error) {
      console.error('ProfesoresScreen: Error fetching profesores:', error);
    } finally {
      setLoading(false);
      console.log('ProfesoresScreen: Fetch completed, loading set to false');
    }
  };

  return (
    <View style={styles.container}>
      <CardList
        data={data}
        columns={columns}
        loading={loading}
        searchPlaceholder="Buscar en profesores..."
        emptyMessage="No hay profesores disponibles"
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

export default ProfesoresScreen;


