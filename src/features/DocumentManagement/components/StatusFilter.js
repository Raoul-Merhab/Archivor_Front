"use client";

import React from 'react';

export default function StatusFilter({ value, onChange }) {
  return (
    <div className="flex items-center">
      <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
        Status
      </label>
      <select
        id="status-filter"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full py-2 pl-3 pr-10 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-gray-100"
      >
        <option value="">All</option>
        <option value="Parsed">Parsed</option>
        <option value="Pending">Pending</option>
        <option value="Error">Error</option>
      </select>
    </div>
  );
}