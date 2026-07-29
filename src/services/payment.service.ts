import type { CheckTransactionResponse, CreatePaymentResponse } from "@/types/payment";

const BASE_URL = "http://localhost:3000/api/v1"; // e.g. 

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

export const checkTransaction = async (
  tranId?: string
): Promise<CheckTransactionResponse> => {
  const res = await fetch(`${BASE_URL}/payment/${tranId}/check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to check transaction");
  }

  return res.json();
};