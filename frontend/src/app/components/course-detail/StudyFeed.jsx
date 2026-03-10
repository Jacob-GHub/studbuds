// components/course-detail/StudyFeed.jsx
'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStudySessions, useStudySessionStats } from '../../hooks/useCourseActivity';
import { likeStudySession, deleteStudySession } from '../../lib/api/courseActivity';
import { formatDuration, getDifficultyColor, formatSessionDate } from '../../lib/studySessionUtils';
import LoadingSpinner from '../LoadingSpinner';
import EmptyState from '../EmptyState';
import UserAvatar from '../UserAvatar';
import LogStudySessionModal from './LogStudySessionModal';
import { BookOpen } from 'lucide-react';
import { useDarkMode } from '../../context/DarkModeContext';

export default function StudyFeed({ classId, token, baseUrl }) {
  const { darkMode } = useDarkMode();
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [showLogModal, setShowLogModal] = useState(false);

  const filterValue = filter === 'my-sessions' ? user?._id : 'all';
  const { sessions, count, loading, refetch, setSessions } = useStudySessions(classId, token, filterValue);
  const { userStats, refetch: refetchStats } = useStudySessionStats(classId, token);

  const handleSessionLogged = () => { setShowLogModal(false); refetch(); refetchStats(); };
  const handleLikeSession = async (sessionId) => {
    try { await likeStudySession(sessionId, token); refetch(); }
    catch { console.error('Error liking session'); }
  };
  const handleDeleteSession = async (sessionId) => {
    if (!confirm('Delete this study session?')) return;
    try { await deleteStudySession(sessionId, token); setSessions(p => p.filter(s => s._id !== sessionId)); refetchStats(); }
    catch { alert('Failed to delete session'); }
  };

  if (loading) {
    return (
      <div className={`rounded-xl border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
        <LoadingSpinner message="Loading study sessions..." />
      </div>
    );
  }

  return (
    <>
      <div className={`rounded-xl border ${darkMode ? 'bg-gray-900 border-gray-700 shadow-none' : 'bg-white border-gray-100 shadow-sm'}`}>

        {/* Header */}
        <div className={`px-4 sm:px-6 py-4 sm:py-5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <h2 className={`text-base sm:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Study Sessions
          </h2>
          <p className={`text-xs sm:text-sm mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {count} {count === 1 ? 'study session' : 'study sessions'} created
          </p>
        </div>

        {/* Filters + Log button */}
        <div className={`px-4 sm:px-6 py-3 sm:py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
            {/* Filter pills */}
            <div className="flex gap-1.5 sm:gap-2">
              {[
                { id: 'all', label: 'All' },
                { id: 'my-sessions', label: 'Mine' },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setFilter(id)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition text-xs sm:text-sm ${
                    filter === id
                      ? 'bg-indigo-100 text-indigo-700'
                      : darkMode
                      ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowLogModal(true)}
              className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition flex items-center gap-1.5 text-xs sm:text-sm"
            >
              <span className="text-base leading-none">+</span>
              Log Session
            </button>
          </div>

          {userStats && <UserStatsPanel stats={userStats} darkMode={darkMode} />}
        </div>

        {/* Sessions list */}
        <div className="p-4 sm:p-6">
          {sessions.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title={filter === 'my-sessions' ? 'No sessions logged yet' : 'No study sessions yet'}
              description={filter === 'my-sessions' ? 'Start tracking your study progress!' : 'Be the first to log a study session!'}
              actionLabel="Log Your First Session"
              onAction={() => setShowLogModal(true)}
              darkMode={darkMode}
            />
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {sessions.map(session => (
                <StudySessionCard
                  key={session._id}
                  session={session}
                  currentUser={user}
                  onLike={handleLikeSession}
                  onDelete={handleDeleteSession}
                  darkMode={darkMode}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <LogStudySessionModal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        onSessionLogged={handleSessionLogged}
        classId={classId} token={token} baseUrl={baseUrl}
      />
    </>
  );
}

function UserStatsPanel({ stats, darkMode }) {
  return (
    <div className={`rounded-lg p-3 sm:p-4 border ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100'
    }`}>
      <h3 className={`font-semibold text-xs sm:text-sm mb-2 sm:mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Your Study Stats
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {[
          { value: stats.totalHours,           label: 'Total Hours' },
          { value: stats.totalSessions,        label: 'Sessions' },
          { value: stats.currentStreak,        label: 'Day Streak 🔥' },
          { value: stats.averageSessionMinutes,label: 'Avg Minutes' },
        ].map(({ value, label }) => (
          <div key={label} className={`rounded-lg p-2 sm:p-3 border ${
            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-indigo-100'
          }`}>
            <div className={`text-lg sm:text-2xl font-bold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
              {value}
            </div>
            <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudySessionCard({ session, currentUser, onLike, onDelete, darkMode }) {
  const isOwnSession = session.userId?._id === currentUser?._id;
  const hasLiked = session.likes?.includes(currentUser?._id);

  return (
    <div className={`rounded-lg p-3 sm:p-4 border transition hover:shadow-sm ${
      darkMode
        ? 'bg-gray-800 border-gray-700 hover:border-indigo-600'
        : 'bg-white border border-gray-200 hover:border-indigo-200'
    }`}>
      {/* Top row: avatar + author info + delete */}
      <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
        <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
          <UserAvatar user={session.userId} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-0.5">
              <span className={`font-semibold text-sm sm:text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {session.userId?.name || 'Anonymous'}
              </span>
              {session.userId?.major && (
                <span className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  • {session.userId.major}
                </span>
              )}
            </div>
            {/* Time + difficulty — wrap on mobile */}
            <div className={`flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <span>⏱️ {formatDuration(session.duration)}</span>
              <span>•</span>
              <span>📅 {formatSessionDate(session.createdAt)}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor(session.difficulty)}`}>
                {session.difficulty}
              </span>
            </div>
          </div>
        </div>
        {isOwnSession && (
          <button
            onClick={() => onDelete(session._id)}
            className={`flex-shrink-0 text-xs transition ${darkMode ? 'text-gray-400 hover:text-red-500' : 'text-gray-400 hover:text-red-600'}`}
          >
            Delete
          </button>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h4 className={`flex items-center gap-2 font-semibold text-sm sm:text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          📚 {session.topic}
        </h4>

        {session.subtopics?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {session.subtopics.map((s, i) => (
              <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${
                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}>{s}</span>
            ))}
          </div>
        )}

        <div className={`rounded-lg p-2.5 sm:p-3 text-xs sm:text-sm ${
          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-700'
        }`}>
          <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>💡 What I learned: </span>
          {session.whatILearned}
        </div>

        {session.studyTechnique && (
          <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            🎯 Technique: <span className="font-medium">{session.studyTechnique}</span>
          </p>
        )}
        {session.location && (
          <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            📍 {session.location}
          </p>
        )}
      </div>

      {/* Like button */}
      <div className={`mt-2 sm:mt-3 pt-2 sm:pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
        <button
          onClick={() => onLike(session._id)}
          className={`flex items-center gap-1 text-sm font-medium transition ${
            hasLiked
              ? 'text-red-500 hover:text-red-600'
              : darkMode ? 'text-gray-400 hover:text-red-500' : 'text-gray-500 hover:text-red-500'
          }`}
        >
          <span className="text-base sm:text-lg">{hasLiked ? '❤️' : '🤍'}</span>
          <span>{session.likes?.length || 0}</span>
        </button>
      </div>
    </div>
  );
}