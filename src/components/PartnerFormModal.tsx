import { useState, useRef, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import Modal from './Modal';
import { Partner } from '../services/partnersService';

interface PartnerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: { name: string; website_url: string; logo_file: File | null }) => Promise<void>;
  partner?: Partner | null;
}

export default function PartnerFormModal({ isOpen, onClose, onSave, partner }: PartnerFormModalProps) {
  const [name, setName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && partner) {
      setName(partner.name);
      setWebsiteUrl(partner.website_url);
      setLogoPreview(partner.logo_url);
      setLogoFile(null);
    } else if (isOpen) {
      setName('');
      setWebsiteUrl('');
      setLogoFile(null);
      setLogoPreview('');
    }
    setError('');
  }, [isOpen, partner]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Le fichier doit être une image (PNG, JPG, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('La taille du fichier ne doit pas dépasser 5 MB');
      return;
    }

    setError('');
    setLogoFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Le nom du partenaire est requis');
      return;
    }

    if (!websiteUrl.trim()) {
      setError("L'URL du site web est requise");
      return;
    }

    if (!partner && !logoFile) {
      setError('Le logo est requis');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        name: name.trim(),
        website_url: websiteUrl.trim(),
        logo_file: logoFile,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={partner ? 'Modifier le partenaire' : 'Ajouter un nouveau partenaire'}
      maxWidth="600px"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-light text-gray-700 mb-2">
            Nom du partenaire <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 bg-white/80 border border-gray-200/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
            placeholder="Ex: Allianz"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-light text-gray-700 mb-2">
            URL du site web <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            className="w-full px-4 py-2.5 bg-white/80 border border-gray-200/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
            placeholder="https://www.exemple.fr"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-light text-gray-700 mb-2">
            Logo {!partner && <span className="text-red-500">*</span>}
          </label>
          <div className="space-y-3">
            {logoPreview && (
              <div className="relative w-32 h-32 mx-auto bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-center">
                <img
                  src={logoPreview}
                  alt="Aperçu du logo"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl text-sm font-light hover:from-blue-600 hover:to-blue-700 flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              <Upload className="w-4 h-4" />
              {logoPreview ? 'Changer le logo' : 'Choisir un logo'}
            </button>
            <p className="text-xs text-gray-500 font-light text-center">
              Formats acceptés : PNG, JPG, SVG (max 5 MB)
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl text-sm font-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl text-sm font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? 'Enregistrement...' : (partner ? 'Enregistrer' : 'Ajouter')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
