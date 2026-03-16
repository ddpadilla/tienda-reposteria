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
          <h3 class="footer-logo">Sweet Bloom</h3>
          <p class="footer-tagline">Artesanía dulce. Hecho con amor.</p>
        </div>

        <div class="footer-links">
          <h4>Explorar</h4>
          <ul>
            <li><a routerLink="/">Inicio</a></li>
            <li><a routerLink="/portfolio">Portfolio</a></li>
            <li><a routerLink="/shop">Tienda</a></li>
            <li><a routerLink="/blog">Blog</a></li>
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
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--color-brown);
      color: var(--color-cream);
      margin-top: var(--spacing-3xl);
    }

    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--spacing-3xl) var(--spacing-md);
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-xl);
    }

    .footer-logo {
      font-family: var(--font-serif);
      font-size: 1.5rem;
      color: var(--color-gold);
      margin-bottom: var(--spacing-sm);
    }

    .footer-tagline {
      font-style: italic;
      opacity: 0.8;
    }

    .footer-links h4,
    .footer-contact h4,
    .footer-social h4 {
      font-family: var(--font-sans);
      font-size: 0.9rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: var(--spacing-md);
      color: var(--color-gold);
    }

    .footer-links ul {
      list-style: none;
    }

    .footer-links li {
      margin-bottom: var(--spacing-sm);
    }

    .footer-links a {
      color: var(--color-cream);
      opacity: 0.8;
      transition: opacity var(--transition-fast);
    }

    .footer-links a:hover {
      opacity: 1;
      color: var(--color-gold);
    }

    .footer-contact p {
      opacity: 0.8;
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
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: var(--border-radius-full);
      color: var(--color-cream);
      transition: all var(--transition-fast);
    }

    .social-links a:hover {
      background: var(--color-gold);
      transform: translateY(-2px);
    }

    .footer-bottom {
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
      opacity: 0.7;
    }

    .footer-legal {
      display: flex;
      gap: var(--spacing-lg);
    }

    .footer-legal a {
      font-size: 0.85rem;
      color: var(--color-cream);
      opacity: 0.7;
    }

    .footer-legal a:hover {
      opacity: 1;
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
