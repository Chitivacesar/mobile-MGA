import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { colors, spacing, radii, typography, shadows } from '@/constants/theme';
import DataCard from './DataCard';

interface CardListProps {
  data: any[];
  columns: { key: string; label: string }[];
  loading?: boolean;
  emptyMessage?: string;
  onCardPress?: (item: any) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

const CardList: React.FC<CardListProps> = ({
  data,
  columns,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  onCardPress,
  searchTerm = '',
  onSearchChange
}) => {
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

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pageNumbers}
            style={styles.pageNumbersScroll}
          >
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
          </ScrollView>

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
    backgroundColor: colors.background, // #f5f7fa - Fondo exacto de tu web
  },
  listContainer: {
    padding: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  emptyText: {
    fontSize: typography.sizes.lg,
    color: colors.textSecondary, // #666666 - Color exacto de tu web
    textAlign: 'center',
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: '#f5f7fa',
  },
  loadingText: {
    fontSize: 16,
    color: '#555555',
    marginTop: spacing.sm,
    fontFamily: 'System',
  },
  paginationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  pageButton: {
    fontSize: 14,
    color: '#0455a2', // Color primario de la web
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  pageButtonDisabled: {
    color: '#999999',
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
  },
  pageNumbersScroll: {
    flexGrow: 1,
    marginHorizontal: spacing.sm,
  },
  pageNumbers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  pageNumber: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 13,
    color: '#555555',
    fontWeight: '500',
    backgroundColor: colors.surface,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    minWidth: 32,
    textAlign: 'center',
  },
  pageNumberActive: {
    borderColor: '#0455a2',
    color: colors.surface,
    backgroundColor: '#0455a2',
    shadowColor: '#0455a2',
    shadowOpacity: 0.3,
    fontWeight: '600',
  },
});

export default CardList;
