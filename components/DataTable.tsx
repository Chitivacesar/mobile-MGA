import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { colors, spacing, radii, typography, shadows } from '@/constants/theme';

interface Column {
  key: string;
  label: string;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  loading?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  loading = false,
  searchPlaceholder = 'Buscar...',
  emptyMessage = 'No hay datos disponibles'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    
    return data.filter(item => {
      return columns.some(column => {
        const value = item[column.key];
        if (value === null || value === undefined) return false;
        
        if (typeof value === 'object') {
          if (value.nombre) return value.nombre.toLowerCase().includes(searchTerm.toLowerCase());
          if (value.nombres && value.apellidos) {
            const fullName = `${value.nombres} ${value.apellidos}`;
            return fullName.toLowerCase().includes(searchTerm.toLowerCase());
          }
          if (value.nombre && value.apellido) {
            const fullName = `${value.nombre} ${value.apellido}`;
            return fullName.toLowerCase().includes(searchTerm.toLowerCase());
          }
          return false;
        }
        
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm, columns]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  const renderRow = ({ item }: { item: any }) => (
    <View style={styles.row}>
      {columns.map((column, index) => (
        <View key={index} style={styles.cell}>
          <Text style={styles.cellText}>
            {item[column.key] || 'N/A'}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerRow}>
      {columns.map((column, index) => (
        <View key={index} style={styles.headerCell}>
          <Text style={styles.headerText}>{column.label}</Text>
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      {/* Controles de paginación */}
      <View style={styles.paginationContainer}>
        <Text style={styles.rowsLabel}>Filas:</Text>
        <View style={styles.rowsButtons}>
          {[5, 10, 20, 50].map(rows => (
            <Text
              key={rows}
              style={[
                styles.rowsButton,
                rowsPerPage === rows && styles.rowsButtonActive
              ]}
              onPress={() => handleRowsPerPageChange(rows)}
            >
              {rows}
            </Text>
          ))}
        </View>
      </View>

      {/* Tabla */}
      {paginatedData.length > 0 ? (
        <View style={styles.tableContainer}>
          {renderHeader()}
          <FlatList
            data={paginatedData}
            renderItem={renderRow}
            keyExtractor={(item, index) => `row-${index}`}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <View style={styles.paginationControls}>
          <TouchableOpacity
            style={[
              styles.pageButton,
              currentPage === 1 && styles.pageButtonDisabled
            ]}
            onPress={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <Text style={styles.pageButtonText}>Anterior</Text>
          </TouchableOpacity>
          
          <View style={styles.pageNumbers}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <TouchableOpacity
                key={page}
                style={[
                  styles.pageNumber,
                  currentPage === page && styles.pageNumberActive
                ]}
                onPress={() => handlePageChange(page)}
              >
                <Text style={[
                  styles.pageNumberText,
                  currentPage === page && styles.pageNumberTextActive
                ]}>
                  {page}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity
            style={[
              styles.pageButton,
              currentPage === totalPages && styles.pageButtonDisabled
            ]}
            onPress={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <Text style={styles.pageButtonText}>Siguiente</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
    fontSize: 16,
    backgroundColor: colors.white,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowsLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  rowsButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  rowsButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
    backgroundColor: colors.background,
    fontSize: 14,
    color: colors.textSecondary,
  },
  rowsButtonActive: {
    backgroundColor: colors.primary,
    color: colors.white,
  },
  tableContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
  },
  headerCell: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.md,
  },
  cell: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    color: colors.textPrimary,
    fontSize: 14,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  paginationControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  pageButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
    backgroundColor: colors.primary,
  },
  pageButtonDisabled: {
    backgroundColor: colors.disabled,
  },
  pageButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  pageNumbers: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  pageNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageNumberActive: {
    backgroundColor: colors.primary,
  },
  pageNumberText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  pageNumberTextActive: {
    color: colors.white,
  },
});

export default DataTable;


