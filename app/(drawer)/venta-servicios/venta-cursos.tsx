import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import CardList from '@/components/CardList';
import { api } from '@/shared/services/api';

const VentaCursosScreen = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('VentaCursosScreen: Rendering with', data.length, 'ventas, loading:', loading);

  const columns = [
    { key: 'codigoVenta', label: 'Código' },
    { key: 'beneficiario', label: 'Beneficiario' },
    { key: 'curso', label: 'Curso' },
    { key: 'valorTotal', label: 'Valor Total' },
    { key: 'estado', label: 'Estado' },
    { key: 'fechaInicio', label: 'Fecha Inicio' },
  ];

  useEffect(() => {
    console.log('VentaCursosScreen: useEffect triggered, fetching data...');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('VentaCursosScreen: Starting to fetch ventas...');
      setLoading(true);
      const response = await api.get('/ventas');
      
      console.log('VentaCursosScreen: API response received:', response);
      
      // Filtrar solo ventas de cursos (códigos que empiecen con CU)
      const ventasCursos = (response || []).filter((venta: any) => 
        venta.codigoVenta && venta.codigoVenta.startsWith('CU')
      );

      console.log('VentaCursosScreen: Filtered ventas de cursos:', ventasCursos);

      const processedData = ventasCursos.map((venta: any) => {
        // Obtener nombre del beneficiario
        let beneficiarioNombre = 'N/A';
        if (venta.beneficiarioId?.nombre) {
          beneficiarioNombre = `${venta.beneficiarioId.nombre} ${venta.beneficiarioId.apellido || ''}`;
        } else if (venta.beneficiario?.nombre) {
          beneficiarioNombre = `${venta.beneficiario.nombre} ${venta.beneficiario.apellido || ''}`;
        } else if (venta.beneficiarioNombre) {
          beneficiarioNombre = venta.beneficiarioNombre;
        }

        // Obtener nombre del curso
        let cursoNombre = 'N/A';
        if (venta.cursoId?.nombre) {
          cursoNombre = venta.cursoId.nombre;
        } else if (venta.curso?.nombre) {
          cursoNombre = venta.curso.nombre;
        }

        return {
          codigoVenta: venta.codigoVenta || 'N/A',
          beneficiario: beneficiarioNombre,
          curso: cursoNombre,
          valorTotal: venta.valor_total ? `$${venta.valor_total.toLocaleString()}` : 'N/A',
          estado: venta.estado || 'N/A',
          fechaInicio: venta.fechaInicio ? new Date(venta.fechaInicio).toLocaleDateString() : 'N/A',
        };
      });

      console.log('VentaCursosScreen: Processed data:', processedData);
      setData(processedData);
    } catch (error) {
      console.error('VentaCursosScreen: Error fetching venta de cursos:', error);
    } finally {
      setLoading(false);
      console.log('VentaCursosScreen: Fetch completed, loading set to false');
    }
  };

  return (
    <View style={styles.container}>
      <CardList
        data={data}
        columns={columns}
        loading={loading}
        searchPlaceholder="Buscar en venta de cursos..."
        emptyMessage="No hay ventas de cursos disponibles"
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

export default VentaCursosScreen;


