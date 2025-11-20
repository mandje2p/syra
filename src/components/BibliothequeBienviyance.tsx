import { useState } from 'react';
import { Bell, Search, FileText, Eye, Download, Trash2, Plus, FolderOpen } from 'lucide-react';
import { formatFileSize } from '../services/libraryService';
import { useLibraryDocuments } from '../hooks/useLibraryDocuments';
import UploadDocumentModal from './UploadDocumentModal';

interface BibliothequeBienviyanceProps {
  onNotificationClick: () => void;
  notificationCount: number;
}

export default function BibliothequeBienviyance({ onNotificationClick, notificationCount }: BibliothequeBienviyanceProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);

  const {
    filteredDocuments,
    searchTerm,
    setSearchTerm,
    loading,
    canUpload,
    currentUserId,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleDownload,
    handleView,
    handleDelete,
    loadDocuments,
    isMockDocument,
  } = useLibraryDocuments({ category: 'Bienviyance' });

  const handleUploadSuccess = () => {
    loadDocuments();
    setShowUploadModal(false);
  };

  return (
    <div className="flex-1 overflow-auto">
      <header className="glass-card ml-20 mr-4 lg:mx-8 mt-4 md:mt-6 lg:mt-8 px-4 md:px-6 lg:px-8 py-4 md:py-5 flex items-center justify-between floating-shadow">
        <div>
          <h1 className="text-xl md:text-2xl font-light text-gray-900">
            Bibliothèque - Bienviyance
          </h1>
          <p className="text-xs md:text-sm text-gray-500 font-light mt-1 hidden sm:block">
            Documents internes Bienviyance
          </p>
        </div>
        <button
          onClick={onNotificationClick}
          className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center transition-all hover:scale-105 relative flex-shrink-0"
        >
          <Bell className="w-5 h-5 text-gray-900 dark:text-gray-300" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-light shadow-lg animate-pulse">
              {notificationCount}
            </span>
          )}
        </button>
      </header>

      <div className="px-4 md:px-6 lg:px-8 py-3 md:py-4 lg:py-5 max-w-[1800px] mx-auto">
        <div className="glass-card p-6 floating-shadow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un document..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {canUpload ? (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl text-sm font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all hover:scale-105 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Ajouter un document</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-500 font-light">
                  <span className="hidden sm:inline">Droits insuffisants pour ajouter des documents</span>
                  <span className="sm:hidden">Pas de droits</span>
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="glass-card p-4 animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <FolderOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-light text-gray-900 mb-2">Aucun document disponible</h3>
              <p className="text-sm text-gray-500 font-light mb-6">
                {searchTerm ? 'Aucun résultat pour votre recherche' : 'Aucun document Bienviyance disponible'}
              </p>
              {canUpload && !searchTerm && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all hover:scale-105"
                >
                  Ajouter un document
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="glass-card glass-card-hover p-4 floating-shadow relative group"
                >
                  {showDeleteConfirm === doc.id && (
                    <div className="absolute inset-0 bg-red-50/95 backdrop-blur-sm rounded-3xl z-10 flex flex-col items-center justify-center p-4">
                      <p className="text-sm text-gray-900 font-medium mb-3 text-center">
                        Confirmer la suppression ?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="px-4 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-full text-xs font-light hover:bg-gray-50"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={() => handleDelete(doc)}
                          className="px-4 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-xs font-light hover:from-red-600 hover:to-red-700"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg mb-3">
                    <FileText className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                    {doc.title}
                  </h3>

                  <div className="text-xs text-gray-500 font-light space-y-1 mb-3">
                    <p>{new Date(doc.uploaded_at).toLocaleDateString('fr-FR')}</p>
                    <p>{formatFileSize(doc.file_size)}</p>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleView(doc)}
                      className="flex-1 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Voir"
                    >
                      <Eye className="w-4 h-4 text-blue-600 mx-auto" />
                    </button>
                    <button
                      onClick={() => handleDownload(doc)}
                      className="flex-1 p-2 hover:bg-green-50 rounded-lg transition-colors"
                      title="Télécharger"
                    >
                      <Download className="w-4 h-4 text-green-600 mx-auto" />
                    </button>
                    {canUpload && !isMockDocument(doc) && (
                      <button
                        onClick={() => handleDelete(doc)}
                        className="flex-1 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 mx-auto" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showUploadModal && currentUserId && (
        <UploadDocumentModal
          userId={currentUserId}
          organizationId="1"
          uploadCategory="Bienviyance"
          uploadSubCategory={undefined}
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
}
