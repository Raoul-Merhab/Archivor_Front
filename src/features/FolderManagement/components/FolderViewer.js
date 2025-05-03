"use client";

import { useEffect, useState } from 'react';

export default function FolderViewer({ 
  folders = [],
  isLoading = false,
  error = null,
  onFolderClick,
  onCreateFolder,
}) {
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDescription, setNewFolderDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filter and sort folders based on search term and sort option
  const filteredFolders = folders
    .filter(folder => folder.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === 'newest') {
        return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
      } else {
        return new Date(a.createdAt || Date.now()) - new Date(b.createdAt || Date.now());
      }
    });

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;

    if (onCreateFolder) {
      onCreateFolder({ 
        name: newFolderName,
        description: newFolderDescription 
      });
      setNewFolderName('');
      setNewFolderDescription('');
      setShowCreateModal(false);
    }
  };
    
  // Function to calculate days elapsed since creation
  const getDaysElapsed = (createdAt) => {
    if (!createdAt) return '0 days';
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  };

  return (
    <div className=" flex flex-col w-full min-h-screen">
      {/* Header */}
      <header className="bg-[#FFFFFF10] p-4 flex justify-between items-center w-full">
        <div className="flex items-center">
          <img src="/file.svg" alt="Logo" className="h-8 w-8 mr-2" />
          <span className="text-white text-xl font-semibold">InnovDigital</span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-white">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <div className="bg-blue-700 rounded-full h-8 w-8 flex items-center justify-center text-white font-bold">
            U
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow w-full">
        <div className="w-full mx-auto p-4 md:p-6">
          {/* Create folder button */}
          <div className="mb-6 flex justify-center">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none"
            >
              Créer un dossier
            </button>
          </div>

          {/* Search */}
          <div className="w-full max-w-xl mx-auto mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un dossier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Folder list */}
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 py-8 text-center">{error}</div>
          ) : (
            <div className="w-full">
              {filteredFolders.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No folders found. Create your first folder to get started.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFolders.map((folder) => (
                    <div
                      key={folder._id}
                      onClick={() => onFolderClick && onFolderClick(folder._id)}
                      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-blue-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{folder.name || "Unnamed Folder"}</h3>
                          <p className="text-xs text-gray-500 overflow-hidden text-ellipsis">
                            {folder.description || "No description"}
                          </p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {getDaysElapsed(folder.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Create folder modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-[#FFFFFF40] bg-opacity-50 flex justify-center items-center z-50">
          <div className="rounded-lg p-6 w-96 max-w-full mx-4 bg-black">
            <h2 className="text-xl font-semibold mb-4">Create New Folder</h2>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <textarea
              value={newFolderDescription}
              onChange={(e) => setNewFolderDescription(e.target.value)}
              placeholder="Folder description (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            ></textarea>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}