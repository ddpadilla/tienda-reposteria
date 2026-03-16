import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="blog-page">
      <div class="container">
        <header class="blog-header">
          <h1>Blog</h1>
          <p>Descubre recetas, consejos y las últimas tendencias en repostería de lujo</p>
        </header>

        <div class="blog-grid">
          <article class="blog-card">
            <div class="blog-image">
              <img src="https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=400&fit=crop" alt="Delicias Artesanales">
            </div>
            <div class="blog-content">
              <span class="blog-date">Hace 5 horas</span>
              <h2><a routerLink="/blog">Delicias Artesanales: Postres Exclusivos para Momentos Especiales</a></h2>
              <p>La repostería artesanal ha cobrado un nuevo significado en los últimos años. Cada vez más personas buscan no solo satisfacer su antojo de algo dulce, sino también disfrutar de una experiencia única y memorable...</p>
              <span class="blog-author">Dennis Padilla</span>
            </div>
          </article>

          <article class="blog-card">
            <div class="blog-image">
              <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop" alt="Sabores Premium">
            </div>
            <div class="blog-content">
              <span class="blog-date">Hace 5 horas</span>
              <h2><a routerLink="/blog">Sabores Premium: Descubre Nuestros Pasteles de Lujo</a></h2>
              <p>La repostería ha evolucionado de ser una simple necesidad alimentaria a convertirse en una forma de arte. En Sweet Bloom, nos enorgullecemos de ofrecer pasteles de lujo que no solo satisfacen el paladar...</p>
              <span class="blog-author">Dennis Padilla</span>
            </div>
          </article>

          <article class="blog-card">
            <div class="blog-image">
              <img src="https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=400&fit=crop" alt="Postres Individuales">
            </div>
            <div class="blog-content">
              <span class="blog-date">Hace 5 horas</span>
              <h2><a routerLink="/blog">La Magia de los Postres Individuales: Una Experiencia Visual</a></h2>
              <p>Los postres individuales han ganado popularidad en los últimos años, no solo por su sabor, sino también por su presentación. Estos pequeños manjares ofrecen una experiencia visual única...</p>
              <span class="blog-author">Dennis Padilla</span>
            </div>
          </article>
        </div>
      </div>
    </main>
  `,
  styles: [`
    .blog-page {
      padding: var(--spacing-xl) 0 var(--spacing-3xl);
    }

    .blog-header {
      text-align: center;
      margin-bottom: var(--spacing-3xl);
    }

    .blog-header h1 {
      margin-bottom: var(--spacing-sm);
    }

    .blog-header p {
      color: var(--color-gray);
      font-size: 1.1rem;
    }

    .blog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: var(--spacing-xl);
    }

    .blog-card {
      background: var(--color-white);
      border-radius: var(--border-radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      transition: transform var(--transition-normal), box-shadow var(--transition-normal);
    }

    .blog-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }

    .blog-image {
      aspect-ratio: 16/10;
      overflow: hidden;
    }

    .blog-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--transition-slow);
    }

    .blog-card:hover .blog-image img {
      transform: scale(1.05);
    }

    .blog-content {
      padding: var(--spacing-lg);
    }

    .blog-date {
      font-size: 0.8rem;
      color: var(--color-gray);
    }

    .blog-content h2 {
      font-size: 1.25rem;
      margin: var(--spacing-sm) 0;
      line-height: 1.4;
    }

    .blog-content h2 a {
      color: var(--color-brown);
    }

    .blog-content h2 a:hover {
      color: var(--color-gold);
    }

    .blog-content p {
      color: var(--color-gray);
      font-size: 0.95rem;
      line-height: 1.7;
      margin-bottom: var(--spacing-md);
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .blog-author {
      font-size: 0.85rem;
      color: var(--color-brown-light);
    }
  `]
})
export class BlogComponent {}
