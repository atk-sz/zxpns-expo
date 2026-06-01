import { useTheme } from "@/hooks/useTheme";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { generateId, getTypeColor, getTypeIcon } from "../../utils/common.util";
import { IEventTransaction } from "../../utils/interfaces";
import ToastComponent from "../toast/toast.component";

interface IEventTransactionFormProps {
  visible: boolean;
  eventId: string;
  onClose: () => void;
  onSubmit: (transaction: IEventTransaction) => void;
}

const EventTransactionForm: React.FC<IEventTransactionFormProps> = ({
  visible,
  eventId,
  onClose,
  onSubmit,
}) => {
  const styles = useStyles();
  const theme = useTheme();
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof IEventTransaction, string>>
  >({});

  // Date/Time picker states
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Helper functions for date and time formatting
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const formatDateTime = (date: Date) => {
    return `${formatDate(date)}T${formatTime(date)}`;
  };

  const [formValues, setFormValues] = useState<IEventTransaction>({
    id: "",
    amount: "",
    type: "incoming",
    balanceAmountNow: "",
    description: "",
    date: formatDateTime(new Date()),
    eventId: eventId,
    worth: "",
    itemName: "",
  });

  const handleChange = (key: keyof IEventTransaction, value: any) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));

    // Clear the error for this field when user starts typing
    if (formErrors[key]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (event.type === "set" && date) {
      // Keep the same time, only update the date part
      const currentDateTime = new Date(selectedDate);
      const newDateTime = new Date(date);
      newDateTime.setHours(currentDateTime.getHours());
      newDateTime.setMinutes(currentDateTime.getMinutes());

      setSelectedDate(newDateTime);
      setFormValues((prev) => ({ ...prev, date: formatDateTime(newDateTime) }));

      // Clear date error when date is changed
      if (formErrors.date) {
        setFormErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.date;
          return newErrors;
        });
      }
    }
  };

  const onTimeChange = (event: DateTimePickerEvent, time?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (event.type === "set" && time) {
      // Keep the same date, only update the time part
      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(time.getHours());
      newDateTime.setMinutes(time.getMinutes());

      setSelectedDate(newDateTime);
      setFormValues((prev) => ({ ...prev, date: formatDateTime(newDateTime) }));

      // Clear date error when time is changed
      if (formErrors.date) {
        setFormErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.date;
          return newErrors;
        });
      }
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const showTimePickerModal = () => {
    setShowTimePicker(true);
  };

  const resetForm = () => {
    const newDate = new Date();
    setSelectedDate(newDate);
    setFormValues({
      id: "",
      amount: "",
      type: "incoming",
      description: "",
      date: formatDateTime(newDate),
      balanceAmountNow: "",
      eventId: eventId,
      worth: "",
      itemName: "",
    });
    setFormErrors({});
    setShowErrorToast(false);
  };

  const handleSubmit = () => {
    const errors: Partial<Record<keyof IEventTransaction, string>> = {};

    if (formValues.type === "item") {
      formValues.itemName = formValues.itemName?.trim() || "";
      formValues.worth = formValues.worth?.trim() || "";
      if (!formValues.itemName) {
        errors.itemName = "Item name is required";
      }
      if (formValues.itemName.length > 25) {
        errors.itemName = "Item name can be at most 25 characters long";
      }
      if (!formValues.worth) {
        errors.worth = "Item value(worth) in amount(approx) is required";
      }
      // formValues.worth must be a number & greater than 0 & less than 9999999999
      const worthNum = Number(formValues.worth);
      if (isNaN(worthNum)) {
        errors.worth = "Item value(worth) must be a number";
      } else if (worthNum <= 0) {
        errors.worth = "Item value(worth) must be greater than 0";
      } else if (worthNum > 9999999999) {
        errors.worth = "Item value(worth) must be less than 9999999999";
      }
      formValues.amount = "0";
    }

    formValues.amount = formValues.amount?.trim() || "";
    if (!formValues.amount) {
      errors.amount = "Amount is required";
    } else if (formValues.type !== "item") {
      const amountNum = Number(formValues.amount);
      if (isNaN(amountNum)) {
        errors.amount = "Amount must be a number";
      } else if (amountNum <= 0) {
        errors.amount = "Amount must be greater than 0";
      } else if (amountNum > 9999999999) {
        errors.amount = "Amount must be less than 9999999999";
      }
    }

    // Validate date & time
    if (isNaN(selectedDate.getTime())) {
      errors.date = "Please enter a valid date & time";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setShowErrorToast(true);
      return;
    }

    // Generate new ID and submit
    const newId = generateId();
    const transactionToSubmit = {
      ...formValues,
      description: formValues.description.trim(),
      id: newId,
    };

    onSubmit(transactionToSubmit);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      {showErrorToast && (
        <ToastComponent
          message="Please fill all required fields."
          type="error"
        />
      )}
      <View style={styles.overlay}>
        <ScrollView
          style={styles.formContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.formTitle}>ADD TRANSACTION</Text>
          <Text style={[styles.text, { marginBottom: 10, fontWeight: "bold" }]}>
            Event: {formValues.eventId}
          </Text>

          {/* Transaction Type Selection */}
          <View style={styles.formComponentContainer}>
            <Text style={styles.label}>Transaction Type *</Text>
            <View style={styles.typeButtonsContainer}>
              {(["incoming", "outgoing", "item"] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    {
                      backgroundColor:
                        formValues.type === type
                          ? getTypeColor(type)
                          : theme.grey + "40",
                      borderColor:
                        formValues.type === type
                          ? getTypeColor(type)
                          : theme.grey,
                    },
                  ]}
                  onPress={() => handleChange("type", type)}
                >
                  <Icon
                    name={getTypeIcon(type)}
                    size={20}
                    color={formValues.type === type ? theme.text : theme.grey}
                  />
                  <Text
                    style={[
                      styles.typeButtonText,
                      {
                        color:
                          formValues.type === type ? theme.text : theme.grey,
                        fontWeight:
                          formValues.type === type ? "bold" : "normal",
                      },
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Item Name (only for 'item' type) */}
          {formValues.type === "item" && (
            <View style={styles.formComponentContainer}>
              <Text style={styles.label}>Item Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter item name"
                placeholderTextColor={theme.grey}
                value={formValues.itemName}
                onChangeText={(val) => handleChange("itemName", val)}
                maxLength={25}
              />
              <Text style={styles.errorText}>{formErrors.itemName ?? " "}</Text>
            </View>
          )}

          {/* Amount (only for non-item types) */}
          {formValues.type !== "item" && (
            <View style={styles.formComponentContainer}>
              <Text style={styles.label}>Amount *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                keyboardType="decimal-pad"
                placeholderTextColor={theme.grey}
                value={formValues.amount}
                onChangeText={(val) => {
                  const cleaned = val.replace(/[^0-9.]/g, "");
                  handleChange("amount", cleaned);
                }}
              />
              <Text style={styles.errorText}>{formErrors.amount ?? " "}</Text>
            </View>
          )}

          {/* Worth (only for 'item' type) */}
          {formValues.type === "item" && (
            <View style={styles.formComponentContainer}>
              <Text style={styles.label}>Worth *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter worth"
                keyboardType="decimal-pad"
                placeholderTextColor={theme.grey}
                value={formValues.worth}
                onChangeText={(val) => {
                  const cleaned = val.replace(/[^0-9.]/g, "");
                  handleChange("worth", cleaned);
                }}
              />
              <Text style={styles.errorText}>{formErrors.worth ?? " "}</Text>
            </View>
          )}

          {/* Date & Time Pickers */}
          <View style={styles.formComponentContainer}>
            <Text style={styles.label}>Date & Time *</Text>
            <View style={styles.dateTimeContainer}>
              <TouchableOpacity
                style={[styles.dateTimeButton, { width: "70%" }]}
                onPress={showDatePickerModal}
              >
                <View style={styles.dateTimeButtonContent}>
                  <Icon name="calendar" size={20} color={theme.secondary} />
                  <Text style={styles.dateTimeButtonText}>
                    {formatDate(selectedDate)}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.dateTimeButton, { width: "28%" }]}
                onPress={showTimePickerModal}
              >
                <View style={styles.dateTimeButtonContent}>
                  <Icon name="clock" size={20} color={theme.secondary} />
                  <Text style={styles.dateTimeButtonText}>
                    {formatTime(selectedDate)}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <Text style={styles.errorText}>{formErrors.date ?? " "}</Text>
          </View>

          {/* Description */}
          <View style={styles.formComponentContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter description"
              placeholderTextColor={theme.grey}
              value={formValues.description}
              onChangeText={(val) =>
                handleChange(
                  "description",
                  val.length <= 1000 ? val : formValues.description,
                )
              }
              multiline
              numberOfLines={3}
              maxLength={1000}
            />
            <Text style={styles.errorText}>
              {formErrors.description ?? " "}
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.cancelBtn]}
              onPress={handleClose}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.submitBtn]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitText}>Add</Text>
            </TouchableOpacity>
          </View>

          {/* Add some bottom padding for better scrolling */}
          <View style={{ height: 30 }} />
        </ScrollView>
      </View>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onTimeChange}
        />
      )}
    </Modal>
  );
};

