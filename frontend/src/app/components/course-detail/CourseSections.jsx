// components/course-detail/CourseSections.jsx
// ─────────────────────────────────────────────────────────────
import { useDarkMode } from '../../context/DarkModeContext';

export function CourseSections({ sections }) {
  const { darkMode } = useDarkMode();

  const card = darkMode
    ? 'bg-gray-800/80 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-700'
    : 'bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100';

  if (!sections || sections.length === 0) {
    return (
      <div className={`${card} text-center py-10 sm:py-12`}>
        <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">📋</div>
        <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          No Sections Available
        </h3>
        <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Section information will be added soon.
        </p>
      </div>
    );
  }

  return (
    <div className={card}>
      <h2 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        Course Sections
      </h2>
      <div className="space-y-3 sm:space-y-4">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className={`border rounded-lg p-3 sm:p-4 hover:shadow-sm transition ${
              darkMode
                ? 'border-gray-600 hover:border-indigo-400'
                : 'border-gray-200 hover:border-indigo-200'
            }`}
          >
            {/* Section header */}
            <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
              <div>
                <h3 className={`font-semibold text-sm sm:text-base ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  Section {section.sectionNumber}
                </h3>
                <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {section.scheduleType}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {section.enrollment}/{section.maxEnrollment}
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>enrolled</div>
              </div>
            </div>

            {section.instructor && (
              <p className={`text-xs sm:text-sm mb-1.5 sm:mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="font-medium">Instructor:</span> {section.instructor}
              </p>
            )}

            {section.meetingTimes?.map((mt, i) => {
              const isOnline = mt.location?.toLowerCase().includes('online');
              return (
                <div
                  key={i}
                  className={`text-xs sm:text-sm flex flex-wrap items-center gap-1 sm:gap-2 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {mt.days?.length > 0 && <span className="font-medium">{mt.days.join(', ')}</span>}
                  {mt.startTime && mt.endTime && <span>• {mt.startTime} – {mt.endTime}</span>}
                  {isOnline ? (
                    <span className="text-indigo-400">• Online</span>
                  ) : mt.location ? (
                    <span>• {mt.location}</span>
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseSections;