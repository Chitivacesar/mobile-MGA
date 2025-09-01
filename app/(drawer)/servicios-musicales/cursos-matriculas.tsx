import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { colors, spacing } from '@/constants/theme';
import CardList from '@/components/CardList';
import { api } from '@/shared/services/api';

const CursosMatriculasScreen = () => {
  const [activeTab, setActiveTab] = useState<'cursos' | 'matriculas'>('cursos');
  const [cursosData, setCursosData] = useState<any[]>([]);
  const [matriculasData, setMatriculasData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('CursosMatriculasScreen: Rendering with activeTab:', activeTab, 'cursos:', cursosData.length, 'matriculas:', matriculasData.length, 'loading:', loading);

  const cursosColumns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'duracion', label: 'Duración' },
    { key: 'precio', label: 'Precio' },
  ];

  const matriculasColumns = [
    { key: 'nombre', label: 'Nombre Matrícula' },
    { key: 'valorMatricula', label: 'Matrícula de valor' },
    { key: 'estado', label: 'Estado' },
  ];

  useEffect(() => {
    console.log('CursosMatriculasScreen: useEffect triggered, fetching data...');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('CursosMatriculasScreen: Starting to fetch data...');
      setLoading(true);
      
      // Obtener cursos
      console.log('CursosMatriculasScreen: Fetching cursos...');
      const cursosResponse = await api.get('/cursos');
      const cursosProcessed = (cursosResponse || []).map((curso: any) => ({
        nombre: curso.nombre || 'N/A',
        descripcion: curso.descripcion || 'N/A',
        duracion: 'Por hora', // Los cursos se cobran por hora
        precio: curso.valor_por_hora ? `$${curso.valor_por_hora.toLocaleString()}` : 'N/A',
      }));
      console.log('CursosMatriculasScreen: Cursos processed:', cursosProcessed);
      setCursosData(cursosProcessed);

      // Obtener matrículas
      console.log('CursosMatriculasScreen: Fetching matriculas...');
      const matriculasResponse = await api.get('/matriculas');
      const matriculasProcessed = (matriculasResponse || []).map((matricula: any) => ({
        nombre: matricula.nombre || 'N/A',
        valorMatricula: matricula.valorMatricula ? `$${matricula.valorMatricula.toLocaleString()}` : 'N/A',
        estado: matricula.estado ? 'Activo' : 'Inactivo',
      }));
      console.log('CursosMatriculasScreen: Matriculas processed:', matriculasProcessed);
      setMatriculasData(matriculasProcessed);
    } catch (error) {
      console.error('CursosMatriculasScreen: Error fetching data:', error);
    } finally {
      setLoading(false);
      console.log('CursosMatriculasScreen: Fetch completed, loading set to false');
    }
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'cursos' && styles.activeTab]}
          onPress={() => setActiveTab('cursos')}
        >
          <Text style={[styles.tabText, activeTab === 'cursos' && styles.activeTabText]}>
            Cursos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'matriculas' && styles.activeTab]}
          onPress={() => setActiveTab('matriculas')}
        >
          <Text style={[styles.tabText, activeTab === 'matriculas' && styles.activeTabText]}>
            Matrículas
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenido de las tabs */}
      {activeTab === 'cursos' ? (
        <CardList
          data={cursosData}
          columns={cursosColumns}
          loading={loading}
          searchPlaceholder="Buscar en cursos..."
          emptyMessage="No hay cursos disponibles"
        />
      ) : (
        <CardList
          data={matriculasData}
          columns={matriculasColumns}
          loading={loading}
          searchPlaceholder="Buscar en matrículas..."
          emptyMessage="No hay matrículas disponibles"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
});

export default CursosMatriculasScreen;


