import { supabase } from "@/configs/supabase.config";

export const signUpWithEmail = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
) => {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });
};

export const signInWithEmail = async (email: string, password: string) => {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const signOut = async () => {
  return supabase.auth.signOut();
};
