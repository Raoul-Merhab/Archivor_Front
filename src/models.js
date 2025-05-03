import mongoose from 'mongoose';

// Folder Schema
const FolderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export const Folder = mongoose.models.Folder || mongoose.model('Folder', FolderSchema);

// Document Schema
const DocumentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required: true },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Completed', 'Error'],
        default: 'Pending'
    },
    fileType: { type: String },
    docType: { type: String },
    metadata: { type: Map, of: String },
    indexes: { type: [String] },
    fileSize: { type: Number },
    fileUrl: { type: String, required: true },
    path: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const Document = mongoose.models.Document || mongoose.model('Document', DocumentSchema);
