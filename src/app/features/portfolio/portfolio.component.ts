import { Component } from '@angular/core';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  template: `
    <main class="portfolio-page">
      <div class="container">
        <header class="portfolio-header">
          <h1>Portfolio</h1>
          <p>Galería de nuestras creaciones exclusivas</p>
        </header>

        <div class="portfolio-grid">
          @for (item of portfolioItems; track item.title) {
            <div class="portfolio-item">
              <img [src]="item.image" [alt]="item.title">
              <div class="portfolio-overlay">
                <h3>{{ item.title }}</h3>
              </div>
            </div>
          }
        </div>
      </div>
    </main>
  `,
  styles: [`
    .portfolio-page {
      padding: var(--spacing-xl) 0 var(--spacing-3xl);
    }

    .portfolio-header {
      text-align: center;
      margin-bottom: var(--spacing-3xl);
    }

    .portfolio-header h1 {
      margin-bottom: var(--spacing-sm);
    }

    .portfolio-header p {
      color: var(--color-gray);
      font-size: 1.1rem;
    }

    .portfolio-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--spacing-lg);
    }

    .portfolio-item {
      position: relative;
      aspect-ratio: 1;
      border-radius: var(--border-radius-md);
      overflow: hidden;
      cursor: pointer;
    }

    .portfolio-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--transition-slow);
    }

    .portfolio-item:hover img {
      transform: scale(1.1);
    }

    .portfolio-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(61,44,44,0.8) 0%, transparent 50%);
      display: flex;
      align-items: flex-end;
      padding: var(--spacing-lg);
      opacity: 0;
      transition: opacity var(--transition-normal);
    }

    .portfolio-item:hover .portfolio-overlay {
      opacity: 1;
    }

    .portfolio-overlay h3 {
      color: var(--color-white);
      font-size: 1.25rem;
    }
  `]
})
export class PortfolioComponent {
  portfolioItems = [
    { title: 'Yuzu Matcha Gem', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=600&fit=crop' },
    { title: 'Salted Caramel Dome', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop' },
    { title: 'Pistachio Rose Entremet', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=600&fit=crop' },
    { title: 'Tiramisu Dream Cup', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=600&fit=crop' },
    { title: 'Raspberry Parfait', image: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=600&h=600&fit=crop' },
    { title: 'Mango Mousse', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&h=600&fit=crop' }
  ];
}
