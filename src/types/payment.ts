export interface PaymentRecord {
  id: number;
  orderId: number;
  paywayTranId: string;
  method: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
  remark: string;
  amount: string;
  createdAt: string;
  updatedAt: string;
  paidAt: string | null;
}

export interface PaywayFields {
  merchant_id: string;
  req_time: string;
  tran_id: string;
  amount: string;
  items: string;
  shipping: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  type: string;
  view_type: string;
  payment_option: string;
  return_url: string;
  cancel_url: string;
  continue_success_url: string;
  currency: string;
  payment_gate: number;
  hash: string;
}

export interface PaywayData {
  action: string;
  method: string;
  target: string;
  id: string;
  fields: PaywayFields;
}

export interface CreatePaymentResponse {
  message: string;
  data: {
    payment: PaymentRecord;
    payway: PaywayData;
  };
}
export interface AbaCheckTransactionStatus {
  code: string;       // e.g. "00"
  message?: string;
}

export interface AbaCheckTransactionData {
  payment_status_code: number;
  payment_status: "APPROVED" | "DECLINED" | "FAILED" | string;
  transaction_date?: string;
  [key: string]: unknown;
}

export interface AbaCheckTransactionResponse {
  status: AbaCheckTransactionStatus;
  data: AbaCheckTransactionData;
}

export interface CheckTransactionResponse {
  message: string;
  data: {
    payment: PaymentRecord;
    aba: AbaCheckTransactionResponse;
  };
}