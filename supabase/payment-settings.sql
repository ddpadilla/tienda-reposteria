-- Payment Settings Table
CREATE TABLE IF NOT EXISTS payment_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_name TEXT NOT NULL DEFAULT 'Banco de Honduras',
  account_number TEXT NOT NULL DEFAULT '2001112233',
  account_holder TEXT DEFAULT 'Sweet Bloom',
  instructions TEXT DEFAULT '<p>Realiza tu transferencia como anticipo del 50%.</p><p>Envía el comprobante por WhatsApp o correo.</p>',
  advance_percentage NUMERIC DEFAULT 50,
  whatsapp TEXT DEFAULT '+50455556756',
  email TEXT DEFAULT 'sac@sweetbloom.com',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agregar campos de advance a orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS advance_paid BOOLEAN DEFAULT false;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS advance_paid_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS advance_amount_hnl DECIMAL(10,2);

-- Insertar settings por defecto
INSERT INTO payment_settings (bank_name, account_number, account_holder, advance_percentage, whatsapp, email)
VALUES ('Banco de Honduras', '2001112233', 'Sweet Bloom', 50, '+50455556756', 'sac@sweetbloom.com')
ON CONFLICT DO NOTHING;

-- Habilitar RLS
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para payment_settings
CREATE POLICY "Public read payment_settings" ON payment_settings FOR SELECT USING (true);
CREATE POLICY "Authenticated manage payment_settings" ON payment_settings FOR ALL USING (auth.role() = 'authenticated');
