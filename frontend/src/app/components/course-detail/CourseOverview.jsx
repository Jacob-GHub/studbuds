// components/course-detail/CourseOverview.jsx

import CourseSections from '../../components/course-detail/CourseSections';
import { useDarkMode } from '../../context/DarkModeContext';

export function CourseOverview({ classData }) {
  const { darkMode } = useDarkMode();

  const card = darkMode
    ? 'bg-gray-800/80 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-700'
    : 'bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100';

  const heading = darkMode
    ? 'text-lg sm:text-xl font-bold text-gray-100 mb-3 sm:mb-4'
    : 'text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4';

  return (
    <>
      {/* Description */}
      <div className={card}>
        <h2 className={heading}>Course Description</h2>
        <p className={`text-sm sm:text-base leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {classData.description || 'No description available for this course.'}
        </p>
      </div>

      {/* Details */}
      <div className={card}>
        <h2 className={heading}>Course Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {[
            { label: 'Department', value: classData.department },
            { label: 'Units',      value: classData.units },
            { label: 'Format',     value: classData.instructionalMethod },
          ].map(({ label, value }) =>
            value ? (
              <div key={label} className="flex items-center gap-2 text-sm sm:text-base">
                <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {label}:
                </span>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{value}</span>
              </div>
            ) : null
          )}
          {classData.instructor?.email && (
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email:
              </span>
              <a
                href={`mailto:${classData.instructor.email}`}
                className={`truncate ${darkMode ? 'text-indigo-400 hover:underline' : 'text-indigo-600 hover:underline'}`}
              >
                {classData.instructor.email}
              </a>
            </div>
          )}
        </div>
      </div>

      <CourseSections sections={classData.sections} />
    </>
  );
}

export default CourseOverview;