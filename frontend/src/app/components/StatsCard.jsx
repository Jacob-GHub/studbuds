// components/StatsCard.jsx
'use client';

export default function StatsCard({ stat, darkMode = false, onClick }) {
  const Icon = stat.icon;

  return (
    <div
      onClick={onClick}
      className={`group relative rounded-xl sm:rounded-2xl p-3 sm:p-6 border-2 transition-all duration-300 overflow-hidden ${
        onClick ? 'cursor-pointer' : ''
      } ${
        darkMode
          ? 'bg-gray-800 border-gray-700 hover:border-gray-600 hover:shadow-lg'
          : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-lg'
      }`}
    >
      {/* Background watermark */}
      <div className="absolute top-0 right-0 w-14 h-14 sm:w-20 sm:h-20 opacity-5">
        <Icon className={`w-full h-full ${darkMode ? 'text-gray-100' : 'text-gray-900'}`} />
      </div>

      <div className="relative z-10">
        {/* Icon */}
        <div className={`${stat.bgColor} w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4 group-hover:scale-110 transition-transform`}>
          <Icon className={`w-4 h-4 sm:w-6 sm:h-6 ${stat.iconColor}`} strokeWidth={2} />
        </div>

        {/* Label */}
        <p className={`text-xs sm:text-sm mb-0.5 sm:mb-1 leading-tight ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {stat.label}
        </p>

        {/* Value — truncate long strings like "Log your first session!" on mobile */}
        <p className={`text-base sm:text-2xl font-bold leading-tight truncate ${
          darkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>
          {stat.value}
        </p>

        {stat.subValue && (
          <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {stat.subValue}
          </p>
        )}
      </div>
    </div>
  );
}