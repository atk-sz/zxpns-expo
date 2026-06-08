import ScreenView from "@/components/generic/ScreenView";
import { supabase } from "@/configs/supabase.config";
import { Spacing, theme } from "@/constants/theme";
import { useToast } from "@/contexts/toast.context";
import Icon from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
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

interface IUpdatePasswordFormValues {
  password: string;
  confirmPassword: string;
}

const DUMMY_EMAIL = "user@example.com";

interface IUpdatePasswordFormErrors {
  password?: string;
  confirmPassword?: string;
}

const UpdatePassword: React.FC = (): React.JSX.Element => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formValues, setFormValues] = useState<IUpdatePasswordFormValues>({
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState<IUpdatePasswordFormErrors>({});

  const handleChange = (
    key: keyof IUpdatePasswordFormValues,
    value: string,
  ): void => {
    setFormValues((prev) => ({ ...prev, [key]: value }));

    if (formErrors[key]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: IUpdatePasswordFormErrors = {};

    if (!formValues.password.trim()) {
      errors.password = "New password is required";
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
      errors.confirmPassword = "Please confirm your new password";
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
      const { error } = await supabase.auth.updateUser({
        password: formValues.password,
      });

      if (error) {
        throw error;
      }

      showToast("Password updated successfully!", "success");
      router.replace("/Home");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unable to update password";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        router.replace("/Home");
      }
    };

    checkSession();
  }, []);

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
            <Text style={styles.titleText}>Update Password</Text>
          </View>

          <Text style={styles.emailText}>Updating password for</Text>
          <Text style={styles.emailHighlight}>{DUMMY_EMAIL}</Text>

          <Text style={styles.descriptionText}>
            Choose a new password for your account and confirm it below.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>New Password</Text>
            <View style={styles.inputWrapper}>
              <Icon
                name="lock"
                size={20}
                color={theme.grey}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Enter your new password"
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
                placeholder="Confirm your new password"
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
              <Text style={styles.actionBtnText}>Update Password</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backToLogin}
            onPress={() => router.replace("/Home")}
            disabled={loading}
          >
            <Text style={styles.signUpLinkText}>Back to Home</Text>
          </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: "600",
    marginLeft: Spacing.three,
    letterSpacing: 0.5,
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
  backToLogin: {
    marginTop: Spacing.two,
  },
  emailText: {
    color: theme.lightGrey,
    fontSize: 14,
    marginBottom: Spacing.one,
    textAlign: "center",
  },
  emailHighlight: {
    color: theme.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: Spacing.three,
    textAlign: "center",
  },
  signUpLinkText: {
    color: theme.secondary,
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

export default UpdatePassword;
