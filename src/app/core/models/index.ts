export interface Product {
  id: string;
  name: string;
  description: string | null;
  price_hnl: number;
  category: string;
  image_url: string | null;
  stock: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string | null;
  total_hnl: number;
  status: OrderStatus;
  payment_method: string | null;
  payment_proof_url: string | null;
  notes: string | null;
  advance_paid: boolean;
  advance_paid_at: string | null;
  advance_amount_hnl: number | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price_hnl: number;
}

export type OrderStatus = 
  | 'pendiente_pago'
  | 'anticipo_recibido'
  | 'pagado_total'
  | 'en_preparacion'
  | 'entregado';

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface CheckoutData {
  customer: CustomerInfo;
  paymentMethod: 'paypal' | 'transferencia';
  notes?: string;
}

export interface HeroSlide {
  id: string;
  image_url: string;
  title: string | null;
  subtitle: string | null;
  button_text: string | null;
  button_link: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export interface PaymentSettings {
  id: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
  instructions: string;
  advance_percentage: number;
  whatsapp: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
