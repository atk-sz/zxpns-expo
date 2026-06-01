import { theme } from "@/constants/theme";
import { ConfirmationModalConfig } from "@/hooks/useConfirmationModel";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ConfirmationModalProps {
  isVisible: boolean;
  config: ConfirmationModalConfig | null;
  animation: Animated.Value;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isVisible,
  config,
  animation,
  onConfirm,
  onCancel,
}) => {
  if (!config) return null;

  const {
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    iconName = "alert-circle" as any,
    iconColor = theme.error,
    confirmButtonColor = theme.error,
  } = config;

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [
                {
                  scale: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 1],
                  }),
                },
              ],
              opacity: animation,
            },
          ]}
        >
          <View style={styles.modalHeader}>
            <Icon name={iconName} size={48} color={iconColor} />
            <Text style={styles.modalTitle}>{title}</Text>
          </View>

          <Text style={styles.modalMessage}>{message}</Text>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.confirmButton,
                { backgroundColor: confirmButtonColor },
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: theme.darkGrey,
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 340,
    elevation: 10,
    shadowColor: theme.dark,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.text,
    marginTop: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: theme.lightGrey,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 28,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: theme.lightGrey + "30",
    borderWidth: 1,
    borderColor: theme.lightGrey + "50",
  },
  confirmButton: {
    backgroundColor: theme.error,
  },
  cancelButtonText: {
    color: theme.text,
    fontWeight: "600",
    fontSize: 16,
  },
  confirmButtonText: {
    color: theme.text,
    fontWeight: "600",
    fontSize: 16,
  },
});
