-- Create storage bucket for past exams
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'past-exams',
  'past-exams',
  true,
  26214400, -- 25MB in bytes
  ARRAY['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
);

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'past-exams' AND 
  auth.role() = 'authenticated'
);

-- Allow public read access to files
CREATE POLICY "Allow public downloads" ON storage.objects
FOR SELECT USING (bucket_id = 'past-exams');

-- Allow users to delete their own files
CREATE POLICY "Allow users to delete own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'past-exams' AND
  auth.uid()::text = (storage.foldername(name))[1]
);