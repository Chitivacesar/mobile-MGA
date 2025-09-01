import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import CardList from '@/components/CardList';
import { api } from '@/shared/services/api';
import { useAuth } from '@/shared/contexts/AuthContext';

const PagosScreen = () => {
  const { user, getUserRole } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('PagosScreen: Rendering with', data.length, 'pagos, loading:', loading);
  console.log('PagosScreen: Current user:', user?.nombre, 'Role:', getUserRole());

  const columns = [
    { key: 'codigoVenta', label: 'Código Venta' },
    { key: 'beneficiario', label: 'Beneficiario' },
    { key: 'metodoPago', label: 'Método Pago' },
    { key: 'valorTotal', label: 'Valor Total' },
    { key: 'estado', label: 'Estado' },
    { key: 'fechaPago', label: 'Fecha Pago' },
    { key: 'descripcion', label: 'Descripción' },
  ];

  useEffect(() => {
    console.log('PagosScreen: useEffect triggered, fetching data...');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('PagosScreen: Starting to fetch pagos...');
      setLoading(true);
      const response = await api.get('/pagos');
      
      console.log('PagosScreen: API response received:', response);
      console.log('PagosScreen: Response type:', typeof response);
      console.log('PagosScreen: Is array?', Array.isArray(response));
      console.log('PagosScreen: Response length:', Array.isArray(response) ? response.length : 'Not an array');
      
      // Validar estructura de respuesta
      let pagosList;
      if (Array.isArray(response)) {
        pagosList = response;
      } else if (response && response.pagos && Array.isArray(response.pagos)) {
        pagosList = response.pagos;
      } else if (response && response.data && Array.isArray(response.data)) {
        pagosList = response.data;
      } else {
        console.log('PagosScreen: Invalid response structure, setting empty array');
        setData([]);
        return;
      }

      console.log('PagosScreen: Pagos list:', pagosList);
      console.log('PagosScreen: Pagos count:', pagosList.length);
      
      // Filtrar solo los pagos del cliente logueado
      let filteredPagos = pagosList;
      
      if (getUserRole() === 'cliente' && user?.id) {
        console.log('PagosScreen: Filtering for cliente with ID:', user.id);
        filteredPagos = pagosList.filter((pago: any) => {
          // Verificar si el pago pertenece al cliente logueado
          const isOwnPago = pago.ventas?.beneficiario?.clienteId === user.id;
          console.log('PagosScreen: Pago item:', pago.ventas?.codigoVenta, 'Is own:', isOwnPago);
          return isOwnPago;
        });
        console.log('PagosScreen: Filtered pagos for cliente:', filteredPagos.length);
      }
      
      // La API devuelve un array directamente, no dentro de una propiedad
      const processedData = filteredPagos.map((pago: any, index: number) => {
        console.log(`PagosScreen: Processing pago ${index + 1}:`, JSON.stringify(pago, null, 2));
        
        // Obtener nombre del beneficiario
        let beneficiarioNombre = 'N/A';
        if (pago.ventas?.beneficiario?.nombre) {
          beneficiarioNombre = `${pago.ventas.beneficiario.nombre} ${pago.ventas.beneficiario.apellido || ''}`;
        }

        const processedPago = {
          codigoVenta: pago.ventas?.codigoVenta || 'N/A',
          beneficiario: beneficiarioNombre,
          metodoPago: pago.metodoPago || 'N/A',
          valorTotal: pago.valor_total ? `$${pago.valor_total.toLocaleString()}` : 'N/A',
          estado: pago.estado || 'N/A',
          fechaPago: pago.fechaPago ? new Date(pago.fechaPago).toLocaleDateString() : 'N/A',
          descripcion: pago.descripcion || 'N/A',
        };

        console.log(`PagosScreen: Processed pago ${index + 1}:`, processedPago);
        return processedPago;
      });

      console.log('PagosScreen: Processed data:', processedData);
      setData(processedData);
    } catch (error) {
      console.error('PagosScreen: Error fetching pagos:', error);
    } finally {
      setLoading(false);
      console.log('PagosScreen: Fetch completed, loading set to false');
    }
  };

  return (
    <View style={styles.container}>
      <CardList
        data={data}
        columns={columns}
        loading={loading}
        searchPlaceholder="Buscar en pagos..."
        emptyMessage={
          getUserRole() === 'cliente' 
            ? "No tienes pagos registrados" 
            : "No hay pagos disponibles"
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

export default PagosScreen;


