import { createPayment, checkTransaction } from "@/services/payment.service";
import { sendTelegramMessage } from "@/services/telegram.service";
import type {
  CreatePaymentResponse,
  CheckTransactionResponse,
} from "@/types/payment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreatePayment = () => {
  return useMutation<CreatePaymentResponse, Error, number>({
    mutationFn: (orderId: number) => createPayment(orderId),
  });
};

export const useCheckTransaction = () => {
  const queryClient = useQueryClient();

  let isSending = false;

  return useMutation<CheckTransactionResponse, Error, string | undefined>({
    mutationFn: (tranId) => checkTransaction(tranId),

    onSuccess: async () => {
      toast.success("Transaction checked successfully");

      queryClient.invalidateQueries({
        queryKey: ["payments"],
      });

      // Prevent duplicate Telegram sending
      if (isSending) return;
      isSending = true;

      const orderData = sessionStorage.getItem("pendingTelegramOrder");

      if (!orderData) {
        isSending = false;
        return;
      }

      const order = JSON.parse(orderData);

      let message = `🛍️ NEW PAID ORDER\n\n`;

      message += `👤 Customer Information\n`;
      message += `━━━━━━━━━━━━━━━━━━\n`;
      message += `Name: ${order.customer.fullName}\n`;
      message += `Email: ${order.customer.email}\n`;
      message += `Phone: ${order.customer.phone}\n`;
      message += `Address: ${order.customer.address}\n\n`;

      message += `📦 Products\n`;
      message += `━━━━━━━━━━━━━━━━━━\n`;

      order.products.forEach((product: any, index: number) => {
        message += `${index + 1}. ${product.name}\n`;
        message += `   Qty: ${product.quantity}\n`;
        message += `   Price: $${product.price.toFixed(2)}\n`;
        message += `   Subtotal: $${product.subtotal.toFixed(2)}\n\n`;
      });

      message += `━━━━━━━━━━━━━━━━━━\n`;
      message += `Original Total : $${order.originalTotal.toFixed(2)}\n`;
      message += `Discount       : -$${order.discount.toFixed(2)}\n`;
      message += `Final Total    : $${order.total.toFixed(2)}\n`;

      try {
        await sendTelegramMessage(message);

        console.log("✅ Telegram sent");

        sessionStorage.removeItem("pendingTelegramOrder");
      } catch (error) {
        console.error(error);
      } finally {
        isSending = false;
      }
    },

    onError: (error) => {
      toast.error("Failed to check transaction");
      console.error(error);
    },
  });
};