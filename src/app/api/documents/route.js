import { NextResponse } from 'next/server';
import connectMongoDB from '@/utils/connectMongoDB';
import { Document } from '@/models';

export async function GET(request) {
  await connectMongoDB();
  
  try {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get('folderId');
    const documentId = searchParams.get('documentId');
    
    // If documentId is provided, return a single document
    if (documentId) {
      const document = await Document.findById(documentId);
      
      if (!document) {
        return NextResponse.json({ 
          success: false, 
          error: 'Document not found' 
        }, { status: 404 });
      }
      
      return NextResponse.json({
        success: true,
        document: document
      });
    }
    
    // Otherwise, return multiple documents with optional folder filter
    let query = {};
    if (folderId) {
      query.folderId = folderId;
    }
    
    const documents = await Document.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      documents: documents,
      count: documents.length
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch documents',
      details: error.message
    }, { status: 500 });
  }
}

export async function DELETE(request) {
  await connectMongoDB();
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');
    if (!documentId) {
      return NextResponse.json({ success: false, error: 'documentId is required' }, { status: 400 });
    }
    const deleted = await Document.findByIdAndDelete(documentId);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Document deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete document', details: error.message }, { status: 500 });
  }
}