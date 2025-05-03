"use client";

import React, { useState, useEffect } from 'react';

export default function ValidationInterface({ documentId, extractedData, onSave, commonFields = [] }) {
  const [fields, setFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize fields from extractedData with insights from commonFields
  useEffect(() => {
    if (extractedData) {
      const initialFields = [];
      // Handle flat fields first
      Object.entries(extractedData).forEach(([key, value]) => {
        if (key === 'items' || Array.isArray(value)) return; // Skip arrays, handle separately
        
        // Find if this is a common field
        const commonField = commonFields.find(field => field.name === key);
        
        initialFields.push({
          name: key,
          type: typeof value === 'string' ? 'string' : typeof value,
          value: value,
          selected: true,
          description: getDescriptionForField(key),
          isCommon: !!commonField,
          frequency: commonField ? commonField.occurrencePercent : 0
        });
      });
      
      // Handle items separately if it exists
      if (extractedData.items && Array.isArray(extractedData.items)) {
        const itemsCommonField = commonFields.find(field => field.name === 'items');
        
        initialFields.push({
          name: 'items',
          type: 'list',
          value: extractedData.items,
          selected: true,
          description: 'List of items included in the order.',
          isCommon: !!itemsCommonField,
          frequency: itemsCommonField ? itemsCommonField.occurrencePercent : 0,
          children: [
            { name: 'designation', type: 'string', description: 'Description of the item.' },
            { name: 'quantity', type: 'string', description: 'Number of units ordered.' },
            { name: 'unit_price', type: 'string', description: 'Price per unit of the item.' },
            { name: 'total_price', type: 'string', description: 'Total price for the item.' }
          ]
        });
      }
      
      // Check if there are common fields that don't exist in current extractedData
      // and add them as suggested fields
      commonFields.forEach(commonField => {
        if (commonField.occurrencePercent > 50 && // Only suggest fields that appear in more than 50% of docs
            !initialFields.some(field => field.name === commonField.name)) {
          initialFields.push({
            name: commonField.name,
            type: 'string',
            value: '',
            selected: false,
            description: getDescriptionForField(commonField.name),
            isCommon: true,
            frequency: commonField.occurrencePercent,
            isSuggested: true
          });
        }
      });
      
      // Sort fields with common ones first
      const sortedFields = initialFields.sort((a, b) => {
        // First sort by selected status
        if (a.selected !== b.selected) return a.selected ? -1 : 1;
        // Then sort by common status
        if (a.isCommon !== b.isCommon) return a.isCommon ? -1 : 1;
        // Then by frequency
        return b.frequency - a.frequency;
      });
      
      setFields(sortedFields);
      setSelectedFields(sortedFields.filter(field => field.selected).map(field => field.name));
    }
  }, [extractedData, commonFields]);

  const getDescriptionForField = (fieldName) => {
    const descriptions = {
      company_name: 'Name of the company issuing the order.',
      company_address: 'Address of the company issuing the order.',
      company_contact: 'Contact details of the company issuing the order.',
      order_title: 'Title of the document, indicating it is a purchase order.',
      order_date: 'Date when the order was issued.',
      client_name: 'Name of the client receiving the order.',
      client_address: 'Address of the client receiving the order.',
      order_reference: 'Reference number of the proforma invoice related to the order.',
      document_title: 'Title of the document.',
      document_type: 'Type of document.',
      items: 'List of items included in the order.',
    };
    
    return descriptions[fieldName] || `Field: ${fieldName}`;
  };

  const handleSelectField = (fieldName) => {
    setSelectedFields(prev => {
      if (prev.includes(fieldName)) {
        return prev.filter(name => name !== fieldName);
      } else {
        return [...prev, fieldName];
      }
    });
  };

  const handleValueChange = (fieldName, newValue) => {
    setFields(prev => 
      prev.map(field => 
        field.name === fieldName 
          ? { ...field, value: newValue } 
          : field
      )
    );
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Prepare data for saving - only include selected fields
      const dataToSave = {};
      fields.forEach(field => {
        if (selectedFields.includes(field.name)) {
          dataToSave[field.name] = field.value;
        }
      });
      
      const response = await fetch(`/api/documents/validate?documentId=${documentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          extractedData: dataToSave,
          status: 'Validated'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save validation');
      }
      
      if (onSave) {
        onSave(dataToSave);
      }
      
    } catch (error) {
      console.error('Error saving validated data:', error);
      alert('Failed to save validation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddField = () => {
    // Functionality to add custom field
    const newField = {
      name: `custom_field_${fields.length}`,
      type: 'string',
      value: '',
      selected: true,
      description: 'Custom field',
      isNew: true
    };
    
    setFields(prev => [...prev, newField]);
    setSelectedFields(prev => [...prev, newField.name]);
  };

  return (
    <div className="bg-white p-4 h-full flex flex-col">
      <div className="mb-4">
        <h1 className="text-xl font-medium">Validation des résultats</h1>
        <p className="text-sm text-gray-600 mt-1">
          Voici les résultats générés par les algorithmes pour votre document. Vous pouvez gérer les labels et valeurs suggérés, avec les options d'édition, ajout ou suppression.
          <a href="#" className="text-blue-600 ml-1">Learn more →</a>
        </p>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={handleAddField}
          className="inline-flex items-center text-sm px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
        >
          <span className="mr-1">+</span> Add field (N)
        </button>
        
        <div className="flex items-center text-sm text-gray-500">
          <span>Updated {new Date().toLocaleString()}</span>
          <button className="ml-3 px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50">
            Save schema
          </button>
          <button className="ml-1 p-2 text-gray-500 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="w-6 py-3 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field name</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fields.map((field) => (
              <React.Fragment key={field.name}>
                <tr className={`${selectedFields.includes(field.name) ? '' : 'bg-gray-50'} ${field.isSuggested ? 'bg-blue-50' : ''}`}>
                  <td className="py-4 pl-4 pr-3 whitespace-nowrap">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={selectedFields.includes(field.name)}
                      onChange={() => handleSelectField(field.name)}
                    />
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center">
                      {field.name}
                      {field.isCommon && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          {field.frequency}% common
                        </span>
                      )}
                      {field.isSuggested && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Suggested
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {field.type}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {field.type === 'list' ? (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{field.value.length} items</span>
                    ) : (
                      <input 
                        type="text" 
                        className={`border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${field.isSuggested ? 'border-blue-300' : ''}`}
                        value={field.value || ''}
                        onChange={(e) => handleValueChange(field.name, e.target.value)}
                        disabled={!selectedFields.includes(field.name)}
                        placeholder={field.isSuggested ? "Enter value" : ""}
                      />
                    )}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {field.description}
                  </td>
                </tr>
                {field.type === 'list' && field.children && selectedFields.includes(field.name) && (
                  field.children.map((childField) => (
                    <tr key={`${field.name}-${childField.name}`} className="bg-gray-50">
                      <td className="py-2 pl-4 pr-3"></td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                        <span className="ml-4">└─ {childField.name}</span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                        {childField.type}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                        {/* No editable value for child fields directly */}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                        {childField.description}
                      </td>
                    </tr>
                  ))
                )}
              </React.Fragment>
            ))}
            {fields.length === 0 && (
              <tr>
                <td colSpan="5" className="px-3 py-4 text-center text-sm text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex justify-end">
        <button 
          onClick={handleSave}
          disabled={isLoading || fields.length === 0}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Validation'}
        </button>
      </div>
    </div>
  );
}