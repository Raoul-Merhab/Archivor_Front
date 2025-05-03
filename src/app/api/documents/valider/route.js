import { NextResponse } from "next/server";
import connectMongoDB from "@/utils/connectMongoDB";
import { Document } from "@/models";

export async function POST(request) {
    try {
        const { folderId } = await request.json();
        await connectMongoDB();
        const documents = await Document.find({});
        const temp = documents.filter(doc => doc.folderId == folderId);

        const docTypes = [];
        const files = [];

        temp.forEach(doc => {
            if (doc.docType) {
                docTypes.push(doc.docType);
            }
            if (doc.fileType === "application/pdf" || doc.fileType === "audio/mpeg") {
                files.push({ ...doc.toObject(), id: doc._id });
            }
        });
        const urls = {
            "application/pdf": "http://10.0.33.117:8000/process/text",
            "audio/mpeg": "http://10.0.33.117:8000/process/audio"
        }

        const tasks = files.map(async doc => {
            try {
                const res = await fetch(urls[doc.fileType], {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        file_path: doc.fileUrl,
                        known_types: docTypes,
                    }),
                });
                const response = await res.json();
                console.log(response);
                
                console.log({
                    name: doc.name,
                    folderId: doc.folderId,
                    fileType: doc.fileType,
                    fileSize: doc.fileSize,
                    fileUrl: doc.fileUrl,
                    status: 'Processing',
                    createdAt: doc.createdAt,
                    docType: response.doc_type === "" ? response.suggestion : response.doc_type,
                    metadata: response.metadata,
                    indexes: response.search_indexes,
                });
                console.log({
                    name: doc.name,
                    folderId: doc.folderId,
                    fileType: doc.fileType,
                    fileSize: doc.fileSize,
                    fileUrl: doc.fileUrl,
                    status: 'Processing',
                    createdAt: doc.createdAt,
                    docType: response.doc_type === "" ? response.suggestion : response.doc_type,
                    metadata: response.metadata,
                    indexes: response.search_indexes,
                })
                
                await Document.create({
                    name: doc.name,
                    folderId: doc.folderId,
                    fileType: doc.fileType,
                    fileSize: doc.fileSize,
                    fileUrl: doc.fileUrl,
                    status: 'Processing',
                    createdAt: doc.createdAt,
                    docType: response.doc_type === "" ? response.suggestion : response.doc_type,
                    metadata: response.metadata,
                    indexes: response.search_indexes,
                });

                await Document.findByIdAndDelete(doc.id);

            } catch (error) {
                console.log("Error processing file:", error);
            }
        });

        await Promise.all(tasks);

        return NextResponse.json({ success: true, documents: temp });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
