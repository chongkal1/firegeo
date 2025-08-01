'use client';

import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface VLNErrorMessageProps {
  error: string;
  onDismiss: () => void;
}

export function VLNErrorMessage({ error, onDismiss }: VLNErrorMessageProps) {
  return (
    <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-md animate-fade-in z-50">
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm flex-1">{error}</span>
      <button
        onClick={onDismiss}
        className="text-red-500 hover:text-red-700 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}