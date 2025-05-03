"use client";

import React from 'react';

export default function ExtractedData({ data, activeTab }) {
  // If no data has been extracted yet, show empty state
  if (!data) {
    return (
      <div className="p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No data extracted</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Click on the "Extract" button to analyze this document and extract its data.
        </p>
      </div>
    );
  }

  // JSON view
  if (activeTab === 'json') {
    return (
      <div className="p-4">
        <pre className="bg-gray-50 dark:bg-slate-800 rounded-md p-4 overflow-auto text-xs text-gray-800 dark:text-gray-200">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  }

  // Extraction Schema view
  if (activeTab === 'extraction-schema') {
    return (
      <div className="p-4">
        <div className="bg-gray-50 dark:bg-slate-800 rounded-md p-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Extraction Schema (12)</h3>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {["document_title", "order_date", "order_reference", "order_title", "items"].map((field) => (
              <li key={field} className="py-2 flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">{field}</span>
                <span className="text-xs text-green-600 dark:text-green-400">✓ Extracted</span>
              </li>
            ))}
            {["customer_info", "supplier_info", "tax", "subtotal", "total", "payment_terms", "delivery_terms"].map((field) => (
              <li key={field} className="py-2 flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">{field}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Not found</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // Default: Extracted data view
  return (
    <div className="p-4 space-y-6">
      {/* Document title */}
      <div>
        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">document_title</h3>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{data.document_title}</p>
      </div>
      
      {/* Items */}
      <div>
        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          items ({data.items?.length || 0} item)
        </h3>
        <div className="bg-gray-50 dark:bg-slate-800 rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-slate-700">
              <tr>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  designation
                </th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  quantity
                </th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  unit_price
                </th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  total_price
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
              {data.items?.map((item, index) => (
                <tr key={index}>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.designation}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.quantity}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.unit_price}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.total_price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Order date */}
      <div>
        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">order_date</h3>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{data.order_date}</p>
      </div>
      
      {/* Order reference */}
      <div>
        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">order_reference</h3>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{data.order_reference}</p>
      </div>
      
      {/* Order title */}
      <div>
        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">order_title</h3>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{data.order_title}</p>
      </div>
    </div>
  );
}