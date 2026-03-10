// components/MyCourseCard.jsx
'use client';

import { Calendar, User, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import { getSubjectConfig } from '../lib/constants';
import { getPrimaryMeeting, formatInstructor } from '../lib/courseUtils';
import { useDarkMode } from '../context/DarkModeContext';

export default function MyCourseCard({ course }) {
  const { darkMode } = useDarkMode();
  if (!course) return null;

  const subjectConfig = getSubjectConfig(course.department, true);
  const SubjectIcon = subjectConfig.icon;
  const { meeting: meetingDisplay, location: locationDisplay } = getPrimaryMeeting(course);
  const instructorName = formatInstructor(course.instructor);

  return (
    <Link href={`/classes/${course._id}`} className="w-full block">
      <div className={`${
        darkMode
          ? 'bg-[#1e1e1e] border-gray-700 hover:border-indigo-400 shadow-none'
          : 'bg-white border-gray-100 hover:border-indigo-200 shadow-sm'
      } rounded-xl hover:shadow-xl transition-all duration-300 overflow-hidden group border w-full`}>

        <div className="flex flex-col sm:flex-row">

          {/* Left panel — full-width strip on mobile, fixed-width column on sm+ */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 px-6 py-5 sm:py-6 sm:w-48 flex sm:flex-col items-center justify-start sm:justify-center gap-4 sm:gap-0 text-white flex-shrink-0">
            <div className={`w-12 h-12 sm:w-16 sm:h-16 ${subjectConfig.iconBg} backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center sm:mb-3`}>
              <SubjectIcon className={`w-6 h-6 sm:w-8 sm:h-8 ${subjectConfig.iconColor}`} strokeWidth={2} />
            </div>
            <div className="sm:text-center">
              <h3 className="text-lg sm:text-2xl font-bold sm:text-center sm:mb-1">{course.code}</h3>
              {course.units && (
                <p className="text-indigo-100 text-xs sm:text-sm">{course.units} Units</p>
              )}
              {course.isUserCreated && (
                <span className="mt-1 sm:mt-2 inline-block bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium">
                  User Created
                </span>
              )}
            </div>
          </div>

          {/* Right panel */}
          <div className="flex-1 p-4 sm:p-6 flex flex-col min-w-0">

            {/* Title row */}
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="flex-1 min-w-0 pr-3 sm:pr-4">
                <h4 className={`${
                  darkMode
                    ? 'text-white group-hover:text-indigo-300'
                    : 'text-gray-900 group-hover:text-indigo-600'
                } text-base sm:text-xl font-bold mb-1 sm:mb-2 transition-colors line-clamp-1`}>
                  {course.name}
                </h4>
                {course.description && (
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-xs sm:text-sm line-clamp-2`}>
                    {course.description}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0">
                <div className={`${
                  darkMode ? 'bg-indigo-900/40 group-hover:bg-indigo-900/60' : 'bg-indigo-50 group-hover:bg-indigo-100'
                } w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors`}>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Metadata — 2 cols on mobile, up to 4 on lg */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
              {course.term && (
                <MetaItem
                  icon={<Calendar className={`${darkMode ? 'text-blue-300' : 'text-blue-600'} w-4 h-4 sm:w-5 sm:h-5`} strokeWidth={2} />}
                  iconBg={darkMode ? 'bg-blue-900/40' : 'bg-blue-50'}
                  label="Term"
                  value={course.term}
                  darkMode={darkMode}
                />
              )}
              {instructorName && (
                <MetaItem
                  icon={<User className={`${darkMode ? 'text-purple-300' : 'text-purple-600'} w-4 h-4 sm:w-5 sm:h-5`} strokeWidth={2} />}
                  iconBg={darkMode ? 'bg-purple-900/40' : 'bg-purple-50'}
                  label="Instructor"
                  value={instructorName}
                  darkMode={darkMode}
                />
              )}
              {meetingDisplay && (
                <MetaItem
                  icon={<Clock className={`${darkMode ? 'text-green-300' : 'text-green-600'} w-4 h-4 sm:w-5 sm:h-5`} strokeWidth={2} />}
                  iconBg={darkMode ? 'bg-green-900/40' : 'bg-green-50'}
                  label="Schedule"
                  value={meetingDisplay}
                  darkMode={darkMode}
                />
              )}
            </div>

            {/* Location */}
            {locationDisplay && (
              <div className={`mt-auto pt-3 sm:pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'} flex items-center gap-2 text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <MapPin className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0`} strokeWidth={2} />
                <span className="truncate">{locationDisplay}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function MetaItem({ icon, iconBg, label, value, darkMode }) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 text-sm min-w-0">
      <div className={`${iconBg} w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-xs`}>{label}</p>
        <p className={`${darkMode ? 'text-white' : 'text-gray-900'} font-medium text-xs sm:text-sm truncate`}>{value}</p>
      </div>
    </div>
  );
}