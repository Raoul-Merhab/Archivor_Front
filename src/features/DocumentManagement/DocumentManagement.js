"use client";

import React, { useState, useEffect } from 'react';
import DocumentViewer from './components/DocumentViewer';
import { useRouter } from 'next/navigation';

export default function DocumentManagement({folderID}) {
  const router = useRouter();
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch documents on component mount
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // In a real app, this would be an API call
        // For now, simulate with mock data based on the image
        const mockDocuments = [
          {
            id: "1",
            name: "Dossier 1",
            createdAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(), // 16 hours ago
            received: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
            status: "active",
            type: "folder"
          },
          {
            id: "2",
            name: "Dossier 2",
            createdAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(), // 16 hours ago
            received: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
            status: "active",
            type: "folder"
          }
        ];
        
        setDocuments(mockDocuments);
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleDocumentClick = (documentId) => {
    router.push(`/folders/${folderID}/${documentId}`);
  };

  // Handle document creation
  const handleCreateDocument = async (documentData) => {
    try {
      setIsLoading(true);
      
      // In a real app, this would be an API call to create the document
      // For now, we'll just add a new mock document to the existing list
      const newDocument = {
        id: `new-${Date.now()}`,
        name: documentData.name || "New Dossier",
        createdAt: new Date().toISOString(),
        received: new Date().toISOString(),
        status: "active",
        type: "folder"
      };
      
      setDocuments([...documents, newDocument]);
      
    } catch (err) {
      console.error('Error creating document:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container min-h-screen bg-gray-50 dark:bg-slate-900">
      <DocumentViewer
        documents={documents}
        isLoading={isLoading}
        error={error}
        onDocumentClick={handleDocumentClick}
        onCreateDocument={handleCreateDocument}
      />
    </div>
  );
}