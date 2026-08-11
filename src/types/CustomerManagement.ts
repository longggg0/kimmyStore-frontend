
export interface CustomerManagementCustomer {
  id: number;
  username: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerOrderDetail {
  id?: number;
  orderId: number;
  productId: number;
  productName: string;
  productPrice: string | number;
  originalPrice: string | number;
  discountPercent: string | number;
  qty: number;
  amount: string | number;
}

export interface CustomerOrder {
  id: number;
  customerId: number;
  orderNumber: string | number;
  total: string | number;
  discount: string | number;
  orderDate: string;
  location: string;
  createdAt?: string;
  updatedAt?: string;
  orderDetails: CustomerOrderDetail[];
}

export interface CustomerManagementResponse {
  message: string;
  customers: CustomerManagementCustomer[];
}

export interface CustomerOrdersResponse {
  message: string;
  customer: CustomerManagementCustomer;
  count: number;
  orders: CustomerOrder[];
}

export interface UpdateCustomerPayload {
  username?: string;
  email?: string;
  phone?: string;
  role?: "user" | "admin";
}

