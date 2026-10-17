export interface CheckoutFormData {
  name: string;
  phone: string;
  district: string;
  upazila: string;
  address: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}
