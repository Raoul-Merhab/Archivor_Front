"use client";

import React, { useState } from 'react';

export default function ImportButton({ onDocumentsImported }) {
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState(null);
  
  const importFromGoogleDrive = async () => {
    setIsImporting(true);
    setImportError(null);
    
    try {
      const response = await fetch('/api/documents/gdrive', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to import documents from Google Drive');
      }
      
      const data = await response.json();
      
      // Process the documents to add additional properties
      const processedDocuments = data.map(doc => ({
        ...doc,
        source: 'google-drive',
        status: 'pending',
        received: new Date().toISOString(),
      }));
      
      // Pass imported documents to parent component
      onDocumentsImported(processedDocuments);
      
    } catch (error) {
      console.error('Error importing from Google Drive:', error);
      setImportError(error.message);
    } finally {
      setIsImporting(false);
    }
  };
  
  return (
    <>
      <button
        onClick={importFromGoogleDrive}
        disabled={isImporting}
        className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        {isImporting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Importing...
          </>
        ) : (
          <>
            <svg className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 4V2h10v2h-10zm.99 16c-.28-.282-.536-.563-.79-.844a.984.984 0 00-1.4 0l-1.49 1.49a.984.984 0 000 1.4c.56.562 1.15 1.08 1.76 1.54.2.142.47.22.74.22.27 0 .53-.08.73-.22.61-.46 1.2-.978 1.76-1.54a.984.984 0 000-1.4l-1.49-1.49a.984.984 0 00-1.4 0 9.161 9.161 0 01-.37.394V9.601l8.85 8.85a.984.984 0 001.4 0l1.49-1.49a.984.984 0 000-1.4C15.05 13.773 13 11.1 13 8h1.24a1 1 0 100-2H8.24a1 1 0 100 2H9c0 .692.131 1.359.372 1.973L7.99 7.37V20z" />
            </svg>
            Import from Google Drive
          </>
        )}
      </button>
      
      {importError && (
        <div className="mt-2 text-sm text-red-600 dark:text-red-400">
          {importError}
        </div>
      )}
    </>
  );
}