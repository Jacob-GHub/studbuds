'use client';

import { useRouter } from 'next/navigation';
import { BookOpen, ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import { useClasses } from '../hooks/useClasses';

import ProtectedPage from '../components/ProtectedPage';
import PageHeader from '../components/PageHeader';
import LoadingScreen from '../components/LoadingScreen';
import MyCourseCard from '../components/MyCourseCard';

export default function MyCoursesPage() {
  const { user, token, loading: authLoading } = useAuth();
  const { darkMode } = useDarkMode();
  const router = useRouter();

  const { classes: myCourses, loading } = useClasses(token, 'enrolled', user);

  if (authLoading || loading) return <LoadingScreen />;

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <ProtectedPage>
      <div className="pb-24 md:pb-0">
        <PageHeader
          title="My Courses"
          subtitle={`You're enrolled in ${myCourses.length} ${myCourses.length === 1 ? 'course' : 'courses'}`}
        />

        {myCourses.length === 0 ? (
          /* ── Empty state ── */
          <div className={`rounded-2xl sm:rounded-3xl p-8 sm:p-20 text-center border-2 ${
            darkMode
              ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-gray-700 border-gray-700'
              : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-indigo-100'
          }`}>
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <BookOpen
                  className={`w-24 h-24 sm:w-48 sm:h-48 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}
                  strokeWidth={1}
                />
              </div>
              <div className="relative z-10">
                <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-white'
                }`}>
                  <BookOpen
                    className={`w-7 h-7 sm:w-10 sm:h-10 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}
                    strokeWidth={2}
                  />
                </div>
                <h3 className={`text-lg sm:text-2xl font-semibold mb-2 sm:mb-3 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  No courses yet
                </h3>
                <p className={`mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Start by discovering and joining courses that interest you
                </p>
                <Link
                  href="/discover"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:shadow-lg hover:shadow-indigo-500/30 transition-all hover:scale-105 text-sm sm:text-base"
                >
                  Browse Courses
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /*
            Mobile:  single column stack
            sm+:     flex-wrap (original behaviour)
          */
          <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-3">
            {myCourses.map((course) => (
              <MyCourseCard key={course._id} course={course} darkMode={darkMode} />
            ))}
          </div>
        )}
      </div>
    </ProtectedPage>
  );
}