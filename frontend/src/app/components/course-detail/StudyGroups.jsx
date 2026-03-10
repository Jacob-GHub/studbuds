// components/course-detail/StudyGroups.jsx
'use client';

import { useState } from 'react';
import { useDarkMode } from '../../context/DarkModeContext';
import { useStudyGroups } from '../../hooks/useCourseActivity';
import {
  createStudyGroup,
  joinStudyGroup,
  leaveStudyGroup,
  deleteStudyGroup,
} from '../../lib/api/courseActivity';
import LoadingSpinner from '../LoadingSpinner';
import EmptyState from '../EmptyState';
import { Users } from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';

export default function StudyGroups({ classId, token, user }) {
  const { darkMode } = useDarkMode();
  const { studyGroups, loading, refetch, setStudyGroups } = useStudyGroups(classId, token);
  const { handleXPAward } = useGamification();
  const [groupActionLoading, setGroupActionLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '', scheduledAt: '', location: '' });

  const handleCreateStudyGroup = async (e) => {
    e.preventDefault();
    if (!newGroup.name?.trim()) { alert('Group name is required'); return; }
    setGroupActionLoading(true);
    try {
      const { group, xpAwarded } = await createStudyGroup(classId, newGroup, token);
      if (xpAwarded) handleXPAward(xpAwarded);
      setStudyGroups((prev) => [group, ...prev]);
      setNewGroup({ name: '', description: '', scheduledAt: '', location: '' });
      setShowCreateForm(false);
    } catch (err) {
      alert(err.message || 'Failed to create study group');
    } finally {
      setGroupActionLoading(false);
    }
  };

  const handleJoinGroup = async (groupId) => {
    setGroupActionLoading(true);
    try {
      const { group: updatedGroup, xpAwarded } = await joinStudyGroup(classId, groupId, token);
      if (xpAwarded) handleXPAward(xpAwarded);
      setStudyGroups((prev) => prev.map((g) => (g._id === groupId ? updatedGroup : g)));
    } catch (err) {
      alert(err.message || 'Failed to join study group');
    } finally {
      setGroupActionLoading(false);
    }
  };

  const handleLeaveGroup = async (groupId) => {
    setGroupActionLoading(true);
    try {
      const updatedGroup = await leaveStudyGroup(classId, groupId, token);
      setStudyGroups((prev) => prev.map((g) => (g._id === groupId ? updatedGroup : g)));
    } catch (err) {
      alert(err.message || 'Failed to leave study group');
    } finally {
      setGroupActionLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm("Delete this study group? This can't be undone.")) return;
    setGroupActionLoading(true);
    try {
      await deleteStudyGroup(classId, groupId, token);
      setStudyGroups((prev) => prev.filter((g) => g._id !== groupId));
    } catch (err) {
      alert(err.message || 'Failed to delete study group');
    } finally {
      setGroupActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`rounded-xl p-4 sm:p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <LoadingSpinner message="Loading study groups..." darkMode={darkMode} />
      </div>
    );
  }

  return (
    <div className={`rounded-xl shadow-sm p-4 sm:p-6 space-y-3 sm:space-y-4 ${
      darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base sm:text-xl font-bold">Study Groups</h2>
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-indigo-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-indigo-700 transition"
          >
            + Create Group
          </button>
        )}
      </div>

      {/* Create form */}
      {showCreateForm && (
        <StudyGroupForm
          newGroup={newGroup}
          setNewGroup={setNewGroup}
          onSubmit={handleCreateStudyGroup}
          onCancel={() => setShowCreateForm(false)}
          loading={groupActionLoading}
          darkMode={darkMode}
        />
      )}

      {/* Empty state */}
      {studyGroups.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No study groups yet"
          description="Be the first to create a study group!"
          actionLabel="Create Study Group"
          onAction={() => setShowCreateForm(true)}
          darkMode={darkMode}
        />
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {studyGroups.map((group) => (
            <StudyGroupCard
              key={group._id}
              group={group}
              user={user}
              onJoin={handleJoinGroup}
              onLeave={handleLeaveGroup}
              onDelete={handleDeleteGroup}
              loading={groupActionLoading}
              darkMode={darkMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StudyGroupForm({ newGroup, setNewGroup, onSubmit, onCancel, loading, darkMode }) {
  const inputCls = `w-full border rounded-lg px-3 py-2 text-sm ${
    darkMode
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
  }`;
  const labelCls = `block text-xs sm:text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`;

  return (
    <form onSubmit={onSubmit} className={`rounded-lg border p-3 sm:p-4 space-y-3 ${
      darkMode ? 'border-gray-700 bg-gray-700/30' : 'border-gray-200 bg-gray-50'
    }`}>
      <div>
        <label className={labelCls}>Group Name *</label>
        <input
          type="text"
          value={newGroup.name}
          onChange={(e) => setNewGroup((p) => ({ ...p, name: e.target.value }))}
          className={inputCls}
          placeholder="CS180 Midterm 1 Review"
          required
        />
      </div>

      <div>
        <label className={labelCls}>Description</label>
        <textarea
          value={newGroup.description}
          onChange={(e) => setNewGroup((p) => ({ ...p, description: e.target.value }))}
          className={inputCls}
          placeholder="Topics, expectations, etc."
          rows={2}
        />
      </div>

      {/* Date/time and location — stacked on mobile, side-by-side on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Date & Time</label>
          <input
            type="datetime-local"
            value={newGroup.scheduledAt}
            onChange={(e) => setNewGroup((p) => ({ ...p, scheduledAt: e.target.value }))}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Location</label>
          <input
            type="text"
            value={newGroup.location}
            onChange={(e) => setNewGroup((p) => ({ ...p, location: e.target.value }))}
            className={inputCls}
            placeholder="Library Room 204"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 pt-1">
        <button
          type="submit"
          disabled={loading}
          className={`bg-indigo-600 text-white px-4 sm:px-5 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition ${
            loading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Creating...' : 'Create'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={`text-sm ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition`}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function StudyGroupCard({ group, user, onJoin, onLeave, onDelete, loading, darkMode }) {
  const isMember = group.members?.some((m) => m._id === user?._id);
  const isCreator = group.createdBy?._id === user?._id;

  return (
    <div className={`border rounded-lg p-3 sm:p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      {/* Top row: info + action buttons */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm sm:text-base truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {group.name}
          </p>

          {group.description && (
            <p className={`text-xs sm:text-sm mt-0.5 sm:mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {group.description}
            </p>
          )}

          {/* Schedule + location — wrap naturally */}
          {(group.scheduledAt || group.location) && (
            <p className={`text-xs mt-1 flex flex-wrap gap-x-2 gap-y-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              {group.scheduledAt && (
                <span>🕒 {new Date(group.scheduledAt).toLocaleString()}</span>
              )}
              {group.location && <span>📍 {group.location}</span>}
            </p>
          )}

          <p className={`text-xs sm:text-sm mt-0.5 sm:mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {group.members?.length || 0} members
          </p>
        </div>

        {/* Buttons — stacked on very small screens */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {isMember ? (
            <button
              onClick={() => onLeave(group._id)}
              disabled={loading}
              className={`text-xs sm:text-sm px-2.5 sm:px-3 py-1 sm:py-1.5 border rounded-lg transition whitespace-nowrap ${
                darkMode
                  ? 'text-gray-300 border-gray-600 hover:bg-gray-700'
                  : 'text-gray-700 border-gray-300 hover:bg-gray-50'
              } ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              Leave
            </button>
          ) : (
            <button
              onClick={() => onJoin(group._id)}
              disabled={loading}
              className={`text-xs sm:text-sm px-2.5 sm:px-3 py-1 sm:py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition whitespace-nowrap ${
                loading ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              Join
            </button>
          )}

          {isCreator && (
            <button
              onClick={() => onDelete(group._id)}
              disabled={loading}
              className={`text-xs sm:text-sm px-2.5 sm:px-3 py-1 sm:py-1.5 border border-red-400 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition whitespace-nowrap ${
                loading ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}