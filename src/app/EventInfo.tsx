import ScreenView from "@/components/generic/ScreenView";
import { theme } from "@/constants/theme";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import ConfirmationModal from "../components/model/confirmationModel.component";
import { useLoader } from "../contexts/loader.context";
import { useToast } from "../contexts/toast.context";
import useConfirmationModal from "../hooks/useConfirmationModel";
import { clearCurEvent } from "../redux/slices/event";
import { deleteEvent } from "../redux/slices/events";
import { formatAmount, formatDateLong, formatTime } from "../utils/common.util";
import { IExpenseEvent } from "../utils/interfaces";

const EventInfoScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const curEvent = useSelector((state: any) => state.curEvent) as IExpenseEvent;
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { showLoader, hideLoader } = useLoader();

  const {
    isVisible,
    config,
    animation,
    showModal,
    handleConfirm,
    handleCancel,
  } = useConfirmationModal();

  // total donation worth
  const totalWorth = curEvent.transactions
    .filter((txn) => txn.type === "item" && txn.worth)
    .reduce((sum, txn) => sum + Number(txn.worth), 0);

  const handleCopyId = async () => {
    await Clipboard.setStringAsync(curEvent.id);
    Alert.alert("Copied", "Event ID copied to clipboard");
  };

  const handleDeletePress = () => {
    showModal({
      title: "Delete Event",
      message:
        "Are you sure you want to delete this event? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      iconName: "alert-circle",
      iconColor: theme.error,
      confirmButtonColor: theme.error,
      onConfirm: () => {
        showLoader("Deleting event...");
        dispatch(deleteEvent(curEvent.id));
        dispatch(clearCurEvent());
        showToast("Transaction deleted successfully!", "success");
        hideLoader();
        router.dismissAll();
        router.replace("/Home");
      },
    });
  };

  const handleEditPress = () => {
    router.push({
      pathname: "/CreateEvent",
      params: {
        isEditMode: "true",
        eventId: curEvent.id,
      },
    });
  };

  return (
    <ScreenView>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backIcon}
            onPress={() => router.back()}
          >
            <Icon name="arrow-left" size={28} color={theme.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{curEvent.title}</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Event ID */}
        <TouchableOpacity onPress={handleCopyId} style={styles.idCard}>
          <Text style={styles.idLabel}>Event ID</Text>
          <Text style={styles.idValue}>{curEvent.id}</Text>
          <Text style={styles.copyHint}>(Tap to copy)</Text>
        </TouchableOpacity>

        {/* Dates */}
        <View style={styles.dateSection}>
          <Icon name="calendar" size={20} color={theme.info} />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.dateText}>
              {formatDateLong(curEvent.startDate)} (
              {formatTime(curEvent.startDate)})
            </Text>
            {curEvent.isMultiDay && (
              <Text style={styles.dateText}>
                →{" "}
                {curEvent.endDate
                  ? `${formatDateLong(curEvent.endDate)} (${formatTime(
                      curEvent.endDate,
                    )})`
                  : ""}
              </Text>
            )}
          </View>
        </View>

        {/* Balance Section */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <Text style={styles.balanceValue}>
            ₹{formatAmount(curEvent.balanceAmount)}
          </Text>
          <View style={styles.amountRow}>
            <Text style={[styles.amountIn, { color: theme.success }]}>
              +₹{formatAmount(curEvent.incomingAmount)}
            </Text>
            <Text style={[styles.amountOut, { color: theme.error }]}>
              -₹{formatAmount(curEvent.outgoingAmount)}
            </Text>
          </View>
        </View>

        {/* Donations Worth */}
        <View style={styles.donationCard}>
          <Text style={styles.sectionTitle}>Total Donation Worth</Text>
          <Text style={styles.donationValue}>
            ₹{formatAmount(totalWorth.toString())}
          </Text>
        </View>

        {/* Members */}
        <View style={styles.membersSection}>
          <Text style={styles.sectionTitle}>Members</Text>
          {[
            "Alice",
            "Bob",
            "Charlie",
            "Dave",
            "Eve",
            "Frank",
            "Grace",
            "Harry",
            "Ivy",
          ].map((member, idx) => (
            <View key={idx} style={styles.memberRow}>
              <Icon name="account-circle" size={22} color={theme.info} />
              <Text style={styles.memberName}>{member}</Text>
            </View>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Edit FAB */}
      <TouchableOpacity
        style={[
          styles.editFab,
          {
            bottom: insets.bottom + 20,
            backgroundColor: theme.info,
          },
        ]}
        onPress={handleEditPress}
      >
        <Icon name="pencil" size={32} color={theme.text} />
      </TouchableOpacity>

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

export default EventInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  backIcon: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: theme.text,
  },
  placeholder: { width: 44 },
  idCard: {
    backgroundColor: theme.darkGrey,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  idLabel: {
    fontSize: 14,
    color: theme.lightGrey,
    marginBottom: 4,
  },
  idValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.text,
  },
  copyHint: {
    fontSize: 12,
    color: theme.lightGrey,
    marginTop: 4,
    fontStyle: "italic",
  },
  dateSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  dateText: {
    fontSize: 14,
    color: theme.lightGrey,
  },
  balanceCard: {
    backgroundColor: theme.darkGrey,
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 14,
    color: theme.lightGrey,
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: theme.text,
    marginBottom: 8,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  amountIn: {
    fontSize: 16,
    fontWeight: "600",
  },
  amountOut: {
    fontSize: 16,
    fontWeight: "600",
  },
  donationCard: {
    backgroundColor: theme.darkGrey,
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  donationValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.text,
    marginTop: 8,
  },
  membersSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.text,
    marginBottom: 12,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  memberName: {
    marginLeft: 8,
    fontSize: 16,
    color: theme.text,
  },
  bottomSpacer: {
    height: 100,
  },
  editFab: {
    position: "absolute",
    left: 20,
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
});
