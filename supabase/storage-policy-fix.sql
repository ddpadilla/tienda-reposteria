-- Eliminar políticas anteriores de storage
DROP POLICY IF EXISTS "Authenticated product images upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated product images update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated product images delete" ON storage.objects;

-- Nuevas políticas que permiten acceso sin autenticación para el bucket de productos
CREATE POLICY "Allow public insert product images" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow public update product images" ON storage.objects 
FOR UPDATE USING (bucket_id = 'product-images');

CREATE POLICY "Allow public delete product images" ON storage.objects 
FOR DELETE USING (bucket_id = 'product-images');
