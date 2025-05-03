import { NextResponse } from 'next/server';
// Helper function to extract folder ID from Drive URL
function extractFolderIdFromUrl(url) {
  try {
    // Handle various Google Drive URL formats
    const regex = /(?:https?:\/\/)?(?:www\.)?drive\.google\.com\/(?:drive\/folders\/|file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting folder ID:', error);
    return null;
  }
}