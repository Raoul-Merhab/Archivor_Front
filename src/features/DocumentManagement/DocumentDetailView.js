"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DocumentDetailView({ folderId, documentId }) {
    const router = useRouter();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("extracted_data");
    const [status, setStatus] = useState('Pending');
    const [extractedData, setExtractedData] = useState(null);

    useEffect(() => {
        async function fetchDocument() {
            try {
                setLoading(true);
                const response = await fetch(
                    `/api/documents?documentId=${documentId}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch document");
                }
                const data = await response.json();
                setDocument(data.document);
                setStatus(data.document.status || 'Pending');
                if (data.document.status && data.document.status !== 'Pending') {
                    setExtractedData(data.document.extractedData || null);
                } else {
                    setExtractedData(null);
                }
            } catch (err) {
                setError(err.message);
                console.error("Error fetching document:", err);
            } finally {
                setLoading(false);
            }
        }

        if (documentId) {
            fetchDocument();
        }
    }, [documentId]);

    const handleGoBack = () => {
        router.push(`/folders/${folderId}`);
    };

    const onClickValider = () => {

    }


    const getDocsViewerUrl = (url) => {
        if (!url) return null;
        return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    console.log(document.fileUrl.replace('/view', '/preview'));
    

    if (error) {
        return (
            <div className="p-8 w-full">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                    <p>Error: {error}</p>
                    <button
                        onClick={handleGoBack}
                        className="mt-2 text-blue-600 hover:underline"
                    >
                        &larr; Go back to folder
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white w-full">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 shadow-sm">
                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            onClick={handleGoBack}
                            className="text-gray-600 hover:text-gray-900 mr-4"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                        </button>
                        <h1 className="text-lg font-medium text-gray-900 truncate">
                            {document?.name || "BC DBAA.pdf"}
                        </h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center bg-green-100 text-green-800 rounded-full px-2 py-0.5 text-xs">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                            Parsed
                        </div>
                        <span className="text-xs text-gray-500">
                            Received May 2, 10:03 • Parsed May 2, 10:04
                        </span>
                    </div>
                </div>
            </header>

            <div className="flex flex-col md:flex-row">
                {/* PDF Viewer */}
                <div className="w-full md:w-3/5 border-r border-gray-200 flex flex-col">
                    <div className="flex-grow p-4 bg-gray-100 flex justify-center items-center">
                        {
                            document?.fileUrl && document?.fileType === 'application/pdf' ? (
                            <iframe 
                                src={document.fileUrl.replace('/view', '/preview')}
                                className="w-full h-full border-0"
                                title={document.name}
                            />
                        ) : document?.fileUrl && document?.fileType === 'video/mp4' ? (
                            <iframe src={document.fileUrl.replace('/view', '/preview')} className=" w-full h-full" allow="autoplay"></iframe>
                        )
                        :  document?.fileUrl && document?.fileType === 'audio/mpeg' ? (
                            <iframe src={document.fileUrl.replace('/view', '/preview')} className=" w-full h-full" allow="autoplay"></iframe>
                        )
                        : document?.fileUrl && document?.fileType === 'image/jpeg' ? (
                            <iframe src={document.fileUrl.replace('/view', '/preview')} className=" w-full h-full" allow="autoplay"></iframe>
                        )
                        :
                        (
                            <div className="text-center">
                                <p className="text-gray-500">Preview not available</p>
                                <p className="text-sm text-gray-400">This file is not a PDF and cannot be displayed.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Extracted Data */}
                <div className="w-full md:w-2/5 flex flex-col h-[calc(100vh-64px)]">
                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="flex">
                            <button
                                className={`px-4 py-2 text-sm font-medium ${
                                    activeTab === "extracted_data"
                                        ? "border-b-2 border-blue-500 text-blue-600"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                                onClick={() => setActiveTab("extracted_data")}
                            >
                                Extracted data
                            </button>
                            <button
                                className={`px-4 py-2 text-sm font-medium ${
                                    activeTab === "json"
                                        ? "border-b-2 border-blue-500 text-blue-600"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                                onClick={() => setActiveTab("json")}
                            >
                                JSON
                            </button>
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {status === 'Pending' ? (
                            <div className="text-center text-gray-500">No extracted data available. Status: Pending.</div>
                        ) : activeTab === "extracted_data" ? (
                            extractedData ? (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            document_title
                                        </h3>
                                        <p className="text-sm">
                                            {extractedData.document_title}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            items ({extractedData.items?.length || 0} item)
                                        </h3>
                                        <div className="bg-white border border-gray-200 rounded overflow-hidden">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            designation
                                                        </th>
                                                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            quantity
                                                        </th>
                                                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            total_price
                                                        </th>
                                                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            unit_price
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {extractedData.items?.map((item, idx) => (
                                                        <tr key={idx}>
                                                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                                                {item.designation}
                                                            </td>
                                                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                                                {item.quantity}
                                                            </td>
                                                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                                                {item.total_price}
                                                            </td>
                                                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                                                {item.unit_price}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            order_date
                                        </h3>
                                        <p className="text-sm">
                                            {extractedData.order_date}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            order_reference
                                        </h3>
                                        <p className="text-sm">
                                            {extractedData.order_reference}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            order_title
                                        </h3>
                                        <p className="text-sm">
                                            {extractedData.order_title}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-gray-500">No extracted data found.</div>
                            )
                        ) : (
                            <div className="bg-gray-50 p-4 rounded-md">
                                <pre className="text-xs overflow-auto">
                                    {JSON.stringify(extractedData, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200">
                        <button
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                            onClick={onClickValider}
                        >
                            Valider les résultats
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
