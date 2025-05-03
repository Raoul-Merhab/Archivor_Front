"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ValidationInterface from './components/ValidationInterface';

export default function ValidationPage({ folderId, documentId }) {
  const router = useRouter();
  const [document, setDocument] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [folderDocuments, setFolderDocuments] = useState([]);
  const [commonFields, setCommonFields] = useState([]);
  const [isLoadingFolderData, setIsLoadingFolderData] = useState(false);
  
  // Fetch the current document
  useEffect(() => {
    async function fetchDocument() {
      try {
        setLoading(true);
        const response = await fetch(`/api/documents?documentId=${documentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch document');
        }
        const data = await response.json();
        setDocument(data.document);
        setExtractedData(data.document.extractedData || null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching document:', err);
      } finally {
        setLoading(false);
      }
    }

    if (documentId) {
      fetchDocument();
    }
  }, [documentId]);

  // Fetch all documents in the folder to extract common fields
  useEffect(() => {
    async function fetchFolderDocuments() {
      if (!folderId) return;
      
      try {
        setIsLoadingFolderData(true);
        const response = await fetch(`/api/documents?folderId=${folderId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch folder documents');
        }
        
        const data = await response.json();
        // Filter documents that have extractedData
        const documentsWithExtractedData = data.documents.filter(doc => 
          doc.extractedData && Object.keys(doc.extractedData).length > 0
        );
        
        setFolderDocuments(documentsWithExtractedData);
        
        // Extract common fields from all documents
        if (documentsWithExtractedData.length > 0) {
          const fieldFrequency = {};
          const totalDocs = documentsWithExtractedData.length;
          
          // Count field occurrences across all documents
          documentsWithExtractedData.forEach(doc => {
            if (doc.extractedData) {
              Object.keys(doc.extractedData).forEach(field => {
                fieldFrequency[field] = (fieldFrequency[field] || 0) + 1;
              });
            }
          });
          
          // Sort fields by frequency
          const sortedFields = Object.entries(fieldFrequency)
            .sort((a, b) => b[1] - a[1])
            .map(([field, count]) => ({
              name: field,
              occurrencePercent: Math.round((count / totalDocs) * 100),
              count
            }));
          
          setCommonFields(sortedFields);
        }
      } catch (err) {
        console.error('Error fetching folder documents:', err);
      } finally {
        setIsLoadingFolderData(false);
      }
    }

    fetchFolderDocuments();
  }, [folderId]);

  const handleBackToDocument = () => {
    router.push(`/folders/${folderId}/${documentId}`);
  };

  const handleSaveValidation = async (validatedData) => {
    // Redirect to document view after successful validation
    router.push(`/folders/${folderId}/${documentId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
          <p>Error: {error}</p>
          <button 
            onClick={() => router.push(`/folders/${folderId}`)}
            className="mt-2 text-blue-600 hover:underline"
          >
            &larr; Go back to folder
          </button>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="p-8 text-center">
        <p>Document not found</p>
        <button 
          onClick={() => router.push(`/folders/${folderId}`)}
          className="mt-2 text-blue-600 hover:underline"
        >
          &larr; Go back to folder
        </button>
      </div>
    );
  }

  if (!extractedData && document.status !== 'Parsed') {
    return (
      <div className="p-8 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-medium mb-2">No extracted data available</h2>
          <p className="text-gray-600 mb-4">This document needs to be parsed before validation.</p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => router.push(`/folders/${folderId}/${documentId}`)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Go back to document
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link href="/" className="flex items-center">
                  <svg className="h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 8H19M5 12H19M12 16H19M3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="ml-2 text-blue-600 font-semibold">ARCHIVOID</span>
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button className="p-1 rounded-full text-gray-500 hover:bg-gray-100">
                <span className="sr-only">Notifications</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="ml-3 relative">
                <div>
                  <button className="flex items-center max-w-xs rounded-full text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-sm font-medium">B</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <button 
              onClick={handleBackToDocument}
              className="text-gray-600 hover:text-gray-900 mr-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <h1 className="text-lg font-medium leading-6 text-gray-900">
              {document.name} - Validation
            </h1>
          </div>

          {/* Folder Insights Panel */}
          {folderDocuments.length > 0 && (
            <div className="bg-white shadow rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-sm font-medium text-gray-900">Folder Insights</h2>
                <span className="text-xs text-gray-500">{folderDocuments.length} documents with extracted data</span>
              </div>
              
              <div className="mt-2">
                <h3 className="text-xs font-medium text-gray-700 mb-1">Common Fields</h3>
                <div className="flex flex-wrap gap-2">
                  {commonFields.map(field => (
                    <span 
                      key={field.name}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {field.name}
                      <span className="ml-1 text-xs text-blue-600">{field.occurrencePercent}%</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <ValidationInterface 
              documentId={documentId} 
              extractedData={extractedData} 
              onSave={handleSaveValidation}
              commonFields={commonFields}
            />
          </div>
        </div>
      </main>
    </div>
  );
}