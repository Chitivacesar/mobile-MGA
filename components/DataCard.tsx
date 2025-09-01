import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, radii } from '@/constants/theme';

interface DataCardProps {
  title?: string;
  data: Record<string, any>;
  onPress?: () => void;
  isSelected?: boolean;
}

const DataCard: React.FC<DataCardProps> = ({ title, data, onPress, isSelected = false }) => {
  console.log('DataCard: Rendering with', Object.keys(data).length, 'fields, selected:', isSelected);

  const renderValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') {
      if (value.nombre) return value.nombre;
      if (value.nombres && value.apellidos) return `${value.nombres} ${value.apellidos}`;
      if (value.nombre && value.apellido) return `${value.nombre} ${value.apellido}`;
      return JSON.stringify(value);
    }
    return String(value);
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected && styles.selectedCard,
        onPress && styles.pressableCard
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      {title && (
        <Text style={styles.cardTitle}>{title}</Text>
      )}
      
      <View style={styles.dataContainer}>
        {Object.entries(data).map(([key, value]) => (
          <View key={key} style={styles.dataRow}>
            <Text style={styles.label}>{key}:</Text>
            <Text style={styles.value}>{renderValue(value)}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: '#f0f8ff',
  },
  pressableCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  dataContainer: {
    gap: spacing.xs,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '400',
    flex: 2,
    textAlign: 'right',
  },
});

export default DataCard;
