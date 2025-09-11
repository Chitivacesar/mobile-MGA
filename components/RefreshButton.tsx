import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, radii } from '@/constants/theme';

interface RefreshButtonProps {
  onPress: () => void;
  loading?: boolean;
  size?: number;
  color?: string;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({
  onPress,
  loading = false,
  size = 24,
  color = colors.primary,
}) => {
  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={onPress}
      disabled={loading}
    >
      <MaterialIcons 
        name="refresh" 
        size={size} 
        color={loading ? colors.textSecondary : color} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: spacing.sm,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
});

export default RefreshButton;
