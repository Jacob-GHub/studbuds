// app/friends/page.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, UserPlus, Users, MessageCircle, User, AlertCircle, Check } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { useDarkMode } from '../context/DarkModeContext';
import { useFriends } from '../hooks/useFriends';

import ProtectedPage from '../components/ProtectedPage';
import PageHeader from '../components/PageHeader';
import LoadingScreen from '../components/LoadingScreen';

import { searchUsers, addFriend, removeFriend } from '../lib/api/friends';

export default function FriendsPage() {
  const { user, token, loading: authLoading } = useAuth();
  const { handleXPAward } = useGamification();
  const { darkMode } = useDarkMode();
  const router = useRouter();

  const { friends, loading, refetch } = useFriends(token);

  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('friends');
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    setError('');
    try {
      const data = await searchUsers(searchQuery, token);
      setSearchResults(data.users || []);
      setActiveTab('search');
    } catch (err) {
      setError(err.message || 'Search failed');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddFriend = async (userId) => {
    try {
      const data = await addFriend(userId, token);
      if (data.xpAwarded) handleXPAward(data.xpAwarded);
      await refetch();
      setSearchResults(searchResults.filter(u => u._id !== userId));
    } catch (err) {
      setError(err.message || 'Failed to add friend');
    }
  };

  const handleRemoveFriend = async (userId) => {
    if (!confirm('Are you sure you want to remove this friend?')) return;
    try {
      await removeFriend(userId, token);
      await refetch();
    } catch (err) {
      setError(err.message || 'Failed to remove friend');
    }
  };

  if (authLoading || loading) return <LoadingScreen />;
  if (!user) { router.push('/login'); return null; }

  return (
    <ProtectedPage>
      <div className="pb-24 md:pb-0">
        <PageHeader title="Friends" subtitle="Connect with classmates and study together" />

        {/* Search bar */}
        <div className="mb-8 sm:mb-12">
          <form onSubmit={handleSearch} className="flex gap-2 sm:gap-3">
            <div className="flex-1 relative">
              <Search
                className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`}
                strokeWidth={2}
              />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border-2 rounded-xl sm:rounded-2xl focus:outline-none transition text-sm sm:text-lg ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-indigo-500'
                    : 'bg-white border-gray-100 text-gray-900 placeholder-gray-400 focus:border-indigo-300'
                }`}
              />
            </div>
            <button
              type="submit"
              disabled={searchLoading || !searchQuery.trim()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-4 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-indigo-500/30 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base whitespace-nowrap"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
              <span className="hidden sm:inline">{searchLoading ? 'Searching...' : 'Search'}</span>
            </button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className={`mb-6 sm:mb-8 border-2 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl flex items-center gap-3 text-sm sm:text-base ${
            darkMode
              ? 'bg-red-900/50 border-red-700 text-red-200'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" strokeWidth={2} />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Tabs */}
        <div className={`mb-6 sm:mb-8 border-b-2 ${darkMode ? 'border-gray-800' : 'border-gray-50'}`}>
          <div className="flex gap-4 sm:gap-8">
            {[
              { id: 'friends', label: `My Friends (${friends.length})` },
              ...(searchResults.length > 0
                ? [{ id: 'search', label: `Results (${searchResults.length})` }]
                : []),
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 sm:pb-4 px-1 text-sm sm:text-base font-semibold transition relative whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-indigo-600'
                    : darkMode
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-400 hover:text-gray-900'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Friends list */}
        {activeTab === 'friends' && (
          friends.length === 0 ? (
            <div className={`rounded-2xl sm:rounded-3xl p-10 sm:p-20 text-center ${
              darkMode ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <Users className={`w-12 h-12 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 ${
                darkMode ? 'text-gray-600' : 'text-gray-300'
              }`} strokeWidth={1.5} />
              <h3 className={`text-lg sm:text-2xl font-semibold mb-2 sm:mb-3 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>No friends yet</h3>
              <p className={`max-w-md mx-auto text-sm sm:text-lg ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Search for classmates to connect with and start studying together
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {friends.map((friend) => (
                <FriendCard
                  key={friend._id}
                  friend={friend}
                  darkMode={darkMode}
                  onSendMessage={() => router.push(`/messages?userId=${friend._id}`)}
                  onViewProfile={() => router.push(`/profile/${friend._id}`)}
                  onRemove={() => handleRemoveFriend(friend._id)}
                />
              ))}
            </div>
          )
        )}

        {/* Search results */}
        {activeTab === 'search' && (
          searchResults.length === 0 ? (
            <div className={`rounded-2xl sm:rounded-3xl p-10 sm:p-20 text-center ${
              darkMode ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <Search className={`w-12 h-12 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 ${
                darkMode ? 'text-gray-600' : 'text-gray-300'
              }`} strokeWidth={1.5} />
              <h3 className={`text-lg sm:text-2xl font-semibold mb-2 sm:mb-3 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>No results found</h3>
              <p className={`text-sm sm:text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Try a different name or email
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {searchResults.map((searchUser) => (
                <SearchUserCard
                  key={searchUser._id}
                  user={searchUser}
                  isFriend={friends.some(f => f._id === searchUser._id)}
                  darkMode={darkMode}
                  onViewProfile={() => router.push(`/profile/${searchUser._id}`)}
                  onAddFriend={() => handleAddFriend(searchUser._id)}
                />
              ))}
            </div>
          )
        )}
      </div>
    </ProtectedPage>
  );
}

function PersonCardShell({ darkMode, children }) {
  return (
    <div className={`border-2 rounded-2xl sm:rounded-3xl p-4 sm:p-6 transition-all duration-300 ${
      darkMode
        ? 'bg-gray-800 border-gray-700 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10'
        : 'bg-white border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10'
    }`}>
      {children}
    </div>
  );
}

function PersonAvatar({ name }) {
  return (
    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
      <span className="text-white font-semibold text-xl sm:text-2xl">
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

function PersonInfo({ person, darkMode }) {
  return (
    <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
      <PersonAvatar name={person.name} />
      <div className="flex-1 min-w-0">
        <h3 className={`font-semibold text-base sm:text-lg mb-0.5 truncate ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {person.name}
        </h3>
        {person.major && (
          <p className="text-xs sm:text-sm text-indigo-600 font-medium truncate">{person.major}</p>
        )}
        <p className={`text-xs truncate ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          {person.email}
        </p>
      </div>
    </div>
  );
}

function FriendCard({ friend, darkMode, onSendMessage, onViewProfile, onRemove }) {
  return (
    <PersonCardShell darkMode={darkMode}>
      <PersonInfo person={friend} darkMode={darkMode} />
      {friend.bio && (
        <p className={`text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-2 leading-relaxed ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {friend.bio}
        </p>
      )}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onSendMessage}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition hover:shadow-lg hover:shadow-indigo-500/30 text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2"
          >
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />
            Message
          </button>
          <button
            onClick={onViewProfile}
            className={`font-medium px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />
            Profile
          </button>
        </div>
        <button
          onClick={onRemove}
          className={`w-full font-medium px-4 py-2.5 sm:py-3 rounded-xl transition text-xs sm:text-sm ${
            darkMode
              ? 'bg-gray-700 hover:bg-red-900 text-gray-300 hover:text-red-200'
              : 'bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-600'
          }`}
        >
          Remove Friend
        </button>
      </div>
    </PersonCardShell>
  );
}

function SearchUserCard({ user, isFriend, darkMode, onViewProfile, onAddFriend }) {
  return (
    <PersonCardShell darkMode={darkMode}>
      <PersonInfo person={user} darkMode={darkMode} />
      {user.bio && (
        <p className={`text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-2 leading-relaxed ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {user.bio}
        </p>
      )}
      <div className="flex gap-2">
        <button
          onClick={onViewProfile}
          className={`flex-1 font-medium px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition text-xs sm:text-sm flex items-center justify-center gap-1.5 ${
            darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
          }`}
        >
          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />
          Profile
        </button>
        {isFriend ? (
          <button
            disabled
            className={`font-medium px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm cursor-not-allowed flex items-center gap-1.5 ${
              darkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-50 text-green-700'
            }`}
          >
            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />
            Friends
          </button>
        ) : (
          <button
            onClick={onAddFriend}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl transition hover:shadow-lg hover:shadow-indigo-500/30 text-xs sm:text-sm flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />
            Add
          </button>
        )}
      </div>
    </PersonCardShell>
  );
}