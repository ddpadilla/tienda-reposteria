import { Component, inject } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    @if (cartService.notify().visible) {
      <div class="toast">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>{{ cartService.notify().message }}</span>
      </div>
    }
  `,
  styles: [`
    .toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--color-brown);
      color: var(--color-white);
      padding: var(--spacing-md) var(--spacing-xl);
      border-radius: var(--border-radius-md);
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      box-shadow: var(--shadow-lg);
      z-index: 9999;
      animation: slideUp 0.3s ease;
    }

    .toast svg {
      color: var(--color-success);
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }
  `]
})
export class ToastComponent {
  cartService = inject(CartService);
}
