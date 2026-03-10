// app/classes/[id]/page.jsx
'use client';

import { useAuth } from '../../context/AuthContext';
import { useGamification } from '../../context/GamificationContext';
import { useDarkMode } from '../../context/DarkModeContext';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingScreen from '../../components/LoadingScreen';
import ProtectedPage from '../../components/ProtectedPage';
import CourseHeader from '../../components/CourseHeader';
import CourseJoinPrompt from '../../components/course-detail/CourseJoinPrompt';
import CourseOverview from '../../components/course-detail/CourseOverview';
import CourseNotes from '../../components/course-detail/CourseNotes';
import StudyFeed from '../../components/course-detail/StudyFeed';
import CourseChat from '../../components/course-detail/CourseChat';
import CoursePeople from '../../components/course-detail/CoursePeople';
import StudyGroups from '../../components/course-detail/StudyGroups';
import Link from 'next/link';
import { LogOut } from 'lucide-react';

export default function CourseDetailPage() {
  const { token, user, loading: authLoading } = useAuth();
  const { handleXPAward } = useGamification();
  const { darkMode } = useDarkMode();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const classId = params.id;

  const initialTabFromUrl = searchParams?.get('tab');
  const initialTab = initialTabFromUrl === 'study-groups' ? 'study-groups' : 'overview';

  const [classData, setClassData] = useState(null);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

  useEffect(() => {
    if (!authLoading && !token) router.push('/login');
  }, [authLoading, token, router]);

  useEffect(() => {
    if (token && classId) fetchClassData();
  }, [token, classId]);

  const fetchClassData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/classes/${classId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setClassData(data);
      else setError(data.message || 'Failed to load class');
    } catch {
      setError('Failed to load class');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = async () => {
    try {
      const res = await fetch(`${baseUrl}/classes/${classId}/join`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        if (data.xpAwarded) handleXPAward(data.xpAwarded);
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setError(data.message || 'Failed to join class');
      }
    } catch {
      setError('Failed to join class');
    }
  };

  const handleLeaveClass = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to leave this class? You can always rejoin later from Discover.'
    );
    if (!confirmed) return;
    try {
      const res = await fetch(`${baseUrl}/classes/${classId}/leave`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) router.push('/discover');
      else setError(data.message || 'Failed to leave class');
    } catch {
      setError('Failed to leave class');
    }
  };

  const tabs = [
    { id: 'overview',      label: 'Overview' },
    { id: 'chat',          label: 'Chat' },
    { id: 'notes',         label: 'Notes' },
    { id: 'study-feed',    label: 'Study Feed' },
    { id: 'study-groups',  label: 'Study Groups' },
    { id: 'people',        label: 'People' },
  ];

  if (authLoading || loading) return <LoadingScreen />;

  // Error state — still uses ProtectedPage for consistent layout
  if (error && !classData) {
    return (
      <ProtectedPage>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md px-4">
            <div className="text-5xl sm:text-6xl mb-4">😕</div>
            <h2 className={`text-xl sm:text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Course Not Found
            </h2>
            <p className={`mb-6 text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {error}
            </p>
            <Link
              href="/discover"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition text-sm sm:text-base"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </ProtectedPage>
    );
  }

  if (!user || !classData) return null;

  const isCurrentUserMember = classData.isCurrentUserMember;

  return (
    <ProtectedPage>
      <div className="pb-24 md:pb-0">
        {/* Course Header */}
        <div className="mb-4">
          <CourseHeader
            code={classData.code}
            name={classData.name}
            term={classData.term}
            instructor={classData.instructor?.name}
            studentCount={classData.memberCount}
          />
        </div>

        {!isCurrentUserMember ? (
          <CourseJoinPrompt courseCode={classData.code} onJoin={handleJoinClass} />
        ) : (
          <>
            {/* ── Tab bar ── */}
            <div className={`mb-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                {/*
                  Scrollable tab row on mobile so all 6 tabs are reachable
                  without wrapping or shrinking.
                */}
                <div className="flex gap-3 sm:gap-6 overflow-x-auto flex-1 scrollbar-none pb-px">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`pb-3 px-0.5 text-sm sm:text-base font-medium transition relative whitespace-nowrap flex-shrink-0 ${
                        activeTab === tab.id
                          ? 'text-indigo-600'
                          : darkMode
                          ? 'text-gray-400 hover:text-gray-200'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Leave button — icon-only on mobile, icon+text on sm+ */}
                <button
                  onClick={handleLeaveClass}
                  title="Leave class"
                  className={`ml-3 flex-shrink-0 flex items-center gap-1.5 px-2 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    darkMode
                      ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300'
                      : 'text-red-500 hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Leave</span>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-4 sm:space-y-6">
              {activeTab === 'overview'     && <CourseOverview classData={classData} />}
              {activeTab === 'notes'        && <CourseNotes classId={classId} token={token} baseUrl={baseUrl} />}
              {activeTab === 'study-feed'   && <StudyFeed classId={classId} token={token} baseUrl={baseUrl} />}
              {activeTab === 'chat'         && <CourseChat classId={classId} token={token} baseUrl={baseUrl} />}
              {activeTab === 'people'       && <CoursePeople classId={classId} token={token} baseUrl={baseUrl} />}
              {activeTab === 'study-groups' && (
                <StudyGroups classId={classId} token={token} baseUrl={baseUrl} user={user} />
              )}
            </div>
          </>
        )}
      </div>
    </ProtectedPage>
  );
}