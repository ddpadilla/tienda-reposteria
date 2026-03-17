import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../core/services/supabase.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [RouterLink, FormsModule, ProductCardComponent, LoadingSpinnerComponent],
  template: `
    <main class="shop-page">
      <div class="container">
        <header class="shop-header">
          <h1>Tienda</h1>
          <p class="shop-count">{{ products().length }} productos</p>
        </header>

        <div class="shop-layout">
          <!-- Filtros -->
          <aside class="filters">
            <div class="filter-section">
              <h3>Categorías</h3>
              <div class="filter-options">
                <div class="filter-option">
                  <input 
                    type="radio" 
                    id="cat-all"
                    name="category" 
                    value=""
                    [(ngModel)]="selectedCategory"
                    (change)="filterProducts()"
                  >
                  <label for="cat-all">Todos</label>
                </div>
                <div class="filter-option">
                  <input 
                    type="radio" 
                    id="cat-cups"
                    name="category" 
                    value="cups"
                    [(ngModel)]="selectedCategory"
                    (change)="filterProducts()"
                  >
                  <label for="cat-cups">Cups</label>
                </div>
                <div class="filter-option">
                  <input 
                    type="radio" 
                    id="cat-mini-cakes"
                    name="category" 
                    value="mini-cakes"
                    [(ngModel)]="selectedCategory"
                    (change)="filterProducts()"
                  >
                  <label for="cat-mini-cakes">Mini Cakes</label>
                </div>
                <div class="filter-option">
                  <input 
                    type="radio" 
                    id="cat-molds"
                    name="category" 
                    value="molds"
                    [(ngModel)]="selectedCategory"
                    (change)="filterProducts()"
                  >
                  <label for="cat-molds">Molds</label>
                </div>
              </div>
            </div>

            <div class="filter-section">
              <h3>Precio</h3>
              <div class="price-range">
                <input 
                  type="range" 
                  min="0" 
                  max="600" 
                  step="50"
                  [(ngModel)]="maxPrice"
                  (input)="filterProducts()"
                >
                <span class="price-label">Hasta L {{ maxPrice }}</span>
              </div>
            </div>
          </aside>

          <!-- Productos -->
          <section class="products-section">
            @if (isLoading()) {
              <app-loading-spinner />
            } @else if (filteredProducts().length === 0) {
              <div class="no-products">
                <p>No se encontraron productos</p>
              </div>
            } @else {
              <div class="products-grid">
                @for (product of filteredProducts(); track product.id) {
                  <app-product-card 
                    [product]="product"
                    (addToCart)="addToCart($event)"
                  />
                }
              </div>
            }
          </section>
        </div>
      </div>
    </main>
  `,
  styles: [`
    .shop-page {
      padding: var(--spacing-xl) 0 var(--spacing-3xl);
    }

    .shop-header {
      margin-bottom: var(--spacing-xl);
    }

    .shop-header h1 {
      margin-bottom: var(--spacing-xs);
    }

    .shop-count {
      color: var(--color-gray);
    }

    .shop-layout {
      display: grid;
      grid-template-columns: 250px 1fr;
      gap: var(--spacing-xl);
    }

    /* Filtros */
    .filters {
      position: sticky;
      top: 100px;
      height: fit-content;
    }

    .filter-section {
      background: var(--color-white);
      padding: var(--spacing-lg);
      border-radius: var(--border-radius-md);
      margin-bottom: var(--spacing-md);
      box-shadow: var(--shadow-sm);
    }

    .filter-section h3 {
      font-family: var(--font-sans);
      font-size: 0.9rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: var(--spacing-md);
      color: var(--color-brown-light);
    }

    .filter-options {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .filter-option {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .filter-option label {
      cursor: pointer;
      width: 100%;
    }

    .filter-option input {
      accent-color: var(--color-gold);
      cursor: pointer;
      width: 1.2rem;
      height: 1.2rem;
    }

    .price-range {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .price-range input[type="range"] {
      width: 100%;
      accent-color: var(--color-gold);
      cursor: pointer;
    }

    .price-label {
      font-size: 0.9rem;
      color: var(--color-gray);
    }

    /* Productos */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: var(--spacing-lg);
    }

    .no-products {
      text-align: center;
      padding: var(--spacing-3xl);
      color: var(--color-gray);
    }

    @media (max-width: 900px) {
      .shop-layout {
        grid-template-columns: 1fr;
      }

      .filters {
        position: static;
        display: flex;
        gap: var(--spacing-md);
        flex-wrap: wrap;
      }

      .filter-section {
        flex: 1;
        min-width: 200px;
      }
    }
  `]
})
export class ShopComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);

  products = signal<Product[]>([]);
  filteredProducts = signal<Product[]>([]);
  isLoading = signal(true);

  selectedCategory = '';
  maxPrice = 600;

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory = params['category'];
      }
    });

    try {
      const products = await this.supabase.getActiveProducts();
      this.products.set(products);
      this.filterProducts();
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  filterProducts() {
    let filtered = this.products();

    if (this.selectedCategory) {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    filtered = filtered.filter(p => p.price_hnl <= this.maxPrice);

    this.filteredProducts.set(filtered);
  }

  addToCart(product: Product) {
    this.cartService.addProduct(product);
  }
}
