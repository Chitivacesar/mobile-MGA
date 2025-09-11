import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, radii, shadows } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

interface HorarioProfesor {
  dia: string;
  horaInicio: string;
  horaFin: string;
}

interface HorariosProfesorModalProps {
  visible: boolean;
  onClose: () => void;
  profesor: string;
  horarios: HorarioProfesor[];
}

const HorariosProfesorModal: React.FC<HorariosProfesorModalProps> = ({
  visible,
  onClose,
  profesor,
  horarios
}) => {
  const renderHorario = (horario: HorarioProfesor, index: number) => (
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
            <Text style={styles.modalTitle}>{profesor}</Text>
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

export default HorariosProfesorModal;
