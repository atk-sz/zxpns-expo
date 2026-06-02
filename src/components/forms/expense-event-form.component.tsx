import { theme } from "@/constants/theme";
import { formatDateLong } from "@/utils/common.util";
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
  showStartDatePicker: boolean;
  showEndDatePicker: boolean;
  formValues: IExpenseEvent;
  formErrors: Partial<Record<keyof IExpenseEvent, string>>;
  isEditMode?: boolean; // New prop to determine if we're in edit mode
  setShowStartDatePicker: (value: boolean) => void;
  setShowEndDatePicker: (value: boolean) => void;
  handleChange: (key: keyof IExpenseEvent, value: any) => void;
  handleSubmit: () => void;
};

const ExpenseEventForm: React.FC<IExpenseEventFormProps> = ({
  showStartDatePicker,
  showEndDatePicker,
  formValues,
  formErrors,
  isEditMode = false, // Default to create mode
  setShowEndDatePicker,
  setShowStartDatePicker,
  handleChange,
  handleSubmit,
}) => {
  const toggleEventValue = (key: "isMultiDay" | "isGroupEvent") => {
    Keyboard.dismiss();
    handleChange(key, !formValues[key]);
  };

  return (
    <View style={styles.formContainer}>
      {/* Title */}
      <View style={styles.formComponentContainer}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter event title"
          placeholderTextColor={theme.grey}
          value={formValues.title}
          onChangeText={(text) => handleChange("title", text)}
          maxLength={25}
        />
        <Text style={styles.errorText}>{formErrors.title ?? " "}</Text>
      </View>

      {/* Start Date (always required) */}
      <View style={styles.formComponentContainer}>
        <Text style={styles.label}>
          {formValues.isMultiDay ? "Start Date *" : "Date *"}
        </Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowStartDatePicker(true)}
        >
          <Text style={{ color: theme.dark }}>
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
              setShowStartDatePicker(false);
              handleChange("startDate", date.toISOString().split("T")[0]);
            }}
            onDismiss={() => setShowStartDatePicker(false)}
            onNeutralButtonPress={() => setShowStartDatePicker(false)}
          />
        )}
        <Text style={styles.errorText}>{formErrors.startDate ?? " "}</Text>
      </View>

      {/* Group Event Toggle */}
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
          >
            <Text style={styles.label}>Group event?</Text>
            <Switch
              value={formValues.isGroupEvent}
              onValueChange={() => toggleEventValue("isGroupEvent")}
              thumbColor={theme.text}
              trackColor={{ false: theme.grey, true: theme.secondary }}
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
        >
          <Text style={styles.label}>Multi-day event?</Text>
          <Switch
            value={formValues.isMultiDay}
            onValueChange={() => toggleEventValue("isMultiDay")}
            thumbColor={theme.text}
            trackColor={{ false: theme.grey, true: theme.secondary }}
          />
        </Pressable>
      </View>

      {/* End Date (only if multi-day) */}
      {formValues.isMultiDay && (
        <View style={styles.formComponentContainer}>
          <Text style={styles.label}>End Date</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text style={{ color: theme.dark }}>
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
                setShowEndDatePicker(false);
                handleChange("endDate", date.toISOString().split("T")[0]);
              }}
              onDismiss={() => setShowEndDatePicker(false)}
              onNeutralButtonPress={() => setShowEndDatePicker(false)}
            />
          )}
          <Text style={styles.errorText}>{formErrors.endDate ?? " "}</Text>
        </View>
      )}

      {/* Submit Button - Dynamic text based on mode */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
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
  input: {
    backgroundColor: theme.white,
    color: theme.dark,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: theme.error,
    marginBottom: 8,
    fontSize: 12,
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
  },
  submitButtonText: {
    color: theme.text,
    fontWeight: "bold",
    fontSize: 16,
  },
});
