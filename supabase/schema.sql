-- Sweet Bloom Database Schema
-- Ejecutar en Supabase SQL Editor

-- Tabla PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_hnl DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL DEFAULT 'cups',
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT,
  total_hnl DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pendiente_pago',
  payment_method TEXT,
  payment_proof_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla ORDER_ITEMS
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price_hnl DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla ADMIN USERS (simple, solo email y password hash)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para PRODUCTS
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public insert products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update products" ON products FOR UPDATE USING (true);
CREATE POLICY "Public delete products" ON products FOR DELETE USING (true);

-- Políticas RLS para ORDERS (lectura pública para ver estado, gestión completa para auth)
CREATE POLICY "Public read orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public manage orders" ON orders FOR UPDATE USING (true);

-- Políticas RLS para ORDER_ITEMS
CREATE POLICY "Public read order_items" ON order_items FOR SELECT USING (true);
CREATE POLICY "Public insert order_items" ON order_items FOR INSERT WITH CHECK (true);

-- Políticas RLS para ADMIN_USERS
CREATE POLICY "Admin full access" ON admin_users FOR ALL USING (auth.role() = 'authenticated');

-- Insertar productos de ejemplo
INSERT INTO products (name, description, price_hnl, category, stock) VALUES
('Yuzu Matcha Gem', 'Delicada combinación de yuzu con té matcha', 416.00, 'cups', 50),
('Salted Caramel Chocolate Dome', 'Dome de chocolate con caramelo salado', 442.00, 'cups', 50),
('Pistachio Rose Entremet', 'Entremet de pistacho con rosa', 468.00, 'cups', 50),
('Tiramisu Dream Cup', 'Cup de tiramisu clásico', 364.00, 'cups', 50),
('White Chocolate Raspberry Parfait', 'Parfait de chocolate blanco y frambuesa', 338.00, 'cups', 50),
('Mango Passion Fruit Mousse', 'Mousse de mango y maracuyá', 312.00, 'cups', 50),
('Lemon Lavender Blossom', 'Cup de lavanda y limón', 390.00, 'cups', 50),
('Chocolate Espresso Tartlet', 'Tartlet de chocolate y espresso', 416.00, 'cups', 50),
('Berry Vanilla Mini Cake', 'Mini cake de vainilla con berries', 390.00, 'mini-cakes', 30);

-- Crear bucket para imágenes
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Política para acceder a imágenes públicas
CREATE POLICY "Public product images access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Authenticated product images upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated product images update" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated product images delete" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
