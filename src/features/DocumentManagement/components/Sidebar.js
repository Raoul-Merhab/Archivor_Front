"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  
  const sidebarItems = [
    { title: "Inbox", path: "/documents", count: 1, icon: "📥" },
    { title: "Parsed Data", path: "/documents/parsed-data", count: 1, icon: "📊" },
    { title: "Extraction Schema", path: "/documents/extraction-schema", count: 0, icon: "🔧", badge: "New" },
    { title: "Post-processing", path: "/documents/post-processing", count: 0, icon: "⚙️" },
    { title: "Integrations", path: "/documents/integrations", count: 0, icon: "🔗" },
    { title: "Inbox Settings", path: "/documents/settings", count: 0, icon: "⚙️" },
  ];

  const isActive = (path) => {
    if (path === '/documents') {
      // Exact match for the main documents route
      return pathname === '/documents';
    }
    // For other routes, check if pathname starts with the path
    return pathname.startsWith(path);
  };

  return (
    <div className="w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 p-4">
      {/* User profile */}
      <div className="flex items-center mb-8 p-2">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
          n
        </div>
        <div className="ml-3">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">name</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">name.45937@n.ai</div>
        </div>
      </div>

      {/* Navigation items */}
      <nav className="space-y-1">
        {sidebarItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <div className={`flex items-center justify-between px-3 py-2 rounded-md ${
              isActive(item.path) 
                ? 'bg-blue-50 text-blue-600 dark:bg-slate-700 dark:text-blue-400' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}>
              <div className="flex items-center">
                <span className="mr-3">{item.icon}</span>
                <span>{item.title}</span>
                {item.badge && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {item.badge}
                  </span>
                )}
              </div>
              {item.count > 0 && (
                <span className="bg-gray-100 dark:bg-slate-600 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
                  {item.count}
                </span>
              )}
            </div>
          </Link>
        ))}
      </nav>

      {/* Trial plan */}
      <div className="mt-auto pt-8">
        <div className="px-3 py-4 bg-gray-50 dark:bg-slate-700 rounded-md">
          <div className="flex items-center">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Trial plan</span>
          </div>
          <div className="mt-2">
            <div className="h-2 w-full bg-gray-200 dark:bg-slate-600 rounded-full">
              <div className="h-2 bg-blue-500 rounded-full" style={{ width: '23.3%' }}></div>
            </div>
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Credits: 7/30
          </div>
          <div className="mt-3">
            <Link href="/pricing">
              <button className="w-full flex justify-center items-center py-2 px-4 border border-blue-500 rounded-md text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                Upgrade plan
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}