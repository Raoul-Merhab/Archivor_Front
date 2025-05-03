"use client";

import React, { useState } from 'react';

export default function ImportModal({ folder, onImport, onClose }) {
  const [importUrl, setImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!importUrl) {
      setError('Please enter a Google Drive URL');
      return;
    }
    
    try {
      setIsImporting(true);
      setError(null);
      
      // Call the parent component's import handler
      await onImport(importUrl);
      
    } catch (err) {
      console.error('Error importing:', err);
      setError(err.message || 'Failed to import documents');
    } finally {
      setIsImporting(false);
    }
  };
  
  const handleSkip = () => {
    // Navigate to the folder without importing
    onClose();
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.34 15l-3.54 6.15A9.958 9.958 0 0 1 2.1 13.95L8.34 15zm-1.8-3.1L11.1 2.68c1.52.38 2.9 1.14 4 2.22L10 12l-3.46-.1zm12.46 6A10.02 10.02 0 0 1 12 22c-1.44 0-2.8-.3-4.05-.85L12 13l7-1.1z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Import documents from Google Drive
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Add documents to <span className="font-medium text-gray-700 dark:text-gray-300">{folder.name}</span> from your Google Drive.
                  </p>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="drive-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Google Drive URL
                      </label>
                      <input
                        type="text"
                        id="drive-url"
                        value={importUrl}
                        onChange={(e) => setImportUrl(e.target.value)}
                        placeholder="https://drive.google.com/drive/folders/..."
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white p-2"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Paste the URL of a Google Drive folder containing the documents you want to import.
                      </p>
                    </div>
                    
                    {error && (
                      <div className="mb-4 p-2 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 text-sm rounded-md">
                        {error}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-slate-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isImporting}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                'Import'
              )}
            </button>
            <button
              type="button"
              onClick={handleSkip}
              disabled={isImporting}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}