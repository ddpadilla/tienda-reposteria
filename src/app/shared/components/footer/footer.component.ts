import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-brand">
          <img src="assets/nvologo-removebg-preview.png" alt="Sweet Bloom Logo" class="footer-logo-img">
          <h3 class="footer-logo">Sweet Bloom</h3>
          <p class="footer-tagline">Artesanía dulce. Hecho con amor.</p>
        </div>

        <div class="footer-links">
          <h4>Explorar</h4>
          <ul>
            <li><a routerLink="/">Inicio</a></li>
            <li><a routerLink="/portfolio">Portfolio</a></li>
            <li><a routerLink="/shop">Tienda</a></li>
            <li><a routerLink="/nosotros">Nosotros</a></li>
          </ul>
        </div>

        <div class="footer-contact">
          <h4>Contáctanos</h4>
          <p>San Pedro Sula, Honduras</p>
          <p>+504 5555-6756</p>
          <p>sac&#64;sweetbloom.com</p>
        </div>

        <div class="footer-social">
          <h4>Síguenos</h4>
          <div class="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener" aria-label="TikTok">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-bottom-container">
          <p>&copy; 2026 Sweet Bloom. Todos los derechos reservados.</p>
          <div class="footer-legal">
            <a routerLink="/aviso-legal">Aviso Legal</a>
            <a routerLink="/privacidad">Privacidad</a>
            <a routerLink="/admin">Administrador</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--color-accent); /* Rojo Brillante */
      color: var(--color-white);
      margin-top: var(--spacing-xl);
    }

    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--spacing-xl) var(--spacing-md);
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-xl);
    }

    .footer-brand {
      display: flex;
      flex-direction: column;
      align-items: flex-start; /* Alineación matemática estricta a la izquierda */
      justify-content: flex-start;
    }

    .footer-logo-img {
      height: 80px;
      width: auto;
      margin: 0 0 var(--spacing-sm) 0; /* Sin margen izquierdo/derecho */
      filter: brightness(0) invert(1);
      display: block;
      object-fit: contain;
      object-position: left center;
    }

    .footer-logo {
      font-family: var(--font-serif);
      font-size: 1.75rem;
      color: var(--color-white);
      margin: 0 0 var(--spacing-sm) 0; /* Sin margen izquierdo */
      font-weight: 700;
    }

    .footer-tagline {
      font-style: italic;
      opacity: 0.9;
    }

    .footer-links h4,
    .footer-contact h4,
    .footer-social h4 {
      font-family: var(--font-sans);
      font-size: 1rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: var(--spacing-md);
      color: var(--color-white);
      border-bottom: 2px solid var(--color-secondary);
      display: inline-block;
      padding-bottom: 4px;
    }

    .footer-links ul {
      list-style: none;
    }

    .footer-links li {
      margin-bottom: var(--spacing-sm);
    }

    .footer-links a {
      color: rgba(255, 255, 255, 0.85);
      transition: transform var(--transition), color var(--transition);
      text-decoration: none;
      display: inline-block;
    }

    .footer-links a:hover,
    .footer-links a:focus-visible {
      color: var(--color-white);
      transform: translateX(6px);
    }

    .footer-contact p {
      opacity: 0.9;
      margin-bottom: var(--spacing-xs);
    }

    .social-links {
      display: flex;
      gap: var(--spacing-md);
    }

    .social-links a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: var(--border-radius-md);
      color: var(--color-white);
      transition: var(--transition);
    }

    .social-links a:hover {
      background: var(--color-white);
      color: var(--color-accent);
      transform: translateY(-5px);
    }

    .footer-bottom {
      background: var(--color-secondary); /* Granate */
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .footer-bottom-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--spacing-md);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--spacing-md);
    }

    .footer-bottom p {
      font-size: 0.85rem;
      opacity: 0.8;
    }

    .footer-legal {
      display: flex;
      gap: var(--spacing-lg);
    }

    .footer-legal a {
      font-size: 0.85rem;
      color: var(--color-white);
      opacity: 0.8;
      text-decoration: none;
    }

    .footer-legal a:hover {
      opacity: 1;
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .footer-bottom-container {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {}
