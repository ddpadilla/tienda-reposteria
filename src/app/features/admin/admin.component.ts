import { Component, inject, signal, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';
import { AuthService } from '../../core/services/auth.service';
import { Product, Order, PaymentSettings } from '../../core/models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="admin-page">
      <div class="admin-container">
        <header class="admin-header">
          <h1>Panel de Administración</h1>
          <a routerLink="/" class="btn btn-secondary">Ver Tienda</a>
        </header>

        @if (!isAuthenticated()) {
          <!-- Login -->
          <div class="login-form">
            <h2>Iniciar Sesión</h2>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" class="form-input" [(ngModel)]="loginEmail">
            </div>
            <div class="form-group">
              <label class="form-label">Contraseña</label>
              <input type="password" class="form-input" [(ngModel)]="loginPassword">
            </div>
            <button class="btn btn-primary" (click)="login()">Entrar</button>
            @if (loginError()) {
              <p class="error">{{ loginError() }}</p>
            }
          </div>
        } @else {
          <!-- Admin Tabs -->
          <div class="admin-tabs">
            <button [class.active]="activeTab() === 'orders'" (click)="activeTab.set('orders')">Pedidos</button>
            <button [class.active]="activeTab() === 'products'" (click)="activeTab.set('products')">Productos</button>
            <button [class.active]="activeTab() === 'hero'" (click)="switchToHeroTab()">Hero Slides</button>
            <button [class.active]="activeTab() === 'payment'" (click)="activeTab.set('payment')">Pago</button>
            <button [class.active]="activeTab() === 'dashboard'" (click)="activeTab.set('dashboard')">Dashboard</button>
          </div>

          @if (activeTab() === 'hero') {
            <!-- Hero Slides -->
            <div class="products-section">
              <div class="section-header">
                <h2>Hero Slides</h2>
                <button class="btn btn-gold" (click)="showHeroForm.set(true)">+ Nuevo Slide</button>
              </div>

              @if (showHeroForm()) {
                <div class="product-form">
                  <h3>{{ editingHero() ? 'Editar' : 'Nuevo' }} Slide</h3>
                  <div class="form-group">
                    <label class="form-label">URL de Imagen *</label>
                    @if (heroForm.image_url) {
                      <div class="current-image">
                        <img [src]="heroForm.image_url" alt="Preview">
                        <button type="button" class="btn-remove-image" (click)="heroForm.image_url = ''">×</button>
                      </div>
                    }
                    <input type="file" class="form-input" accept="image/*" (change)="onHeroImageSelected($event)">
                    <input type="text" class="form-input mt-sm" [(ngModel)]="heroForm.image_url" placeholder="O pega una URL">
                    <p class="help-text">Dimensiones recomendadas: 1920x1080px (16:9). La imagen se ajustará automáticamente.</p>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Título</label>
                    <input type="text" class="form-input" [(ngModel)]="heroForm.title" placeholder="Título del slide">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Subtítulo</label>
                    <textarea class="form-input" [(ngModel)]="heroForm.subtitle" placeholder="Descripción"></textarea>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">Texto del Botón</label>
                      <input type="text" class="form-input" [(ngModel)]="heroForm.button_text" placeholder="Ver Catálogo">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Link del Botón</label>
                      <input type="text" class="form-input" [(ngModel)]="heroForm.button_link" placeholder="/shop">
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Orden</label>
                    <input type="number" class="form-input" [(ngModel)]="heroForm.order_index">
                  </div>
                  <div class="form-group">
                    <label class="checkbox-label">
                      <input type="checkbox" [(ngModel)]="heroForm.is_active"> Activo
                    </label>
                  </div>
                  <div class="form-actions">
                    <button class="btn btn-secondary" (click)="cancelHeroForm()">Cancelar</button>
                    <button class="btn btn-primary" (click)="saveHeroSlide()">Guardar</button>
                  </div>
                </div>
              }

              <div class="slides-grid">
                @for (slide of heroSlides(); track slide.id) {
                  <div class="slide-card">
                    <img [src]="slide.image_url" [alt]="slide.title || 'Slide'">
                    <div class="slide-info">
                      <h4>{{ slide.title || 'Sin título' }}</h4>
                      <p>{{ slide.subtitle || 'Sin subtítulo' }}</p>
                      <span class="slide-order">Orden: {{ slide.order_index }}</span>
                      @if (!slide.is_active) {
                        <span class="slide-inactive">Inactivo</span>
                      }
                    </div>
                    <div class="slide-actions">
                      <button class="btn-icon" (click)="editHeroSlide(slide)">✏️</button>
                      <button class="btn-icon" (click)="deleteHeroSlide(slide.id)">🗑️</button>
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          @if (activeTab() === 'payment') {
            <!-- Payment Settings -->
            <div class="payment-settings-section">
              <h2>Configuración de Pago</h2>
              
              @if (paymentSettingsForm()) {
                <div class="product-form">
                  <h3>Configuración de Transferencia</h3>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">Nombre del Banco</label>
                      <input type="text" class="form-input" [(ngModel)]="paymentSettingsForm()!.bank_name">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Número de Cuenta</label>
                      <input type="text" class="form-input" [(ngModel)]="paymentSettingsForm()!.account_number">
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Titular de la Cuenta</label>
                    <input type="text" class="form-input" [(ngModel)]="paymentSettingsForm()!.account_holder">
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">% Anticipo</label>
                      <input type="number" class="form-input" [(ngModel)]="paymentSettingsForm()!.advance_percentage">
                    </div>
                    <div class="form-group">
                      <label class="form-label">WhatsApp (para comprobantes)</label>
                      <input type="text" class="form-input" [(ngModel)]="paymentSettingsForm()!.whatsapp">
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Email (para comprobantes)</label>
                    <input type="email" class="form-input" [(ngModel)]="paymentSettingsForm()!.email">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Instrucciones Adicionales (HTML)</label>
                    <textarea class="form-input" [(ngModel)]="paymentSettingsForm()!.instructions" rows="4"></textarea>
                  </div>
                  <div class="form-group">
                    <label class="checkbox-label">
                      <input type="checkbox" [(ngModel)]="paymentSettingsForm()!.is_active"> Activo
                    </label>
                  </div>
                  <div class="form-actions">
                    <button class="btn btn-primary" (click)="savePaymentSettings()">Guardar Configuración</button>
                  </div>
                </div>
              }
            </div>
          }

          @if (activeTab() === 'dashboard') {
            <!-- Dashboard -->
            <div class="dashboard">
              <div class="stats-grid">
                <div class="stat-card">
                  <h3>Ventas Totales</h3>
                  <p class="stat-value">L {{ totalSales() | number:'1.2-2' }}</p>
                </div>
                <div class="stat-card">
                  <h3>Pedidos</h3>
                  <p class="stat-value">{{ orders().length }}</p>
                </div>
              </div>

              <h3>Productos Más Vendidos</h3>
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad Vendida</th>
                  </tr>
                </thead>
                <tbody>
                  @for (item of topProducts(); track item.product_name) {
                    <tr>
                      <td>{{ item.product_name }}</td>
                      <td>{{ item.total_sold }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }

          @if (activeTab() === 'orders') {
            <!-- Orders -->
            <div class="orders-section">
              <h2>Pedidos</h2>
              @if (isLoading()) {
                <p>Cargando pedidos...</p>
              } @else if (orders().length === 0) {
                <p>No hay pedidos aún</p>
              } @else {
                <div class="orders-grid">
                  @for (order of orders(); track order.id) {
                  <div class="order-card">
                    <div class="order-header">
                      <span class="order-id">#{{ order.id.slice(0, 8).toUpperCase() }}</span>
                      <span class="order-status" [class]="order.status">{{ getStatusLabel(order.status) }}</span>
                    </div>
                    <div class="order-body">
                      <p><strong>{{ order.customer_name }}</strong></p>
                      <p>{{ order.customer_email }}</p>
                      <p>{{ order.customer_phone }}</p>
                      @if (order.delivery_address) {
                        <p>{{ order.delivery_address }}</p>
                      }
                      <p class="order-total">Total: L {{ order.total_hnl | number:'1.2-2' }}</p>
                      @if (order.payment_method === 'transferencia') {
                        <p class="payment-info">
                          <span class="label">Pago:</span> 
                          @if (order.advance_paid) {
                            <span class="advance-paid">Anticipo: L {{ order.advance_amount_hnl | number:'1.2-2' }} ✓</span>
                          } @else {
                            <span class="advance-pending">Pendiente</span>
                          }
                        </p>
                      }
                    </div>
                    <div class="order-actions">
                      @if (order.payment_method === 'transferencia' && !order.advance_paid && order.status === 'pendiente_pago') {
                        <button class="btn btn-success btn-sm" (click)="markAdvanceReceived(order)">
                          ✓ Marcar Anticipo Recibido
                        </button>
                      }
                      @if (order.advance_paid && order.status !== 'pagado_total' && order.status !== 'entregado') {
                        <button class="btn btn-primary btn-sm" (click)="updateOrderStatus(order.id, 'pagado_total')">
                          ✓ Marcar Pagado Total
                        </button>
                      }
                      <select class="form-input" [value]="order.status" (change)="updateOrderStatus(order.id, $any($event.target).value)">
                        <option value="pendiente_pago">Pendiente de Pago</option>
                        <option value="anticipo_recibido">Anticipo Recibido</option>
                        <option value="pagado_total">Pagado Total</option>
                        <option value="en_preparacion">En Preparación</option>
                        <option value="entregado">Entregado</option>
                      </select>
                    </div>
                  </div>
                }
              </div>
              }
            </div>
          }

          @if (activeTab() === 'products') {
            <!-- Products -->
            <div class="products-section">
              <div class="section-header">
                <h2>Productos</h2>
                <button class="btn btn-gold" (click)="showProductForm.set(true)">+ Nuevo Producto</button>
              </div>

              @if (showProductForm()) {
                <div class="product-form">
                  <h3>{{ editingProduct() ? 'Editar' : 'Nuevo' }} Producto</h3>
                  <div class="form-group">
                    <label class="form-label">Nombre</label>
                    <input type="text" class="form-input" [(ngModel)]="productForm.name">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Descripción</label>
                    <textarea class="form-input" [(ngModel)]="productForm.description"></textarea>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">Precio (HNL)</label>
                      <input type="number" class="form-input" [(ngModel)]="productForm.price_hnl">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Stock</label>
                      <input type="number" class="form-input" [(ngModel)]="productForm.stock">
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Categoría</label>
                    <select class="form-input" [(ngModel)]="productForm.category">
                      <option value="cups">Cups</option>
                      <option value="mini-cakes">Mini Cakes</option>
                      <option value="molds">Molds</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Imagen del Producto</label>
                    @if (productForm.image_url) {
                      <div class="current-image">
                        <img [src]="productForm.image_url" alt="Imagen actual">
                        <button type="button" class="btn-remove-image" (click)="productForm.image_url = ''">×</button>
                      </div>
                    }
                    <input 
                      type="file" 
                      class="form-input"
                      accept="image/*"
                      (change)="onImageSelected($event)"
                    >
                    <input 
                      type="text" 
                      class="form-input mt-sm"
                      [(ngModel)]="productForm.image_url"
                      placeholder="O pega una URL de imagen"
                    >
                    @if (uploadingImage()) {
                      <p class="upload-status">Subiendo imagen...</p>
                    }
                  </div>
                  <div class="form-actions">
                    <button class="btn btn-secondary" (click)="cancelProductForm()">Cancelar</button>
                    <button class="btn btn-primary" (click)="saveProduct()">Guardar</button>
                  </div>
                </div>
              }

              <table class="data-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Categoría</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  @for (product of products(); track product.id) {
                    <tr>
                      <td>{{ product.name }}</td>
                      <td>L {{ product.price_hnl | number:'1.2-2' }}</td>
                      <td>{{ product.stock }}</td>
                      <td>{{ product.category }}</td>
                      <td class="actions">
                        <button class="btn-icon" (click)="editProduct(product)">✏️</button>
                        <button class="btn-icon" (click)="deleteProduct(product.id)">🗑️</button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }

          <button class="btn btn-secondary logout-btn" (click)="logout()">Cerrar Sesión</button>
        }
      </div>
    </main>
  `,
  styles: [`
    .admin-page {
      min-height: 100vh;
      background: var(--color-cream-dark);
      padding: var(--spacing-xl) 0;
    }

    .admin-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 var(--spacing-md);
    }

    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-xl);
    }

    /* Login */
    .login-form {
      max-width: 400px;
      margin: var(--spacing-3xl) auto;
      background: var(--color-white);
      padding: var(--spacing-xl);
      border-radius: var(--border-radius-md);
      box-shadow: var(--shadow-md);
    }

    .login-form h2 {
      margin-bottom: var(--spacing-lg);
    }

    .error {
      color: var(--color-error);
      margin-top: var(--spacing-md);
    }

    /* Tabs */
    .admin-tabs {
      display: flex;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-xl);
    }

    .admin-tabs button {
      padding: var(--spacing-sm) var(--spacing-lg);
      background: var(--color-white);
      border-radius: var(--border-radius-sm);
      font-weight: 500;
    }

    .admin-tabs button.active {
      background: var(--color-brown);
      color: var(--color-white);
    }

    /* Dashboard */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-xl);
    }

    .stat-card {
      background: var(--color-white);
      padding: var(--spacing-lg);
      border-radius: var(--border-radius-md);
      box-shadow: var(--shadow-sm);
    }

    .stat-card h3 {
      font-size: 0.9rem;
      color: var(--color-gray);
      margin-bottom: var(--spacing-sm);
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--color-gold);
    }

    /* Orders */
    .orders-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--spacing-lg);
    }

    .order-card {
      background: var(--color-white);
      padding: var(--spacing-lg);
      border-radius: var(--border-radius-md);
      box-shadow: var(--shadow-sm);
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--spacing-md);
    }

    .order-id {
      font-weight: 600;
    }

    .order-status {
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--border-radius-sm);
      font-size: 0.75rem;
      font-weight: 600;
    }

    .order-status.pendiente_pago { background: #FEF3C7; color: #92400E; }
    .order-status.anticipo_recibido { background: #DBEAFE; color: #1E40AF; }
    .order-status.pagado_total { background: #D1FAE5; color: #065F46; }
    .order-status.en_preparacion { background: #E0E7FF; color: #3730A3; }
    .order-status.entregado { background: var(--color-success); color: white; }

    .order-body p {
      font-size: 0.9rem;
      margin-bottom: var(--spacing-xs);
      color: var(--color-gray);
    }

    .order-total {
      font-weight: 600;
      color: var(--color-brown) !important;
    }

    .order-actions {
      margin-top: var(--spacing-md);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .order-actions select {
      width: 100%;
    }

    .btn-sm {
      padding: var(--spacing-xs) var(--spacing-sm);
      font-size: 0.85rem;
    }

    .btn-success {
      background: #10B981;
      color: white;
      border: none;
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--border-radius-sm);
      cursor: pointer;
      font-weight: 500;
    }

    .btn-success:hover {
      background: #059669;
    }

    .payment-info {
      margin-top: var(--spacing-xs);
      font-size: 0.9rem;
    }

    .advance-paid {
      color: #10B981;
      font-weight: 600;
    }

    .advance-pending {
      color: #F59E0B;
      font-weight: 600;
    }

    /* Products */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-lg);
    }

    .product-form {
      background: var(--color-white);
      padding: var(--spacing-lg);
      border-radius: var(--border-radius-md);
      margin-bottom: var(--spacing-lg);
      box-shadow: var(--shadow-sm);
    }

    .product-form h3 {
      margin-bottom: var(--spacing-md);
      padding-bottom: var(--spacing-sm);
      border-bottom: 1px solid var(--color-cream-dark);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-md);
    }

    .form-group {
      margin-bottom: var(--spacing-md);
      display: flex;
      flex-direction: column;
    }

    .form-label {
      font-weight: 600;
      margin-bottom: var(--spacing-xs);
      color: var(--color-brown);
      font-size: 0.95rem;
    }

    .form-input {
      width: 100%;
      padding: 0.8rem var(--spacing-sm);
      border: 1px solid var(--color-cream-dark);
      border-radius: var(--border-radius-sm);
      font-family: inherit;
      font-size: 1rem;
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
      background-color: var(--color-white);
    }

    .form-input:focus {
      outline: none;
      border-color: var(--color-gold);
      box-shadow: 0 0 0 3px var(--color-gold-light);
    }

    textarea.form-input {
      resize: vertical;
      min-height: 80px;
    }

    .form-actions {
      display: flex;
      gap: var(--spacing-md);
      justify-content: flex-end;
      margin-top: var(--spacing-md);
    }

    .data-table {
      width: 100%;
      background: var(--color-white);
      border-radius: var(--border-radius-md);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }

    .data-table th,
    .data-table td {
      padding: var(--spacing-md);
      text-align: left;
    }

    .data-table th {
      background: var(--color-brown);
      color: var(--color-white);
      font-weight: 500;
    }

    .data-table tr:nth-child(even) {
      background: var(--color-cream);
    }

    .current-image {
      position: relative;
      width: 100px;
      height: 100px;
      margin-bottom: var(--spacing-sm);
      border-radius: var(--border-radius-sm);
      overflow: hidden;
    }

    .current-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .btn-remove-image {
      position: absolute;
      top: 2px;
      right: 2px;
      width: 24px;
      height: 24px;
      background: var(--color-error);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }

    .upload-status {
      color: var(--color-gold);
      font-size: 0.9rem;
      margin-top: var(--spacing-xs);
    }

    .help-text {
      color: var(--color-gray);
      font-size: 0.8rem;
      margin-top: var(--spacing-xs);
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      cursor: pointer;
    }

    .slides-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--spacing-lg);
    }

    .slide-card {
      background: var(--color-white);
      border-radius: var(--border-radius-md);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }

    .slide-card img {
      width: 100%;
      height: 160px;
      object-fit: cover;
    }

    .slide-info {
      padding: var(--spacing-md);
    }

    .slide-info h4 {
      font-size: 1rem;
      margin-bottom: var(--spacing-xs);
    }

    .slide-info p {
      font-size: 0.85rem;
      color: var(--color-gray);
      margin-bottom: var(--spacing-xs);
    }

    .slide-order {
      font-size: 0.8rem;
      color: var(--color-gold);
    }

    .slide-inactive {
      display: inline-block;
      margin-left: var(--spacing-sm);
      padding: 2px 6px;
      background: var(--color-error);
      color: white;
      font-size: 0.7rem;
      border-radius: var(--border-radius-sm);
    }

    .slide-actions {
      display: flex;
      gap: var(--spacing-sm);
      padding: var(--spacing-md);
      border-top: 1px solid var(--color-rose-pastel);
    }

    .actions {
      display: flex;
      gap: var(--spacing-sm);
    }

    .btn-icon {
      padding: var(--spacing-xs);
    }

    .logout-btn {
      margin-top: var(--spacing-xl);
    }
  `]
})
export class AdminComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private auth = inject(AuthService);

  isAuthenticated = this.auth.isAuthenticated;
  activeTab = signal<'orders' | 'products' | 'hero' | 'payment' | 'dashboard'>('orders');
  loginError = signal('');

  orders = signal<Order[]>([]);
  products = signal<Product[]>([]);
  isLoading = signal(false);
  totalSales = signal(0);
  topProducts = signal<{product_name: string; total_sold: number}[]>([]);

  loginEmail = '';
  loginPassword = '';

  showProductForm = signal(false);
  editingProduct = signal<Product | null>(null);
  uploadingImage = signal(false);
  productForm = {
    name: '',
    description: '',
    price_hnl: 0,
    stock: 0,
    category: 'cups',
    image_url: ''
  };

  heroSlides = signal<any[]>([]);
  showHeroForm = signal(false);
  editingHero = signal<any>(null);
  heroForm = {
    image_url: '',
    title: '',
    subtitle: '',
    button_text: '',
    button_link: '',
    order_index: 0,
    is_active: true
  };

  paymentSettingsForm = signal<PaymentSettings | null>(null);

  constructor() {
    // Reactively load data when authentication state changes
    effect(() => {
      if (this.isAuthenticated()) {
        this.loadData();
        this.loadHeroSlides();
        this.loadPaymentSettings();
      } else {
        // Clear data when not authenticated
        this.orders.set([]);
        this.products.set([]);
      }
    });
  }

  async ngOnInit() {
    // effect handles the initial and subsequent loads
  }

  async login() {
    const result = await this.auth.signIn(this.loginEmail, this.loginPassword);
    if (result.error) {
      this.loginError.set(result.error);
    } else {
      this.loginError.set('');
      await this.loadData();
    }
  }

  async logout() {
    await this.auth.signOut();
  }

  async loadData() {
    this.isLoading.set(true);
    try {
      console.log('Loading orders...');
      const orders = await this.supabase.getOrders();
      console.log('Orders loaded:', orders.length, 'orders');
      
      console.log('Loading products...');
      const products = await this.supabase.getProducts();
      console.log('Products loaded:', products.length, 'products');
      
      const sales = await this.supabase.getTotalSales();
      const top = await this.supabase.getTopProducts();
      
      this.orders.set(orders);
      this.products.set(products);
      this.totalSales.set(sales);
      this.topProducts.set(top);
    } catch (error: any) {
      console.error('Error loading data:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadHeroSlides() {
    try {
      const slides = await this.supabase.getAllHeroSlides();
      this.heroSlides.set(slides);
    } catch (error) {
      console.error('Error loading hero slides:', error);
    }
  }

  async loadPaymentSettings() {
    try {
      const settings = await this.supabase.getPaymentSettings();
      if (settings) {
        this.paymentSettingsForm.set(settings);
      } else {
        this.paymentSettingsForm.set({
          id: '',
          bank_name: 'Banco de Honduras',
          account_number: '2001112233',
          account_holder: 'Sweet Bloom',
          instructions: '',
          advance_percentage: 50,
          whatsapp: '+50455556756',
          email: 'sac@sweetbloom.com',
          is_active: true,
          created_at: '',
          updated_at: ''
        });
      }
    } catch (error) {
      console.error('Error loading payment settings:', error);
    }
  }

  async savePaymentSettings() {
    try {
      const settings = this.paymentSettingsForm();
      if (!settings) return;
      
      await this.supabase.updatePaymentSettings({
        bank_name: settings.bank_name,
        account_number: settings.account_number,
        account_holder: settings.account_holder,
        instructions: settings.instructions,
        advance_percentage: settings.advance_percentage,
        whatsapp: settings.whatsapp,
        email: settings.email,
        is_active: settings.is_active
      });
      alert('Configuración guardada correctamente');
    } catch (error) {
      console.error('Error saving payment settings:', error);
      alert('Error al guardar la configuración');
    }
  }

  async switchToHeroTab() {
    this.activeTab.set('hero');
    await this.loadHeroSlides();
  }

  editHeroSlide(slide: any) {
    this.editingHero.set(slide);
    this.heroForm = {
      image_url: slide.image_url || '',
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      button_text: slide.button_text || '',
      button_link: slide.button_link || '',
      order_index: slide.order_index || 0,
      is_active: slide.is_active !== false
    };
    this.showHeroForm.set(true);
  }

  cancelHeroForm() {
    this.showHeroForm.set(false);
    this.editingHero.set(null);
    this.heroForm = {
      image_url: '',
      title: '',
      subtitle: '',
      button_text: '',
      button_link: '',
      order_index: 0,
      is_active: true
    };
  }

  async onHeroImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.uploadingImage.set(true);
      try {
        const imageUrl = await this.supabase.uploadProductImage(file);
        this.heroForm.image_url = imageUrl;
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error al subir la imagen');
      } finally {
        this.uploadingImage.set(false);
      }
    }
  }

  async saveHeroSlide() {
    try {
      const editing = this.editingHero();
      if (editing) {
        await this.supabase.updateHeroSlide(editing.id, this.heroForm);
      } else {
        await this.supabase.createHeroSlide(this.heroForm);
      }
      this.cancelHeroForm();
      await this.loadHeroSlides();
    } catch (error) {
      console.error('Error saving hero slide:', error);
    }
  }

  async deleteHeroSlide(id: string) {
    if (confirm('¿Estás seguro de eliminar este slide?')) {
      await this.supabase.deleteHeroSlide(id);
      await this.loadHeroSlides();
    }
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'pendiente_pago': 'Pendiente',
      'anticipo_recibido': 'Anticipo',
      'pagado_total': 'Pagado',
      'en_preparacion': 'Preparación',
      'entregado': 'Entregado'
    };
    return labels[status] || status;
  }

  async updateOrderStatus(orderId: string, status: string, advancePaid: boolean = false, advanceAmount?: number) {
    await this.supabase.updateOrderStatus(orderId, status, advancePaid, advanceAmount);
    await this.loadData();
  }

  async markAdvanceReceived(order: Order) {
    const settings = this.paymentSettingsForm();
    const percentage = settings?.advance_percentage || 50;
    const advanceAmount = order.total_hnl * (percentage / 100);
    if (confirm(`¿Confirmar que recibiste el anticipo de L ${advanceAmount.toFixed(2)} (${percentage}%)?`)) {
      await this.updateOrderStatus(order.id, 'anticipo_recibido', true, advanceAmount);
    }
  }

  editProduct(product: Product) {
    this.editingProduct.set(product);
    this.productForm = {
      name: product.name,
      description: product.description || '',
      price_hnl: product.price_hnl,
      stock: product.stock,
      category: product.category,
      image_url: product.image_url || ''
    };
    this.showProductForm.set(true);
  }

  cancelProductForm() {
    this.showProductForm.set(false);
    this.editingProduct.set(null);
    this.productForm = { name: '', description: '', price_hnl: 0, stock: 0, category: 'cups', image_url: '' };
  }

  async saveProduct() {
    try {
      const editing = this.editingProduct();
      if (editing) {
        await this.supabase.updateProduct(editing.id, this.productForm);
      } else {
        await this.supabase.createProduct(this.productForm);
      }
      this.cancelProductForm();
      await this.loadData();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  }

  async onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.uploadingImage.set(true);
      try {
        const imageUrl = await this.supabase.uploadProductImage(file);
        this.productForm.image_url = imageUrl;
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error al subir la imagen');
      } finally {
        this.uploadingImage.set(false);
      }
    }
  }

  async deleteProduct(id: string) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      await this.supabase.deleteProduct(id);
      await this.loadData();
    }
  }
}
