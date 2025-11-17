import { useState, useEffect } from 'react';
import { LibraryDocument, MockLibraryDocument, DocumentCategory, ContractSubCategory } from '../types';
import { getAllDocuments, deleteDocument, getDocumentDownloadUrl } from '../services/libraryService';
import { getActiveProfile, getProfilePermissions } from '../services/profileService';
import { mockLibraryDocuments } from '../data/mockLibraryDocuments';

interface UseLibraryDocumentsOptions {
  category: DocumentCategory;
  subCategory?: ContractSubCategory;
}

export function useLibraryDocuments({ category, subCategory }: UseLibraryDocumentsOptions) {
  const [documents, setDocuments] = useState<LibraryDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<(LibraryDocument | MockLibraryDocument)[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [canUpload, setCanUpload] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    checkPermissionsAndLoad();
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [category, subCategory]);

  useEffect(() => {
    let docsToFilter: (LibraryDocument | MockLibraryDocument)[] = [];

    if (category === 'Contrats' && subCategory) {
      const realDocs = documents.filter(d => d.category === 'Contrats' && d.sub_category === subCategory);
      const mockDocs = mockLibraryDocuments.filter(d => d.category === 'Contrats' && d.sub_category === subCategory);
      docsToFilter = [...realDocs, ...mockDocs];
    } else if (category === 'Bienviyance') {
      const realDocs = documents.filter(d => d.category === 'Bienviyance');
      const mockDocs = mockLibraryDocuments.filter(d => d.category === 'Bienviyance');
      docsToFilter = [...realDocs, ...mockDocs];
    } else {
      const realDocs = documents.filter(d => d.category === category);
      const mockDocs = mockLibraryDocuments.filter(d => d.category === category);
      docsToFilter = [...realDocs, ...mockDocs];
    }

    if (searchTerm.trim()) {
      const filtered = docsToFilter.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDocuments(filtered);
    } else {
      setFilteredDocuments(docsToFilter);
    }
  }, [searchTerm, documents, category, subCategory]);

  const checkPermissionsAndLoad = async () => {
    try {
      const profile = await getActiveProfile();
      if (profile) {
        setCurrentUserId(profile.id);
        const permissions = getProfilePermissions(profile.profile_type);
        setCanUpload(permissions.canUploadLibraryDocuments);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    }
  };

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const allDocs = await getAllDocuments();
      setDocuments(allDocs);
    } catch (error) {
      console.error('Erreur lors du chargement des documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (doc: LibraryDocument) => {
    try {
      const url = await getDocumentDownloadUrl(doc.file_url);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement du document');
    }
  };

  const handleView = async (doc: LibraryDocument) => {
    try {
      const url = await getDocumentDownloadUrl(doc.file_url);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Erreur lors de l\'ouverture:', error);
      alert('Erreur lors de l\'ouverture du document');
    }
  };

  const handleDelete = async (doc: LibraryDocument) => {
    if (showDeleteConfirm !== doc.id) {
      setShowDeleteConfirm(doc.id);
      return;
    }

    try {
      await deleteDocument(doc.id, doc.file_url);
      await loadDocuments();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du document');
    }
  };

  const isMockDocument = (doc: LibraryDocument | MockLibraryDocument): doc is MockLibraryDocument => {
    return 'id' in doc && doc.id.startsWith('mock-');
  };

  return {
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
  };
}
