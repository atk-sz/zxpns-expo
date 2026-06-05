import ScreenView from "@/components/generic/ScreenView";
import { Spacing, theme } from "@/constants/theme";
import { useToast } from "@/contexts/toast.context";
import Icon from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ISignupFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ISignupFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const Signup: React.FC = (): React.JSX.Element => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<ISignupFormErrors>({});
  const [formValues, setFormValues] = useState<ISignupFormValues>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (key: keyof ISignupFormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));

    if (formErrors[key]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const errors: ISignupFormErrors = {};

    if (!formValues.firstName.trim()) {
      errors.firstName = "First name is required";
    } else if (formValues.firstName.length < 2) {
      errors.firstName = "First name must be at least 2 characters";
    }

    if (!formValues.lastName.trim()) {
      errors.lastName = "Last name is required";
    } else if (formValues.lastName.length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
    }

    if (!formValues.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(formValues.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!formValues.password.trim()) {
      errors.password = "Password is required";
    } else if (formValues.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    } else if (formValues.password.length > 25) {
      errors.password = "Password can be at most 25 characters long";
    } else if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/.test(formValues.password)
    ) {
      errors.password =
        "Password must contain letters, a number, and a special character";
    }

    if (!formValues.confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formValues.confirmPassword !== formValues.password) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast("Please fix the errors below", "error");
      return false;
    }

    return true;
  };

  const onSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      showToast("Account created successfully!", "success");
      // router.replace("/Home");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Signup failed";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginPress = () => {
    router.push("/Login");
  };

  return (
    <ScreenView>
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
              source={require("../../assets/images/logo.png")}
              style={styles.logo}
            />
            <Text style={styles.titleText}>Zxpense</Text>
          </View>

          <Text style={styles.subtitleText}>Create your account</Text>
          <Text style={styles.descriptionText}>
            Start tracking your events and expenses securely.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>First Name</Text>
            <View style={styles.inputWrapper}>
              <Icon
                name="person"
                size={20}
                color={theme.grey}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your first name"
                placeholderTextColor={theme.grey}
                value={formValues.firstName}
                onChangeText={(value) => handleChange("firstName", value)}
                editable={!loading}
              />
            </View>
            <Text style={styles.errorText}>{formErrors.firstName ?? " "}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Last Name</Text>
            <View style={styles.inputWrapper}>
              <Icon
                name="person"
                size={20}
                color={theme.grey}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your last name"
                placeholderTextColor={theme.grey}
                value={formValues.lastName}
                onChangeText={(value) => handleChange("lastName", value)}
                editable={!loading}
              />
            </View>
            <Text style={styles.errorText}>{formErrors.lastName ?? " "}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWrapper}>
              <Icon
                name="email"
                size={20}
                color={theme.grey}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={theme.grey}
                value={formValues.email}
                onChangeText={(value) => handleChange("email", value)}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>
            <Text style={styles.errorText}>{formErrors.email ?? " "}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <Icon
                name="lock"
                size={20}
                color={theme.grey}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Create a password"
                placeholderTextColor={theme.grey}
                value={formValues.password}
                onChangeText={(value) => handleChange("password", value)}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                <Icon
                  name={showPassword ? "visibility" : "visibility-off"}
                  size={20}
                  color={theme.grey}
                  style={styles.inputIcon}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.errorText}>{formErrors.password ?? " "}</Text>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <Icon
                name="lock"
                size={20}
                color={theme.grey}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Re-enter your password"
                placeholderTextColor={theme.grey}
                value={formValues.confirmPassword}
                onChangeText={(value) => handleChange("confirmPassword", value)}
                secureTextEntry={!showConfirmPassword}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                <Icon
                  name={showConfirmPassword ? "visibility" : "visibility-off"}
                  size={20}
                  color={theme.grey}
                  style={styles.inputIcon}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.errorText}>
              {formErrors.confirmPassword ?? " "}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.actionBtn, loading && styles.btnDisabled]}
            onPress={onSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.text} size="small" />
            ) : (
              <Text style={styles.actionBtnText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.signInContainer}>
            <Text style={styles.signUpText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleLoginPress} disabled={loading}>
              <Text style={styles.signUpLinkText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  titleContainer: {
    marginBottom: Spacing.five,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 40,
    height: 40,
  },
  titleText: {
    color: theme.text,
    fontSize: 32,
    fontWeight: "600",
    marginLeft: Spacing.three,
    letterSpacing: 0.5,
  },
  subtitleText: {
    color: theme.text,
    fontSize: 24,
    fontWeight: "600",
    marginBottom: Spacing.one,
  },
  descriptionText: {
    color: theme.lightGrey,
    fontSize: 14,
    marginBottom: Spacing.five,
    textAlign: "center",
    maxWidth: 320,
  },
  inputContainer: {
    width: "100%",
    marginBottom: Spacing.three,
  },
  inputLabel: {
    color: theme.text,
    fontSize: 14,
    fontWeight: "500",
    marginBottom: Spacing.one,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.dark,
    borderWidth: 2,
    borderColor: theme.grey,
    borderRadius: 8,
    paddingHorizontal: Spacing.two,
  },
  inputIcon: {
    marginHorizontal: Spacing.one,
  },
  input: {
    color: theme.text,
    fontSize: 16,
    paddingVertical: Spacing.two,
    flex: 1,
  },
  errorText: {
    color: theme.error,
    fontSize: 12,
    marginTop: Spacing.one,
    minHeight: 16,
  },
  actionBtn: {
    width: "100%",
    backgroundColor: theme.secondary,
    paddingVertical: Spacing.two,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.three,
    marginBottom: Spacing.two,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  actionBtnText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: "600",
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing.four,
  },
  signUpText: {
    color: theme.lightGrey,
    fontSize: 14,
  },
  signUpLinkText: {
    color: theme.secondary,
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

export default Signup;
