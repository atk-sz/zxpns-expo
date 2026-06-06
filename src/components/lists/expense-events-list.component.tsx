import { Spacing, theme } from "@/constants/theme";
import useConfirmationModal from "@/hooks/useConfirmationModel";
import useEventsHandler from "@/hooks/useEvents.hook";
import Icon from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { useLoader } from "../../contexts/loader.context";
import { useToast } from "../../contexts/toast.context";
import { saveCurEvent } from "../../redux/slices/event";
import { IExpenseEvent } from "../../utils/interfaces";
import ExpenseItemComponent from "../list-items/ExpenseItem.component";
import ConfirmationModal from "../model/confirmationModel.component";

type IExpenseEventsListProps = {
  expenses: IExpenseEvent[];
};

const ExpenseEventsList: React.FC<IExpenseEventsListProps> = ({ expenses }) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { showLoader, hideLoader } = useLoader();
  const { removeEventById } = useEventsHandler();

  const {
    isVisible,
    config,
    animation,
    showModal,
    handleConfirm,
    handleCancel,
  } = useConfirmationModal();

  const handleDeleteEvent = (eventId: string) => {
    showModal({
      title: "Delete Event",
      message:
        "Are you sure you want to delete this Event? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      iconName: "alert-circle",
      iconColor: theme.error,
      confirmButtonColor: theme.error,
      onConfirm: async () => {
        try {
          showLoader("Deleting event...");
          await removeEventById(eventId);
          hideLoader();
          showToast("Event deleted successfully!", "success");
        } catch (error) {
          console.log(error);
          showToast("Failed to delete event", "error");
        }
      },
    });
  };

  const handleEditEvent = (eventId: string) => {
    router.push({
      pathname: "/CreateEvent",
      params: { isEditMode: "true", eventId },
    });
  };

  const onEventPress = (item: IExpenseEvent) => {
    const foundEvent = expenses.find((e) => e.id === item.id);
    if (!foundEvent) return;
    dispatch(saveCurEvent(foundEvent));
    router.push({
      pathname: "/EventDetails",
      params: { id: item.id },
    });
  };

  const renderExpenseItem = ({ item }: { item: IExpenseEvent }) => (
    <ExpenseItemComponent
      item={item}
      onEventPress={onEventPress}
      handleDeleteEvent={handleDeleteEvent}
      handleEditEvent={handleEditEvent}
    />
  );

  const onPressCreateEvent = () => {
    router.navigate("/CreateEvent");
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerContainer}>
        <Image
          source={require("../../../assets/images/logo.png")}
          style={styles.logo}
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.titleText}>Zxpense</Text>
          <Text style={styles.subtitleText}>
            Manage events & track expenses
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.actionBtn} onPress={onPressCreateEvent}>
        <Icon name="add" size={20} color={theme.text} />
        <Text style={styles.actionBtnText}>Create New Event</Text>
      </TouchableOpacity>
      <Text style={styles.listTitle}>Your Events</Text>
      {expenses.length === 0 ? (
        <Text style={styles.emptyMessage}>
          You don't have any events yet! 😒😢
        </Text>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={renderExpenseItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <ConfirmationModal
        isVisible={isVisible}
        config={config}
        animation={animation}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </View>
  );
};

export default ExpenseEventsList;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.text,
    marginBottom: 12,
    paddingHorizontal: 0,
  },
  listContainer: {
    paddingHorizontal: 0,
    paddingBottom: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.three,
    gap: Spacing.two,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  headerTextContainer: {
    flex: 1,
  },
  titleText: {
    color: theme.text,
    fontSize: 20,
    fontWeight: "700",
  },
  subtitleText: {
    color: theme.lightGrey,
    fontSize: 13,
    marginTop: 2,
  },
  actionBtn: {
    backgroundColor: theme.secondary,
    padding: 14,
    borderRadius: 12,
    marginBottom: Spacing.three,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  actionBtnText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },
  emptyMessage: {
    textAlign: "center",
    color: theme.text,
    fontSize: 16,
    marginTop: 24,
  },
});
