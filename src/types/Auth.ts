export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  message: string;
  data: string; // JWT token
}

export interface RegisterResponse {
  message: string;
  data: Customer;
}

export interface CustomersResponse {
  message: string;
  data: (Customer & { token: string })[];
}


// Decoded JWT payload shape
export interface AuthUser {
  id: number;
  email: string;
  username: string;
  fullName: string;
  role: 'user' | 'admin'; 
  exp?: number;
  iat?: number;
}