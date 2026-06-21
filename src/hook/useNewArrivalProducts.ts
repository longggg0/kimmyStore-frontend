import { useQuery } from '@tanstack/react-query';
import { getNewArrivalProducts } from '@/services/product.service';

export const useNewArrivalProducts = (limit = 10) => {
  return useQuery({
    queryKey: ['products', 'new-arrivals', limit],
    queryFn: () => getNewArrivalProducts(limit),
  });
};