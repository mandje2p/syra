/*
  # Ajout de documents d'exemple pour Contrats et Bienviyance
  
  1. Documents Contrats
    - Documents liés aux contrats d'assurance (PER, Assurance Vie, etc.)
    
  2. Documents Bienviyance
    - Documents internes de l'entreprise (guides, procédures, etc.)
*/

DO $$
DECLARE
  admin_id uuid;
BEGIN
  SELECT id INTO admin_id FROM user_profiles WHERE profile_type = 'Admin' LIMIT 1;
  
  IF admin_id IS NOT NULL THEN
    -- Supprimer les anciens documents avec catégorie Prévoyance
    DELETE FROM library_documents WHERE category = 'Prévoyance';
    
    -- Documents Contrats (PER et Assurance Vie)
    INSERT INTO library_documents (organization_id, title, file_url, file_name, file_size, category, uploaded_by)
    VALUES
      ('1', 'MMA PER Individuel - Guide complet 2024', '1/Contrats/mma-per-guide-2024.pdf', 'mma-per-guide-2024.pdf', 1856234, 'Contrats', admin_id),
      ('1', 'Generali PER - Avantages fiscaux détaillés', '1/Contrats/generali-per-fiscal.pdf', 'generali-per-fiscal.pdf', 2134567, 'Contrats', admin_id),
      ('1', 'Entoria PER - Documentation contractuelle', '1/Contrats/entoria-per-contrat.pdf', 'entoria-per-contrat.pdf', 1987234, 'Contrats', admin_id),
      ('1', 'AG2R La Mondiale PER - Conditions générales', '1/Contrats/ag2r-per-cg.pdf', 'ag2r-per-cg.pdf', 2456789, 'Contrats', admin_id),
      ('1', 'Axa PER - Notice d''information', '1/Contrats/axa-per-notice.pdf', 'axa-per-notice.pdf', 1678901, 'Contrats', admin_id),
      ('1', 'MMA Assurance Vie - Contrat Multisupport Elite', '1/Contrats/mma-av-elite.pdf', 'mma-av-elite.pdf', 2234567, 'Contrats', admin_id),
      ('1', 'Generali Assurance Vie - Options de gestion', '1/Contrats/generali-av-options.pdf', 'generali-av-options.pdf', 1876543, 'Contrats', admin_id),
      ('1', 'Entoria Assurance Vie - Supports d''investissement', '1/Contrats/entoria-av-supports.pdf', 'entoria-av-supports.pdf', 2098765, 'Contrats', admin_id),
      ('1', 'Cardif Assurance Vie - Conditions tarifaires', '1/Contrats/cardif-av-tarifs.pdf', 'cardif-av-tarifs.pdf', 1567890, 'Contrats', admin_id),
      ('1', 'Axa Assurance Vie - Document d''informations clés', '1/Contrats/axa-av-dici.pdf', 'axa-av-dici.pdf', 1234567, 'Contrats', admin_id),
      ('1', 'SwissLife PER - Guide pratique de souscription', '1/Contrats/swisslife-per-guide.pdf', 'swisslife-per-guide.pdf', 1945678, 'Contrats', admin_id),
      ('1', 'BNP Paribas Assurance Vie - Fiscalité et succession', '1/Contrats/bnp-av-fiscalite.pdf', 'bnp-av-fiscalite.pdf', 2167890, 'Contrats', admin_id)
    ON CONFLICT DO NOTHING;
    
    -- Documents Bienviyance (internes)
    INSERT INTO library_documents (organization_id, title, file_url, file_name, file_size, category, uploaded_by)
    VALUES
      ('1', 'Guide du conseiller Bienviyance - Edition 2024', '1/Bienviyance/guide-conseiller-2024.pdf', 'guide-conseiller-2024.pdf', 3456789, 'Bienviyance', admin_id),
      ('1', 'Procédure de recueil des besoins clients', '1/Bienviyance/procedure-recueil-besoins.pdf', 'procedure-recueil-besoins.pdf', 1234567, 'Bienviyance', admin_id),
      ('1', 'Charte qualité Bienviyance', '1/Bienviyance/charte-qualite.pdf', 'charte-qualite.pdf', 987654, 'Bienviyance', admin_id),
      ('1', 'Formation DDA - Support de formation', '1/Bienviyance/formation-dda.pdf', 'formation-dda.pdf', 2876543, 'Bienviyance', admin_id),
      ('1', 'Processus de validation des dossiers', '1/Bienviyance/processus-validation.pdf', 'processus-validation.pdf', 1567890, 'Bienviyance', admin_id),
      ('1', 'Modèles de devoir de conseil', '1/Bienviyance/modeles-devoir-conseil.pdf', 'modeles-devoir-conseil.pdf', 2345678, 'Bienviyance', admin_id),
      ('1', 'Argumentaire commercial - Assurance Vie', '1/Bienviyance/argumentaire-av.pdf', 'argumentaire-av.pdf', 1876543, 'Bienviyance', admin_id),
      ('1', 'Argumentaire commercial - PER', '1/Bienviyance/argumentaire-per.pdf', 'argumentaire-per.pdf', 1789012, 'Bienviyance', admin_id),
      ('1', 'Présentation entreprise Bienviyance', '1/Bienviyance/presentation-entreprise.pdf', 'presentation-entreprise.pdf', 4567890, 'Bienviyance', admin_id),
      ('1', 'Guide des partenaires assureurs', '1/Bienviyance/guide-partenaires.pdf', 'guide-partenaires.pdf', 2678901, 'Bienviyance', admin_id),
      ('1', 'Grilles de rémunération 2024', '1/Bienviyance/grilles-remuneration-2024.pdf', 'grilles-remuneration-2024.pdf', 1456789, 'Bienviyance', admin_id),
      ('1', 'Procédure de mise en relation client', '1/Bienviyance/procedure-mise-en-relation.pdf', 'procedure-mise-en-relation.pdf', 1234567, 'Bienviyance', admin_id)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;