// components/EmptyState.jsx
'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  darkMode,
}) {
  const buttonClasses = `inline-flex items-center gap-2 font-medium px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:shadow-lg transition-all hover:scale-105 text-sm sm:text-base ${
    darkMode
      ? 'bg-gray-700 text-gray-100 hover:bg-gray-600 hover:shadow-gray-500/30'
      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-indigo-500/30'
  }`;

  const ActionButton = ({ children }) =>
    onAction ? (
      <button onClick={onAction} className={buttonClasses}>{children}</button>
    ) : (
      <Link href={actionHref} className={buttonClasses}>{children}</Link>
    );

  return (
    <div className={`rounded-2xl sm:rounded-3xl p-8 sm:p-20 text-center border-2 transition-colors ${
      darkMode
        ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-gray-700 border-gray-700'
        : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-indigo-100'
    }`}>
      <div className="relative">
        {/* Background watermark icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <Icon
            className={`w-24 h-24 sm:w-48 sm:h-48 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}
            strokeWidth={1}
          />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg ${
            darkMode ? 'bg-gray-700' : 'bg-white'
          }`}>
            <Icon
              className={`w-7 h-7 sm:w-10 sm:h-10 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}
              strokeWidth={2}
            />
          </div>

          <h3 className={`text-lg sm:text-2xl font-semibold mb-2 sm:mb-3 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {title}
          </h3>

          <p className={`mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {description}
          </p>

          {actionLabel && (actionHref || onAction) && (
            <ActionButton>
              {actionLabel}
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
            </ActionButton>
          )}
        </div>
      </div>
    </div>
  );
}