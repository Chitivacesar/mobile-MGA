import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import CardList from '@/components/CardList';
import { api } from '@/shared/services/api';

const VentaMatriculasScreen = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('VentaMatriculasScreen: Rendering with', data.length, 'ventas, loading:', loading);

  const columns = [
    { key: 'codigoVenta', label: 'Código' },
    { key: 'beneficiario', label: 'Beneficiario' },
    { key: 'valorTotal', label: 'Valor Total' },
    { key: 'estado', label: 'Estado' },
    { key: 'fechaInicio', label: 'Fecha Inicio' },
  ];

  useEffect(() => {
    console.log('VentaMatriculasScreen: useEffect triggered, fetching data...');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('VentaMatriculasScreen: Starting to fetch ventas...');
      setLoading(true);
      const response = await api.get('/ventas');
      
      console.log('VentaMatriculasScreen: API response received:', response);
      
      // Filtrar solo ventas de matrículas (códigos que empiecen con MA)
      const ventasMatriculas = (response || []).filter((venta: any) => 
        venta.codigoVenta && venta.codigoVenta.startsWith('MA')
      );

      console.log('VentaMatriculasScreen: Filtered ventas de matrículas:', ventasMatriculas);

      const processedData = ventasMatriculas.map((venta: any) => {
        // Obtener nombre del beneficiario
        let beneficiarioNombre = 'N/A';
        if (venta.beneficiarioId?.nombre) {
          beneficiarioNombre = `${venta.beneficiarioId.nombre} ${venta.beneficiarioId.apellido || ''}`;
        } else if (venta.beneficiario?.nombre) {
          beneficiarioNombre = `${venta.beneficiario.nombre} ${venta.beneficiario.apellido || ''}`;
        } else if (venta.beneficiarioNombre) {
          beneficiarioNombre = venta.beneficiarioNombre;
        }

        return {
          codigoVenta: venta.codigoVenta || 'N/A',
          beneficiario: beneficiarioNombre,
          valorTotal: venta.valor_total ? `$${venta.valor_total.toLocaleString()}` : 'N/A',
          estado: venta.estado || 'N/A',
          fechaInicio: venta.fechaInicio ? new Date(venta.fechaInicio).toLocaleDateString() : 'N/A',
        };
      });

      console.log('VentaMatriculasScreen: Processed data:', processedData);
      setData(processedData);
    } catch (error) {
      console.error('VentaMatriculasScreen: Error fetching venta de matrículas:', error);
    } finally {
      setLoading(false);
      console.log('VentaMatriculasScreen: Fetch completed, loading set to false');
    }
  };

  return (
    <View style={styles.container}>
      <CardList
        data={data}
        columns={columns}
        loading={loading}
        searchPlaceholder="Buscar en venta de matrículas..."
        emptyMessage="No hay ventas de matrículas disponibles"
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

export default VentaMatriculasScreen;


