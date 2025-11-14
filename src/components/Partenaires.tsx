import { Bell, X, Plus, Edit2, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import PartnerFormModal from './PartnerFormModal';
import { Partner, getAllPartners, createPartner, updatePartner, deletePartner, PartnerFormData } from '../services/partnersService';

interface PartenairesProps {
  onNotificationClick: () => void;
  notificationCount: number;
}


export default function Partenaires({ onNotificationClick, notificationCount }: PartenairesProps) {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await getAllPartners();
      setPartners(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des partenaires');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPartner = () => {
    setEditingPartner(null);
    setIsFormModalOpen(true);
  };

  const handleEditPartner = (partner: Partner) => {
    setEditingPartner(partner);
    setIsFormModalOpen(true);
  };

  const handleSavePartner = async (formData: PartnerFormData) => {
    if (editingPartner) {
      await updatePartner(editingPartner.id, formData, editingPartner.logo_url);
    } else {
      await createPartner(formData);
    }
    await loadPartners();
  };

  const handleDeletePartner = async (partner: Partner) => {
    setDeleteConfirmId(partner.id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;

    const partner = partners.find(p => p.id === deleteConfirmId);
    if (!partner) return;

    try {
      setIsDeleting(true);
      await deletePartner(partner.id, partner.logo_url);
      await loadPartners();
      setDeleteConfirmId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  return (
    <div className="flex-1 overflow-auto">
      <header className="glass-card ml-20 mr-4 lg:mx-8 mt-4 md:mt-6 lg:mt-8 px-4 md:px-6 lg:px-8 py-4 md:py-5 flex items-center justify-between floating-shadow">
        <div>
          <h1 className="text-xl md:text-2xl font-light text-gray-900">Partenaires</h1>
          <p className="text-xs md:text-sm text-gray-500 font-light mt-1 hidden sm:block">Accédez aux portails de nos partenaires</p>
        </div>
        <div className="flex items-center gap-3">
          {!selectedPartner && (
            <button
              onClick={handleAddPartner}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center gap-2 transition-all hover:from-blue-600 hover:to-blue-700 shadow-md hover:scale-105 text-sm font-light"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Ajouter un partenaire</span>
            </button>
          )}
          <button onClick={onNotificationClick} className="w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all hover:scale-105 shadow-sm relative flex-shrink-0">
            <Bell className="w-5 h-5 text-gray-600" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-light shadow-lg animate-pulse">
                {notificationCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
        {error && (
          <div className="glass-card p-4 floating-shadow mb-4 bg-red-50 border border-red-200">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm font-light">{error}</p>
            </div>
          </div>
        )}

        {!selectedPartner ? (
          <div className="glass-card p-6 md:p-8 floating-shadow">
            <h2 className="text-lg font-light text-gray-900 mb-6">Nos partenaires assureurs</h2>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : partners.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 font-light mb-4">Aucun partenaire pour le moment</p>
                <button
                  onClick={handleAddPartner}
                  className="px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center gap-2 transition-all hover:from-blue-600 hover:to-blue-700 shadow-md mx-auto text-sm font-light"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter le premier partenaire
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {partners.map((partner) => (
                  <div
                    key={partner.id}
                    className="glass-card p-6 md:p-8 hover:bg-white transition-all group relative"
                  >
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPartner(partner);
                        }}
                        className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-all shadow-md"
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePartner(partner);
                        }}
                        className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all shadow-md"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    <button
                      onClick={() => setSelectedPartner(partner)}
                      className="w-full flex flex-col items-center justify-center gap-4 cursor-pointer"
                    >
                      <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
                        <img
                          src={partner.logo_url}
                          alt={partner.name}
                          className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all"
                        />
                      </div>
                      <span className="text-sm font-light text-gray-700 group-hover:text-gray-900">{partner.name}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="glass-card p-4 floating-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-light text-gray-900">{selectedPartner.name}</h2>
              <button
                onClick={() => setSelectedPartner(null)}
                className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all hover:scale-105 shadow-sm"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="w-full h-[calc(100vh-240px)] bg-white rounded-2xl overflow-hidden shadow-inner">
              <iframe
                src={selectedPartner.website_url}
                className="w-full h-full"
                title={selectedPartner.name}
                allow="fullscreen"
              />
            </div>
          </div>
        )}
      </div>

      <PartnerFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSavePartner}
        partner={editingPartner}
      />

      {deleteConfirmId && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[109]" onClick={cancelDelete} />
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md border border-gray-200/50 pointer-events-auto p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-light text-gray-900">Confirmer la suppression</h3>
              </div>
              <p className="text-sm text-gray-600 font-light mb-6">
                Êtes-vous sûr de vouloir supprimer ce partenaire ? Cette action est irréversible.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl text-sm font-light transition-all disabled:opacity-50"
                  disabled={isDeleting}
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl text-sm font-light hover:from-red-600 hover:to-red-700 shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
                  disabled={isDeleting}
                >
                  {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isDeleting ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
