/*
  # Add More Sample Library Documents

  1. Purpose
    - Add additional realistic sample documents for both PER and Assurance Vie categories
    - Provide more variety with different insurance companies and document types

  2. Sample Documents
    PER Documents:
    - SwissLife PER - Notice d'information
    - BNP Paribas PER - Guide pratique
    - Crédit Agricole PER - Plaquette produit
    - Allianz PER - Conditions tarifaires

    Assurance Vie Documents:
    - SwissLife Assurance Vie - Document d'informations clés
    - BNP Paribas Assurance Vie - Options de gestion
    - Crédit Agricole Assurance Vie - Fiscalité
    - Allianz Assurance Vie - Frais et performances

  3. Notes
    - Uses dummy file paths (documents will need to be uploaded separately)
    - Realistic file sizes based on typical PDF documents
    - All documents assigned to the first admin user found
*/

DO $$
DECLARE
  admin_id uuid;
BEGIN
  -- Get the first admin user
  SELECT id INTO admin_id FROM user_profiles WHERE profile_type = 'Admin' LIMIT 1;

  IF admin_id IS NOT NULL THEN
    -- Insert additional PER sample documents
    INSERT INTO library_documents (organization_id, title, file_url, file_name, file_size, category, uploaded_by)
    VALUES
      ('1', 'SwissLife PER - Notice d''information', '1/PER/swisslife-per-notice.pdf', 'swisslife-per-notice.pdf', 1789012, 'PER', admin_id),
      ('1', 'BNP Paribas PER - Guide pratique', '1/PER/bnp-per-guide.pdf', 'bnp-per-guide.pdf', 1123456, 'PER', admin_id),
      ('1', 'Crédit Agricole PER - Plaquette produit', '1/PER/ca-per-plaquette.pdf', 'ca-per-plaquette.pdf', 2345678, 'PER', admin_id),
      ('1', 'Allianz PER - Conditions tarifaires', '1/PER/allianz-per-tarifs.pdf', 'allianz-per-tarifs.pdf', 1456789, 'PER', admin_id)
    ON CONFLICT DO NOTHING;

    -- Insert additional Assurance Vie sample documents
    INSERT INTO library_documents (organization_id, title, file_url, file_name, file_size, category, uploaded_by)
    VALUES
      ('1', 'SwissLife Assurance Vie - Document d''informations clés', '1/Assurance Vie/swisslife-av-dici.pdf', 'swisslife-av-dici.pdf', 892345, 'Assurance Vie', admin_id),
      ('1', 'BNP Paribas Assurance Vie - Options de gestion', '1/Assurance Vie/bnp-av-options.pdf', 'bnp-av-options.pdf', 1567234, 'Assurance Vie', admin_id),
      ('1', 'Crédit Agricole Assurance Vie - Fiscalité', '1/Assurance Vie/ca-av-fiscalite.pdf', 'ca-av-fiscalite.pdf', 1234567, 'Assurance Vie', admin_id),
      ('1', 'Allianz Assurance Vie - Frais et performances', '1/Assurance Vie/allianz-av-frais.pdf', 'allianz-av-frais.pdf', 1678901, 'Assurance Vie', admin_id)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
