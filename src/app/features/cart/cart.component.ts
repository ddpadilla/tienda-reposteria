import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  template: `
    <main class="cart-page">
      <div class="container">
        <h1>Carrito de Compras</h1>

        @if (cartService.items().length === 0) {
          <div class="empty-cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <p>Tu carrito está vacío</p>
            <a routerLink="/shop" class="btn btn-gold">Ver Productos</a>
          </div>
        } @else {
          <div class="cart-layout">
            <!-- Items -->
            <div class="cart-items">
              @for (item of cartService.items(); track item.product.id) {
                <div class="cart-item">
                  <div class="item-image">
                    @if (item.product.image_url) {
                      <img [src]="item.product.image_url" [alt]="item.product.name">
                    } @else {
                      <div class="placeholder"></div>
                    }
                  </div>
                  
                  <div class="item-details">
                    <h3>{{ item.product.name }}</h3>
                    <p class="item-price">L {{ item.product.price_hnl | number:'1.2-2' }}</p>
                  </div>

                  <div class="item-quantity">
                    <button 
                      class="qty-btn"
                      (click)="cartService.updateQuantity(item.product.id, item.quantity - 1)"
                    >−</button>
                    <span>{{ item.quantity }}</span>
                    <button 
                      class="qty-btn"
                      (click)="cartService.updateQuantity(item.product.id, item.quantity + 1)"
                    >+</button>
                  </div>

                  <div class="item-total">
                    L {{ (item.product.price_hnl * item.quantity) | number:'1.2-2' }}
                  </div>

                  <button 
                    class="remove-btn"
                    (click)="cartService.removeProduct(item.product.id)"
                    aria-label="Eliminar"
                  >
                    ×
                  </button>
                </div>
              }
            </div>

            <!-- Resumen -->
            <div class="cart-summary">
              <h2>Resumen del Pedido</h2>
              
              <div class="summary-row">
                <span>Subtotal</span>
                <span>L {{ cartService.totalHNL() | number:'1.2-2' }}</span>
              </div>
              
              <div class="summary-row">
                <span>Envío</span>
                <span>Gratis</span>
              </div>

              <div class="summary-divider"></div>

              <div class="summary-row total">
                <span>Total</span>
                <span>L {{ cartService.totalHNL() | number:'1.2-2' }}</span>
              </div>

              <a routerLink="/checkout" class="btn btn-gold checkout-btn">
                Proceder al Checkout
              </a>

              <button class="clear-cart" (click)="cartService.clearCart()">
                Vaciar Carrito
              </button>
            </div>
          </div>
        }
      </div>
    </main>
  `,
  styles: [`
    .cart-page {
      padding: var(--spacing-xl) 0 var(--spacing-3xl);
    }

    .cart-page h1 {
      margin-bottom: var(--spacing-xl);
    }

    .empty-cart {
      text-align: center;
      padding: var(--spacing-3xl);
      color: var(--color-gray);
    }

    .empty-cart svg {
      margin-bottom: var(--spacing-lg);
      opacity: 0.5;
    }

    .empty-cart p {
      margin-bottom: var(--spacing-lg);
      font-size: 1.1rem;
    }

    .cart-layout {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: var(--spacing-xl);
      align-items: start;
    }

    /* Items */
    .cart-items {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .cart-item {
      display: grid;
      grid-template-columns: 80px 1fr auto auto auto;
      gap: var(--spacing-md);
      align-items: center;
      padding: var(--spacing-md);
      background: var(--color-white);
      border-radius: var(--border-radius-md);
      box-shadow: var(--shadow-sm);
    }

    .item-image {
      width: 80px;
      height: 80px;
      border-radius: var(--border-radius-sm);
      overflow: hidden;
      background: var(--color-cream-dark);
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-details h3 {
      font-family: var(--font-serif);
      font-size: 1.1rem;
      margin-bottom: var(--spacing-xs);
    }

    .item-price {
      color: var(--color-gray);
      font-size: 0.9rem;
    }

    .item-quantity {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .qty-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--color-rose-dark);
      border-radius: var(--border-radius-sm);
      transition: all var(--transition-fast);
    }

    .qty-btn:hover {
      background: var(--color-rose-pastel);
    }

    .item-total {
      font-weight: 600;
      min-width: 80px;
      text-align: right;
    }

    .remove-btn {
      width: 32px;
      height: 32px;
      font-size: 1.5rem;
      color: var(--color-gray);
      transition: color var(--transition-fast);
    }

    .remove-btn:hover {
      color: var(--color-error);
    }

    /* Resumen */
    .cart-summary {
      background: var(--color-white);
      padding: var(--spacing-xl);
      border-radius: var(--border-radius-md);
      box-shadow: var(--shadow-sm);
      position: sticky;
      top: 100px;
    }

    .cart-summary h2 {
      font-size: 1.25rem;
      margin-bottom: var(--spacing-lg);
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--spacing-md);
    }

    .summary-divider {
      height: 1px;
      background: var(--color-rose-pastel);
      margin: var(--spacing-md) 0;
    }

    .summary-row.total {
      font-weight: 700;
      font-size: 1.2rem;
    }

    .checkout-btn {
      width: 100%;
      margin-top: var(--spacing-lg);
      padding: var(--spacing-md);
    }

    .clear-cart {
      display: block;
      width: 100%;
      margin-top: var(--spacing-md);
      padding: var(--spacing-sm);
      color: var(--color-gray);
      font-size: 0.9rem;
      text-align: center;
    }

    .clear-cart:hover {
      color: var(--color-error);
    }

    @media (max-width: 900px) {
      .cart-layout {
        grid-template-columns: 1fr;
      }

      .cart-item {
        grid-template-columns: 60px 1fr auto;
      }

      .item-quantity, .item-total {
        grid-column: 2;
      }

      .remove-btn {
        grid-column: 3;
        grid-row: 1 / 3;
      }
    }
  `]
})
export class CartComponent {
  cartService = inject(CartService);
}
