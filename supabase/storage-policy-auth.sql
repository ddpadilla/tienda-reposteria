-- Políticas estrictas para storage - requieren autenticación
DROP POLICY IF EXISTS "Allow public insert product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete product images" ON storage.objects;

-- Política de lectura pública
DROP POLICY IF EXISTS "Public product images access" ON storage.objects;
CREATE POLICY "Public product images access" ON storage.objects 
FOR SELECT USING (bucket_id = 'product-images');

-- Políticas que requieren autenticación
CREATE POLICY "Auth product images insert" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Auth product images update" ON storage.objects 
FOR UPDATE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Auth product images delete" ON storage.objects 
FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
