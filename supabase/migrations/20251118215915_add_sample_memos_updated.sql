/*
  # Add Sample Memos for Testing

  1. Purpose
    - Add realistic sample memos to demonstrate the memos functionality
    - Include memos with various dates (today, tomorrow, future dates)
    - Provide diverse examples with and without descriptions

  2. Sample Memos (8 examples as specified)
    - Pièce manquante – Dossier MARTIN (12/11/2025 09:00)
    - Relance validation PER – GOASDOUE (14/11/2025 11:30)
    - Signature Assurance Vie – DUPONT (12/11/2025 14:00)
    - Programmer RDV bilan patrimonial (18/11/2025 10:00)
    - Mettre à jour procédure interne Bienviyance (20/11/2025 16:00)
    - Dossier en reprise – Mme LEROY (12/11/2025 18:00)
    - Vérifier documents signés (13/11/2025 15:00)
    - Dossier complexe – Note interne (15/11/2025 09:15)

  3. Notes
    - All memos assigned to the first admin user
    - Mix of memos with and without descriptions
    - Fixed dates for demo purposes
*/

DO $$
DECLARE
  admin_id uuid;
BEGIN
  -- Get the first admin user
  SELECT id INTO admin_id FROM user_profiles WHERE profile_type = 'Admin' LIMIT 1;

  IF admin_id IS NOT NULL THEN
    -- Delete existing sample memos first
    DELETE FROM memos WHERE organization_id = '1';

    -- Insert the 8 specified sample memos
    INSERT INTO memos (organization_id, user_id, title, description, due_date, due_time, status)
    VALUES
      ('1', admin_id, 'Pièce manquante – Dossier MARTIN', 'Attendre l''envoi du justificatif de domicile.', '2025-11-12', '09:00:00', 'pending'),
      ('1', admin_id, 'Relance validation PER – GOASDOUE', 'Relance téléphonique pour finaliser le contrat.', '2025-11-14', '11:30:00', 'pending'),
      ('1', admin_id, 'Signature Assurance Vie – DUPONT', 'Vérifier la signature électronique du dossier.', '2025-11-12', '14:00:00', 'pending'),
      ('1', admin_id, 'Programmer RDV bilan patrimonial', 'Prévoir un créneau de 30 min la semaine prochaine.', '2025-11-18', '10:00:00', 'pending'),
      ('1', admin_id, 'Mettre à jour procédure interne Bienviyance', 'Lire la version 2025 du document de conformité.', '2025-11-20', '16:00:00', 'pending'),
      ('1', admin_id, 'Dossier en reprise – Mme LEROY', 'Reprendre l''analyse (IBAN invalide).', '2025-11-12', '18:00:00', 'pending'),
      ('1', admin_id, 'Vérifier documents signés', 'Confirmer réception des documents post-signature.', '2025-11-13', '15:00:00', 'pending'),
      ('1', admin_id, 'Dossier complexe – Note interne', 'Vérifier situation familiale avant recommandation.', '2025-11-15', '09:15:00', 'pending')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;