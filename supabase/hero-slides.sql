-- Tabla para slides del carousel del hero
CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  button_text TEXT,
  button_link TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Public read hero_slides" ON hero_slides FOR SELECT USING (true);
CREATE POLICY "Auth manage hero_slides" ON hero_slides FOR ALL USING (auth.role() = 'authenticated');

-- Insertar slides de ejemplo
INSERT INTO hero_slides (image_url, title, subtitle, button_text, button_link, order_index, is_active) VALUES
('https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1920&h=1080&fit=crop', 'Repostería de Alta Gama para Momentos Únicos', 'Descubre nuestra colección de postres artesanales elaborados con los mejores ingredientes', 'Ver Catálogo', '/shop', 1, true),
('https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1920&h=1080&fit=crop', 'Dulces Creaciones para Celebraciones Especiales', 'Postres elaborados con pasión y los ingredientes más finos', 'Explorar', '/shop', 2, true),
('https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1920&h=1080&fit=crop', 'El Regalo Perfecto: Postres de Lujo', 'Sorprende con nuestras creaciones artesanales exclusivas', 'Ver Productos', '/shop', 3, true);
