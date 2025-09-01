import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import CardList from '@/components/CardList';
import { api } from '@/shared/services/api';
import { useAuth } from '@/shared/contexts/AuthContext';

const BeneficiariosScreen = () => {
  const { user, getUserRole } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('BeneficiariosScreen: Rendering with', data.length, 'beneficiarios, loading:', loading);
  console.log('BeneficiariosScreen: Current user:', user?.nombre, 'Role:', getUserRole());

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'apellido', label: 'Apellido' },
    { key: 'tipoDocumento', label: 'Tipo Doc' },
    { key: 'numeroDocumento', label: 'N° Documento' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'direccion', label: 'Dirección' },
  ];

  useEffect(() => {
    console.log('BeneficiariosScreen: useEffect triggered, fetching data...');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('BeneficiariosScreen: Starting to fetch beneficiarios...');
      setLoading(true);
      const response = await api.get('/beneficiarios');
      
      console.log('BeneficiariosScreen: API response received:', response);
      
      // Filtrar solo los beneficiarios del cliente logueado
      let filteredBeneficiarios = response || [];
      
      if (getUserRole() === 'cliente' && user?.id) {
        console.log('BeneficiariosScreen: Filtering for cliente with ID:', user.id);
        filteredBeneficiarios = (response || []).filter((beneficiario: any) => {
          // Verificar si el beneficiario pertenece al cliente logueado
          const isOwnBeneficiario = beneficiario.clienteId === user.id;
          console.log('BeneficiariosScreen: Beneficiario item:', beneficiario.nombre, 'Is own:', isOwnBeneficiario);
          return isOwnBeneficiario;
        });
        console.log('BeneficiariosScreen: Filtered beneficiarios for cliente:', filteredBeneficiarios.length);
      }
      
      const processedData = filteredBeneficiarios.map((beneficiario: any) => ({
        nombre: beneficiario.nombre || 'N/A',
        apellido: beneficiario.apellido || 'N/A',
        tipoDocumento: beneficiario.tipo_de_documento || 'N/A',
        numeroDocumento: beneficiario.numero_de_documento || 'N/A',
        telefono: beneficiario.telefono || 'N/A',
        direccion: beneficiario.direccion || 'N/A',
      }));
      
      console.log('BeneficiariosScreen: Processed data:', processedData);
      setData(processedData);
    } catch (error) {
      console.error('BeneficiariosScreen: Error fetching beneficiarios:', error);
    } finally {
      setLoading(false);
      console.log('BeneficiariosScreen: Fetch completed, loading set to false');
    }
  };

  return (
    <View style={styles.container}>
      <CardList
        data={data}
        columns={columns}
        loading={loading}
        searchPlaceholder="Buscar en beneficiarios..."
        emptyMessage={
          getUserRole() === 'cliente' 
            ? "No tienes beneficiarios registrados" 
            : "No hay beneficiarios disponibles"
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

export default BeneficiariosScreen;


