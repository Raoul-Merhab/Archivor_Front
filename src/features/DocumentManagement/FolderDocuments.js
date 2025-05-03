"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function FolderDocuments({ folderId }) {
  const router = useRouter();
  const [folder, setFolder] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState(null);

  // Fetch folder data and documents
  useEffect(() => {
    const fetchFolderData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch folder details
        const folderResponse = await fetch(`/api/folders?id=${folderId}`);
        if (!folderResponse.ok) {
          throw new Error('Failed to fetch folder details');
        }
        const folderData = await folderResponse.json();
        setFolder(Array.isArray(folderData) && folderData.length > 0 
          ? folderData.find(f => f._id === folderId) 
          : folderData);
        
        // Fetch documents in this folder
        const documentsResponse = await fetch(`/api/documents?folderId=${folderId}`);
        if (!documentsResponse.ok) {
          throw new Error('Failed to fetch documents');
        }
        const documentsData = await documentsResponse.json();
        setDocuments(documentsData.documents || []);
      } catch (err) {
        console.error('Error loading folder data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (folderId) {
      fetchFolderData();
    }
  }, [folderId]);

  const handleUploadDocument = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folderId', folderId);
      
      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload document');
      }
      
      const newDocument = await response.json();
      setDocuments([...documents, newDocument.document]);
      
    } catch (err) {
      console.error('Error uploading document:', err);
      setError(err.message);
    }
  };

  const handleImportFromGDrive = async () => {
    if (!importUrl.trim()) {
      setImportError("Please enter a Google Drive URL");
      return;
    }

    try {
      setIsImporting(true);
      setImportError(null);

      // Call the API endpoint to import from Google Drive
      const response = await fetch('/api/documents/gdrive/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          driveUrl: importUrl,
          folderId: folderId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        
        throw new Error(errorData.error || errorData.message || 'Failed to import documents from Google Drive');
      }

      const result = await response.json();
      
      // Refresh documents list
      const documentsResponse = await fetch(`/api/documents?folderId=${folderId}`);
      if (!documentsResponse.ok) {
        throw new Error('Failed to fetch updated documents');
      }
      const documentsData = await documentsResponse.json();
      setDocuments(documentsData.documents || []);
      
      // Close the modal and reset state
      setShowImportModal(false);
      setImportUrl('');
    } catch (err) {
      console.error('Error importing from Google Drive:', err);
      setImportError(err.message);
    } finally {
      setIsImporting(false);
    }
  };
  const onClickParsed = () =>{
    router.push(`/folders/${folderId}/extracted-data`);
  }

  // Handler to delete a document and refresh the list
  const handleDeleteDocument = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      const response = await fetch(`/api/documents?documentId=${docId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete document');
      // Refresh the list
      const documentsResponse = await fetch(`/api/documents?folderId=${folderId}`);
      const documentsData = await documentsResponse.json();
      setDocuments(documentsData.documents || []);
    } catch (err) {
      alert('Error deleting document: ' + err.message);
    }
  };

  const filteredDocuments = documents
    .filter(doc => doc.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className=" w-full flex flex-col h-screen">
      {/* Header */}
      <header className=" border-b border-gray-200 py-2 px-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Inbox</h1>
        <div className="flex items-center space-x-2">
          <button className="border border-blue-600 text-blue-600 rounded-md px-3 py-1 text-sm">
            Upgrade
          </button>
          <button className="text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">
            B
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-grow overflow-hidden">
        {/* Sidebar */}
        <div className="w-52  border-r border-gray-200 flex flex-col">
          <div className="p-4">
            <div className="flex items-center text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              ARCHIVOID
            </div>
          </div>

          <nav className="flex-1 mt-6">
            <div className="flex items-center px-4 py-2  border-l-4 border-blue-600 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Documents</span>
              <span className="ml-auto bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs">1</span>
            </div>

            <div onClick={onClickParsed} className="flex items-center px-4 py-2 hover:bg-[#FFFFFF40] cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Parsed Data</span>
              <span className="ml-auto bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs">1</span>
            </div>

            <div className="flex items-center px-4 py-2 hover:bg-[#FFFFFF40] cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Créer un dossier</span>
            </div>

            <div className="flex items-center px-4 py-2 hover:bg-[#FFFFFF40] cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Inbox Settings</span>
            </div>
          </nav>

          <div className="p-4 mt-auto border-t border-gray-200">
            <button className="flex items-center text-gray-600 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Help
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search bar */}
          <div className="p-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Enter document name and press Enter to search..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <button className="flex items-center px-3 py-1 text-sm text-gray-600 border-l">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Status
                </button>
              </div>
            </div>
          </div>

          <div className=" px-4 py-2 text-sm text-gray-500">
            {documents.length} document{documents.length !== 1 ? 's' : ''}
          </div>

          {/* Document list */}
          {isLoading ? (
            <div className="flex-1 flex justify-center items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="flex-1 p-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                {error}
              </div>
            </div>
          ) : (
            <div className="flex-1 hi overflow-y-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase">
                    <th className="py-3 px-4 text-left w-12">
                      <input type="checkbox" className="rounded text-blue-500 focus:ring-blue-500" />
                    </th>
                    <th className="py-3 px-4 text-left w-28">Status</th>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-right">Sender</th>
                    <th className="py-3 px-4 text-right">Parsed</th>
                    <th className="py-3 px-4 text-right">Received</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 px-4 text-center text-gray-500">
                        No documents found in this folder.
                      </td>
                    </tr>
                  ) : (
                    filteredDocuments.map((document) => (
                      <tr 
                        key={document._id} 
                        className="border-b border-gray-200 hover:bg-gray-500 cursor-pointer"
                        onClick={() => router.push(`/folders/${folderId}/${document._id}`)}
                      >
                        <td className="py-3 px-4">
                          <input 
                            type="checkbox" 
                            className="rounded text-blue-500 focus:ring-blue-500"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${
                            document.status === 'Parsed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {document.status || 'Pending'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium">{document.name}</td>
                        <td className="py-3 px-4 text-right text-gray-500">
                          {document.sender || '-'}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-500">
                          {document.parsed 
                            ? new Date(document.parsed).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })
                            : '-'}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-500">
                          {new Date(document.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                          <button
                            className="ml-4 text-red-600 hover:text-red-800"
                            onClick={e => {
                              e.stopPropagation();
                              handleDeleteDocument(document._id);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="p-4 border-t border-gray-200 text-sm text-gray-500">
            Showing 1 to {filteredDocuments.length} of {documents.length} documents
          </div>

          {/* Action buttons */}
          <div className="p-4 border-t border-gray-200 flex justify-between">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Traiter les documents
            </button>
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              onClick={() => setShowImportModal(true)}
            >
              Importer des documents
            </button>
          </div>
        </div>
      </div>

      {/* Google Drive Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-[#FFFFFF40] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-slate-900">Import from Google Drive</h3>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportUrl('');
                  setImportError(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {importError && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
                <p>{importError}</p>
              </div>
            )}
            
            <div className="mb-6">
              <label htmlFor="driveUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Google Drive Folder URL
              </label>
              <input
                type="text"
                id="driveUrl"
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                placeholder="https://drive.google.com/drive/folders/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Paste the URL of a Google Drive folder to import all files from it.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportUrl('');
                  setImportError(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleImportFromGDrive}
                disabled={isImporting}
                className={`px-4 py-2 rounded-md text-white ${
                  isImporting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isImporting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Importing...
                  </span>
                ) : (
                  'Import'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}