"use client";

import React, { useState, useEffect } from 'react';

export default function DocumentViewer({ 
  documents = [],
  isLoading: externalIsLoading = false,
  error: externalError = null,
  onDocumentClick,
  onCreateDocument
}) {
  const [isLoading, setIsLoading] = useState(externalIsLoading);
  const [error, setError] = useState(externalError);
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentDocuments, setCurrentDocuments] = useState(documents);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDocumentName, setNewDocumentName] = useState("");
  
  // Update isLoading state when externalIsLoading changes
  useEffect(() => {
    setIsLoading(externalIsLoading);
  }, [externalIsLoading]);

  // Update error state when externalError changes
  useEffect(() => {
    setError(externalError);
  }, [externalError]);

  // Update currentDocuments when documents or sortOrder changes
  useEffect(() => {
    setCurrentDocuments(sortDocuments(documents, sortOrder));
  }, [documents, sortOrder]);
  
  // Sort documents based on sort order
  const sortDocuments = (docs, order) => {
    return [...docs].sort((a, b) => {
      if (order === "newest") {
        return new Date(b.createdAt || b.received) - new Date(a.createdAt || a.received);
      } else if (order === "oldest") {
        return new Date(a.createdAt || a.received) - new Date(b.createdAt || b.received);
      } else if (order === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  };

  // Handle search and sorting
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (!e.target.value) {
      setCurrentDocuments(sortDocuments(documents, sortOrder));
    } else {
      const filtered = documents.filter(doc => 
        doc.name.toLowerCase().includes(e.target.value.toLowerCase()));
      setCurrentDocuments(sortDocuments(filtered, sortOrder));
    }
  };

  // Handle sort change
  const handleSortChange = (e) => {
    const newSortOrder = e.target.value;
    setSortOrder(newSortOrder);
    setCurrentDocuments(sortDocuments(currentDocuments, newSortOrder));
  };
  
  // Handle document click
  const handleDocumentClick = (doc) => {
    if (onDocumentClick) {
      onDocumentClick(doc.id);
    }
  };
  
  // Create a new document/folder
  const handleCreateDocument = () => {
    setShowCreateModal(true);
  };
  
  // Submit new document creation
  const handleSubmitCreate = () => {
    if (newDocumentName && onCreateDocument) {
      onCreateDocument({ name: newDocumentName });
      setNewDocumentName("");
      setShowCreateModal(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} days`;
    }
  };

  return (
    <div className="h-full flex flex-col  dark:bg-slate-800">
      {/* Header with create button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-medium text-gray-900 dark:text-white">Documents</h1>
        
        <button 
          onClick={handleCreateDocument}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Créer un dossier
        </button>
      </div>
      
      {/* Search and sort controls */}
      <div className="flex flex-col md:flex-row justify-between items-center p-4 gap-4">
        <div className="w-full md:w-auto">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Sort:</span>
            <select
              value={sortOrder}
              onChange={handleSortChange}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-700  dark:bg-slate-800 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
        
        <div className="w-full md:w-auto">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Rechercher un dossier"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700  dark:bg-slate-800 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      
      {/* Error state */}
      {error && (
        <div className="flex items-center justify-center p-4">
          <div className="text-red-500 text-center">
            <p className="text-lg font-bold mb-2">Error loading documents</p>
            <p>{error.message || "Unable to load documents. Please try again later."}</p>
          </div>
        </div>
      )}
      
      {/* Loading state */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Document list */}
      {!isLoading && !error && (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {currentDocuments.length > 0 ? (
              currentDocuments.map((doc) => (
                <div 
                  key={doc.id}
                  onClick={() => handleDocumentClick(doc)}
                  className="border border-gray-200 dark:border-gray-700 dark:bg-slate-800 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                      <div className="mr-3 flex-shrink-0">
                        <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{doc.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {doc.id}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 dark:text-gray-400">{formatDate(doc.createdAt || doc.received)}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{doc.size ? formatFileSize(doc.size) : ""}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No documents</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Get started by creating a new document or folder.
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleCreateDocument}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Créer un dossier
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Create document modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom  dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className=" dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Create new folder
                    </h3>
                    <div className="mt-2">
                      <input
                        type="text"
                        value={newDocumentName}
                        onChange={(e) => setNewDocumentName(e.target.value)}
                        placeholder="Enter folder name"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 rounded-md  dark:bg-slate-700 text-gray-900 dark:text-white p-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSubmitCreate}
                  disabled={!newDocumentName.trim()}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2  dark:bg-slate-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to format file size
function formatFileSize(bytes) {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}