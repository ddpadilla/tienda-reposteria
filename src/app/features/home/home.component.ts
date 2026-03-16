import { Component, OnInit, inject, signal, OnDestroy, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';
import { CartService } from '../../core/services/cart.service';
import { Product, HeroSlide } from '../../core/models';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ProductCardComponent, LoadingSpinnerComponent, ScrollRevealDirective],
  template: `
    <main>
      <!-- Hero Carousel -->
      <section class="hero-carousel">
        @if (heroSlides().length > 0) {
          <div class="carousel">
            @for (slide of heroSlides(); track slide.id; let i = $index) {
              <div 
                class="carousel-slide"
                [class.active]="currentSlide() === i"
                [class.loading]="!isImageLoaded(slide.image_url)"
                [style.backgroundImage]="isImageLoaded(slide.image_url) ? 'url(' + slide.image_url + ')' : ''"
              >
                <div class="carousel-overlay"></div>
                <div class="carousel-content">
                  @if (slide.title) {
                    <h1 class="hero-title">{{ slide.title }}</h1>
                  }
                  @if (slide.subtitle) {
                    <p class="hero-subtitle">{{ slide.subtitle }}</p>
                  }
                  @if (slide.button_text) {
                    <a [routerLink]="slide.button_link || '/shop'" class="btn btn-gold">
                      {{ slide.button_text }}
                    </a>
                  }
                </div>
              </div>
            }
            
            @if (heroSlides().length > 1) {
              <button class="carousel-btn prev" (click)="prevSlide()" aria-label="Anterior">‹</button>
              <button class="carousel-btn next" (click)="nextSlide()" aria-label="Siguiente">›</button>
              <div class="carousel-dots">
                @for (slide of heroSlides(); track slide.id; let i = $index) {
                  <button 
                    class="carousel-dot"
                    [class.active]="currentSlide() === i"
                    (click)="goToSlide(i)"
                    [attr.aria-label]="'Slide ' + (i + 1)"
                  ></button>
                }
              </div>
            }
          </div>
        } @else {
          <!-- Fallback hero sin slides -->
          <section class="hero">
            <div class="hero-content">
              <h1 class="hero-title animate-slideUp">Repostería de Alta Gama para Momentos Únicos</h1>
              <p class="hero-subtitle animate-slideUp">
                Descubre nuestra colección de postres artesanales elaborados con los mejores ingredientes
              </p>
              <a routerLink="/shop" class="btn btn-gold animate-slideUp">Ver Catálogo</a>
            </div>
            <div class="hero-decoration"></div>
          </section>
        }
      </section>

      <!-- Categorías -->
      <section class="categories" appScrollReveal>
        <div class="container">
          <h2 class="section-title" appScrollReveal animation="fade" [delay]="0">Explorar por Categoría</h2>
          <div class="category-grid">
            <a routerLink="/shop" [queryParams]="{category: 'cups'}" class="category-card" appScrollReveal animation="slide-up" [delay]="100">
              <div class="category-icon">🍨</div>
              <h3>Vasitos Gourmet</h3>
            </a>
            <a routerLink="/shop" [queryParams]="{category: 'mini-cakes'}" class="category-card" appScrollReveal animation="slide-up" [delay]="200">
              <div class="category-icon">🎂</div>
              <h3>Mini Tartas</h3>
            </a>
            <a routerLink="/shop" [queryParams]="{category: 'molds'}" class="category-card" appScrollReveal animation="slide-up" [delay]="300">
              <div class="category-icon">🍫</div>
              <h3>Ediciones Especiales</h3>
            </a>
          </div>
        </div>
      </section>

      <!-- Valores -->
      <section class="values" appScrollReveal>
        <div class="container">
          <h2 class="section-title">Una Experiencia de Lujo</h2>
          <p class="section-subtitle">
            Nuestra repostería no es solo comida, es un viaje sensorial diseñado para elevar cada celebración
          </p>
            <div class="values-grid">
            <div class="value-card" appScrollReveal animation="slide-up" [delay]="0">
              <div class="value-icon">🌿</div>
              <h3>Ingredientes de Primera</h3>
              <p>Seleccionamos meticulosamente cada materia prima para asegurar la máxima frescura y pureza</p>
            </div>
            <div class="value-card" appScrollReveal animation="slide-up" [delay]="100">
              <div class="value-icon">🎁</div>
              <h3>Regalos de Alta Gama</h3>
              <p>Nuestros formatos individuales son la pieza central perfecta para cualquier obsequio sofisticado</p>
            </div>
            <div class="value-card" appScrollReveal animation="slide-up" [delay]="200">
              <div class="value-icon">✨</div>
              <h3>Portabilidad Creativa</h3>
              <p>Nuestros envases innovadores permiten llevar la elegancia a cualquier lugar</p>
            </div>
            <div class="value-card" appScrollReveal animation="slide-up" [delay]="300">
              <div class="value-icon">♻️</div>
              <h3>Compromiso Sustentable</h3>
              <p>Moldes reutilizables y materiales eco-conscientes que reflejan nuestro amor por la naturaleza</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Productos Destacados -->
      <section class="featured-products">
        <div class="container">
          <h2 class="section-title">Productos Destacados</h2>
          @if (isLoading()) {
            <app-loading-spinner />
          } @else {
            <div class="products-grid">
              @for (product of featuredProducts(); track product.id) {
                <app-product-card 
                  [product]="product"
                  (addToCart)="addToCart($event)"
                />
              }
            </div>
          }
          <div class="section-cta">
            <a routerLink="/shop" class="btn btn-secondary">Ver Todos los Productos</a>
          </div>
        </div>
      </section>

      <!-- About con Parallax -->
      <section class="about parallax-section" appScrollReveal>
        <div class="parallax-bg" [style.backgroundImage]="'url(https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1920&q=80)'"></div>
        <div class="parallax-overlay"></div>
        <div class="container">
          <div class="about-content">
            <h2>Nuestra Visión de la Repostería Artesanal</h2>
            <p>
              Cada creación en Sweet Bloom es el resultado de una búsqueda incansable de la perfección. 
              Fusionamos técnicas tradicionales con un diseño visual vanguardista para transformar 
              ingredientes premium en joyas comestibles. Nuestro compromiso con lo artesanal significa 
              que cada detalle, desde la textura de una crema hasta la portabilidad de nuestros vasitos, 
              está pensado para ofrecerte un momento de indulgencia inigualable.
            </p>
          </div>
        </div>
      </section>
    </main>
  `,
  styles: [`
    /* Hero Carousel */
    .hero-carousel {
      position: relative;
      height: 80vh;
      min-height: 500px;
      overflow: hidden;
    }

    .carousel {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .carousel-slide {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      opacity: 0;
      transition: opacity 0.8s ease-in-out;
    }

    .carousel-slide.active {
      opacity: 1;
    }

    .carousel-slide.loading {
      background-color: var(--color-cream-dark);
      background-image: none !important;
    }

    .carousel-slide.loading::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    .carousel-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%);
    }

    .carousel-content {
      position: relative;
      z-index: 2;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: var(--spacing-2xl);
      max-width: 800px;
      margin: 0 auto;
    }

    .carousel-content .hero-title {
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: var(--spacing-lg);
      color: var(--color-white);
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }

    .carousel-content .hero-subtitle {
      font-size: 1.25rem;
      color: var(--color-cream);
      margin-bottom: var(--spacing-xl);
      text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
      max-width: 600px;
    }

    .carousel-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 50px;
      height: 50px;
      background: rgba(255,255,255,0.2);
      border: none;
      border-radius: 50%;
      color: white;
      font-size: 2rem;
      cursor: pointer;
      transition: background 0.3s;
      z-index: 10;
    }

    .carousel-btn:hover {
      background: rgba(255,255,255,0.4);
    }

    .carousel-btn.prev { left: 20px; }
    .carousel-btn.next { right: 20px; }

    .carousel-dots {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 10px;
      z-index: 10;
    }

    .carousel-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(255,255,255,0.5);
      border: none;
      cursor: pointer;
      transition: background 0.3s;
    }

    .carousel-dot.active {
      background: var(--color-white);
    }

    /* Hero fallback */
    .hero {
      position: relative;
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: var(--spacing-3xl) var(--spacing-md);
      background: linear-gradient(135deg, var(--color-cream) 0%, var(--color-rose-pastel) 100%);
      overflow: hidden;
    }

    .hero-content {
      position: relative;
      z-index: 2;
      max-width: 700px;
    }

    .hero-title {
      font-size: clamp(2rem, 5vw, 3.5rem);
      margin-bottom: var(--spacing-lg);
      color: var(--color-brown);
    }

    .hero-subtitle {
      font-size: 1.2rem;
      color: var(--color-brown-light);
      margin-bottom: var(--spacing-xl);
      line-height: 1.8;
    }

    .hero-decoration {
      position: absolute;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      background: radial-gradient(circle, var(--color-gold-light) 0%, transparent 70%);
      opacity: 0.3;
      top: -200px;
      right: -200px;
    }

    /* Categorías */
    .categories {
      padding: var(--spacing-3xl) 0;
    }

    .section-title {
      text-align: center;
      margin-bottom: var(--spacing-xl);
    }

    .category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-lg);
    }

    .category-card {
      background: var(--color-white);
      padding: var(--spacing-xl);
      border-radius: var(--border-radius-lg);
      text-align: center;
      box-shadow: var(--shadow-sm);
      transition: transform var(--transition-normal), box-shadow var(--transition-normal);
    }

    .category-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
    }

    .category-icon {
      font-size: 3rem;
      margin-bottom: var(--spacing-md);
    }

    .category-card h3 {
      font-family: var(--font-serif);
      font-size: 1.25rem;
    }

    /* Valores */
    .values {
      padding: var(--spacing-3xl) 0;
      background: var(--color-cream-dark);
    }

    .section-subtitle {
      text-align: center;
      max-width: 600px;
      margin: 0 auto var(--spacing-xl);
      color: var(--color-gray);
    }

    .values-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--spacing-lg);
    }

    .value-card {
      text-align: center;
      padding: var(--spacing-lg);
    }

    .value-icon {
      font-size: 2.5rem;
      margin-bottom: var(--spacing-md);
    }

    .value-card h3 {
      font-size: 1.1rem;
      margin-bottom: var(--spacing-sm);
    }

    .value-card p {
      font-size: 0.9rem;
      color: var(--color-gray);
      line-height: 1.7;
    }

    /* Productos */
    .featured-products {
      padding: var(--spacing-3xl) 0;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-xl);
    }

    .section-cta {
      text-align: center;
    }

    /* About con Parallax */
    .parallax-section {
      position: relative;
      padding: var(--spacing-3xl) 0;
      overflow: hidden;
    }

    .parallax-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 120%;
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      z-index: -1;
    }

    .parallax-overlay {
      position: absolute;
      inset: 0;
      background: rgba(61, 44, 44, 0.85);
      z-index: 0;
    }

    .parallax-section .container {
      position: relative;
      z-index: 1;
    }

    .about {
      padding: var(--spacing-3xl) 0;
      background: var(--color-brown);
      color: var(--color-cream);
    }

    .about h2 {
      color: var(--color-gold);
      margin-bottom: var(--spacing-lg);
    }

    .about-content {
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
    }

    .about p {
      font-size: 1.1rem;
      line-height: 1.9;
      opacity: 0.9;
    }

    @media (max-width: 768px) {
      .hero {
        min-height: 60vh;
      }

      .category-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .hero-carousel .carousel-content {
        padding: var(--spacing-md);
      }

      .hero-carousel .hero-title {
        font-size: 1.75rem;
      }

      .hero-carousel .hero-subtitle {
        font-size: 1rem;
      }
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  private supabase = inject(SupabaseService);
  private cartService = inject(CartService);

  featuredProducts = signal<Product[]>([]);
  heroSlides = signal<HeroSlide[]>([]);
  currentSlide = signal(0);
  isLoading = signal(true);
  private slideInterval: any;
  loadedImages = signal<Set<string>>(new Set());

  async ngOnInit() {
    try {
      const [products, slides] = await Promise.all([
        this.supabase.getActiveProducts(),
        this.supabase.getHeroSlides()
      ]);
      this.featuredProducts.set(products.slice(0, 6));
      this.heroSlides.set(slides);
      
      // Preload images
      this.preloadImages(slides);
      
      if (slides.length > 1) {
        this.startAutoSlide();
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  preloadImages(slides: HeroSlide[]) {
    slides.forEach((slide, index) => {
      if (slide.image_url) {
        const img = new Image();
        img.onload = () => {
          this.loadedImages.update(set => {
            const newSet = new Set(set);
            newSet.add(slide.image_url!);
            return newSet;
          });
        };
        img.onerror = () => {
          console.error('Error loading image:', slide.image_url);
        };
        img.src = slide.image_url;
        
        // Show first image immediately
        if (index === 0) {
          this.currentSlide.set(0);
        }
      }
    });
  }

  isImageLoaded(url: string): boolean {
    return this.loadedImages().has(url);
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  startAutoSlide() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide() {
    this.currentSlide.update(i => (i + 1) % this.heroSlides().length);
  }

  prevSlide() {
    this.currentSlide.update(i => (i - 1 + this.heroSlides().length) % this.heroSlides().length);
  }

  goToSlide(index: number) {
    this.currentSlide.set(index);
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.startAutoSlide();
    }
  }

  addToCart(product: Product) {
    this.cartService.addProduct(product);
  }
}
