"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FolderViewer from './components/FolderViewer';

export default function FolderManagement() {
  const router = useRouter();
  const [folders, setFolders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch folders on component mount
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/folders');
        
        if (!response.ok) {
          throw new Error('Failed to fetch folders');
        }
        
        const folderData = await response.json();
        setFolders(folderData);
      } catch (err) {
        console.error('Error fetching folders:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFolders();
  }, []);

  const handleFolderClick = (folderId) => {
    router.push(`/folders/${folderId}`);
  };

  // Handle folder creation
  const handleCreateFolder = async (folderData) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: folderData.name,
          description: folderData.description 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create folder');
      }
      
      const newFolder = await response.json();
      setFolders(prevFolders => [...prevFolders, newFolder]);
      
      // Navigate directly to the new folder
      router.push(`/folders/${newFolder._id}`);
      
    } catch (err) {
      console.error('Error creating folder:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FolderViewer
      folders={folders}
      isLoading={isLoading}
      error={error}
      onFolderClick={handleFolderClick}
      onCreateFolder={handleCreateFolder}
      />
  );
}