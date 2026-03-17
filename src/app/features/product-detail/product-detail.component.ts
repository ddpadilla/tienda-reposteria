import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { SupabaseService } from '../../core/services/supabase.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ImgLoadDirective } from '../../shared/directives/img-load.directive';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, LoadingSpinnerComponent, DecimalPipe, TitleCasePipe, ImgLoadDirective],
  template: `
    <main class="product-detail-page">
      <div class="container">
        @if (isLoading()) {
          <app-loading-spinner />
        } @else if (!product()) {
          <div class="not-found">
            <p>Producto no encontrado</p>
            <a routerLink="/shop" class="btn btn-primary">Volver a la Tienda</a>
          </div>
        } @else {
          <div class="product-layout">
            <!-- Imagen -->
            <div class="product-image skeleton-loader">
              @if (product()!.image_url) {
                <img [src]="product()!.image_url" [alt]="product()!.name" loading="lazy" decoding="async">
              } @else {
                <div class="image-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </div>
              }
            </div>

            <!-- Info -->
            <div class="product-info">
              <nav class="breadcrumb">
                <a routerLink="/shop">Tienda</a>
                <span>/</span>
                <span>{{ product()!.category | titlecase }}</span>
              </nav>

              <h1>{{ product()!.name }}</h1>
              
              <p class="product-price">L {{ product()!.price_hnl | number:'1.2-2' }}</p>

              @if (product()!.description) {
                <p class="product-description">{{ product()!.description }}</p>
              }

              <div class="product-stock">
                @if (product()!.stock > 0) {
                  <span class="stock available">✓ Disponible ({{ product()!.stock }} unidades)</span>
                } @else {
                  <span class="stock unavailable">✗ Agotado</span>
                }
              </div>

              <div class="product-actions">
                <div class="quantity-selector">
                  <button 
                    class="qty-btn" 
                    (click)="decreaseQty()"
                    [disabled]="quantity() <= 1"
                  >−</button>
                  <span class="qty-value">{{ quantity() }}</span>
                  <button 
                    class="qty-btn" 
                    (click)="increaseQty()"
                    [disabled]="quantity() >= product()!.stock"
                  >+</button>
                </div>

                <button 
                  class="btn btn-gold add-btn"
                  [disabled]="product()!.stock === 0"
                  (click)="addToCart()"
                >
                  {{ product()!.stock === 0 ? 'Agotado' : 'Agregar al Carrito' }}
                </button>
              </div>

              <a routerLink="/shop" class="back-link">← Volver a la tienda</a>
            </div>
          </div>
        }
      </div>
    </main>
  `,
  styles: [`
    .product-detail-page {
      padding: var(--spacing-xl) 0 var(--spacing-3xl);
    }

    .not-found {
      text-align: center;
      padding: var(--spacing-3xl);
    }

    .product-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-3xl);
      align-items: start;
    }

    .product-image {
      aspect-ratio: 1;
      border-radius: var(--border-radius-lg);
      overflow: hidden;
      background: var(--color-white);
      box-shadow: var(--shadow-md);
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .image-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-rose-dark);
    }

    .breadcrumb {
      display: flex;
      gap: var(--spacing-sm);
      font-size: 0.9rem;
      color: var(--color-gray);
      margin-bottom: var(--spacing-md);
    }

    .breadcrumb a:hover {
      color: var(--color-gold);
    }

    .product-info h1 {
      font-size: 2rem;
      margin-bottom: var(--spacing-md);
    }

    .product-price {
      font-size: 1.75rem;
      font-weight: 600;
      color: var(--color-gold);
      margin-bottom: var(--spacing-lg);
    }

    .product-description {
      color: var(--color-gray);
      line-height: 1.8;
      margin-bottom: var(--spacing-lg);
    }

    .product-stock {
      margin-bottom: var(--spacing-lg);
    }

    .stock {
      font-size: 0.9rem;
      font-weight: 500;
    }

    .stock.available {
      color: var(--color-success);
    }

    .stock.unavailable {
      color: var(--color-error);
    }

    .product-actions {
      display: flex;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-xl);
    }

    .quantity-selector {
      display: flex;
      align-items: center;
      border: 1px solid var(--color-rose-dark);
      border-radius: var(--border-radius-sm);
      overflow: hidden;
    }

    .qty-btn {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      color: var(--color-brown);
      transition: background var(--transition-fast);
    }

    .qty-btn:hover:not(:disabled) {
      background: var(--color-rose-pastel);
    }

    .qty-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .qty-value {
      width: 50px;
      text-align: center;
      font-weight: 600;
    }

    .add-btn {
      flex: 1;
      max-width: 250px;
    }

    .back-link {
      font-size: 0.9rem;
      color: var(--color-gray);
    }

    .back-link:hover {
      color: var(--color-gold);
    }

    @media (max-width: 768px) {
      .product-layout {
        grid-template-columns: 1fr;
        gap: var(--spacing-xl);
      }

      .product-actions {
        flex-direction: column;
      }

      .add-btn {
        max-width: 100%;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);

  product = signal<Product | null>(null);
  isLoading = signal(true);
  quantity = signal(1);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      try {
        const product = await this.supabase.getProductById(id);
        this.product.set(product);
      } catch (error) {
        console.error('Error loading product:', error);
      }
    }
    this.isLoading.set(false);
  }

  increaseQty() {
    const product = this.product();
    if (product && this.quantity() < product.stock) {
      this.quantity.update(q => q + 1);
    }
  }

  decreaseQty() {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  addToCart() {
    const product = this.product();
    if (product) {
      this.cartService.addProduct(product, this.quantity());
    }
  }
}
