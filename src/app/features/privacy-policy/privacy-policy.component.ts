import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [RouterLink, ScrollRevealDirective],
  template: `
    <main class="legal-page">
      <section class="legal-hero" appScrollReveal>
        <div class="container">
          <h1>Política de Privacidad</h1>
          <p class="lead">Comprometidos con la seguridad de tu información.</p>
        </div>
      </section>

      <section class="legal-content section-padding">
        <div class="container narrow-container" appScrollReveal animation="slide-up">
          <div class="legal-card shadow-lg">
            <h2>1. Compromiso con la Privacidad (Alineado a HIPAA)</h2>
            <p>
              En Sweet Bloom, valoramos profundamente la privacidad de nuestros clientes. Aunque somos una repostería, entendemos que la información sobre alergias alimentarias, restricciones dietéticas y condiciones de salud relacionadas con la alimentación es información sensible. 
              Por ello, aplicamos estándares inspirados en la <strong>Ley de Portabilidad y Responsabilidad de Seguros de Salud (HIPAA)</strong> para garantizar que tus datos de salud sean tratados con la máxima confidencialidad.
            </p>

            <h2>2. Información que Recopilamos</h2>
            <p>Recopilamos únicamente la información necesaria para procesar tus pedidos y garantizar tu seguridad:</p>
            <ul>
              <li><strong>Datos de contacto:</strong> Nombre, dirección, teléfono y correo electrónico.</li>
              <li><strong>Datos de Transacción:</strong> Detalles de pedidos y preferencias de entrega.</li>
            </ul>

            <h2>3. Uso y Protección de Datos</h2>
            <p>
              Tus datos se utilizan exclusivamente para la personalización de productos y logística de entrega. No compartimos, vendemos ni divulgamos tu información personal a terceros sin tu consentimiento explícito, salvo requerimiento legal.
              Implementamos medidas de seguridad físicas y digitales para proteger el acceso no autorizado a tu "Información de Salud Protegida" (PHI) dentro de nuestro sistema.
            </p>

            <h2>4. Tus Derechos</h2>
            <p>
              Tienes derecho a acceder, rectificar o solicitar la eliminación de tus datos personales en cualquier momento. Puedes contactarnos a <strong>sac&#64;sweetbloom.com</strong> para cualquier solicitud relacionada con tu privacidad.
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
      background: linear-gradient(rgba(120, 0, 0, 0.8), rgba(120, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1454165833767-027ff33027b4?w=1600&q=80');
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

    .legal-card ul {
      margin-bottom: var(--spacing-md);
      padding-left: var(--spacing-xl);
    }

    .legal-card li {
      margin-bottom: var(--spacing-xs);
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
export class PrivacyPolicyComponent {}
