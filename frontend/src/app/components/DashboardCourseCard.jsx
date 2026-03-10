// components/DashboardCourseCard.jsx
'use client';

import Link from 'next/link';
import { useDarkMode } from '../context/DarkModeContext';
import { Users, ChevronRight } from 'lucide-react';
import { getSubjectConfig } from '../lib/constants';

export default function DashboardCourseCard({ course }) {
  const { darkMode } = useDarkMode();
  const subjectConfig = getSubjectConfig(course.department);
  const SubjectIcon = subjectConfig.icon;

  return (
    <Link href={`/classes/${course._id}`}>
      <div className={`group border-2 rounded-2xl p-3 sm:p-4 flex flex-col hover:shadow-lg transition-all duration-300 ${
        darkMode
          ? 'bg-gray-800 border-gray-700 hover:border-indigo-500 hover:shadow-indigo-500/10'
          : 'bg-white border-gray-100 hover:border-indigo-200 hover:shadow-indigo-500/10'
      }`}>

        {/* Icon + Course Code */}
        <div className="flex items-center gap-2 sm:gap-2.5 mb-2 sm:mb-3">
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${subjectConfig.iconBg} flex items-center justify-center flex-shrink-0 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:via-purple-600 group-hover:to-indigo-700 group-hover:shadow-md transition-all`}>
            <SubjectIcon
              className={`w-4 h-4 sm:w-5 sm:h-5 ${subjectConfig.iconColor} group-hover:text-white transition-all`}
              strokeWidth={2}
            />
          </div>
          <h3 className={`text-base sm:text-xl font-semibold group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {course.code}
          </h3>
        </div>

        {/* Course Name */}
        <p className={`text-xs sm:text-sm mb-1.5 sm:mb-2 leading-relaxed line-clamp-2 ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {course.name}
        </p>

        {/* Description */}
        {course.description && (
          <p className={`text-xs mb-2 sm:mb-3 leading-relaxed line-clamp-1 ${
            darkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            {course.description}
          </p>
        )}

        {/* Footer */}
        <div className={`flex items-center justify-between pt-2 sm:pt-3 border-t mt-auto ${
          darkMode ? 'border-gray-700' : 'border-gray-100'
        }`}>
          <div className={`flex items-center gap-1 sm:gap-1.5 ${
            darkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={2} />
            <span className="text-xs font-medium">{course.memberCount}</span>
          </div>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <span className="text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
              View
            </span>
            <ChevronRight
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 group-hover:text-indigo-700 group-hover:translate-x-0.5 transition-all"
              strokeWidth={2}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}