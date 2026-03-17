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
      <!-- Hero Carousel Refactorizado -->
      <section class="hero-section">
        @if (heroSlides().length > 0) {
          <div class="hero-carousel-container">
            @for (slide of heroSlides(); track slide.id; let i = $index) {
              <div class="hero-slide" [class.active]="currentSlide() === i">

                <!-- Columna Texto -->
                <div class="hero-content-split">
                  <div class="hero-text-wrapper">
                    <span class="hero-eyebrow">Sweet Bloom</span>
                    @if (slide.title) {
                      <h1 class="hero-title-split">
                        {{ slide.title }}
                      </h1>
                    }
                    @if (slide.subtitle) {
                      <p class="hero-subtitle-split">{{ slide.subtitle }}</p>
                    }
                    <div class="hero-actions">
                      @if (slide.button_text) {
                        <a [routerLink]="slide.button_link || '/shop'" class="btn btn-pill btn-primary">
                          {{ slide.button_text }}
                        </a>
                      }
                      <a routerLink="/portfolio" class="btn btn-pill btn-outline">
                        Ver Galería
                      </a>
                    </div>
                  </div>
                </div>

                <!-- Columna Visual -->
                <div class="hero-visual-split">
                  <!-- Decoraciones abstractas CSS -->
                  <div class="shape-star shape-1">✦</div>
                  <div class="shape-star shape-2">✦</div>

                  <!-- Contenedor de imagen estilo "Pill/Arch" -->
                  <div class="hero-image-frame" [class.loading]="!isImageLoaded(slide.image_url)">
                    @if (isImageLoaded(slide.image_url)) {
                      <img [src]="slide.image_url" [alt]="slide.title" class="hero-img">
                    }
                  </div>
                </div>

              </div>
            }

            <!-- Controles integrados -->
            @if (heroSlides().length > 1) {
              <div class="hero-controls">
                <button class="nav-arrow" (click)="prevSlide()" aria-label="Anterior">←</button>
                <div class="hero-dots">
                  @for (slide of heroSlides(); track slide.id; let i = $index) {
                    <button
                      class="dot"
                      [class.active]="currentSlide() === i"
                      (click)="goToSlide(i)"
                      [attr.aria-label]="'Ir a slide ' + (i + 1)"
                    ></button>
                  }
                </div>
                <button class="nav-arrow" (click)="nextSlide()" aria-label="Siguiente">→</button>
              </div>
            }
          </div>
        } @else {
          <!-- Loading State -->
          <div class="hero-loading-container">
            <img src="assets/load-logo.png" alt="Cargando..." class="hero-load-logo">
          </div>
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
    /* --- NUEVO HERO SPLIT-SCREEN --- */
    .hero-section {
      background-color: var(--color-base); /* Fondo crema limpio */
      position: relative;
      overflow: hidden;
      min-height: 700px;
      display: flex;
      align-items: center;
      padding: var(--spacing-md) var(--spacing-md) var(--spacing-xl) var(--spacing-md);
    }

    .hero-carousel-container {
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
      position: relative;
      min-height: 600px; /* Altura fija para evitar saltos */
      display: flex;
      align-items: center;
    }

    .hero-slide {
      position: absolute;
      inset: 0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-2xl);
      align-items: center;
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease, visibility 0.6s;
    }

    .hero-slide.active {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
      position: relative; /* El slide activo da la altura real si excede el min-height */
      z-index: 1;
    }

    /* Columna de Texto */
    .hero-content-split {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: var(--spacing-xl);
      z-index: 2;
    }

    .hero-eyebrow {
      font-family: var(--font-sans);
      text-transform: uppercase;
      letter-spacing: 2px;
      font-weight: 700;
      color: var(--color-accent);
      margin-bottom: var(--spacing-sm);
      display: block;
    }

    .hero-title-split {
      font-size: clamp(3rem, 6vw, 5rem);
      line-height: 1.1;
      color: var(--color-secondary);
      margin-bottom: var(--spacing-lg);
      font-family: var(--font-serif);
      font-weight: 700;
    }

    /* Estilo para simular el contraste de fuentes de la imagen */
    .hero-title-split em {
      color: var(--color-gold);
      font-style: italic;
      font-weight: 400;
    }

    .hero-subtitle-split {
      font-size: 1.25rem;
      color: var(--color-text);
      line-height: 1.6;
      max-width: 500px;
      margin-bottom: var(--spacing-xl);
      opacity: 0.9;
    }

    .hero-actions {
      display: flex;
      gap: var(--spacing-md);
      align-items: center;
    }

    .btn-pill {
      border-radius: 999px; /* Botones redondos estilo referencia */
      padding: 1rem 2.5rem;
    }

    /* Columna Visual */
    .hero-visual-split {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 600px;
    }

    .hero-image-frame {
      width: 400px;
      height: 550px;
      background-color: var(--color-gold-light);
      border-radius: 200px; /* Forma de píldora vertical */
      overflow: hidden;
      position: relative;
      z-index: 2;
      box-shadow: 0 20px 40px rgba(120, 0, 0, 0.1);
      transform: rotate(-3deg); /* Ligera inclinación para dinamismo */
      transition: transform 0.5s ease;
    }

    .hero-image-frame:hover {
      transform: rotate(0deg) scale(1.02);
    }

    .hero-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Decoraciones Abstractas */
    .shape-star {
      position: absolute;
      color: var(--color-gold);
      font-size: 3rem;
      z-index: 1;
      animation: float 6s ease-in-out infinite;
    }

    .shape-1 {
      top: 10%;
      left: 10%;
      font-size: 4rem;
    }

    .shape-2 {
      bottom: 15%;
      right: 15%;
      font-size: 2.5rem;
      color: var(--color-accent);
      animation-delay: -3s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(10deg); }
    }

    /* Estado de Carga */
    .hero-image-frame.loading::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
      background-color: var(--color-cream-dark);
      animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    .placeholder-art {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, var(--color-gold-light), var(--color-rose-pastel));
    }

    /* Hero Loading */
    .hero-loading-container {
      width: 100%;
      height: 600px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .hero-load-logo {
      width: 250px;
      height: auto;
      animation: bounce 2s infinite;
      filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1));
    }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-30px);
      }
      60% {
        transform: translateY(-15px);
      }
    }

    /* Controles Integrados */
    .hero-controls {
      position: absolute;
      bottom: 0;
      left: var(--spacing-xl);
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      z-index: 10;
    }

    .nav-arrow {
      background: transparent;
      border: 1px solid var(--color-secondary);
      color: var(--color-secondary);
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .nav-arrow:hover {
      background: var(--color-secondary);
      color: var(--color-white);
    }

    .hero-dots {
      display: flex;
      gap: 8px;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba(120, 0, 0, 0.2);
      border: none;
      cursor: pointer;
      transition: all 0.3s;
    }

    .dot.active {
      background: var(--color-secondary);
      transform: scale(1.3);
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .hero-slide {
        grid-template-columns: 1fr;
        gap: var(--spacing-xl);
        text-align: center;
      }

      .hero-content-split {
        padding-left: 0;
        align-items: center;
      }

      .hero-actions {
        justify-content: center;
      }

      .hero-controls {
        position: relative;
        left: 0;
        justify-content: center;
        margin-top: var(--spacing-xl);
      }

      .hero-visual-split {
        height: auto;
        padding: var(--spacing-xl) 0;
      }

      .hero-image-frame {
        width: 300px;
        height: 420px;
      }
    }

    @media (max-width: 768px) {
      .hero-title-split {
        font-size: 2.5rem;
      }
      .hero-actions {
        flex-direction: column;
        width: 100%;
      }
      .hero-actions .btn {
        width: 100%;
      }
      .hero-image-frame {
        width: 250px;
        height: 350px;
      }
    }

    /* Categorías */
    .categories {
      padding: var(--spacing-2xl) 0 var(--spacing-3xl) 0;
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
      transition: transform var(--transition-slow), box-shadow var(--transition-slow);
    }

    .category-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-lg);
    }

    .category-icon {
      font-size: 3rem;
      margin-bottom: var(--spacing-md);
      transition: transform var(--transition-slow);
    }

    .category-card:hover .category-icon {
      transform: scale(1.1) rotate(5deg);
    }

    .category-card h3 {
      font-family: var(--font-serif);
      font-size: 1.25rem;
      color: var(--color-brown);
      text-decoration: none;
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
      background: transparent;
      border-radius: var(--border-radius-md);
      transition: transform var(--transition-slow), background-color var(--transition-slow);
    }

    .value-card:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.5);
    }

    .value-icon {
      font-size: 2.5rem;
      margin-bottom: var(--spacing-md);
      transition: transform var(--transition-slow);
    }

    .value-card:hover .value-icon {
      transform: scale(1.1);
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
