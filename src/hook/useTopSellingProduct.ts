import { useQuery } from '@tanstack/react-query';
import { getTopSellingProducts } from '@/services/product.service';

export const useTopSellingProducts = (limit = 10) => {
  return useQuery({
    queryKey: ['products', 'top-selling', limit],
    queryFn: () => getTopSellingProducts(limit),
  });
};