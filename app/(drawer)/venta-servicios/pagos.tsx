import CardList from '@/components/CardList';
import RefreshButton from '@/components/RefreshButton';
import { colors, radii, shadows, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/shared/contexts/AuthContext';
import { Pago, pagosService } from '@/shared/services/pagos';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

const PagosScreen = () => {
  const { user, token, getUserRole } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');


  const columns = getUserRole() === 'beneficiario' ? [
    { key: 'codigoVenta', label: 'Código Venta' },
    { key: 'metodoPago', label: 'Método Pago' },
    { key: 'valorTotal', label: 'Valor Total' },
    { key: 'estado', label: 'Estado' },
    { key: 'fechaPago', label: 'Fecha Pago' },
    { key: 'descripcion', label: 'Descripción' },
  ] : [
    { key: 'codigoVenta', label: 'Código Venta' },
    { key: 'beneficiario', label: 'Beneficiario' },
    { key: 'metodoPago', label: 'Método Pago' },
    { key: 'valorTotal', label: 'Valor Total' },
    { key: 'estado', label: 'Estado' },
    { key: 'fechaPago', label: 'Fecha Pago' },
    { key: 'descripcion', label: 'Descripción' },
  ];

  useEffect(() => {
    console.log('PagosScreen: useEffect triggered, user:', user);
    console.log('PagosScreen: Token en contexto:', token);
    if (user && token) {
      fetchData();
    } else {
      console.log('PagosScreen: No user or token, skipping fetch');
    }
  }, [user, token]);

  const fetchData = async () => {
    try {
      console.log('PagosScreen: Starting to fetch pagos...');
      setLoading(true);

      const pagosData = await pagosService.list();
      console.log('PagosScreen: API response received:', pagosData);

      if (pagosData && Array.isArray(pagosData)) {
        // Filtrar pagos según el rol del usuario logueado
        let filteredPagos = pagosData;
        console.log('PagosScreen: Total de pagos antes del filtro:', pagosData.length);
        console.log('PagosScreen: Rol del usuario:', getUserRole());
        console.log('PagosScreen: Usuario:', user);
        
        if (getUserRole() === 'cliente' && user) {
          // Para clientes, filtrar por ventas relacionadas
          filteredPagos = pagosData.filter((pago: Pago) => {
            // Aquí podrías implementar lógica específica para filtrar por cliente
            // Por ahora mostramos todos los pagos
            return true;
          });
        } else if (getUserRole() === 'beneficiario' && user) {
          // Para beneficiarios, filtrar por ventas relacionadas
          filteredPagos = pagosData.filter((pago: Pago) => {
            // Aquí podrías implementar lógica específica para filtrar por beneficiario
            // Por ahora mostramos todos los pagos
            return true;
          });
        } else {
          console.log('PagosScreen: Usuario admin, mostrando todos los pagos');
        }
        
        console.log('PagosScreen: Pagos finales después del filtro:', filteredPagos.length);
        
        // Procesar datos
        const processedData = filteredPagos.map((pago: Pago | any) => {
          // La API puede retornar la venta relacionada como ventaId | venta | ventas
          const venta = (pago as any).ventaId || (pago as any).venta || (pago as any).ventas || {};
          const beneficiario = venta?.beneficiarioId || venta?.beneficiario;
          const beneficiarioNombre = beneficiario
            ? `${beneficiario.nombre || ''} ${beneficiario.apellido || ''}`.trim() || 'N/A'
            : 'N/A';

          const codigoVenta = venta?.codigoVenta || (typeof (pago as any).codigoVenta === 'string' ? (pago as any).codigoVenta : undefined) || 'N/A';
          const total = typeof venta?.valor_total === 'number' ? venta.valor_total : (typeof (pago as any).monto === 'number' ? (pago as any).monto : undefined);
          const descripcionPago = (pago as any).observaciones || (pago as any).descripcion || venta?.observaciones || 'N/A';

          const basePago = {
            codigoVenta: codigoVenta,
            metodoPago: (pago as any).metodoPago || 'N/A',
            valorTotal: typeof total === 'number' ? `$${total.toLocaleString('es-CO', { minimumFractionDigits: 2 })}` : 'N/A',
            estado: (pago as any).estado || 'N/A',
            fechaPago: (pago as any).fechaPago ? new Date((pago as any).fechaPago).toLocaleDateString('es-CO') : 'N/A',
            descripcion: descripcionPago,
          };

          // Mostrar beneficiario en vista admin/otros roles
          return getUserRole() !== 'beneficiario' ? {
            ...basePago,
            beneficiario: beneficiarioNombre,
          } : basePago;
        });

        console.log('PagosScreen: Datos procesados finales:', processedData);
        setData(processedData);
      } else {
        console.log('PagosScreen: No data received or invalid format');
        setData([]);
      }
    } catch (error: any) {
      console.error('PagosScreen: Error fetching pagos:', error);
      
      // Mostrar mensaje de error más específico
      if (error.message?.includes('Timeout')) {
        console.error('Timeout error - servidor muy lento');
      } else if (error.code === 'ECONNABORTED') {
        console.error('Connection timeout');
      } else {
        console.error('Other error:', error.message);
      }
      
      setData([]);
    } finally {
      setLoading(false);
      console.log('PagosScreen: Fetch completed, loading set to false');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar en pagos..."
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
          getUserRole() === 'cliente' 
            ? "No tienes pagos registrados" 
            : getUserRole() === 'beneficiario'
            ? "No tienes pagos registrados"
            : "No hay pagos disponibles"
        }
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

export default PagosScreen;