import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  CustomersResponse,
} from "@/types/Auth";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message ?? `Login failed: ${response.statusText}`);
    }
    return response.json();
  },

  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    const response = await fetch(`${BASE_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message ?? `Register failed: ${response.statusText}`);
    }
    return response.json();
  },

  getCustomers: async (): Promise<CustomersResponse> => {
    const response = await fetch(`${BASE_URL}/api/v1/auth/customers`);
    if (!response.ok) throw new Error(`Failed to fetch customers: ${response.statusText}`);
    return response.json();
  },

  // Send OTP to email
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await fetch(`${BASE_URL}/api/v1/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message ?? "Failed to send OTP");
    }
    return response.json();
  },

  // Verify OTP
  verifyOtp: async (email: string, otp: string): Promise<{ message: string; resetToken: string }> => {
    const response = await fetch(`${BASE_URL}/api/v1/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message ?? "Invalid OTP");
    }
    return response.json();
  },

  // Reset Password
  resetPassword: async (resetToken: string, newPassword: string): Promise<{ message: string }> => {
    const response = await fetch(`${BASE_URL}/api/v1/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resetToken}`,
      },
      body: JSON.stringify({ newPassword }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message ?? "Reset failed");
    }
    return response.json();
  },
};