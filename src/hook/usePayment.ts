// import { useMutation } from "@tanstack/react-query";
import { createPayment } from "@/services/payment.service";
import type { CreatePaymentResponse } from "@/types/payment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkTransaction } from "@/services/payment.service";
import type { CheckTransactionResponse } from "@/types/payment";
import { toast } from "sonner";

export const useCreatePayment = () => {
  return useMutation<CreatePaymentResponse, Error, number>({
    mutationFn: (orderId: number) => createPayment(orderId),
  });
};

export const useCheckTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation<CheckTransactionResponse, Error, string | undefined>({
    mutationFn: (tranId: string | undefined) => checkTransaction(tranId),
    onSuccess: () => {
      toast.success("Transaction checked successfully");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to check transaction");
      console.log("Failed to check transaction", error);
    },
  });
};