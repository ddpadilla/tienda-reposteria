import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { SupabaseService } from '../../core/services/supabase.service';
import { Order, PaymentSettings } from '../../core/models';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  template: `
    <main class="confirmation-page">
      <div class="container">
        <div class="confirmation-card">
          @if (isLoading()) {
            <div class="loading-state">
              <p>Cargando detalles de tu pedido...</p>
            </div>
          } @else if (!order()) {
            <div class="error-state">
              <h1>Pedido no encontrado</h1>
              <p>No pudimos encontrar la información de este pedido.</p>
              <a routerLink="/" class="btn btn-primary">Volver al Inicio</a>
            </div>
          } @else {
            <div class="success-header">
              <div class="success-icon">✓</div>
              <h1>¡Pedido Confirmado!</h1>
              <p class="order-id">Orden #{{ order()!.id.slice(0, 8).toUpperCase() }}</p>
            </div>
            
            <div class="order-summary">
              <div class="detail-row">
                <span class="label">Cliente</span>
                <span class="value">{{ order()!.customer_name }}</span>
              </div>
              <div class="detail-row total">
                <span class="label">Total a Pagar</span>
                <span class="value highlight">L {{ order()!.total_hnl | number:'1.2-2' }}</span>
              </div>
            </div>

            <div class="instructions-container">
              @if (order()!.payment_method === 'transferencia') {
                <div class="payment-instruction-card">
                  <div class="card-tag">Acción Requerida</div>
                  <h3>Instrucciones de Pago</h3>
                  <p class="instruction-text">Mientras preparamos tu pedido, realiza la transferencia por <strong> (L {{ (order()!.total_hnl) | number:'1.2-2' }})</strong>:</p>
                  
                  @if (paymentSettings()) {
                    <div class="bank-details">
                      <div class="bank-item">
                        <small>Banco</small>
                        <p>{{ paymentSettings()!.bank_name }}</p>
                      </div>
                      <div class="bank-item">
                        <small>Cuenta</small>
                        <p class="account-number">{{ paymentSettings()!.account_number }}</p>
                      </div>
                      <div class="bank-item">
                        <small>A nombre de</small>
                        <p>{{ paymentSettings()!.account_holder }}</p>
                      </div>
                    </div>
                  }

                  <div class="report-section">
                    <p>Envía tu comprobante:</p>
                    <div class="contact-links">
                      <a [href]="'https://wa.me/' + paymentSettings()?.whatsapp" target="_blank" class="contact-pill">
                        <span>WhatsApp</span>
                      </a>
                      <a [href]="'mailto:' + paymentSettings()?.email" class="contact-pill">
                        <span>Email</span>
                      </a>
                    </div>
                  </div>
                </div>
                <p class="email-note">Hemos enviado estos detalles a <strong>{{ order()!.customer_email }}</strong></p>
              } @else {
                <div class="thanks-card">
                  <h3>¡Gracias por tu compra!</h3>
                  <p>Estamos preparando tu pedido. Te notificaremos por correo cuando esté listo.</p>
                </div>
              }
            </div>

            <div class="actions">
              <a routerLink="/" class="btn btn-gold">Ir a la Tienda</a>
              <button (click)="window.print()" class="btn btn-outline btn-sm">Imprimir Recibo</button>
            </div>
          }
        </div>
      </div>
    </main>
  `,
  styles: [`
    .confirmation-page {
      padding: var(--spacing-xl) 0;
      min-height: 80vh;
      display: flex;
      align-items: center;
      background-color: var(--color-base);
    }

    .confirmation-card {
      max-width: 600px;
      margin: 0 auto;
      background: var(--color-white);
      padding: var(--spacing-xl);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-lg);
      text-align: center;
    }

    .success-header {
      margin-bottom: var(--spacing-lg);
    }

    .success-icon {
      width: 64px;
      height: 64px;
      background: var(--color-success);
      color: white;
      font-size: 2rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto var(--spacing-md);
    }

    .order-id {
      font-weight: 600;
      color: var(--color-secondary);
      letter-spacing: 1px;
      background: var(--color-rose-pastel);
      display: inline-block;
      padding: 4px 12px;
      border-radius: var(--border-radius-sm);
      margin-top: var(--spacing-xs);
    }

    .order-summary {
      background: var(--color-base);
      padding: var(--spacing-md);
      border-radius: var(--border-radius-md);
      margin-bottom: var(--spacing-lg);
      border: 1px dashed var(--color-rose-dark);
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: var(--spacing-xs) 0;
      font-size: 0.95rem;
    }

    .detail-row.total {
      margin-top: var(--spacing-xs);
      padding-top: var(--spacing-xs);
      border-top: 1px solid rgba(0,0,0,0.1);
      font-weight: 700;
    }

    .highlight {
      color: var(--color-accent);
      font-size: 1.1rem;
    }

    .instructions-container {
      margin-bottom: var(--spacing-lg);
      text-align: left;
    }

    .payment-instruction-card {
      background: #fff;
      border: 2px solid var(--color-gold);
      border-radius: var(--border-radius-md);
      padding: var(--spacing-lg) var(--spacing-md) var(--spacing-md);
      position: relative;
    }

    .card-tag {
      position: absolute;
      top: -12px;
      left: 20px;
      background: var(--color-gold);
      color: var(--color-brown);
      font-size: 0.7rem;
      font-weight: 800;
      padding: 2px 10px;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .bank-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-md);
      background: #fcf8f0;
      padding: var(--spacing-md);
      border-radius: var(--border-radius-sm);
      margin: var(--spacing-md) 0;
    }

    .bank-item small {
      display: block;
      color: var(--color-gray);
      font-size: 0.75rem;
      text-transform: uppercase;
    }

    .bank-item p {
      font-weight: 600;
      color: var(--color-brown);
      margin: 0;
    }

    .account-number {
      font-family: monospace;
      font-size: 1.1rem !important;
    }

    .report-section {
      border-top: 1px solid #eee;
      padding-top: var(--spacing-sm);
    }

    .contact-links {
      display: flex;
      gap: var(--spacing-sm);
      margin-top: var(--spacing-xs);
    }

    .contact-pill {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px;
      background: var(--color-base);
      color: var(--color-secondary);
      text-decoration: none;
      border-radius: var(--border-radius-sm);
      font-weight: 600;
      font-size: 0.85rem;
      transition: var(--transition);
    }

    .contact-pill:hover {
      background: var(--color-rose-pastel);
    }

    .email-note {
      font-size: 0.8rem;
      color: var(--color-gray);
      margin-top: var(--spacing-sm);
      text-align: center;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .print-btn {
      border: none;
      color: var(--color-gray);
      font-size: 0.75rem;
    }

    @media (max-width: 600px) {
      .confirmation-card {
        padding: var(--spacing-md);
        margin: 0 var(--spacing-sm);
      }
      .bank-details {
        grid-template-columns: 1fr;
      }
      h1 { font-size: 2rem; }
    }

    @media print {
      .actions, .btn-gold { display: none; }
      .confirmation-page { padding: 0; }
      .confirmation-card { box-shadow: none; border: 1px solid #eee; }
    }
  `]
})
export class OrderConfirmationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private supabase = inject(SupabaseService);
  window = window;

  order = signal<Order | null>(null);
  paymentSettings = signal<PaymentSettings | null>(null);
  isLoading = signal(true);

  async ngOnInit() {
    const id = this.route.snapshot.queryParams['id'];
    if (id) {
      try {
        const [order, settings] = await Promise.all([
          this.supabase.getOrderById(id),
          this.supabase.getPaymentSettings()
        ]);
        this.order.set(order);
        this.paymentSettings.set(settings);
      } catch (error) {
        console.error('Error loading confirmation data:', error);
      }
    }
    this.isLoading.set(false);
  }
}
