import ValidationPage from '@/features/DocumentManagement/ValidationPage';

export default function DocumentValidationPage({ params }) {
  const { folder_id, document_id } = params;
  return <ValidationPage folderId={folder_id} />;
}