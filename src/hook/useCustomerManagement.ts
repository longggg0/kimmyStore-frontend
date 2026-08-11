
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { customerManagementService } from "@/services/customerManagement.service";

import type {
  UpdateCustomerPayload,
} from "@/types/CustomerManagement";

export const useCustomerManagement = (
  search?: string
) => {
  return useQuery({
    queryKey: ["customer-management", search ?? ""],
    queryFn: () =>
      customerManagementService.getCustomers(search),
  });
};

export const useCustomerOrders = (
  customerId?: number
) => {
  return useQuery({
    queryKey: ["customer-orders", customerId],
    queryFn: () =>
      customerManagementService.getCustomerOrders(
        customerId!
      ),
    enabled: !!customerId,
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      customerId,
      payload,
    }: {
      customerId: number;
      payload: UpdateCustomerPayload;
    }) =>
      customerManagementService.updateCustomer(
        customerId,
        payload
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customer-management"],
      });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customerId: number) =>
      customerManagementService.deleteCustomer(
        customerId
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customer-management"],
      });
    },
  });
};