export default EventTransactionForm;

const useStyles = () => {
  const theme = useTheme();

  return React.useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        },
        formContainer: {
          backgroundColor: theme.primary,
          borderRadius: 10,
          padding: 16,
          width: "90%",
          maxHeight: "80%",
        },
        formTitle: {
          fontSize: 20,
          fontWeight: "bold",
          color: theme.text,
          textAlign: "center",
          textTransform: "uppercase",
          marginBottom: 16,
        },
        text: {
          fontSize: 16,
          color: theme.text,
        },
        formComponentContainer: {
          marginBottom: 16,
        },
        label: {
          color: theme.text,
          fontSize: 14,
          marginBottom: 4,
          fontWeight: "bold",
        },
        input: {
          backgroundColor: theme.white,
          color: theme.dark,
          padding: 12,
          borderRadius: 8,
          marginBottom: 4,
        },
        textArea: {
          minHeight: 80,
          textAlignVertical: "top",
        },
        errorText: {
          color: theme.error,
          fontSize: 12,
          marginTop: 2,
          minHeight: 16,
        },
        dateTimeContainer: {
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 8,
        },
        dateTimeButton: {
          backgroundColor: theme.white,
          borderRadius: 8,
          padding: 12,
          minHeight: 48,
          justifyContent: "center",
        },
        dateTimeButtonContent: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        },
        dateTimeButtonText: {
          color: theme.dark,
          fontSize: 14,
          fontWeight: "500",
        },
        typeButtonsContainer: {
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 8,
        },
        typeButton: {
          flex: 1,
          padding: 10,
          borderRadius: 8,
          borderWidth: 2,
          alignItems: "center",
          justifyContent: "center",
          minHeight: 55,
        },
        typeButtonText: {
          fontSize: 11,
          marginTop: 4,
          textAlign: "center",
        },
        buttonRow: {
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 12,
        },
        actionBtn: {
          flex: 1,
          padding: 14,
          borderRadius: 8,
          alignItems: "center",
          minHeight: 48,
          justifyContent: "center",
        },
        cancelBtn: {
          backgroundColor: theme.white,
        },
        submitBtn: {
          backgroundColor: theme.secondary,
        },
        cancelText: {
          color: theme.dark,
          fontWeight: "600",
        },
        submitText: {
          color: theme.text,
          fontWeight: "600",
        },
      }),
    [theme],
  );
};
