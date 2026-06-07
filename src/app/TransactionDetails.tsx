import ScreenView from "@/components/generic/ScreenView";
import { theme } from "@/constants/theme";
import useTransactionsHandler from "@/hooks/useTransactions.hook";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import ConfirmationModal from "../components/model/confirmationModel.component";
import { useToast } from "../contexts/toast.context";
import useConfirmationModal from "../hooks/useConfirmationModel";
import { clearCurTransaction } from "../redux/slices/transaction";
import {
  formatAmount,
  formatDateLong,
  formatTime12hrs,
  getTypeColor,
  getTypeIcon,
  getTypeLabel,
} from "../utils/common.util";
import { IEventTransaction } from "../utils/interfaces";

const TransactionDetailsScreen: React.FC = () => {
  const { transactionId, eventId } = useLocalSearchParams();
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();
  const curTransaction = useSelector(
    (state: any) => state.curTransaction,
  ) as IEventTransaction;
  const dispatch = useDispatch();
  const { deleteTransaction } = useTransactionsHandler();

  const {
    isVisible,
    config,
    animation,
    showModal,
    handleConfirm,
    handleCancel,
  } = useConfirmationModal();

  if (!curTransaction || curTransaction.id !== transactionId) {
    return (
      <ScreenView>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={64} color={theme.error} />
          <Text style={styles.errorText}>Transaction not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScreenView>
    );
  }

  const handleDeletePress = () => {
    showModal({
      title: "Delete Transaction",
      message:
        "Are you sure you want to delete this transaction? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      iconName: "alert-circle",
      iconColor: theme.error,
      confirmButtonColor: theme.error,
      onConfirm: async () => {
        try {
          await deleteTransaction(transactionId);
          // reset curTransaction state
          dispatch(clearCurTransaction());
          showToast("Transaction deleted successfully!", "success");
          router.back();
        } catch (error) {
          console.log(error);
          showToast("Failed to delete transaction", "error");
        }
      },
    });
  };

  return (
    <ScreenView>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backIcon}
            onPress={() => router.back()}
          >
            <Icon name="arrow-left" size={28} color={theme.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transaction Details</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Transaction Type Badge */}
        <View style={styles.typeBadgeContainer}>
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: getTypeColor(curTransaction.type) + "20" },
            ]}
          >
            <Icon
              name={getTypeIcon(curTransaction.type)}
              size={28}
              color={getTypeColor(curTransaction.type)}
            />
            <Text
              style={[
                styles.typeLabel,
                { color: getTypeColor(curTransaction.type) },
              ]}
            >
              {getTypeLabel(curTransaction.type)}
            </Text>
          </View>
        </View>

        {/* Amount Section */}
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text
            style={[
              styles.amountValue,
              { color: getTypeColor(curTransaction.type) },
            ]}
          >
            {formatAmount(curTransaction.amount)}
          </Text>
        </View>

        {/* Details Cards */}
        <View style={styles.detailsContainer}>
          {/* Date & Time Card */}
          <View style={styles.detailCard}>
            <View style={styles.cardHeader}>
              <Icon name="calendar-clock" size={20} color={theme.info} />
              <Text style={styles.cardTitle}>Date & Time</Text>
            </View>
            <Text style={styles.cardValue}>
              {formatDateLong(curTransaction.date)}
            </Text>
            <Text style={styles.cardSubValue}>
              {formatTime12hrs(curTransaction.date)}
            </Text>
          </View>

          {/* Balance Card */}
          <View style={styles.detailCard}>
            <View style={styles.cardHeader}>
              <Icon name="wallet" size={20} color={theme.secondary} />
              <Text style={styles.cardTitle}>Balance After</Text>
            </View>
            <Text style={[styles.cardValue, { color: theme.info }]}>
              {/* {formatAmount(curTransaction.balanceAmountNow)} */}0
            </Text>
          </View>

          {/* Item Details (if applicable) */}
          {curTransaction.type === "item" && (
            <View style={styles.detailCard}>
              <View style={styles.cardHeader}>
                <Icon name="package-variant" size={20} color={theme.warning} />
                <Text style={styles.cardTitle}>Item Details</Text>
              </View>
              {curTransaction.itemName && (
                <View style={styles.itemDetailRow}>
                  <Text style={styles.itemLabel}>Name:</Text>
                  <Text style={styles.cardValue}>
                    {curTransaction.itemName}
                  </Text>
                </View>
              )}
              {curTransaction.worth && (
                <View style={styles.itemDetailRow}>
                  <Text style={styles.itemLabel}>Worth:</Text>
                  <Text style={[styles.cardValue, { color: theme.warning }]}>
                    {formatAmount(curTransaction.worth)}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Description Card */}
          {curTransaction.description && (
            <View style={styles.detailCard}>
              <View style={styles.cardHeader}>
                <Icon name="text" size={20} color={theme.lightGrey} />
                <Text style={styles.cardTitle}>Description</Text>
              </View>
              <Text style={styles.descriptionText}>
                {curTransaction.description}
              </Text>
            </View>
          )}

          {/* Transaction ID Card */}
          <View style={styles.detailCard}>
            <View style={styles.cardHeader}>
              <Icon name="identifier" size={20} color={theme.lightGrey} />
              <Text style={styles.cardTitle}>Transaction ID</Text>
            </View>
            <Text style={styles.idText}>{curTransaction.id}</Text>
          </View>
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Delete FAB */}
      <TouchableOpacity
        style={[
          styles.deleteFab,
          {
            bottom: insets.bottom + 20,
            backgroundColor: theme.error,
          },
        ]}
        onPress={handleDeletePress}
      >
        <Icon name="delete" size={32} color={theme.text} />
      </TouchableOpacity>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isVisible={isVisible}
        config={config}
        animation={animation}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ScreenView>
  );
};

export default TransactionDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backIcon: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.text,
  },
  placeholder: {
    width: 44,
  },
  typeBadgeContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
    shadowColor: theme.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  typeLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  amountSection: {
    alignItems: "center",
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  amountLabel: {
    fontSize: 14,
    color: theme.lightGrey,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  amountValue: {
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
  },
  detailsContainer: {
    paddingHorizontal: 16,
  },
  detailCard: {
    backgroundColor: theme.darkGrey,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: theme.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.text,
    marginLeft: 8,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.text,
    marginBottom: 4,
  },
  cardSubValue: {
    fontSize: 14,
    color: theme.lightGrey,
  },
  itemDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemLabel: {
    fontSize: 14,
    color: theme.lightGrey,
    fontWeight: "500",
  },
  descriptionText: {
    fontSize: 16,
    color: theme.text,
    lineHeight: 24,
    fontStyle: "italic",
  },
  idText: {
    fontSize: 14,
    color: theme.lightGrey,
    fontFamily: "monospace",
    backgroundColor: theme.primary + "40",
    padding: 8,
    borderRadius: 8,
  },
  bottomSpacer: {
    height: 120,
  },
  deleteFab: {
    position: "absolute",
    right: 20,
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: theme.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    color: theme.error,
    marginTop: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  backButton: {
    backgroundColor: theme.secondary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: theme.text,
    fontWeight: "600",
  },
});
