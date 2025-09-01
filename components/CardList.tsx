import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { colors, spacing, radii } from '@/constants/theme';
import DataCard from './DataCard';

interface CardListProps {
  data: any[];
  columns: { key: string; label: string }[];
  loading?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  onCardPress?: (item: any) => void;
}

const CardList: React.FC<CardListProps> = ({
  data,
  columns,
  loading = false,
  searchPlaceholder = 'Buscar...',
  emptyMessage = 'No hay datos disponibles',
  onCardPress
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  console.log('CardList: Rendering with', data.length, 'items, loading:', loading);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    
    const filtered = data.filter(item => {
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
    
    console.log('CardList: Filtered data from', data.length, 'to', filtered.length, 'items');
    return filtered;
  }, [data, searchTerm, columns]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginated = filteredData.slice(startIndex, startIndex + rowsPerPage);
    console.log('CardList: Paginated data from', filteredData.length, 'to', paginated.length, 'items (page', currentPage, ')');
    return paginated;
  }, [filteredData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handlePageChange = (page: number) => {
    console.log('CardList: Changing to page', page);
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (rows: number) => {
    console.log('CardList: Changing rows per page to', rows);
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  const renderCard = ({ item }: { item: any }) => {
    const cardData: Record<string, any> = {};
    
    columns.forEach(column => {
      cardData[column.label] = item[column.key];
    });

    return (
      <DataCard
        data={cardData}
        onPress={onCardPress ? () => onCardPress(item) : undefined}
      />
    );
  };

  if (loading) {
    console.log('CardList: Showing loading state');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </View>
    );
  }

  console.log('CardList: Rendering data view with', paginatedData.length, 'items, total pages:', totalPages);

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

      {/* Lista de tarjetas */}
      {paginatedData.length > 0 ? (
        <FlatList
          data={paginatedData}
          renderItem={renderCard}
          keyExtractor={(item, index) => `card-${index}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <View style={styles.paginationControls}>
          <Text
            style={[
              styles.pageButton,
              currentPage === 1 && styles.pageButtonDisabled
            ]}
            onPress={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          >
            Anterior
          </Text>
          
          <View style={styles.pageNumbers}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Text
                key={page}
                style={[
                  styles.pageNumber,
                  currentPage === page && styles.pageNumberActive
                ]}
                onPress={() => handlePageChange(page)}
              >
                {page}
              </Text>
            ))}
          </View>
          
          <Text
            style={[
              styles.pageButton,
              currentPage === totalPages && styles.pageButtonDisabled
            ]}
            onPress={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
          >
            Siguiente
          </Text>
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
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInput: {
    backgroundColor: colors.backgroundSecondary || '#f5f5f5',
    borderRadius: radii.sm,
    padding: spacing.sm,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textPrimary,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowsLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  rowsButtons: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  rowsButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.xs,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  rowsButtonActive: {
    borderColor: colors.primary,
    color: colors.primary,
    backgroundColor: colors.primaryLight || '#f0f8ff',
  },
  listContainer: {
    padding: spacing.md,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  paginationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  pageButton: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  pageButtonDisabled: {
    color: colors.disabled,
  },
  pageNumbers: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  pageNumber: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.xs,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  pageNumberActive: {
    borderColor: colors.primary,
    color: colors.primary,
    backgroundColor: colors.primaryLight || '#f0f8ff',
  },
});

export default CardList;
