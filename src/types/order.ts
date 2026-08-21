import type { ProductVariant } from "./ProductVariant";

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: number;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderDetail {
  id: number;
  orderId: number;
  productId: number;
  variantId?: number | null;
  productName: string | null;
  productPrice: string | null;
  originalPrice: number | string;
  discountPercent: number | string;
  qty: number;
  amount: string;
  createdAt: string;
  updatedAt: string;
  variant?: ProductVariant | null;
}

export interface Order {
  id: number;
  customerId: number;
  orderNumber: string;
  total: string;
  discount: string;
  orderDate: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  customers: Customer;
  orderDetails: OrderDetail[];
}

export interface OrderResponse {
  message: string;
  data: Order[];
}

// types/order.ts
export interface CreateOrderDetailPayload {
  productId: number;
  variantId?: number;   // ← add this
  qty: number;
}

export interface CreateOrderPayload {
  customerId: number;
  discount: string;
  location: string;
  items: CreateOrderDetailPayload[];
  // remove: orderNumber, total, orderDate — backend handles these too
}