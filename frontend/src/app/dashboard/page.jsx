// app/dashboard/page.jsx
'use client';

import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { useDarkMode } from '../context/DarkModeContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedPage from '../components/ProtectedPage';
import PageHeader from '../components/PageHeader';
import LoadingScreen from '../components/LoadingScreen';
import DashboardCourseCard from '../components/DashboardCourseCard';
import EmptyState from '../components/EmptyState';
import StatsCard from '../components/StatsCard';
import { useClasses } from '../hooks/useClasses';
import { useStudyGroups } from '../hooks/useStudyGroups';
import {
  BookOpen,
  Users,
  ChevronRight,
  Flame,
  Clock,
  Trophy,
  Star,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, token } = useAuth();
  const { stats, loading: statsLoading } = useGamification();
  const { darkMode } = useDarkMode();
  const [greeting, setGreeting] = useState('');

  const { classes: myClasses, loading: classesLoading } = useClasses(token, 'enrolled', user);
  const { groups: myStudyGroups, loading: groupsLoading, error: groupsError } = useStudyGroups(token);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const formatStudyTime = (minutes) => {
    if (!minutes) return '0h 0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const dashboardStats = [
    {
      label: 'Learning Streak',
      value: stats?.streak ? `${stats.streak} days` : 'Start today!',
      icon: Flame,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      label: 'Total Study Time',
      value: stats?.totalStudyMinutes
        ? formatStudyTime(stats.totalStudyMinutes)
        : 'Log your first session!',
      icon: Clock,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Achievements',
      value: stats?.achievements?.length?.toString() || '0',
      icon: Trophy,
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      label: 'Current Level',
      value: stats?.level ? `Level ${stats.level}` : 'Level 1',
      subValue: stats?.xp ? `${stats.xp.toLocaleString()} XP` : '0 XP',
      icon: Star,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];

  if (classesLoading || groupsLoading || statsLoading) return <LoadingScreen />;

  return (
    <ProtectedPage>
      {/*
        pb-24 on mobile: prevents content hiding behind the bottom nav bar.
        pb-0 on md+: sidebar layout handles spacing.
      */}
      <div className="pb-24 md:pb-0">
        <PageHeader
          title={`${greeting}, ${user?.name?.split(' ')[0]}`}
          subtitle={
            myClasses.length === 0
              ? "Let's get started with your first course"
              : `You have ${myClasses.length} ${myClasses.length === 1 ? 'course' : 'courses'} this semester`
          }
        />

        {/* ── Stats Grid ── */}
        <div className="mb-6 sm:mb-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {dashboardStats.map((stat, index) => (
              <StatsCard key={index} stat={stat} darkMode={darkMode} />
            ))}
          </div>
        </div>

        {/* ── Your Courses ── */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className={`text-lg sm:text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Your Courses
            </h2>
            {myClasses.length > 0 && (
              <Link
                href="/my-courses"
                className={`text-sm font-medium transition flex items-center gap-1 ${
                  darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-400 hover:text-indigo-600'
                }`}
              >
                View all
                <ChevronRight className="w-4 h-4" strokeWidth={2} />
              </Link>
            )}
          </div>

          {myClasses.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No courses yet"
              description="Discover courses to start your learning journey"
              actionLabel="Explore Courses"
              actionHref="/discover"
              darkMode={darkMode}
            />
          ) : (
            /* Single column on mobile → 2 columns on sm+ */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {myClasses.slice(0, 2).map((course) => (
                <DashboardCourseCard key={course._id} course={course} />
              ))}
            </div>
          )}
        </div>

        {/* ── Upcoming Study Sessions ── */}
        <div className="mb-6 sm:mb-12">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className={`text-lg sm:text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Upcoming Study Sessions
            </h2>
          </div>

          {groupsError ? (
            <p className="text-red-500 text-sm">{groupsError}</p>
          ) : myStudyGroups.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No study sessions yet"
              description="Join or create study groups in your courses to collaborate with classmates"
              actionLabel="View My Courses"
              actionHref="/my-courses"
              darkMode={darkMode}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {myStudyGroups.map((group) => {
                const attendeeCount = group.members ? group.members.length : 0;
                const classLabel = group.class
                  ? `${group.class.code || ''}${group.class.name ? ` – ${group.class.name}` : ''}`
                  : '';
                const when = group.scheduledAt
                  ? new Date(group.scheduledAt).toLocaleString()
                  : 'Time TBA';
                const location = group.location || 'Location TBA';

                return (
                  <div
                    key={group._id}
                    className={`rounded-xl shadow-sm p-4 sm:p-5 hover:shadow-md transition ${
                      darkMode ? 'bg-gray-800' : 'bg-white'
                    }`}
                  >
                    {/* Header row: title + badge */}
                    <div className="flex items-start justify-between mb-3 gap-2">
                      <h3 className={`text-base sm:text-lg font-bold leading-snug ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {group.name}
                      </h3>
                      {classLabel && (
                        <span className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium ${
                          darkMode
                            ? 'bg-indigo-900/50 text-indigo-300'
                            : 'bg-indigo-100 text-indigo-700'
                        }`}>
                          {classLabel}
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-1.5 mb-4">
                      {[
                        { emoji: '🕐', text: when },
                        { emoji: '📍', text: location },
                        { emoji: '👥', text: `${attendeeCount} students attending` },
                      ].map(({ emoji, text }) => (
                        <div
                          key={emoji}
                          className={`flex items-center gap-2 ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          <span className="text-base leading-none">{emoji}</span>
                          <span className="text-sm">{text}</span>
                        </div>
                      ))}
                    </div>

                    <Link
                      href={
                        group.class && group.class._id
                          ? `/classes/${group.class._id}?tab=study-groups`
                          : '/dashboard'
                      }
                      className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition text-sm"
                    >
                      View Session
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ProtectedPage>
  );
}