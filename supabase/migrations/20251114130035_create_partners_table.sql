/*
  # Create Partners Management System

  1. New Tables
    - `partners`
      - `id` (uuid, primary key) - Unique identifier for each partner
      - `name` (text, not null) - Partner company name
      - `logo_url` (text, not null) - URL to the partner's logo in storage
      - `website_url` (text, not null) - Partner's website URL
      - `created_at` (timestamptz) - When the partner was added
      - `updated_at` (timestamptz) - When the partner was last updated

  2. Storage
    - Create `partner-logos` bucket for storing partner logo images
    - Enable public access for viewing logos
    - Add policies for authenticated users to upload/update/delete logos

  3. Security
    - Enable RLS on `partners` table
    - Add policy for anyone to read partners (public access)
    - Add policy for authenticated users to insert partners
    - Add policy for authenticated users to update partners
    - Add policy for authenticated users to delete partners

  4. Indexes
    - Create index on `name` column for alphabetical sorting performance
*/

-- Create partners table
CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text NOT NULL,
  website_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for alphabetical sorting
CREATE INDEX IF NOT EXISTS idx_partners_name ON partners(name);

-- Enable RLS
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view partners"
  ON partners
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert partners"
  ON partners
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update partners"
  ON partners
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete partners"
  ON partners
  FOR DELETE
  TO authenticated
  USING (true);

-- Create storage bucket for partner logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('partner-logos', 'partner-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for partner-logos bucket
CREATE POLICY "Anyone can view partner logos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'partner-logos');

CREATE POLICY "Authenticated users can upload partner logos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'partner-logos');

CREATE POLICY "Authenticated users can update partner logos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'partner-logos')
  WITH CHECK (bucket_id = 'partner-logos');

CREATE POLICY "Authenticated users can delete partner logos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'partner-logos');