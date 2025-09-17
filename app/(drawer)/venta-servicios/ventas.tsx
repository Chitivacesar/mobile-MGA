import RefreshButton from '@/components/RefreshButton';
import { colors, radii, shadows, spacing, typography } from '@/constants/theme';
import { ventasService } from '@/shared/services/ventas';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const VentasScreen = () => {
  const [ventasAll, setVentasAll] = useState<any[]>([]);
  const [ventasMatriculas, setVentasMatriculas] = useState<any[]>([]);
  const [ventasCursos, setVentasCursos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth()); // 0-11
  const [yearPickerVisible, setYearPickerVisible] = useState(false);
  const [monthPickerVisible, setMonthPickerVisible] = useState(false);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const buildYearOptions = (ventas: any[]) => {
    const yearsSet = new Set<number>();
    ventas.forEach((v: any) => {
      const d = extractDate(v);
      if (d) yearsSet.add(d.getFullYear());
    });
    const years = Array.from(yearsSet).sort((a, b) => b - a);
    setAvailableYears(years.length ? years : [selectedYear]);
  };

  console.log('VentasScreen: Rendering with', ventasMatriculas.length, 'ventas matrículas,', ventasCursos.length, 'ventas cursos, loading:', loading);

  useEffect(() => {
    console.log('VentasScreen: useEffect triggered, fetching data...');
    fetchData();
  }, []);

  const extractDate = (venta: any): Date | null => {
    if (!venta) return null;
    const candidates = [
      // Campo confirmado por ti
      venta.fechaInicio,
      venta.fecha,
      venta.fechaVenta,
      venta.fecha_venta,
      venta.createdAt,
      venta.updatedAt,
      venta.fechaCreacion,
    ];
    for (const c of candidates) {
      if (!c) continue;
      const d = new Date(c);
      if (!isNaN(d.getTime())) return d;
    }
    return null;
  };

  const fetchData = async () => {
    try {
      console.log('VentasScreen: Starting to fetch ventas...');
      setLoading(true);
      
      // Solicitud directa (el servicio ya maneja un timeout amplio)
      const ventasData = await ventasService.list();
      
      console.log('VentasScreen: API response received:', ventasData);
      
      if (ventasData && Array.isArray(ventasData)) {
        setVentasAll(ventasData);
        buildYearOptions(ventasData);
      } else {
        console.log('VentasScreen: No data received or invalid format');
        setVentasAll([]);
        setVentasCursos([]);
        setVentasMatriculas([]);
      }
    } catch (error: any) {
      console.error('VentasScreen: Error fetching ventas:', error);
      
      // Mostrar mensaje de error más específico
      if (error.message?.includes('Timeout')) {
        console.error('Timeout error - servidor muy lento');
      } else if (error.code === 'ECONNABORTED') {
        console.error('Connection timeout');
      } else {
        console.error('Other error:', error.message);
      }
      
      setVentasAll([]);
      setVentasCursos([]);
      setVentasMatriculas([]);
    } finally {
      setLoading(false);
      console.log('VentasScreen: Fetch completed, loading set to false');
    }
  };

  const calcularTotal = (ventas: any[]) => {
    return ventas.reduce((total, venta) => {
      // Usar el campo correcto de la API: valor_total
      const monto = parseFloat(venta.valor_total || 0) || 0;
      console.log('VentasScreen: Processing venta:', venta.codigoVenta, 'valor_total:', monto);
      return total + monto;
    }, 0);
  };

  // Refiltrar en memoria al cambiar periodo
  useEffect(() => {
    if (!ventasAll || ventasAll.length === 0) {
      setVentasCursos([]);
      setVentasMatriculas([]);
      return;
    }
    const isInSelectedPeriod = (venta: any) => {
      const d = extractDate(venta);
      if (!d) return false; // si no hay fecha, excluir del periodo
      return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
    };
    const cursos = ventasAll.filter((v: any) => v.codigoVenta?.startsWith('CU-') && v.estado === 'vigente' && isInSelectedPeriod(v));
    const matriculas = ventasAll.filter((v: any) => v.codigoVenta?.startsWith('MA-') && v.estado === 'vigente' && isInSelectedPeriod(v));
    setVentasCursos(cursos);
    setVentasMatriculas(matriculas);
  }, [ventasAll, selectedYear, selectedMonth]);

  const totalMatriculas = useMemo(() => calcularTotal(ventasMatriculas), [ventasMatriculas]);
  const totalCursos = useMemo(() => calcularTotal(ventasCursos), [ventasCursos]);

  const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  const changeMonth = (delta: number) => {
    const date = new Date(selectedYear, selectedMonth + delta, 1);
    setSelectedYear(date.getFullYear());
    setSelectedMonth(date.getMonth());
  };

  // Solo refiltrar en memoria al cambiar periodo (sin volver a llamar a la API)
  useEffect(() => {
    // no hacer fetch adicional aquí
  }, [selectedYear, selectedMonth]);

  const CardVenta = ({ titulo, total, icono, color, cantidad }: { titulo: string, total: number, icono: string, color: string, cantidad: number }) => (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.cardHeader}>
        <MaterialIcons name={icono as any} size={24} color={color} />
        <Text style={styles.cardTitle}>{titulo}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardAmount}>${total.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</Text>
        <Text style={styles.cardCount}>{cantidad} ventas</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <MaterialIcons name="refresh" size={32} color={colors.primary} />
          <Text style={styles.loadingText}>Cargando ventas...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar en ventas..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor={colors.textSecondary}
          />
          <RefreshButton onPress={fetchData} loading={loading} />
        </View>
        <View style={styles.periodSelector}>
          <TouchableOpacity style={styles.periodButton} onPress={() => changeMonth(-1)}>
            <MaterialIcons name="chevron-left" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMonthPickerVisible(true)}>
            <Text style={styles.periodText}>{monthNames[selectedMonth]}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setYearPickerVisible(true)}>
            <Text style={styles.periodText}>{selectedYear}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.periodButton} onPress={() => changeMonth(1)}>
            <MaterialIcons name="chevron-right" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardsContainer}>
        <CardVenta
          titulo="Ventas de Matrículas"
          total={totalMatriculas}
          icono="school"
          color="#4CAF50"
          cantidad={ventasMatriculas.length}
        />
        
        <CardVenta
          titulo="Ventas de Cursos"
          total={totalCursos}
          icono="book"
          color="#2196F3"
          cantidad={ventasCursos.length}
        />
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <MaterialIcons name="trending-up" size={24} color={colors.primary} />
          <Text style={styles.summaryTitle}>Total General</Text>
        </View>
        <Text style={styles.summaryAmount}>
          ${(totalMatriculas + totalCursos).toLocaleString('es-CO', { minimumFractionDigits: 2 })}
        </Text>
        <Text style={styles.summaryCount}>
          {ventasMatriculas.length + ventasCursos.length} ventas en total
        </Text>
      </View>

      {/* Month Picker */}
      <Modal visible={monthPickerVisible} transparent animationType="fade" onRequestClose={() => setMonthPickerVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona mes</Text>
            <View style={styles.optionsGrid}>
              {monthNames.map((m, idx) => (
                <TouchableOpacity key={m} style={[styles.optionItem, idx===selectedMonth && styles.optionItemActive]} onPress={() => { setSelectedMonth(idx); setMonthPickerVisible(false); }}>
                  <Text style={[styles.optionText, idx===selectedMonth && styles.optionTextActive]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Year Picker */}
      <Modal visible={yearPickerVisible} transparent animationType="fade" onRequestClose={() => setYearPickerVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona año</Text>
            {(() => {
              const yearsSrc = availableYears.length ? availableYears : [selectedYear];
              const minY = Math.max(2000, Math.min(...yearsSrc, selectedYear) - 10);
              const maxY = Math.max(...yearsSrc, selectedYear) + 5;
              const years: number[] = [];
              for (let y = maxY; y >= minY; y--) years.push(y);
              return (
                <ScrollView style={styles.scrollArea} contentContainerStyle={styles.optionsGrid}>
                  {years.map((y) => (
                    <TouchableOpacity key={y} style={[styles.optionItem, y===selectedYear && styles.optionItemActive]} onPress={() => { setSelectedYear(y); setYearPickerVisible(false); }}>
                      <Text style={[styles.optionText, y===selectedYear && styles.optionTextActive]}>{y}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              );
            })()}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
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
  periodSelector: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  periodButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  periodText: {
    fontSize: typography.sizes.md,
    color: colors.text,
    fontWeight: typography.weights.semibold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 360,
    ...shadows.elevation[4],
  },
  scrollArea: {
    maxHeight: 320,
  },
  modalTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  optionItem: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionItemActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    color: colors.text,
    fontSize: typography.sizes.md,
  },
  optionTextActive: {
    color: colors.white,
    fontWeight: typography.weights.semibold,
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
  cardsContainer: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.lg,
    borderLeftWidth: 4,
    ...shadows.elevation[2],
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  cardContent: {
    alignItems: 'flex-start',
  },
  cardAmount: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  cardCount: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  summaryCard: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    padding: spacing.lg,
    margin: spacing.lg,
    alignItems: 'center',
    ...shadows.elevation[4],
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  summaryTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.white,
    marginLeft: spacing.sm,
  },
  summaryAmount: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  summaryCount: {
    fontSize: typography.sizes.md,
    color: colors.white,
    opacity: 0.9,
  },
});

export default VentasScreen;
