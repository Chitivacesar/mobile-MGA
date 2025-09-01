import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import CardList from '@/components/CardList';
import { api } from '@/shared/services/api';

const AulasScreen = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('AulasScreen: Rendering with', data.length, 'aulas, loading:', loading);

  const columns = [
    { key: 'numeroAula', label: 'N° Aula' },
    { key: 'capacidad', label: 'Capacidad' },
    { key: 'estado', label: 'Estado' },
  ];

  useEffect(() => {
    console.log('AulasScreen: useEffect triggered, fetching data...');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('AulasScreen: Starting to fetch aulas...');
      setLoading(true);
      const response = await api.get('/aulas');
      
      console.log('AulasScreen: API response received:', response);
      
      // La API devuelve un array directamente, no dentro de una propiedad
      const processedData = (response || []).map((aula: any) => ({
        numeroAula: aula.numeroAula || 'N/A',
        capacidad: aula.capacidad ? `${aula.capacidad} personas` : 'N/A',
        estado: aula.estado || 'N/A',
      }));
      
      console.log('AulasScreen: Processed data:', processedData);
      setData(processedData);
    } catch (error) {
      console.error('AulasScreen: Error fetching aulas:', error);
    } finally {
      setLoading(false);
      console.log('AulasScreen: Fetch completed, loading set to false');
    }
  };

  return (
    <View style={styles.container}>
      <CardList
        data={data}
        columns={columns}
        loading={loading}
        searchPlaceholder="Buscar en aulas..."
        emptyMessage="No hay aulas disponibles"
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

export default AulasScreen;


