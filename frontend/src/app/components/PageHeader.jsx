'use client';

export default function PageHeader({ title, subtitle }) {
  return (
    <div className="bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 rounded-xl p-5 sm:p-8 mb-6 sm:mb-8 text-white shadow-lg">
      <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{title}</h1>
      {subtitle && <p className="text-sm sm:text-base text-indigo-100">{subtitle}</p>}
    </div>
  );
}