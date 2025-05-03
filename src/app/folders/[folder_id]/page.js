"use client";
import FolderDocuments from '@/features/DocumentManagement/FolderDocuments';
import { useParams } from 'next/navigation';

export default function FolderDetailsPage() {
  const params = useParams();
  const { folder_id } = params;
  
  return <FolderDocuments folderId={folder_id} />;
}