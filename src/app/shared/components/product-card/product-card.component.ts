import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Product } from '../../../core/models';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  template: `
    <article class="product-card">
      <a [routerLink]="['/product', product.id]" class="product-image-link">
        <div class="product-image">
          @if (product.image_url) {
            <img [src]="product.image_url" [alt]="product.name" loading="lazy">
          } @else {
            <div class="product-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
          }
          @if (product.stock === 0) {
            <div class="product-badge agotado">Agotado</div>
          }
        </div>
      </a>
      
      <div class="product-info">
        <h3 class="product-name">
          <a [routerLink]="['/product', product.id]">{{ product.name }}</a>
        </h3>
        
        <p class="product-price">L {{ product.price_hnl | number:'1.2-2' }}</p>
        
        <button 
          class="btn btn-primary add-to-cart"
          [disabled]="product.stock === 0"
          (click)="onAddToCart()"
        >
          {{ product.stock === 0 ? 'Agotado' : 'Agregar al Carrito' }}
        </button>
      </div>
    </article>
  `,
  styles: [`
    .product-card {
      background: var(--color-white);
      border-radius: var(--border-radius-md);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      transition: transform var(--transition-normal), box-shadow var(--transition-normal);
      position: relative;
    }

    .product-card:hover,
    .product-card:focus-within {
      transform: translateY(-6px);
      box-shadow: var(--shadow-lg);
    }

    .product-image-link {
      display: block;
    }

    .product-image {
      position: relative;
      aspect-ratio: 1;
      overflow: hidden;
      background: var(--color-cream-dark);
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--transition-slow);
    }

    .product-card:hover .product-image img,
    .product-card:focus-within .product-image img {
      transform: scale(1.05);
    }

    .product-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-rose-dark);
    }

    .product-badge {
      position: absolute;
      top: var(--spacing-sm);
      right: var(--spacing-sm);
      padding: var(--spacing-xs) var(--spacing-sm);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-radius: var(--border-radius-sm);
      z-index: 2;
    }

    .product-badge.agotado {
      background: var(--color-error);
      color: white;
    }

    .product-info {
      padding: var(--spacing-md);
    }

    .product-name {
      font-family: var(--font-serif);
      font-size: 1.1rem;
      font-weight: 500;
      margin-bottom: var(--spacing-xs);
    }

    .product-name a {
      color: var(--color-brown);
      text-decoration: none;
    }

    .product-name a::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 1;
    }

    .product-name a:hover,
    .product-name a:focus-visible {
      color: var(--color-gold);
      outline: none;
    }

    .product-price {
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-gold);
      margin-bottom: var(--spacing-md);
    }

    .add-to-cart {
      width: 100%;
      padding: var(--spacing-sm) var(--spacing-md);
      font-size: 0.85rem;
      position: relative;
      z-index: 2;
    }

    .add-to-cart:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Output() addToCart = new EventEmitter<Product>();

  onAddToCart() {
    this.addToCart.emit(this.product);
  }
}
