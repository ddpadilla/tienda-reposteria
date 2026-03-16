import { Component, inject, Signal, signal, WritableSignal, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar" [class.scrolled]="isScrolled()">
      <div class="nav-container">
        <a routerLink="/" class="nav-logo">
          <img src="assets/logo-removebg.png" alt="Sweet Bloom">
        </a>

        <button class="nav-toggle" (click)="toggleMenu()" aria-label="Toggle menu">
          <span class="hamburger"></span>
        </button>

        <ul class="nav-menu" [class.active]="isMenuOpen()">
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeMenu()">Inicio</a></li>
          <li><a routerLink="/portfolio" routerLinkActive="active" (click)="closeMenu()">Portfolio</a></li>
          <li><a routerLink="/shop" routerLinkActive="active" (click)="closeMenu()">Tienda</a></li>
          <li><a routerLink="/blog" routerLinkActive="active" (click)="closeMenu()">Blog</a></li>
        </ul>

        <a routerLink="/cart" class="nav-cart">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          @if (cartService.itemCount() > 0) {
            <span class="cart-count">{{ cartService.itemCount() }}</span>
          }
        </a>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      background: var(--color-cream);
      border-bottom: 1px solid var(--color-rose-pastel);
      z-index: 1000;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }

    .navbar.scrolled {
      background: rgba(253, 248, 243, 0.95);
      box-shadow: 0 2px 20px rgba(61, 44, 44, 0.1);
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--spacing-md);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .nav-logo {
      display: flex;
      align-items: center;
    }

    .nav-logo img {
      height: 80px;
      width: auto;
    }

    .nav-menu {
      display: flex;
      gap: var(--spacing-xl);
      list-style: none;
    }

    .nav-menu a {
      font-size: 1.45rem;
      font-weight: 400;
      letter-spacing: 0.5px;
      position: relative;
      padding: var(--spacing-xs) 0;
    }

    .nav-menu a::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 1px;
      background: var(--color-gold);
      transition: width var(--transition-normal);
    }

    .nav-menu a:hover::after,
    .nav-menu a.active::after {
      width: 100%;
    }

    .nav-cart {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: var(--border-radius-full);
      transition: background var(--transition-fast);
    }

    .nav-cart:hover {
      background: var(--color-rose-pastel);
    }

    .cart-count {
      position: absolute;
      top: 2px;
      right: 2px;
      width: 18px;
      height: 18px;
      background: var(--color-gold);
      color: white;
      font-size: 0.7rem;
      font-weight: 600;
      border-radius: var(--border-radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .nav-toggle {
      display: none;
      width: 44px;
      height: 44px;
      align-items: center;
      justify-content: center;
    }

    .hamburger {
      display: block;
      width: 24px;
      height: 2px;
      background: var(--color-brown);
      position: relative;
    }

    .hamburger::before,
    .hamburger::after {
      content: '';
      position: absolute;
      width: 24px;
      height: 2px;
      background: var(--color-brown);
      left: 0;
    }

    .hamburger::before { top: -8px; }
    .hamburger::after { bottom: -8px; }

    @media (max-width: 768px) {
      .nav-toggle {
        display: flex;
      }

      .nav-menu {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        flex-direction: column;
        background: var(--color-cream);
        padding: var(--spacing-lg);
        gap: var(--spacing-md);
        border-bottom: 1px solid var(--color-rose-pastel);
        display: none;
      }

      .nav-menu.active {
        display: flex;
      }
    }
  `]
})
export class NavbarComponent {
  cartService = inject(CartService);
  isMenuOpen: WritableSignal<boolean> = signal(false);
  isScrolled: WritableSignal<boolean> = signal(false);

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.scrollY > 50);
  }

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }
}
