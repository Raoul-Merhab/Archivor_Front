import { NextResponse } from 'next/server';
import connectMongoDB from '@/utils/connectMongoDB';
import { Document } from '@/models';

export async function POST(request) {
  await connectMongoDB();
  
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');
    if (!documentId) {
      return NextResponse.json({ 
        success: false, 
        error: 'documentId is required' 
      }, { status: 400 });
    }
    
    // Get the validated data from the request body
    const { extractedData, status } = await request.json();
    
    // Find and update the document
    const updatedDocument = await Document.findByIdAndUpdate(
      documentId,
      { 
        extractedData, 
        status: status || 'Validated',
        validatedAt: new Date()
      },
      { new: true }
    );
    
    if (!updatedDocument) {
      return NextResponse.json({ 
        success: false, 
        error: 'Document not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      document: updatedDocument,
      message: 'Validation saved successfully'
    });
  } catch (error) {
    console.error('Error saving validation:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to save validation',
      details: error.message
    }, { status: 500 });
  }
}