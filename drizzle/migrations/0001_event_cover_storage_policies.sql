CREATE POLICY "Users can read event cover files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'event-covers');

CREATE POLICY "Users can upload event cover files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'event-covers' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update their event cover files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'event-covers' AND (storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK (bucket_id = 'event-covers' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete their event cover files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'event-covers' AND (storage.foldername(name))[1] = auth.uid()::text);