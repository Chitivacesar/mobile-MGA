import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

interface RoleSelectorProps {
  onClose?: () => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onClose }) => {
  const { user, changeRole, getCurrentRoleId } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // Solo mostrar si el usuario tiene más de 2 roles
  if (!user?.todosLosRoles || user.todosLosRoles.length <= 2) {
    return null;
  }

  const currentRoleId = getCurrentRoleId();

  const handleOpen = () => {
    setModalVisible(true);
    if (onClose) onClose();
  };

  const handleClose = () => {
    setModalVisible(false);
    setSelectedRole(null);
  };

  const handleRoleChange = async (roleId: string) => {
    if (roleId === currentRoleId) {
      handleClose();
      return;
    }

    setLoading(true);
    setSelectedRole(roleId);
    
    try {
      const result = await changeRole(roleId);
      if (result.success) {
        handleClose();
        Alert.alert('Éxito', 'Rol cambiado exitosamente');
      } else {
        Alert.alert('Error', result.message || 'Error al cambiar de rol');
      }
    } catch (error) {
      console.error('Error al cambiar rol:', error);
      Alert.alert('Error', 'Error al cambiar de rol');
    } finally {
      setLoading(false);
      setSelectedRole(null);
    }
  };

  const getRoleIcon = (roleName: string) => {
    const role = roleName.toLowerCase().trim();
    
    switch (role) {
      case "profesor":
      case "teacher":
      case "prof":
        return "school";
      case "estudiante":
      case "student":
      case "alumno":
      case "beneficiario":
        return "person";
      case "administrador":
      case "admin":
        return "shield-checkmark";
      case "cliente":
        return "business";
      default:
        return "person-circle";
    }
  };

  const getRoleColor = (roleName: string) => {
    const role = roleName.toLowerCase().trim();
    
    switch (role) {
      case "profesor":
        return "#4CAF50";
      case "beneficiario":
        return "#2196F3";
      case "administrador":
        return "#FF9800";
      case "cliente":
        return "#9C27B0";
      default:
        return "#607D8B";
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={handleOpen}
        style={styles.menuItem}
      >
        <Ionicons name="swap-horizontal" size={20} color="#666" style={styles.menuIcon} />
        <Text style={styles.menuText}>Cambiar Rol</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleClose}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <View style={styles.headerContent}>
                <Ionicons name="swap-horizontal" size={24} color="#007AFF" />
                <Text style={styles.modalTitle}>Cambiar Rol</Text>
              </View>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Selecciona el rol con el que deseas continuar:
            </Text>

            <View style={styles.currentRoleSection}>
              <Text style={styles.currentRoleLabel}>Rol actual:</Text>
              <View style={[styles.currentRoleChip, { backgroundColor: getRoleColor(user.rol?.nombre || '') }]}>
                <Ionicons 
                  name={getRoleIcon(user.rol?.nombre || '')} 
                  size={16} 
                  color="white" 
                  style={styles.roleIcon} 
                />
                <Text style={styles.currentRoleText}>{user.rol?.nombre}</Text>
              </View>
            </View>

                         <ScrollView style={styles.rolesList} showsVerticalScrollIndicator={false}>
               {user.todosLosRoles.map((role: any) => {
                 const isCurrentRole = role.id === currentRoleId;
                 const isSelected = selectedRole === role.id;
                 const isLoading = loading && isSelected;
                
                return (
                  <TouchableOpacity
                    key={role.id}
                    onPress={() => handleRoleChange(role.id)}
                    disabled={loading || isCurrentRole}
                    style={[
                      styles.roleItem,
                      isCurrentRole && styles.currentRoleItem,
                      isSelected && styles.selectedRoleItem
                    ]}
                  >
                    <View style={styles.roleItemContent}>
                      <View style={styles.roleItemLeft}>
                        <Ionicons 
                          name={getRoleIcon(role.nombre)} 
                          size={24} 
                          color={getRoleColor(role.nombre)} 
                        />
                        <View style={styles.roleTextContainer}>
                          <Text style={[styles.roleName, isCurrentRole && styles.currentRoleName]}>
                            {role.nombre}
                          </Text>
                          {role.descripcion && (
                            <Text style={[styles.roleDescription, isCurrentRole && styles.currentRoleDescription]}>
                              {role.descripcion}
                            </Text>
                          )}
                        </View>
                      </View>
                      
                      <View style={styles.roleItemRight}>
                        {isCurrentRole && (
                          <View style={styles.currentBadge}>
                            <Text style={styles.currentBadgeText}>Actual</Text>
                          </View>
                        )}
                        {isLoading && (
                          <ActivityIndicator size="small" color="#007AFF" />
                        )}
                        {!isCurrentRole && !isLoading && (
                          <Ionicons name="chevron-forward" size={20} color="#666" />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>CANCELAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  currentRoleSection: {
    marginBottom: 20,
  },
  currentRoleLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  currentRoleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleIcon: {
    marginRight: 6,
  },
  currentRoleText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  rolesList: {
    marginBottom: 20,
  },
  roleItem: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: 'white',
  },
  currentRoleItem: {
    borderColor: '#007AFF',
    borderWidth: 2,
    backgroundColor: '#F0F8FF',
  },
  selectedRoleItem: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  roleItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  roleItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  roleTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  roleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  currentRoleName: {
    color: '#007AFF',
  },
  roleDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  currentRoleDescription: {
    color: '#007AFF',
  },
  roleItemRight: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  currentBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RoleSelector;
