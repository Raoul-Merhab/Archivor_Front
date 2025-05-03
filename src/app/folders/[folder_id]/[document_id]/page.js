"use client";
import DocumentDetailView from '@/features/DocumentManagement/DocumentDetailView';
import { useParams } from 'next/navigation';

export default function DocumentPage() {
    const params = useParams();
    const { folder_id, document_id } = params;
    return <DocumentDetailView folderId={folder_id} documentId={document_id} />;
}   