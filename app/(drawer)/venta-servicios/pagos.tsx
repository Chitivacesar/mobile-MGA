import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { colors, spacing, typography, radii, shadows } from '@/constants/theme';
import CardList from '@/components/CardList';
import RefreshButton from '@/components/RefreshButton';
import { api } from '@/shared/services/api';
import { useAuth } from '@/shared/contexts/AuthContext';

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
      setLoading(true);
      console.log('PagosScreen: Iniciando fetch de pagos...');
      console.log('PagosScreen: Usuario actual:', user);
      console.log('PagosScreen: Token del contexto:', token);
      console.log('PagosScreen: Token en API service:', (api as any).token);
      
      // Verificar si el token está configurado en axios
      const axios = require('axios');
      console.log('PagosScreen: Headers de axios global:', axios.defaults.headers.common);
      
      const response = await api.get('/pagos');
      console.log('PagosScreen: Respuesta completa de la API:', response);
      
      // Validar estructura de respuesta
      let pagosList;
      if (Array.isArray(response)) {
        pagosList = response;
        console.log('PagosScreen: Respuesta es array directo, pagosList:', pagosList);
      } else if (response && response.pagos && Array.isArray(response.pagos)) {
        pagosList = response.pagos;
        console.log('PagosScreen: Respuesta tiene propiedad pagos, pagosList:', pagosList);
      } else if (response && response.data && Array.isArray(response.data)) {
        pagosList = response.data;
        console.log('PagosScreen: Respuesta tiene propiedad data, pagosList:', pagosList);
      } else {
        console.log('PagosScreen: No se pudo extraer lista de pagos de la respuesta:', response);
        setData([]);
        return;
      }
      
      // Filtrar pagos según el rol del usuario logueado
      let filteredPagos = pagosList;
      console.log('PagosScreen: Total de pagos antes del filtro:', pagosList.length);
      console.log('PagosScreen: Rol del usuario:', getUserRole());
      console.log('PagosScreen: Usuario:', user);
      
      if (getUserRole() === 'cliente' && user) {
        filteredPagos = pagosList.filter((pago: any) => {
          const beneficiarioData = pago.ventas?.beneficiario;
          
          if (!beneficiarioData) {
            return false;
          }
          
          // Verificar el clienteId del beneficiario
          const clienteId = beneficiarioData.clienteId;
          const clienteData = beneficiarioData.cliente;
          
          // Criterio 1: clienteId directo
          if (clienteId && (
            clienteId === user.id || 
            clienteId.toString() === user.id.toString() ||
            clienteId === user.id.toString() ||
            clienteId.toString() === user.id
          )) {
            return true;
          }
          
          // Criterio 2: cliente object comparison
          if (clienteData) {
            const clienteMatchesId = clienteData._id === user.id || clienteData.id === user.id;
            const clienteMatchesName = (clienteData.nombre === user.nombre && clienteData.apellido === user.apellido);
            const clienteMatchesEmail = clienteData.correo === user.correo || clienteData.email === user.correo;
            
            if (clienteMatchesId || clienteMatchesName || clienteMatchesEmail) {
              return true;
            }
          }
          
          return false;
        });
      } else if (getUserRole() === 'beneficiario' && user) {
        filteredPagos = pagosList.filter((pago: any) => {
          const beneficiarioData = pago.ventas?.beneficiario;
          
          if (!beneficiarioData) {
            return false;
          }
          
          // Múltiples criterios de comparación
          const matchesId = beneficiarioData._id === user.id || beneficiarioData.id === user.id;
          const matchesEmail = beneficiarioData.correo === user.correo || beneficiarioData.email === user.correo;
          const matchesDocument = beneficiarioData.numero_de_documento === (user as any).numeroDocumento;
          const matchesName = (beneficiarioData.nombre === user.nombre && beneficiarioData.apellido === user.apellido);
          
          return matchesId || matchesEmail || matchesDocument || matchesName;
        });
        console.log('PagosScreen: Pagos filtrados para cliente:', filteredPagos.length);
      } else if (getUserRole() === 'beneficiario' && user) {
        filteredPagos = pagosList.filter((pago: any) => {
          const beneficiarioData = pago.ventas?.beneficiario;
          
          if (!beneficiarioData) {
            return false;
          }
          
          // Múltiples criterios de comparación
          const matchesId = beneficiarioData._id === user.id || beneficiarioData.id === user.id;
          const matchesEmail = beneficiarioData.correo === user.correo || beneficiarioData.email === user.correo;
          const matchesDocument = beneficiarioData.numero_de_documento === (user as any).numeroDocumento;
          const matchesName = (beneficiarioData.nombre === user.nombre && beneficiarioData.apellido === user.apellido);
          
          return matchesId || matchesEmail || matchesDocument || matchesName;
        });
        console.log('PagosScreen: Pagos filtrados para beneficiario:', filteredPagos.length);
      } else {
        console.log('PagosScreen: Usuario admin, mostrando todos los pagos');
      }
      
      console.log('PagosScreen: Pagos finales después del filtro:', filteredPagos.length);
      
      // Procesar datos
      const processedData = filteredPagos.map((pago: any) => {
        // Obtener nombre del beneficiario
        let beneficiarioNombre = 'N/A';
        if (pago.ventas?.beneficiario?.nombre) {
          beneficiarioNombre = `${pago.ventas.beneficiario.nombre} ${pago.ventas.beneficiario.apellido || ''}`;
        }

        const basePago = {
          codigoVenta: pago.ventas?.codigoVenta || 'N/A',
          metodoPago: pago.metodoPago || 'N/A',
          valorTotal: pago.valor_total ? `$${pago.valor_total.toLocaleString()}` : 'N/A',
          estado: pago.estado || 'N/A',
          fechaPago: pago.fechaPago ? new Date(pago.fechaPago).toLocaleDateString() : 'N/A',
          descripcion: pago.descripcion || 'N/A',
        };
        
        // Solo agregar beneficiario si no es beneficiario logueado
        return getUserRole() !== 'beneficiario' ? {
          ...basePago,
          beneficiario: beneficiarioNombre,
        } : basePago;
      });

      console.log('PagosScreen: Datos procesados finales:', processedData);
      setData(processedData);
    } catch (error) {
      console.error('PagosScreen: Error fetching pagos:', error);
    } finally {
      setLoading(false);
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