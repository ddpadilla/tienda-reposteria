import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-legal-notice',
  standalone: true,
  imports: [RouterLink, ScrollRevealDirective],
  template: `
    <main class="legal-page">
      <section class="legal-hero" appScrollReveal>
        <div class="container">
          <h1>Aviso Legal</h1>
          <p class="lead">Información importante sobre el uso de nuestro sitio.</p>
        </div>
      </section>

      <section class="legal-content section-padding">
        <div class="container narrow-container" appScrollReveal animation="slide-up">
          <div class="legal-card shadow-lg">
            <h2>1. Identificación del Titular</h2>
            <p>
              En cumplimiento con los estándares de transparencia, se informa que este sitio web es operado bajo la marca comercial <strong>Sweet Bloom</strong>, con domicilio social en San Pedro Sula, Honduras. 
              Para cualquier consulta, puede contactarnos a través del correo electrónico: <strong>sac&#64;sweetbloom.com</strong>.
            </p>

            <h2>2. Propiedad Intelectual</h2>
            <p>
              Todos los contenidos de este sitio web, incluyendo textos, fotografías, logotipos, iconos, imágenes, así como el diseño gráfico y código fuente, son propiedad de Sweet Bloom o de sus respectivos autores bajo licencia. 
              Queda prohibida su reproducción, distribución o transformación sin la autorización expresa y por escrito de los titulares.
            </p>

            <h2>3. Condiciones de Uso</h2>
            <p>
              El usuario se compromete a hacer un uso adecuado de los contenidos y servicios que Sweet Bloom ofrece a través de su portal. 
              Sweet Bloom se reserva el derecho de efectuar sin previo aviso las modificaciones que considere oportunas en su portal, pudiendo cambiar, suprimir o añadir tanto los contenidos y servicios que se presten a través del mismo como la forma en la que estos aparezcan presentados o localizados.
            </p>

            <h2>4. Limitación de Responsabilidad</h2>
            <p>
              Sweet Bloom no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de virus o programas maliciosos en los contenidos, a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.
            </p>

            <div class="last-update">
              <p><em>Última actualización: 18 de marzo de 2026</em></p>
            </div>

            <div class="cta-back">
              <a routerLink="/shop" class="btn btn-primary">Volver a la Tienda</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  `,
  styles: [`
    .legal-page {
      background-color: var(--color-white);
    }

    .section-padding {
      padding: var(--spacing-2xl) 0;
    }

    .narrow-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .legal-hero {
      background: linear-gradient(rgba(120, 0, 0, 0.8), rgba(120, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1589232390616-7904e6e0f6fc?w=1600&q=80');
      background-size: cover;
      background-position: center;
      color: var(--color-white);
      padding: var(--spacing-3xl) 0;
      text-align: center;
    }

    .legal-hero h1 {
      color: var(--color-white);
      font-size: clamp(2rem, 5vw, 3.5rem);
      margin-bottom: var(--spacing-sm);
    }

    .lead {
      font-size: 1.25rem;
      opacity: 0.9;
    }

    .legal-card {
      background: var(--color-white);
      padding: var(--spacing-2xl);
      border-radius: var(--border-radius-lg);
      line-height: 1.8;
      color: var(--color-gray);
    }

    .legal-card h2 {
      color: var(--color-accent);
      margin: var(--spacing-xl) 0 var(--spacing-md) 0;
      font-size: 1.5rem;
      border-bottom: 2px solid var(--color-rose-pastel);
      padding-bottom: 8px;
    }

    .legal-card h2:first-of-type {
      margin-top: 0;
    }

    .legal-card p {
      margin-bottom: var(--spacing-md);
    }

    .last-update {
      margin-top: var(--spacing-2xl);
      padding-top: var(--spacing-md);
      border-top: 1px solid var(--color-cream-dark);
      font-size: 0.9rem;
    }

    .cta-back {
      margin-top: var(--spacing-xl);
      text-align: center;
    }

    @media (max-width: 768px) {
      .legal-card {
        padding: var(--spacing-lg);
      }
    }
  `]
})
export class LegalNoticeComponent {}
