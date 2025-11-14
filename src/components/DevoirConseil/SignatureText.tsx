interface SignatureTextProps {
  formData: {
    prenom: string;
    nom: string;
    date_naissance: string;
    adresse: string;
    code_postal: string;
    ville: string;
    profession: string;
    telephone: string;
    email: string;
  };
  contracts: any[];
}

export default function SignatureText({ formData, contracts }: SignatureTextProps) {
  const formatCurrency = (value: string) => {
    if (!value || value === '') return null;
    const numValue = parseFloat(value.replace(/[^\d.-]/g, ''));
    if (isNaN(numValue)) return value;
    return `${numValue.toLocaleString('fr-FR')} €`;
  };

  const renderFinancialDetails = (contract: any) => {
    const details = [];

    if (contract.montant_initial) {
      details.push(`Montant initial: ${formatCurrency(contract.montant_initial)}`);
    }

    if (contract.versement_programme) {
      details.push(`Versement programmé: ${formatCurrency(contract.versement_programme)}`);
    }

    if (contract.versement_initial) {
      details.push(`Versement initial: ${formatCurrency(contract.versement_initial)}`);
    }

    if (contract.periodicite) {
      details.push(`Périodicité: ${contract.periodicite}`);
    }

    if (contract.vp_optionnel) {
      details.push(`VP: ${formatCurrency(contract.vp_optionnel)}`);
    }

    if (contract.vl) {
      details.push(`VL: ${formatCurrency(contract.vl)}`);
    }

    if (contract.frais_versement) {
      details.push(`Frais de versement: ${contract.frais_versement}%`);
    }

    if (contract.frais_chacun) {
      details.push(`Frais: ${contract.frais_chacun}%`);
    }

    if (contract.frais_dossier) {
      details.push(`Frais de dossier: ${formatCurrency(contract.frais_dossier)}`);
    }

    return details;
  };

  return (
    <div className="text-sm text-gray-700 leading-relaxed space-y-2">
      <p>
        Je soussigné(e) <span className="font-medium text-blue-600">{formData.prenom} {formData.nom}</span>,
        né(e) le <span className="font-medium text-blue-600">{formData.date_naissance ? new Date(formData.date_naissance).toLocaleDateString('fr-FR') : '___________'}</span>,
        demeurant à <span className="font-medium text-blue-600">{formData.adresse || '___________'}</span>,
        <span className="font-medium text-blue-600"> {formData.code_postal} {formData.ville}</span>.
      </p>
      <p>
        Profession: <span className="font-medium text-blue-600">{formData.profession || '___________'}</span>
      </p>
      <p>
        Téléphone: <span className="font-medium text-blue-600">{formData.telephone || '___________'}</span>
      </p>
      <p>
        Email: <span className="font-medium text-blue-600">{formData.email || '___________'}</span>
      </p>
      <p className="mt-4">
        Certifie avoir pris connaissance de l'ensemble des éléments du présent devoir de conseil,
        notamment les informations relatives à mes besoins et exigences, l'analyse de ma situation,
        les propositions qui m'ont été faites ainsi que les raisons qui motivent le conseil fourni.
      </p>
      <p className="mt-4">
        Accepte expressément que les contrats suivants soient souscrits:
      </p>
      {contracts.length > 0 && (
        <div className="ml-4 space-y-3">
          {contracts.map((contract, index) => {
            const financialDetails = renderFinancialDetails(contract);
            return (
              <div key={index} className="border-l-2 border-blue-300 pl-4 py-1">
                <p>
                  <span className="font-medium text-blue-600">
                    {contract.produit || contract.gamme_contrat}
                  </span>{' '}
                  auprès de{' '}
                  <span className="font-medium text-blue-600">{contract.assureur}</span>
                </p>
                {financialDetails.length > 0 && (
                  <ul className="mt-1 space-y-0.5 text-xs text-gray-600">
                    {financialDetails.map((detail, idx) => (
                      <li key={idx} className="ml-4">• {detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
      <p className="mt-4">
        Fait à <span className="font-medium text-blue-600">{formData.ville || '___________'}</span>,
        le <span className="font-medium text-blue-600">{new Date().toLocaleDateString('fr-FR')}</span>
      </p>
      <p className="mt-6 text-xs text-gray-500 italic">
        Signature précédée de la mention "Lu et approuvé"
      </p>
    </div>
  );
}
