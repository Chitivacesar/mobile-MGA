import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, radii, shadows } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

interface Horario {
  dia: string;
  horaInicio: string;
  horaFin: string;
  aula: string;
  profesor: string;
  beneficiarios: string[];
}

interface HorariosModalProps {
  visible: boolean;
  onClose: () => void;
  curso: string;
  horarios: Horario[];
}

const HorariosModal: React.FC<HorariosModalProps> = ({
  visible,
  onClose,
  curso,
  horarios
}) => {
  const renderHorario = (horario: Horario, index: number) => (
    <View key={index} style={styles.horarioCard}>
      <View style={styles.horarioHeader}>
        <View style={styles.diaContainer}>
          <MaterialIcons name="schedule" size={20} color={colors.primary} />
          <Text style={styles.diaText}>{horario.dia}</Text>
        </View>
        <View style={styles.horaContainer}>
          <Text style={styles.horaText}>
            {horario.horaInicio} - {horario.horaFin}
          </Text>
        </View>
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <MaterialIcons name="room" size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>Aula: {horario.aula}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <MaterialIcons name="person" size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>Profesor: {horario.profesor}</Text>
        </View>
        
        <View style={styles.beneficiariosContainer}>
          <MaterialIcons name="group" size={16} color={colors.textSecondary} />
          <View style={styles.beneficiariosList}>
            {horario.beneficiarios.map((beneficiario, idx) => (
              <Text key={idx} style={styles.beneficiarioText}>
                • {beneficiario}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{curso}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialIcons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {horarios.length > 0 ? (
              horarios.map((horario, index) => renderHorario(horario, index))
            ) : (
              <View style={styles.emptyContainer}>
                <MaterialIcons name="schedule" size={48} color={colors.textSecondary} />
                <Text style={styles.emptyText}>No hay horarios disponibles</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    width: '90%',
    maxHeight: '80%',
    ...shadows.elevation[8],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    flex: 1,
  },
  closeButton: {
    padding: spacing.sm,
    borderRadius: radii.sm,
    backgroundColor: colors.background,
  },
  modalContent: {
    padding: spacing.lg,
  },
  horarioCard: {
    backgroundColor: colors.background,
    borderRadius: radii.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    ...shadows.elevation[2],
  },
  horarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  diaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  diaText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  horaContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
  },
  horaText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.white,
  },
  detailsContainer: {
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
  },
  beneficiariosContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  beneficiariosList: {
    flex: 1,
  },
  beneficiarioText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});

export default HorariosModal;
