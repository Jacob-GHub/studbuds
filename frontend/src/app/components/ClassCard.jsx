// components/ClassCard.jsx
'use client';

import Link from 'next/link';
import { useDarkMode } from '../context/DarkModeContext';
import { Users, ChevronRight } from 'lucide-react';
import { getSubjectConfig } from '../lib/constants';

export default function ClassCard({ course }) {
  const { darkMode } = useDarkMode();
  const subjectConfig = getSubjectConfig(course.department);
  const SubjectIcon = subjectConfig.icon;

  return (
    <Link href={`/classes/${course._id}`}>
      <div className={`group rounded-2xl sm:rounded-3xl p-4 sm:p-6 h-full flex flex-col transition-all duration-300 border-2 ${
        darkMode
          ? 'bg-gray-800 border-gray-700 hover:border-indigo-500'
          : 'bg-white border-gray-100 hover:border-indigo-200'
      } hover:shadow-xl hover:shadow-indigo-500/10`}>

        {/* Icon + Course Code */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
              darkMode
                ? 'bg-gray-700 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:via-purple-600 group-hover:to-indigo-700'
                : `${subjectConfig.iconBg} group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:via-purple-600 group-hover:to-indigo-700`
            } group-hover:shadow-lg`}>
              <SubjectIcon
                className={`w-5 h-5 sm:w-6 sm:h-6 transition-all ${
                  darkMode
                    ? 'text-gray-300 group-hover:text-white'
                    : `${subjectConfig.iconColor} group-hover:text-white`
                }`}
                strokeWidth={2}
              />
            </div>

            <h3 className={`text-lg sm:text-2xl font-semibold transition-all leading-tight ${
              darkMode
                ? 'text-white group-hover:text-indigo-400'
                : 'text-gray-900 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent'
            }`}>
              {course.code}
            </h3>
          </div>
        </div>

        {/* Course Name */}
        <p className={`mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed line-clamp-2 flex-shrink-0 ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {course.name}
        </p>

        {/* Description */}
        {course.description && (
          <p className={`text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-4 leading-relaxed ${
            darkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            {course.description}
          </p>
        )}

        <div className="flex-1" />

        {/* Footer */}
        <div className={`flex items-center justify-between pt-3 sm:pt-4 border-t mt-3 sm:mt-4 ${
          darkMode ? 'border-gray-700' : 'border-gray-100'
        }`}>
          <div className={`flex items-center gap-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />
            <span className="text-xs sm:text-sm font-medium">{course.memberCount}</span>
          </div>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <span className={`text-xs sm:text-sm font-semibold transition-colors ${
              darkMode
                ? 'text-indigo-400 group-hover:text-indigo-300'
                : 'text-indigo-600 group-hover:text-indigo-700'
            }`}>
              View Details
            </span>
            <ChevronRight
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-all group-hover:translate-x-0.5 ${
                darkMode
                  ? 'text-indigo-400 group-hover:text-indigo-300'
                  : 'text-indigo-600 group-hover:text-indigo-700'
              }`}
              strokeWidth={2}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}