import { useMutation } from "@tanstack/react-query";
import { createPayment } from "@/services/payment.service";
import type { CreatePaymentResponse } from "@/types/payment";

export const useCreatePayment = () => {
  return useMutation<CreatePaymentResponse, Error, number>({
    mutationFn: (orderId: number) => createPayment(orderId),
  });
};