import { NextResponse } from 'next/server';
import connectMongoDB from '@/utils/connectMongoDB';
import mongoose from 'mongoose';
import { Document } from '@/models';

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';

function extractDriveFolderId(url) {
  const match = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

export async function POST(request) {
  await connectMongoDB();
  try {
    const data = await request.json();
    const { driveUrl, folderId } = data;

    if (!driveUrl) {
      return NextResponse.json({ error: 'Google Drive URL is required' }, { status: 400 });
    }
    if (!folderId) {
      return NextResponse.json({ error: 'Folder ID is required' }, { status: 400 });
    }
    if (!GOOGLE_API_KEY) {
      return NextResponse.json({ error: 'Google API key not set in environment' }, { status: 500 });
    }

    const gdriveFolderId = extractDriveFolderId(driveUrl);
    if (!gdriveFolderId) {
      return NextResponse.json({ error: 'Invalid Google Drive folder URL' }, { status: 400 });
    }

    const listUrl = `${DRIVE_API_BASE}/files?q='${gdriveFolderId}'+in+parents+and+trashed=false&fields=files(id,name,webViewLink,mimeType,size)&key=${GOOGLE_API_KEY}`;
    const driveRes = await fetch(listUrl);

    if (!driveRes.ok) {
      const err = await driveRes.text();
      return NextResponse.json({ error: 'Failed to fetch files from Google Drive', details: err }, { status: 500 });
    }

    const { files } = await driveRes.json();
    const fileLinks = files.map(file => ({
      name: file.name,
      link: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`
    }));

    const savedDocuments = [];
    for (const file of files) {
      if (file.mimeType !== 'application/vnd.google-apps.folder') {
        const fileUrl = file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`;
        const newDocument = new Document({
          name: file.name,
          folderId: folderId,
          fileType: file.mimeType,
          fileSize: file.size ? Number(file.size) : undefined,
          fileUrl: fileUrl,
          status: 'Pending',
          createdAt: new Date()
        });
        await newDocument.save();
        savedDocuments.push(newDocument.toObject({ getters: false, virtuals: false }));
      }
    }

    return NextResponse.json({
      success: true,
      message: `Fetched and saved ${savedDocuments.length} files from Google Drive.`,
      files: fileLinks,
      savedDocuments
    });
  } catch (error) {
    console.error('Error fetching from Google Drive:', error);
    return NextResponse.json({ error: 'Failed to fetch files from Google Drive', details: error.message }, { status: 500 });
  }
}
