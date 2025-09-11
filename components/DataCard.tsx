import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, radii, typography, shadows } from '@/constants/theme';

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
    borderRadius: radii.sm, // 8px - Igual a tu web
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border, // #e0e0e0 - Borde exacto de tu web
    ...shadows.elevation[2],
    transform: [{ scale: 1 }],
  },
  selectedCard: {
    borderColor: colors.primary, // #0455a2 - Color primario exacto
    backgroundColor: colors.activeBackground, // rgba(4, 85, 162, 0.1)
    ...shadows.elevation[4], // Sombra con color primario
  },
  pressableCard: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.primary, // #0455a2 - Color primario exacto de tu web
    marginBottom: spacing.sm,
    fontFamily: typography.fontFamily,
  },
  dataContainer: {
    gap: 8,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0', // Líneas más sutiles
  },
  label: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary, // #666666 - Color exacto de tu web
    fontWeight: typography.weights.semibold,
    flex: 1,
    fontFamily: typography.fontFamily,
    marginRight: spacing.xs,
  },
  value: {
    fontSize: typography.sizes.sm,
    color: colors.text, // #333333 - Texto exacto de tu web
    fontWeight: typography.weights.normal,
    flex: 2,
    textAlign: 'right',
    fontFamily: typography.fontFamily,
    flexWrap: 'wrap',
  },
});

export default DataCard;
