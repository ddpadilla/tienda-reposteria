import { Injectable, signal, computed, effect, WritableSignal } from '@angular/core';
import { CartItem, Product } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'sweet_bloom_cart';
  
  private cartItems = signal<CartItem[]>([]);
  private notification: WritableSignal<{ message: string; visible: boolean }> = signal({ message: '', visible: false });
  
  readonly items = this.cartItems.asReadonly();
  readonly notify = this.notification.asReadonly();
  
  readonly itemCount = computed(() => 
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );
  
  readonly totalHNL = computed(() => 
    this.cartItems().reduce((sum, item) => 
      sum + (item.product.price_hnl * item.quantity), 0
    )
  );

  constructor() {
    this.loadFromStorage();
    
    effect(() => {
      const items = this.cartItems();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    });
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this.cartItems.set(JSON.parse(stored));
      } catch {
        this.cartItems.set([]);
      }
    }
  }

  addProduct(product: Product, quantity: number = 1): void {
    const items = this.cartItems();
    const existingIndex = items.findIndex(item => item.product.id === product.id);
    
    if (existingIndex >= 0) {
      const updated = [...items];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + quantity
      };
      this.cartItems.set(updated);
    } else {
      this.cartItems.set([...items, { product, quantity }]);
    }

    this.notification.set({ message: `${product.name} agregado al carrito`, visible: true });
    setTimeout(() => {
      this.notification.set({ message: '', visible: false });
    }, 2500);
  }

  removeProduct(productId: string): void {
    this.cartItems.update(items => items.filter(item => item.product.id !== productId));
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeProduct(productId);
      return;
    }
    
    this.cartItems.update(items => 
      items.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  }

  clearCart(): void {
    this.cartItems.set([]);
  }

  getItems(): CartItem[] {
    return this.cartItems();
  }
}
