import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [RouterLink, ScrollRevealDirective],
  template: `
    <main class="about-page">
      <!-- Hero Section -->
      <section class="about-hero" appScrollReveal>
        <div class="container">
          <div class="hero-content">
            <span class="eyebrow">Nuestra Historia</span>
            <h1>Sweet Bloom: El Arte de Endulzar Momentos</h1>
            <p class="lead">Desde el corazón de San Pedro Sula, transformamos ingredientes premium en joyas comestibles.</p>
          </div>
        </div>
      </section>

      <!-- Nuestra Esencia -->
      <section class="our-essence section-padding">
        <div class="container">
          <div class="essence-grid">
            <div class="essence-image" appScrollReveal animation="slide-right">
              <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80" alt="Nuestra cocina" class="img-fluid rounded-lg shadow-lg">
            </div>
            <div class="essence-text" appScrollReveal animation="slide-left">
              <h2 class="section-title">Pasión por la Excelencia</h2>
              <p>
                En Sweet Bloom, creemos que la repostería es mucho más que solo azúcar y harina; es una forma de arte que celebra los momentos más importantes de la vida. Nacimos en San Pedro Sula con la visión de elevar el estándar de la repostería artesanal en Honduras.
              </p>
              <p>
                Cada uno de nuestros productos, desde nuestros icónicos vasitos gourmet hasta nuestras mini tartas, es elaborado a mano, cuidando cada detalle visual y gustativo para ofrecerte una experiencia de lujo en cada bocado.
              </p>
              <div class="trust-indicators">
                <div class="trust-item">
                  <span class="icon">✨</span>
                  <div>
                    <strong>Ingredientes Premium</strong>
                    <p>Utilizamos solo las mejores materias primas locales e importadas.</p>
                  </div>
                </div>
                <div class="trust-item">
                  <span class="icon">🎨</span>
                  <div>
                    <strong>Diseño de Autor</strong>
                    <p>Cada postre es una pieza única diseñada para impresionar.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Valores / Confianza -->
      <section class="trust-section bg-cream section-padding" appScrollReveal>
        <div class="container text-center">
          <h2 class="section-title">¿Por qué confiar en nosotros?</h2>
          <div class="trust-grid">
            <div class="trust-card" appScrollReveal animation="slide-up" [delay]="100">
              <div class="card-icon">🏠</div>
              <h3>Orgullo Sampedrano</h3>
              <p>Somos una empresa local comprometida con nuestra comunidad en San Pedro Sula, apoyando a productores de la zona.</p>
            </div>
            <div class="trust-card" appScrollReveal animation="slide-up" [delay]="200">
              <div class="card-icon">🧼</div>
              <h3>Calidad e Higiene</h3>
              <p>Seguimos los más estrictos protocolos de seguridad alimentaria para garantizar tu salud y satisfacción.</p>
            </div>
            <div class="trust-card" appScrollReveal animation="slide-up" [delay]="300">
              <div class="card-icon">🚚</div>
              <h3>Puntualidad</h3>
              <p>Sabemos que tu celebración es importante; nos comprometemos a que tu pedido llegue perfecto y a tiempo.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Invitación -->
      <section class="cta-section section-padding text-center" appScrollReveal>
        <div class="container">
          <h2>¿Listo para vivir la experiencia Sweet Bloom?</h2>
          <p>Explora nuestro catálogo y descubre por qué somos la repostería favorita de Sula.</p>
          <div class="cta-actions">
            <a routerLink="/shop" class="btn btn-primary btn-lg">Ver Tienda</a>
            <a routerLink="/portfolio" class="btn btn-outline btn-lg">Ver Galería</a>
          </div>
        </div>
      </section>
    </main>
  `,
  styles: [`
    .about-page {
      overflow-x: hidden;
    }

    .section-padding {
      padding: var(--spacing-3xl) 0;
    }

    .bg-cream {
      background-color: var(--color-cream-dark);
      border-top: 1px solid rgba(120, 0, 0, 0.05);
      border-bottom: 1px solid rgba(120, 0, 0, 0.05);
    }

    /* Hero Section */
    .about-hero {
      background: linear-gradient(rgba(120, 0, 0, 0.8), rgba(120, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1600&q=80');
      background-size: cover;
      background-position: center;
      color: var(--color-white);
      padding: var(--spacing-3xl) 0;
      text-align: center;
    }

    .eyebrow {
      text-transform: uppercase;
      letter-spacing: 3px;
      font-weight: 700;
      color: var(--color-gold);
      margin-bottom: var(--spacing-md);
      display: block;
    }

    .about-hero h1 {
      color: var(--color-white);
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: var(--spacing-md);
    }

    .lead {
      font-size: 1.25rem;
      max-width: 700px;
      margin: 0 auto;
      opacity: 0.9;
    }

    /* Essence Grid */
    .essence-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-2xl);
      align-items: center;
    }

    .essence-image img {
      width: 100%;
      height: 500px;
      object-fit: cover;
      border-radius: var(--border-radius-lg);
    }

    .essence-text h2 {
      margin-bottom: var(--spacing-lg);
      font-size: 2.5rem;
    }

    .essence-text p {
      margin-bottom: var(--spacing-md);
      font-size: 1.1rem;
      line-height: 1.8;
      color: var(--color-gray);
    }

    .trust-indicators {
      display: grid;
      gap: var(--spacing-md);
      margin-top: var(--spacing-xl);
    }

    .trust-item {
      display: flex;
      gap: var(--spacing-md);
      align-items: flex-start;
    }

    .trust-item .icon {
      font-size: 1.5rem;
      background: var(--color-rose-pastel);
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .trust-item strong {
      display: block;
      color: var(--color-secondary);
      margin-bottom: 4px;
    }

    .trust-item p {
      font-size: 0.95rem;
      margin: 0;
    }

    /* Trust Grid */
    .trust-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--spacing-xl);
      margin-top: var(--spacing-2xl);
    }

    .trust-card {
      background: var(--color-white);
      padding: var(--spacing-xl);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-md);
      transition: transform 0.3s ease;
    }

    .trust-card:hover {
      transform: translateY(-10px);
    }

    .card-icon {
      font-size: 3rem;
      margin-bottom: var(--spacing-md);
    }

    .trust-card h3 {
      margin-bottom: var(--spacing-sm);
      color: var(--color-accent);
    }

    /* CTA Section */
    .cta-section h2 {
      font-size: 2.5rem;
      margin-bottom: var(--spacing-md);
    }

    .cta-section p {
      font-size: 1.2rem;
      color: var(--color-gray);
      margin-bottom: var(--spacing-xl);
    }

    .cta-actions {
      display: flex;
      gap: var(--spacing-md);
      justify-content: center;
    }

    @media (max-width: 992px) {
      .essence-grid {
        grid-template-columns: 1fr;
        gap: var(--spacing-xl);
      }
      
      .essence-image {
        order: 2;
      }
      
      .essence-text {
        order: 1;
      }

      .essence-image img {
        height: 350px;
      }
    }

    @media (max-width: 768px) {
      .section-padding {
        padding: var(--spacing-2xl) 0;
      }

      .cta-actions {
        flex-direction: column;
        align-items: center;
      }

      .cta-actions .btn {
        width: 100%;
        max-width: 300px;
      }
    }
  `]
})
export class NosotrosComponent {}
