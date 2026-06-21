import type { CreatePaymentResponse } from "@/types/payment";

const BASE_URL = import.meta.env.VITE_API_URL; // e.g. http://localhost:3000/api/v1

export const createPayment = async (
  orderId: number
): Promise<CreatePaymentResponse> => {
  const res = await fetch(`${BASE_URL}/payment/${orderId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to create payment");
  }

  return res.json();
};