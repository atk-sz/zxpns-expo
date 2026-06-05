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

const ForgotPassword: React.FC = (): React.JSX.Element => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = async (): Promise<void> => {
    if (!email.trim()) {
      setError("Email is required");
      showToast("Please enter your email", "error");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      showToast("Please enter a valid email", "error");
      return;
    }

    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setError(undefined);
      showToast("Password reset link sent to your email.", "success");
      router.replace("/Login");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unable to send reset link";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
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
            <Text style={styles.titleText}>Recover password</Text>
          </View>

          <Text style={styles.descriptionText}>
            Enter the email address associated with your account and we’ll send
            you a link to reset your password.
          </Text>

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
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  if (error) {
                    setError(undefined);
                  }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>
            <Text style={styles.errorText}>{error ?? " "}</Text>
          </View>

          <TouchableOpacity
            style={[styles.actionBtn, loading && styles.btnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.text} size="small" />
            ) : (
              <Text style={styles.actionBtnText}>Send Reset Link</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backToLogin}
            onPress={() => router.push("/Login")}
            disabled={loading}
          >
            <Text style={styles.signUpLinkText}>Back to Login</Text>
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
  signUpLinkText: {
    color: theme.secondary,
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

export default ForgotPassword;
