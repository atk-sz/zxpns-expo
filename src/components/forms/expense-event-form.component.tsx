import { theme } from "@/constants/theme";
import { formatDateLong } from "@/utils/common.util";
import Icon from "@expo/vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { IExpenseEvent } from "../../utils/interfaces";

type IExpenseEventFormProps = {
  formValues: IExpenseEvent;
  formErrors: Partial<Record<keyof IExpenseEvent, string>>;
  showStartDatePicker: boolean;
  showEndDatePicker: boolean;
  isEditMode?: boolean;
  loading?: boolean;
  onDatePickerToggle: (pickerType: "start" | "end", show: boolean) => void;
  onDateChange: (date: string, pickerType: "start" | "end") => void;
  handleChange: (key: keyof IExpenseEvent, value: any) => void;
  handleSubmit: () => void;
};

const ExpenseEventForm: React.FC<IExpenseEventFormProps> = ({
  formValues,
  formErrors,
  showStartDatePicker,
  showEndDatePicker,
  isEditMode = false,
  loading = false,
  onDatePickerToggle,
  onDateChange,
  handleChange,
  handleSubmit,
}) => {
  const toggleEventValue = (key: "isMultiDay" | "isGroupEvent") => {
    Keyboard.dismiss();
    handleChange(key, !formValues[key]);
  };

  return (
    <View style={styles.formContainer}>
      {/* Title Input */}
      <View style={styles.formComponentContainer}>
        <Text style={styles.label}>Title *</Text>
        <View style={styles.inputWrapper}>
          <Icon
            name="event"
            size={20}
            color={theme.grey}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter event title"
            placeholderTextColor={theme.grey}
            value={formValues.title}
            onChangeText={(text) => handleChange("title", text)}
            maxLength={25}
            editable={!loading}
          />
        </View>
        <Text style={styles.errorText}>{formErrors.title ?? " "}</Text>
      </View>

      {/* Start Date */}
      <View style={styles.formComponentContainer}>
        <Text style={styles.label}>
          {formValues.isMultiDay ? "Start Date *" : "Date *"}
        </Text>
        <TouchableOpacity
          style={[styles.dateButton, loading && { opacity: 0.6 }]}
          onPress={() => onDatePickerToggle("start", true)}
          disabled={loading}
        >
          <Icon
            name="calendar-today"
            size={20}
            color={theme.text}
            style={styles.inputIcon}
          />
          <Text style={styles.dateButtonText}>
            {formValues.startDate
              ? formatDateLong(formValues.startDate)
              : "Select date"}
          </Text>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={
              formValues.startDate ? new Date(formValues.startDate) : new Date()
            }
            mode="date"
            display="default"
            onValueChange={(_, date) => {
              onDatePickerToggle("start", false);
              if (date) {
                onDateChange(date.toISOString().split("T")[0], "start");
              }
            }}
            onDismiss={() => onDatePickerToggle("start", false)}
            onNeutralButtonPress={() => onDatePickerToggle("start", false)}
          />
        )}
        <Text style={styles.errorText}>{formErrors.startDate ?? " "}</Text>
      </View>

      {/* Group Event Toggle (only in create mode) */}
      {!isEditMode && (
        <View style={styles.formComponentContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.switchContainer,
              pressed && {
                opacity: 0.8,
                backgroundColor: theme.dark,
                borderRadius: 8,
              },
            ]}
            onPress={() => toggleEventValue("isGroupEvent")}
            disabled={loading}
          >
            <Text style={styles.label}>Group event?</Text>
            <Switch
              value={formValues.isGroupEvent}
              onValueChange={() => toggleEventValue("isGroupEvent")}
              thumbColor={theme.text}
              trackColor={{ false: theme.grey, true: theme.secondary }}
              disabled={loading}
            />
          </Pressable>
        </View>
      )}

      {/* Multi-day Toggle */}
      <View style={styles.formComponentContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.switchContainer,
            pressed && {
              opacity: 0.8,
              backgroundColor: theme.dark,
              borderRadius: 8,
            },
          ]}
          onPress={() => toggleEventValue("isMultiDay")}
          disabled={loading}
        >
          <Text style={styles.label}>Multi-day event?</Text>
          <Switch
            value={formValues.isMultiDay}
            onValueChange={() => toggleEventValue("isMultiDay")}
            thumbColor={theme.text}
            trackColor={{ false: theme.grey, true: theme.secondary }}
            disabled={loading}
          />
        </Pressable>
      </View>

      {/* End Date (only if multi-day) */}
      {formValues.isMultiDay && (
        <View style={styles.formComponentContainer}>
          <Text style={styles.label}>End Date *</Text>
          <TouchableOpacity
            style={[styles.dateButton, loading && { opacity: 0.6 }]}
            onPress={() => onDatePickerToggle("end", true)}
            disabled={loading}
          >
            <Icon
              name="calendar-today"
              size={20}
              color={theme.text}
              style={styles.inputIcon}
            />
            <Text style={styles.dateButtonText}>
              {formValues.endDate
                ? formatDateLong(formValues.endDate)
                : "Select date"}
            </Text>
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
              value={
                formValues.endDate ? new Date(formValues.endDate) : new Date()
              }
              mode="date"
              display="default"
              onValueChange={(_, date) => {
                onDatePickerToggle("end", false);
                if (date) {
                  onDateChange(date.toISOString().split("T")[0], "end");
                }
              }}
              onDismiss={() => onDatePickerToggle("end", false)}
              onNeutralButtonPress={() => onDatePickerToggle("end", false)}
            />
          )}
          <Text style={styles.errorText}>{formErrors.endDate ?? " "}</Text>
        </View>
      )}

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, loading && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {isEditMode ? "Update Event" : "Create Event"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ExpenseEventForm;

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    width: "100%",
    marginTop: 50,
    backgroundColor: theme.primary,
    paddingTop: "25%",
    padding: 16,
    borderRadius: 10,
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
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.dark,
    borderWidth: 2,
    borderColor: theme.grey,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    color: theme.text,
    flex: 1,
    height: 48,
    paddingVertical: 8,
  },
  dateButton: {
    backgroundColor: theme.dark,
    borderWidth: 2,
    borderColor: theme.grey,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  dateButtonText: {
    color: theme.text,
    marginLeft: 8,
    flex: 1,
  },
  errorText: {
    color: theme.error,
    marginBottom: 8,
    fontSize: 12,
    marginTop: 4,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  submitButton: {
    backgroundColor: theme.secondary,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonText: {
    color: theme.text,
    fontWeight: "bold",
    fontSize: 16,
  },
});
