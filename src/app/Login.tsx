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

interface ILoginFormValues {
  email: string;
  password: string;
}

interface ILoginFormErrors {
  email?: string;
  password?: string;
}

const Login: React.FC = (): React.JSX.Element => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<ILoginFormErrors>({});
  const [formValues, setFormValues] = useState<ILoginFormValues>({
    email: "",
    password: "",
  });

  const handleChange = (key: keyof ILoginFormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));

    // Clear error for this field when user starts typing
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
    const errors: ILoginFormErrors = {};

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
      !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/.test(formValues.password)
    ) {
      errors.password = "Password must contain both letters and numbers";
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
      // TODO: Replace with actual login API call
      // Example:
      // const response = await loginUser(formValues.email, formValues.password);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      showToast("Login successful!", "success");
      router.replace("/Home");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpPress = () => {
    router.push("/Signup");
  };

  const handleForgotPasswordPress = () => {
    router.push("/ForgotPassword");
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
          {/* Logo and Title */}
          <View style={styles.titleContainer}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={{
                width: 40,
                height: 40,
              }}
            />
            <Text style={styles.titleText}>Zxpense</Text>
          </View>

          {/* Subtitle */}
          <Text style={styles.subtitleText}>Welcome Back</Text>
          <Text style={styles.descriptionText}>
            Sign in to manage your expenses
          </Text>

          {/* Email Input */}
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

          {/* Password Input */}
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
                placeholder="Enter your password"
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

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={onSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.text} size="small" />
            ) : (
              <Text style={styles.loginBtnText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={handleForgotPasswordPress}
            disabled={loading}
            style={styles.forgotPasswordButton}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUpPress} disabled={loading}>
              <Text style={styles.signUpLinkText}>Sign Up</Text>
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
  loginBtn: {
    width: "100%",
    backgroundColor: theme.secondary,
    paddingVertical: Spacing.two,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.three,
    marginBottom: Spacing.two,
  },
  loginBtnDisabled: {
    opacity: 0.6,
  },
  loginBtnText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: "600",
  },
  forgotPasswordButton: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: Spacing.four,
  },
  forgotPasswordText: {
    color: theme.secondary,
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  signUpContainer: {
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

export default Login;
