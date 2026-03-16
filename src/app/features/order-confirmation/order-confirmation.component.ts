import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { SupabaseService } from '../../core/services/supabase.service';
import { Order } from '../../core/models';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  template: `
    <main class="confirmation-page">
      <div class="container">
        <div class="confirmation-card">
          @if (isLoading()) {
            <p>Cargando...</p>
          } @else if (!order()) {
            <h1>Pedido no encontrado</h1>
            <a routerLink="/" class="btn btn-primary">Volver al Inicio</a>
          } @else {
            <div class="success-icon">✓</div>
            <h1>¡Pedido Confirmado!</h1>
            <p class="order-id">Número de orden: <strong>{{ order()!.id.slice(0, 8).toUpperCase() }}</strong></p>
            
            <div class="order-details">
              <div class="detail-row">
                <span>Cliente:</span>
                <span>{{ order()!.customer_name }}</span>
              </div>
              <div class="detail-row">
                <span>Email:</span>
                <span>{{ order()!.customer_email }}</span>
              </div>
              <div class="detail-row">
                <span>Total:</span>
                <span>L {{ order()!.total_hnl | number:'1.2-2' }}</span>
              </div>
              <div class="detail-row">
                <span>Estado:</span>
                <span class="status-badge" [class]="order()!.status">
                  {{ getStatusLabel(order()!.status) }}
                </span>
              </div>
            </div>

            <div class="next-steps">
              @if (order()!.payment_method === 'transferencia') {
                <div class="step">
                  <h3>Próximo Paso</h3>
                  <p>Por favor realiza el pago del 50% (L {{ (order()!.total_hnl / 2) | number:'1.2-2' }}) y envía el comprobante a:</p>
                  <ul>
                    <li>WhatsApp: +504 5555-6756</li>
                    <li>Email: sac&#64;sweetbloom.com</li>
                  </ul>
                  <p class="email-note">Se ha enviado una copia con las instrucciones de pago a tu correo electrónico.</p>
                </div>
              } @else {
                <div class="step">
                  <h3>Gracias por tu compra</h3>
                  <p>Te enviaremos un correo de confirmación pronto.</p>
                </div>
              }
            </div>

            <a routerLink="/" class="btn btn-gold">Volver al Inicio</a>
          }
        </div>
      </div>
    </main>
  `,
  styles: [`
    .confirmation-page {
      padding: var(--spacing-3xl) 0;
      min-height: 60vh;
      display: flex;
      align-items: center;
    }

    .confirmation-card {
      max-width: 500px;
      margin: 0 auto;
      text-align: center;
      background: var(--color-white);
      padding: var(--spacing-3xl);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-md);
    }

    .success-icon {
      width: 80px;
      height: 80px;
      background: var(--color-success);
      color: white;
      font-size: 3rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto var(--spacing-lg);
    }

    .confirmation-card h1 {
      margin-bottom: var(--spacing-sm);
    }

    .order-id {
      color: var(--color-gray);
      margin-bottom: var(--spacing-xl);
    }

    .order-details {
      background: var(--color-cream-dark);
      padding: var(--spacing-lg);
      border-radius: var(--border-radius-md);
      margin-bottom: var(--spacing-xl);
      text-align: left;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: var(--spacing-sm) 0;
      border-bottom: 1px solid var(--color-rose-pastel);
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .status-badge {
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--border-radius-sm);
      font-size: 0.8rem;
      font-weight: 600;
    }

    .status-badge.pendiente_pago {
      background: #FEF3C7;
      color: #92400E;
    }

    .status-badge.pagado_total,
    .status-badge.anticipo_recibido {
      background: #D1FAE5;
      color: #065F46;
    }

    .next-steps {
      margin-bottom: var(--spacing-xl);
      text-align: left;
    }

    .step h3 {
      font-size: 1rem;
      margin-bottom: var(--spacing-sm);
    }

    .step p {
      font-size: 0.9rem;
      color: var(--color-gray);
      margin-bottom: var(--spacing-sm);
    }

    .step ul {
      font-size: 0.9rem;
      margin-left: var(--spacing-lg);
    }

    .email-note {
      margin-top: var(--spacing-md);
      padding: var(--spacing-sm);
      background: #F0FDF4;
      border-radius: var(--border-radius-sm);
      color: #166534;
      font-size: 0.85rem;
    }
  `]
})
export class OrderConfirmationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private supabase = inject(SupabaseService);
  private router = inject(Router);

  order = signal<Order | null>(null);
  isLoading = signal(true);

  async ngOnInit() {
    const id = this.route.snapshot.queryParams['id'];
    if (id) {
      try {
        const order = await this.supabase.getOrderById(id);
        this.order.set(order);
      } catch (error) {
        console.error('Error loading order:', error);
      }
    }
    this.isLoading.set(false);
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'pendiente_pago': 'Pendiente de Pago',
      'anticipo_recibido': 'Anticipo Recibido',
      'pagado_total': 'Pagado',
      'en_preparacion': 'En Preparación',
      'entregado': 'Entregado'
    };
    return labels[status] || status;
  }
}
