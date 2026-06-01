import ExpenseEventForm from "@/components/forms/expense-event-form.component";
import ScreenView from "@/components/generic/ScreenView";
import ConfirmationModal from "@/components/model/confirmationModel.component";
import useConfirmationModal from "@/hooks/useConfirmationModel";
import { useTheme } from "@/hooks/useTheme";
import Icon from "@expo/vector-icons/Feather";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../contexts/toast.context";
import { saveCurEvent } from "../redux/slices/event";
import { addEvent, updateEvent } from "../redux/slices/events";
import { generateId } from "../utils/common.util";
import { IExpenseEvent } from "../utils/interfaces";

const CreateEventScreen: React.FC = (): React.JSX.Element => {
  const styles = useStyles();
  const theme = useTheme();
  // Check if we're in edit mode
  const { isEditMode, eventId } = useLocalSearchParams();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const events = useSelector((state: any) => state.events) as IExpenseEvent[];

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof IExpenseEvent, string>>
  >({});
  const [formValues, setFormValues] = useState<IExpenseEvent>({
    id: "",
    title: "",
    startDate: "",
    isMultiDay: false,
    balanceAmount: "0",
    incomingAmount: "0",
    outgoingAmount: "0",
    endDate: "",
    transactions: [],
    open: true,
  });
  const [eventToEdit, setEventToEdit] = useState<IExpenseEvent | null>(null);
  const {
    isVisible,
    config,
    animation,
    showModal,
    handleConfirm,
    handleCancel,
  } = useConfirmationModal();

  const handleChange = (key: keyof IExpenseEvent, value: any) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));

    if (formErrors[key]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const onSubmitCreate = async (newEvent: IExpenseEvent) => {
    dispatch(addEvent(newEvent));
    dispatch(saveCurEvent(newEvent));
    router.replace({
      pathname: "/EventDetails",
      params: { id: newEvent.id },
    });
  };

  const onSubmitUpdate = async (updatedEvent: IExpenseEvent) => {
    dispatch(
      updateEvent({
        id: updatedEvent.id,
        updates: {
          ...eventToEdit,
          ...updatedEvent,
        },
      }),
    );
    dispatch(saveCurEvent(updatedEvent));
    showToast("Event updated successfully", "success");
    router.back();
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof IExpenseEvent, string>> = {};
    const trimmedTitle = formValues.title.trim();

    // Title validation
    if (!trimmedTitle) {
      errors.title = "Event title is required.";
    } else if (trimmedTitle.length > 25) {
      errors.title = "Event title can be at most 25 characters long.";
    } else {
      // Check for duplicate titles (exclude current event in edit mode)
      const existingEvent = events.find(
        (event) => event.title === trimmedTitle && event.id !== formValues.id,
      );
      if (existingEvent) {
        errors.title = "Event title already exists.";
      }
    }

    // Date validation
    if (!formValues.startDate?.trim()) {
      errors.startDate = "Date is required.";
    } else {
      const date = new Date(formValues.startDate);
      if (isNaN(date.getTime())) {
        errors.startDate = "Invalid date.";
      }
    }

    // End date validation for multi-day events
    if (formValues.isMultiDay && formValues.endDate) {
      const startDate = new Date(formValues.startDate);
      const endDate = new Date(formValues.endDate);
      if (isNaN(endDate.getTime())) errors.endDate = "Invalid date.";
      else if (endDate < startDate) {
        errors.endDate = "End date must be after start date.";
      }
    }

    if (Object.keys(errors).length > 0) {
      showToast("Please clear the following errors", "error");
      setFormErrors(errors);
      return false;
    }

    setFormErrors({});
    return true;
  };

  const handleSubmit = () => {
    // Update title with trimmed value
    const updatedFormValues = { ...formValues, title: formValues.title.trim() };
    setFormValues(updatedFormValues);

    if (!validateForm()) {
      return;
    }

    if (isEditMode === "true" && eventToEdit) {
      onSubmitUpdate(updatedFormValues);
    } else {
      const newId = generateId(updatedFormValues.title, 8);
      const newEvent = { ...updatedFormValues, id: newId };
      onSubmitCreate(newEvent);
    }
  };

  const handleCancelPress = () => {
    showModal({
      title: "Cancel",
      message: "Are you sure you want to cancel? All changes will be lost.",
      confirmText: "Yes, Cancel",
      cancelText: "No, Keep Editing",
      iconName: "alert-circle",
      iconColor: theme.warning,
      confirmButtonColor: theme.warning,
      onConfirm: () => {
        router.back();
      },
    });
  };

  // Load event data for edit mode
  useEffect(() => {
    if (isEditMode === "true" && eventId) {
      const eToEdit = events.find((event) => event.id === eventId);
      if (eToEdit) {
        setEventToEdit(eToEdit);
        setFormValues(eToEdit);
      } else {
        showToast("Event not found", "error");
        router.back();
      }
    }
  }, [isEditMode, eventId, events, showToast, router]);

  return (
    <ScreenView>
      <View style={styles.container}>
        <TouchableOpacity
          style={[
            styles.closeFab,
            {
              top: 20,
              left: 20,
              // backgroundColor: theme.info,
            },
          ]}
          onPress={handleCancelPress}
        >
          <Icon name="x" size={30} color={theme.text} />
        </TouchableOpacity>
        <ExpenseEventForm
          showEndDatePicker={showEndDatePicker}
          showStartDatePicker={showStartDatePicker}
          formValues={formValues}
          formErrors={formErrors}
          isEditMode={isEditMode === "true"}
          setShowStartDatePicker={setShowStartDatePicker}
          setShowEndDatePicker={setShowEndDatePicker}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </View>
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

export default CreateEventScreen;

const useStyles = () => {
  const theme = useTheme();

  return React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.primary,
          padding: 16,
          justifyContent: "center",
          alignItems: "center",
        },
        text: {
          fontSize: 20,
          color: theme.text,
        },
        closeFab: {
          position: "absolute",
          width: 60,
          height: 60,
          justifyContent: "center",
          alignItems: "center",
        },
        label: {
          color: theme.text,
          fontSize: 14,
          marginBottom: 4,
          fontWeight: "bold",
        },
      }),
    [theme],
  );
};
