import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { Product, Order, OrderItem, PaymentSettings } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private client: SupabaseClient;

  constructor() {
    this.client = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );
  }

  get supabase(): SupabaseClient {
    return this.client;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    const { data, error } = await this.client
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getActiveProducts(): Promise<Product[]> {
    const { data, error } = await this.client
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await this.client
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const { data, error } = await this.client
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  // Admin: Create product
  async createProduct(product: Partial<Product>): Promise<Product> {
    const { data, error } = await this.client
      .from('products')
      .insert(product)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Admin: Update product
  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const { data, error } = await this.client
      .from('products')
      .update({ ...product, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Admin: Delete product
  async deleteProduct(id: string): Promise<void> {
    const { error } = await this.client
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Orders
  async createOrder(order: Partial<Order>): Promise<Order> {
    const { data, error } = await this.client
      .from('orders')
      .insert(order)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getOrders(): Promise<Order[]> {
    const { data, error } = await this.client
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getOrderById(id: string): Promise<Order | null> {
    const { data: order, error: orderError } = await this.client
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
    
    if (orderError) throw orderError;

    const { data: items, error: itemsError } = await this.client
      .from('order_items')
      .select('*')
      .eq('order_id', id);
    
    if (itemsError) throw itemsError;

    return { ...order, items: items || [] };
  }

  async updateOrderStatus(id: string, status: string, advancePaid: boolean = false, advanceAmount?: number): Promise<Order> {
    const update: any = { status, updated_at: new Date().toISOString() };
    
    if (advancePaid) {
      update.advance_paid = true;
      update.advance_paid_at = new Date().toISOString();
      if (advanceAmount !== undefined) {
        update.advance_amount_hnl = advanceAmount;
      }
    }

    const { data, error } = await this.client
      .from('orders')
      .update(update)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async addOrderItems(items: Partial<OrderItem>[]): Promise<void> {
    const { error } = await this.client
      .from('order_items')
      .insert(items);
    
    if (error) throw error;
  }

  // Dashboard stats
  async getTotalSales(): Promise<number> {
    const { data, error } = await this.client
      .from('orders')
      .select('total_hnl')
      .in('status', ['pagado_total', 'en_preparacion', 'entregado']);
    
    if (error) throw error;
    return data?.reduce((sum, order) => sum + (order.total_hnl || 0), 0) || 0;
  }

  async getTopProducts(): Promise<{ product_name: string; total_sold: number }[]> {
    const { data, error } = await this.client
      .from('order_items')
      .select('product_name, quantity');
    
    if (error) throw error;
    
    const productMap = new Map<string, number>();
    data?.forEach(item => {
      const current = productMap.get(item.product_name) || 0;
      productMap.set(item.product_name, current + item.quantity);
    });
    
    return Array.from(productMap.entries())
      .map(([product_name, total_sold]) => ({ product_name, total_sold }))
      .sort((a, b) => b.total_sold - a.total_sold)
      .slice(0, 5);
  }

  // Storage
  async uploadProductImage(file: File): Promise<string> {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await this.client.storage
      .from('product-images')
      .upload(fileName, file);
    
    if (error) throw error;
    
    const { data: urlData } = this.client.storage
      .from('product-images')
      .getPublicUrl(fileName);
    
    return urlData.publicUrl;
  }

  // Hero Slides
  async getHeroSlides(): Promise<any[]> {
    const { data, error } = await this.client
      .from('hero_slides')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  async getAllHeroSlides(): Promise<any[]> {
    const { data, error } = await this.client
      .from('hero_slides')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  async createHeroSlide(slide: Partial<any>): Promise<any> {
    const { data, error } = await this.client
      .from('hero_slides')
      .insert(slide)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateHeroSlide(id: string, slide: Partial<any>): Promise<any> {
    const { data, error } = await this.client
      .from('hero_slides')
      .update(slide)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteHeroSlide(id: string): Promise<void> {
    const { error } = await this.client
      .from('hero_slides')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Payment Settings
  async getPaymentSettings(): Promise<PaymentSettings | null> {
    const { data, error } = await this.client
      .from('payment_settings')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single();
    
    if (error) return null;
    return data;
  }

  async updatePaymentSettings(settings: Partial<PaymentSettings>): Promise<PaymentSettings> {
    const { data, error } = await this.client
      .from('payment_settings')
      .update({ ...settings, updated_at: new Date().toISOString() })
      .eq('is_active', true)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}
