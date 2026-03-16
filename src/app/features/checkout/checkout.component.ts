import { Component, inject, signal, OnInit, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { SupabaseService } from '../../core/services/supabase.service';
import { CustomerInfo, Order, PaymentSettings } from '../../core/models';
import { environment } from '../../../environments/environment';

declare var paypal: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterLink, FormsModule, DecimalPipe],
  template: `
    <main class="checkout-page">
      <div class="container">
        <h1>Checkout</h1>

        @if (cartService.items().length === 0) {
          <div class="empty-cart">
            <p>Tu carrito está vacío</p>
            <a routerLink="/shop" class="btn btn-primary">Ver Productos</a>
          </div>
        } @else {
          <div class="checkout-layout">
            <!-- Formulario -->
            <div class="checkout-form">
              <section class="form-section">
                <h2>Información de Contacto</h2>
                
                <div class="form-group">
                  <label class="form-label">Nombre Completo *</label>
                  <input 
                    type="text" 
                    class="form-input"
                    [class.error]="submitted() && getFieldError('name')"
                    [(ngModel)]="customer.name"
                    placeholder="Juan Pérez"
                    (blur)="submitted.set(true)"
                  >
                  @if (submitted() && getFieldError('name')) {
                    <span class="error-text">{{ getFieldError('name') }}</span>
                  }
                </div>

                <div class="form-group">
                  <label class="form-label">Correo Electrónico *</label>
                  <input 
                    type="email" 
                    class="form-input"
                    [class.error]="submitted() && getEmailError()"
                    [(ngModel)]="customer.email"
                    placeholder="juan@email.com"
                    (blur)="submitted.set(true)"
                  >
                  @if (submitted() && getEmailError()) {
                    <span class="error-text">{{ getEmailError() }}</span>
                  }
                </div>

                <div class="form-group">
                  <label class="form-label">Teléfono *</label>
                  <input 
                    type="tel" 
                    class="form-input"
                    [class.error]="submitted() && getPhoneError()"
                    [(ngModel)]="customer.phone"
                    placeholder="+504 9999-9999"
                    (blur)="submitted.set(true)"
                  >
                  @if (submitted() && getPhoneError()) {
                    <span class="error-text">{{ getPhoneError() }}</span>
                  }
                </div>

                <div class="form-group">
                  <label class="form-label">Dirección de Entrega (San Pedro Sula) *</label>
                  <input 
                    type="text" 
                    class="form-input"
                    [class.error]="submitted() && getFieldError('address')"
                    [(ngModel)]="customer.address"
                    placeholder="Col. Alameda, Calle principal, Casa #..."
                    (blur)="submitted.set(true)"
                  >
                  @if (submitted() && getFieldError('address')) {
                    <span class="error-text">{{ getFieldError('address') }}</span>
                  }
                </div>

                <div class="form-group">
                  <label class="form-label">Notas del Pedido</label>
                  <textarea 
                    class="form-input"
                    [(ngModel)]="notes"
                    rows="3"
                    placeholder="Instrucciones especiales..."
                  ></textarea>
                </div>
              </section>

              <section class="form-section">
                <h2>Método de Pago</h2>
                
                <div class="payment-options">
                  <label class="payment-option" [class.selected]="paymentMethod() === 'paypal'">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="paypal"
                      [(ngModel)]="paymentMethodValue"
                      (change)="paymentMethod.set('paypal')"
                    >
                    <div class="payment-content">
                      <span class="payment-icon">💳</span>
                      <span class="payment-title">PayPal</span>
                      <span class="payment-desc">Pago seguro con PayPal</span>
                    </div>
                  </label>

                  <label class="payment-option" [class.selected]="paymentMethod() === 'transferencia'">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="transferencia"
                      [(ngModel)]="paymentMethodValue"
                      (change)="paymentMethod.set('transferencia')"
                    >
                    <div class="payment-content">
                      <span class="payment-icon">🏦</span>
                      <span class="payment-title">Transferencia/Depósito</span>
                      <span class="payment-desc">Paga el 50% de anticipo</span>
                    </div>
                  </label>
                </div>

                @if (paymentMethod() === 'transferencia') {
                  <div class="transfer-instructions">
                    <h3>Instrucciones de Pago</h3>
                    @if (paymentSettings(); as settings) {
                      <p>1. Realiza tu transferencia del <strong>{{ settings.advance_percentage }}% (L {{ (cartService.totalHNL() * settings.advance_percentage / 100) | number:'1.2-2' }})</strong> como anticipo</p>
                      <p>2. Envía el comprobante por:</p>
                      <ul>
                        <li>WhatsApp: {{ settings.whatsapp }}</li>
                        <li>Email: {{ settings.email }}</li>
                      </ul>
                      
                      <div class="bank-info">
                        <h4>Datos Bancarios:</h4>
                        <p><strong>Banco:</strong> {{ settings.bank_name }}</p>
                        <p><strong>Cuenta:</strong> {{ settings.account_number }}</p>
                        <p><strong>Beneficiario:</strong> {{ settings.account_holder }}</p>
                      </div>

                      @if (settings.instructions) {
                        <div class="custom-instructions" [innerHTML]="settings.instructions"></div>
                      }

                      <p class="remaining-note">El {{ 100 - settings.advance_percentage }}% restante (L {{ (cartService.totalHNL() * (100 - settings.advance_percentage) / 100) | number:'1.2-2' }}) se pagal al momento de la entrega.</p>
                    } @else {
                      <p>Cargando información de pago...</p>
                    }

                    <button 
                      class="btn btn-gold confirm-btn"
                      [disabled]="!isFormValid() || isProcessing()"
                      (click)="confirmTransfer()"
                    >
                      {{ isProcessing() ? 'Procesando...' : 'Confirmar Pedido (Anticipo)' }}
                    </button>
                  </div>
                }
              </section>

              @if (paymentMethod() === 'paypal') {
                @if (!paypalLoaded()) {
                  <div class="paypal-placeholder">
                    <p>Cargando PayPal...</p>
                  </div>
                }
                <div id="paypal-button-container"></div>
                @if (paypalLoaded() === false) {
                  <div class="paypal-error">
                    <p>Error al cargar PayPal. Por favor intenta con otro método de pago o contactanos.</p>
                  </div>
                }
              }
            </div>

            <!-- Resumen -->
            <div class="order-summary">
              <h2>Resumen del Pedido</h2>
              
              <div class="order-items">
                @for (item of cartService.items(); track item.product.id) {
                  <div class="order-item">
                    <div class="item-info">
                      <span class="item-name">{{ item.product.name }}</span>
                      <span class="item-qty">x{{ item.quantity }}</span>
                    </div>
                    <span class="item-price">L {{ (item.product.price_hnl * item.quantity) | number:'1.2-2' }}</span>
                  </div>
                }
              </div>

              <div class="summary-divider"></div>

              <div class="summary-row">
                <span>Subtotal</span>
                <span>L {{ cartService.totalHNL() | number:'1.2-2' }}</span>
              </div>
              
              <div class="summary-row">
                <span>Envío</span>
                <span>Gratis</span>
              </div>

              <div class="summary-divider"></div>

              <div class="summary-row total">
                <span>Total</span>
                <span>L {{ cartService.totalHNL() | number:'1.2-2' }}</span>
              </div>
            </div>
          </div>
        }
      </div>
    </main>
  `,
  styles: [`
    .checkout-page {
      padding: var(--spacing-xl) 0 var(--spacing-3xl);
    }

    .checkout-page h1 {
      margin-bottom: var(--spacing-xl);
    }

    .empty-cart {
      text-align: center;
      padding: var(--spacing-3xl);
    }

    .checkout-layout {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: var(--spacing-xl);
      align-items: start;
    }

    .form-section {
      margin-bottom: var(--spacing-xl);
    }

    .form-section h2 {
      font-size: 1.25rem;
      margin-bottom: var(--spacing-lg);
      padding-bottom: var(--spacing-sm);
      border-bottom: 1px solid var(--color-rose-pastel);
    }

    textarea.form-input {
      resize: vertical;
      min-height: 80px;
    }

    .form-input.error {
      border-color: #DC2626;
      background-color: #FEF2F2;
    }

    .error-text {
      color: #DC2626;
      font-size: 0.85rem;
      margin-top: var(--spacing-xs);
      display: block;
    }

    /* Payment Options */
    .payment-options {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
    }

    .payment-option {
      display: flex;
      align-items: center;
      padding: var(--spacing-md);
      background: var(--color-white);
      border: 2px solid var(--color-rose-pastel);
      border-radius: var(--border-radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .payment-option:hover {
      border-color: var(--color-gold);
    }

    .payment-option.selected {
      border-color: var(--color-gold);
      background: var(--color-cream);
    }

    .payment-option input {
      display: none;
    }

    .payment-content {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .payment-icon {
      font-size: 1.5rem;
    }

    .payment-title {
      font-weight: 600;
    }

    .payment-desc {
      font-size: 0.85rem;
      color: var(--color-gray);
    }

    /* Transfer Instructions */
    .transfer-instructions {
      background: var(--color-cream-dark);
      padding: var(--spacing-lg);
      border-radius: var(--border-radius-md);
    }

    .transfer-instructions h3 {
      font-size: 1rem;
      margin-bottom: var(--spacing-md);
    }

    .transfer-instructions p {
      margin-bottom: var(--spacing-sm);
      font-size: 0.95rem;
    }

    .transfer-instructions ul {
      margin-left: var(--spacing-lg);
      margin-bottom: var(--spacing-md);
    }

    .bank-info {
      background: var(--color-white);
      padding: var(--spacing-md);
      border-radius: var(--border-radius-sm);
      margin: var(--spacing-md) 0;
    }

    .bank-info h4 {
      font-size: 0.9rem;
      margin-bottom: var(--spacing-sm);
    }

    .bank-info p {
      margin-bottom: var(--spacing-xs);
    }

    .custom-instructions {
      margin-top: var(--spacing-md);
      padding: var(--spacing-md);
      background: #F5EDE6;
      border-radius: var(--border-radius-md);
    }

    .remaining-note {
      font-style: italic;
      color: #6B5B5B;
      margin-top: var(--spacing-md);
    }

    .confirm-btn {
      width: 100%;
      margin-top: var(--spacing-md);
    }

    .paypal-placeholder {
      text-align: center;
      padding: var(--spacing-lg);
      color: var(--color-gray);
    }

    .paypal-error {
      text-align: center;
      padding: var(--spacing-lg);
      background: #FEE2E2;
      border-radius: var(--border-radius-md);
      color: #991B1B;
      margin-top: var(--spacing-md);
    }

    #paypal-button-container {
      min-height: 50px;
    }

    /* Order Summary */
    .order-summary {
      background: var(--color-white);
      padding: var(--spacing-xl);
      border-radius: var(--border-radius-md);
      box-shadow: var(--shadow-sm);
      position: sticky;
      top: 100px;
    }

    .order-summary h2 {
      font-size: 1.25rem;
      margin-bottom: var(--spacing-lg);
    }

    .order-items {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-md);
      max-height: 250px;
      overflow-y: auto;
    }

    .order-item {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
    }

    .item-info {
      display: flex;
      gap: var(--spacing-sm);
    }

    .item-qty {
      color: var(--color-gray);
    }

    .summary-divider {
      height: 1px;
      background: var(--color-rose-pastel);
      margin: var(--spacing-md) 0;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--spacing-sm);
    }

    .summary-row.total {
      font-weight: 700;
      font-size: 1.2rem;
    }

    @media (max-width: 900px) {
      .checkout-layout {
        grid-template-columns: 1fr;
      }

      .order-summary {
        position: static;
        order: -1;
      }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  cartService = inject(CartService);
  private supabase = inject(SupabaseService);
  private router = inject(Router);

  customer: CustomerInfo = { name: '', email: '', phone: '', address: '' };
  notes = '';
  paymentMethod = signal<'paypal' | 'transferencia'>('paypal');
  paymentMethodValue = 'paypal';
  isProcessing = signal(false);
  paypalLoaded = signal(false);
  submitted = signal(false);
  paymentSettings = signal<PaymentSettings | null>(null);

  environment = environment;

  constructor() {
    effect(() => {
      if (this.paymentMethod() === 'paypal' && this.paypalLoaded()) {
        setTimeout(() => this.renderPayPalButtons(), 0);
      }
    });
  }

  async ngOnInit() {
    this.loadPayPal();
    const settings = await this.supabase.getPaymentSettings();
    if (settings) {
      this.paymentSettings.set(settings);
    }
  }

  loadPayPal() {
    const script = document.createElement('script');
    const domain = environment.paypalSandbox ? 'www.sandbox.paypal.com' : 'www.paypal.com';
    script.src = `https://${domain}/sdk/js?client-id=${environment.paypalClientId}&currency=USD`;
    script.onload = () => {
      this.paypalLoaded.set(true);
      this.renderPayPalButtons();
    };
    script.onerror = () => {
      console.error('Error loading PayPal script');
      this.paypalLoaded.set(false);
    };
    document.body.appendChild(script);
  }

  renderPayPalButtons() {
    const container = document.getElementById('paypal-button-container');
    if (container) {
      container.innerHTML = '';
    }
    
    const totalUSD = (this.cartService.totalHNL() * environment.exchangeRateHNLtoUSD).toFixed(2);
    
    paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal'
      },
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: { value: totalUSD },
            description: 'Sweet Bloom - Pedido de Repostería'
          }]
        });
      },
      onApprove: async (data: any, actions: any) => {
        this.submitted.set(true);
        if (!this.isFormValid() || this.getEmailError() || this.getPhoneError()) {
          alert('Por favor completa todos los campos correctamente');
          return;
        }
        this.isProcessing.set(true);
        try {
          const orderId = data.orderID;
          await this.processPayPalPayment(orderId);
        } catch (error) {
          console.error('Error processing payment:', error);
          this.isProcessing.set(false);
        }
      },
      onError: (err: any) => {
        console.error('PayPal error:', err);
        this.isProcessing.set(false);
      }
    }).render('#paypal-button-container');
  }

  isFormValid(): boolean {
    return !!(this.customer.name && this.customer.email && 
             this.customer.phone && this.customer.address);
  }

  getEmailError(): string {
    if (!this.customer.email) return 'El correo es requerido';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.customer.email)) return 'Ingresa un correo válido';
    return '';
  }

  getPhoneError(): string {
    if (!this.customer.phone) return 'El teléfono es requerido';
    const phoneDigits = this.customer.phone.replace(/\D/g, '');
    if (phoneDigits.length < 8) return 'El teléfono debe tener al menos 8 dígitos';
    return '';
  }

  getFieldError(field: string): string {
    switch (field) {
      case 'name':
        return this.customer.name ? '' : 'El nombre es requerido';
      case 'address':
        return this.customer.address ? '' : 'La dirección es requerida';
      default:
        return '';
    }
  }

  async confirmTransfer() {
    this.submitted.set(true);
    if (!this.isFormValid() || this.getEmailError() || this.getPhoneError()) return;
    
    this.isProcessing.set(true);
    try {
      await this.createOrder('transferencia', null);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  }

  async processPayPalPayment(orderId: string) {
    try {
      const items = this.cartService.getItems().map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.price_hnl
      }));

      const response = await fetch(
        `https://${environment.supabaseUrl}/functions/v1/verify-paypal-payment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId,
            customerName: this.customer.name,
            customerEmail: this.customer.email,
            customerPhone: this.customer.phone,
            deliveryAddress: this.customer.address,
            totalHNL: this.cartService.totalHNL(),
            notes: this.notes || null,
            items
          })
        }
      );

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Error al procesar pago');
      }

      this.cartService.clearCart();
      this.router.navigate(['/order-confirmation'], { queryParams: { id: result.orderId } });
    } catch (error) {
      console.error('Error processing PayPal payment:', error);
      this.isProcessing.set(false);
    }
  }

  async createOrder(paymentMethod: string, paymentId: string | null) {
    try {
      const orderData = {
        customer_name: this.customer.name,
        customer_email: this.customer.email,
        customer_phone: this.customer.phone,
        delivery_address: this.customer.address,
        total_hnl: this.cartService.totalHNL(),
        status: (paymentMethod === 'paypal' ? 'pagado_total' : 'pendiente_pago') as any,
        payment_method: paymentMethod,
        notes: this.notes || null
      };

      const order = await this.supabase.createOrder(orderData);

      const items = this.cartService.getItems().map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price_hnl: item.product.price_hnl
      }));

      await this.supabase.addOrderItems(items);

      this.cartService.clearCart();
      this.router.navigate(['/order-confirmation'], { queryParams: { id: order.id } });
    } catch (error: any) {
      console.error('Error creating order:', error);
      this.isProcessing.set(false);
      const errorMsg = error?.message || error?.error?.message || JSON.stringify(error) || 'Error desconocido';
      alert('Error al crear el pedido: ' + errorMsg);
    }
  }
}
