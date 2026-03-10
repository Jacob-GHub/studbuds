// components/course-detail/CoursePeople.jsx

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useDarkMode } from '../../context/DarkModeContext';

export function CoursePeople({ classId, token, baseUrl }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useDarkMode();

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch(`${baseUrl}/classes/${classId}/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setMembers(data.members || []);
    } catch {
      console.error('Error fetching members');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`rounded-xl border ${
      darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-100 shadow-sm'
    }`}>
      {/* Header */}
      <div className={`px-4 sm:px-6 py-4 sm:py-5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
        <h2 className={`text-base sm:text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          Class Members
        </h2>
        <p className={`text-xs sm:text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {members.length} {members.length === 1 ? 'StudBud' : 'StudBuds'} enrolled
        </p>
      </div>

      {/* List */}
      <div className="p-4 sm:p-6">
        {loading ? (
          <div className="text-center py-10 sm:py-12">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-indigo-600 mx-auto" />
            <p className={`mt-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Loading members…
            </p>
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-10 sm:py-12">
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">👤</div>
            <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              No members yet
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Be the first to join this class!
            </p>
          </div>
        ) : (
          /* Single column on mobile → 2 col on md+ */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {members.map((member) => (
              <div
                key={member._id}
                className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg hover:shadow-sm transition ${
                  darkMode
                    ? 'border-gray-600 hover:border-indigo-400'
                    : 'border-gray-200 hover:border-indigo-200'
                }`}
              >
                <Link href={`/profile/${member._id}`} className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-base sm:text-lg">
                      {member.name?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold truncate text-sm sm:text-base ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    {member.name}
                  </h3>
                  {member.major && (
                    <p className={`text-xs sm:text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {member.major}
                    </p>
                  )}
                  {member.year && (
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {member.year}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CoursePeople;