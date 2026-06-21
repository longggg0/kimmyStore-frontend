export interface Brand {
  id: number;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrandResponse {
  message: string;
  data: Brand[];
}

export interface UpdateBrandPayload {
  name: string;
  image: string;
}