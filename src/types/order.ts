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
  productName: string | null;
  productPrice: string | null;
  qty: number;
  amount: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  customerId: number;
  orderNumber: number;
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
  qty: number;
  // remove: productName, productPrice, amount — backend calculates these
}

export interface CreateOrderPayload {
  customerId: number;
  discount: string;
  location: string;
  items: CreateOrderDetailPayload[];
  // remove: orderNumber, total, orderDate — backend handles these too
}