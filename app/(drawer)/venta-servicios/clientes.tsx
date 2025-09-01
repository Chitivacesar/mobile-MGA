import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import CardList from '@/components/CardList';
import { api } from '@/shared/services/api';

const ClientesScreen = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('ClientesScreen: Rendering with', data.length, 'clientes, loading:', loading);

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'apellido', label: 'Apellido' },
    { key: 'tipoDocumento', label: 'Tipo Doc' },
    { key: 'numeroDocumento', label: 'N° Documento' },
    { key: 'telefono', label: 'Teléfono' },
  ];

  useEffect(() => {
    console.log('ClientesScreen: useEffect triggered, fetching data...');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('ClientesScreen: Starting to fetch beneficiarios...');
      setLoading(true);
      const response = await api.get('/beneficiarios');
      
      console.log('ClientesScreen: Beneficiarios API response received:', response);
      
      // Filtrar solo los beneficiarios que son clientes (clienteId === _id)
      const clientes = (response || []).filter((beneficiario: any) => 
        beneficiario.clienteId === beneficiario._id
      );

      console.log('ClientesScreen: Filtered clientes from beneficiarios:', clientes);

      const processedData = clientes.map((cliente: any) => ({
        nombre: cliente.nombre || 'N/A',
        apellido: cliente.apellido || 'N/A',
        tipoDocumento: cliente.tipo_de_documento || 'N/A',
        numeroDocumento: cliente.numero_de_documento || 'N/A',
        telefono: cliente.telefono || 'N/A',
      }));

      console.log('ClientesScreen: Processed data:', processedData);
      setData(processedData);
    } catch (error) {
      console.error('ClientesScreen: Error fetching beneficiarios:', error);
    } finally {
      setLoading(false);
      console.log('ClientesScreen: Fetch completed, loading set to false');
    }
  };

  return (
    <View style={styles.container}>
      <CardList
        data={data}
        columns={columns}
        loading={loading}
        searchPlaceholder="Buscar en clientes..."
        emptyMessage="No hay clientes disponibles"
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

export default ClientesScreen;


