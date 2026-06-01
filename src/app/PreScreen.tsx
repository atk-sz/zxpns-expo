import UserForm from "@/components/forms/user-form.component";
import ScreenView from "@/components/generic/ScreenView";
import { router } from "expo-router";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useToast } from "../contexts/toast.context";
import { setValue } from "../redux/slices/user";
import { IUserState } from "../utils/interfaces";

const PreScreen: React.FC = ({}): React.JSX.Element => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof IUserState, string>>
  >({});
  const [formValues, setFormValues] = useState<IUserState>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (key: keyof IUserState, value: any) => {
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

  const onSubmit = async (): Promise<void> => {
    const errors: Partial<Record<keyof IUserState, string>> = {};

    if (!formValues.firstName.trim()) {
      errors.firstName = "First name is required";
      setFormErrors(errors);
      showToast("First name must be at least 3 characters long", "error");
      return;
    }

    if (formValues.firstName.length < 3)
      errors.firstName = "First name must be at least 3 characters long";
    if (formValues.firstName.length > 25)
      errors.firstName = "First name can be at most 25 characters long";

    if (formValues.lastName) {
      if (formValues.lastName.length > 25)
        errors.lastName = "Last name can be at most 25 characters long";
    }

    if (Object.keys(errors).length > 0) {
      showToast("Please fix the following errors", "error");
      setFormErrors(errors);
      return;
    }

    dispatch(
      setValue({
        firstName: formValues.firstName,
        lastName: formValues.lastName || "",
      }),
    );
    router.replace("/Dev");
  };

  return (
    <ScreenView>
      <UserForm
        formValues={formValues}
        formErrors={formErrors}
        handleChange={handleChange}
        onSubmit={onSubmit}
      />
    </ScreenView>
  );
};

export default PreScreen;
