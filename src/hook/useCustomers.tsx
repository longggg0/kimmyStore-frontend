import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";

export const useCustomers = () =>
  useQuery({
    queryKey: ["customers"],
    queryFn: authService.getCustomers,
  });