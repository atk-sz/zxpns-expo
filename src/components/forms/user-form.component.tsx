import { theme } from "@/constants/theme";
import { IUserState } from "@/utils/interfaces";
import { Image } from "expo-image";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface IUserFormProps {
  formValues: IUserState;
  formErrors: Partial<Record<keyof IUserState, string>>;
  handleChange: (key: keyof IUserState, value: any) => void;
  onSubmit: () => void;
}

const UserForm: React.FC<IUserFormProps> = ({
  formValues,
  formErrors,
  handleChange,
  onSubmit,
}) => {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.screenContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.titleContainer}>
          <Image
            source={require("../../../assets/images/logo.png")}
            style={{
              width: 50,
              height: 50,
            }}
          />
          <Text style={styles.titleText}>Zxpense</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your first name"
            placeholderTextColor={theme.grey}
            value={formValues.firstName}
            onChangeText={(value) => handleChange("firstName", value)}
            maxLength={25}
          />
          <Text style={styles.errorText}>{formErrors.firstName ?? " "}</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your last name"
            placeholderTextColor={theme.grey}
            value={formValues.lastName}
            onChangeText={(value) => handleChange("lastName", value)}
            maxLength={25}
          />
          <Text style={styles.errorText}>{formErrors.lastName ?? " "}</Text>
        </View>
        <TouchableOpacity style={styles.btn} onPress={onSubmit}>
          <Text style={{ color: theme.text }}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    marginBottom: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  titleText: {
    color: theme.text,
    fontSize: 30,
    paddingLeft: 30,
  },
  inputContainer: {
    width: "80%",
  },
  inputLabel: {
    color: theme.text,
  },
  input: {
    color: theme.text,
    backgroundColor: theme.dark,
    borderWidth: 2,
    borderColor: theme.grey,
    borderRadius: 20,
    height: 50,
    padding: 10,
    marginVertical: 10,
  },
  errorText: {
    color: theme.error,
    marginBottom: 8,
    fontSize: 12,
  },
  btn: {
    height: 50,
    backgroundColor: theme.secondary,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginTop: 20,
  },
});

export default UserForm;
