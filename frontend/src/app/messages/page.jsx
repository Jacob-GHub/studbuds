"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Send, MessageCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import { useConversations } from '../hooks/useConversations';

import ProtectedPage from '../components/ProtectedPage';
import PageHeader from '../components/PageHeader';
import LoadingScreen from '../components/LoadingScreen';

import { fetchMessages, sendMessage, markMessagesAsRead } from '../lib/api/messages';
import { fetchUserById } from '../lib/api/friends';

export default function MessagesPage() {
  const { user, token, loading: authLoading } = useAuth();
  const { darkMode } = useDarkMode();
  const router = useRouter();

  const { conversations, loading, backendError, refetch } = useConversations(token);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState('');
  const [newChatUser, setNewChatUser] = useState(null);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && token) {
      const params = new URLSearchParams(window.location.search);
      const userId = params.get('userId');
      if (userId) startNewConversation(userId);
    }
  }, [token]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.user._id);
      markAsRead(selectedConversation.user._id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startNewConversation = async (userId) => {
    try {
      const data = await fetchUserById(userId, token);
      const targetUser = data.user;
      const existingConvo = conversations.find(c => c.user._id === userId);
      if (existingConvo) {
        selectConversation(existingConvo);
      } else {
        const newConvo = { user: targetUser, lastMessage: null, unreadCount: 0 };
        setNewChatUser(newConvo);
        selectConversation(newConvo);
      }
      window.history.replaceState({}, '', '/messages');
    } catch {
      setError('Failed to start conversation');
    }
  };

  const selectConversation = (convo) => {
    setSelectedConversation(convo);
    setMobileChatOpen(true);
  };

  const loadMessages = async (userId) => {
    try {
      const data = await fetchMessages(userId, token);
      setMessages(data.messages || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load messages');
    }
  };

  const markAsRead = async (userId) => {
    try {
      await markMessagesAsRead(userId, token);
      await refetch();
    } catch {}
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;
    setSendingMessage(true);
    try {
      await sendMessage(selectedConversation.user._id, newMessage, token);
      setNewMessage('');
      if (newChatUser) setNewChatUser(null);
      await loadMessages(selectedConversation.user._id);
      await refetch();
    } catch (err) {
      setError(err.message || 'Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const diffInHours = (new Date() - date) / (1000 * 60 * 60);
    if (diffInHours < 24)
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const [initialLoad, setInitialLoad] = useState(true);
  useEffect(() => {
    if (!authLoading && !loading) setInitialLoad(false);
  }, [authLoading, loading]);

  if (initialLoad) return <LoadingScreen />;
  if (!user) { router.push('/login'); return null; }

  return (
    <ProtectedPage padding="px-0">
      {/*
        Full-height chat layout that fills the available space.
        On mobile: show either the conversation list OR the chat panel (not both).
        On sm+: show both side by side.
      */}
      <div className="flex flex-col h-[calc(100vh-env(safe-area-inset-bottom))] md:h-screen overflow-hidden -mt-8">

        {/* Header — only visible when list is shown on mobile */}
        <div className={`px-4 sm:px-8 pt-6 sm:pt-8 pb-0 border-b-2 flex-shrink-0 ${
          mobileChatOpen ? 'hidden sm:block' : 'block'
        } ${darkMode ? 'border-gray-800' : 'border-gray-50'}`}>
          <PageHeader title="Messages" subtitle="Chat with your classmates" />
        </div>

        {/* Backend error banner */}
        {backendError && (
          <div className={`flex-shrink-0 px-4 sm:px-8 py-3 border-b-2 ${
            darkMode ? 'bg-yellow-900/50 border-yellow-800' : 'bg-yellow-50 border-yellow-100'
          }`}>
            <div className={`flex items-center gap-2 text-xs sm:text-sm font-medium ${
              darkMode ? 'text-yellow-300' : 'text-yellow-800'
            }`}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
              Unable to connect to messaging service. Make sure the backend is running.
            </div>
          </div>
        )}

        {/* Main layout */}
        <div className="flex flex-1 overflow-hidden">

          {/*
            Conversation list:
            - Mobile: full width, hidden when chat is open
            - sm+: fixed width sidebar, always visible
          */}
          <div className={`${
            mobileChatOpen ? 'hidden sm:flex' : 'flex'
          } w-full sm:w-72 md:w-80 lg:w-96 flex-col border-r-2 overflow-hidden flex-shrink-0 ${
            darkMode ? 'border-gray-800 bg-gray-800' : 'border-gray-50 bg-white'
          }`}>
            <div className={`px-4 sm:px-6 py-3 sm:py-4 border-b-2 flex-shrink-0 ${
              darkMode ? 'border-gray-700' : 'border-gray-50'
            }`}>
              <h2 className={`text-base sm:text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Conversations
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-8 sm:p-12 text-center">
                  <MessageCircle className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 ${
                    darkMode ? 'text-gray-600' : 'text-gray-300'
                  }`} />
                  <h3 className={`text-base sm:text-lg font-semibold mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>No messages yet</h3>
                  <p className={`text-xs sm:text-sm mb-4 sm:mb-6 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Start a conversation with your friends!
                  </p>
                  <button
                    onClick={() => router.push('/friends')}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium px-5 py-2.5 rounded-full text-sm hover:shadow-lg"
                  >
                    Go to Friends
                  </button>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <button
                    key={conversation.user._id}
                    onClick={() => selectConversation(conversation)}
                    className={`w-full p-3 sm:p-5 transition text-left border-b ${
                      darkMode ? 'border-gray-700' : 'border-gray-50'
                    } ${
                      selectedConversation?.user._id === conversation.user._id
                        ? darkMode ? 'bg-gray-700' : 'bg-indigo-50'
                        : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-base sm:text-lg">
                          {conversation.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h3 className={`font-semibold text-sm sm:text-base truncate ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {conversation.user.name}
                          </h3>
                          {conversation.lastMessage && (
                            <span className={`text-xs ml-2 flex-shrink-0 ${
                              darkMode ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                              {formatTime(conversation.lastMessage.createdAt)}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs truncate mb-1 ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {conversation.user.major}
                        </p>
                        {conversation.lastMessage && (
                          <p className={`text-xs sm:text-sm truncate ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {conversation.lastMessage.content}
                          </p>
                        )}
                        {conversation.unreadCount > 0 && (
                          <span className="inline-block mt-1 bg-indigo-600 text-white text-xs px-2.5 py-0.5 rounded-full">
                            {conversation.unreadCount} new
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/*
            Chat area:
            - Mobile: full width, only shown when mobileChatOpen
            - sm+: flex-1, always shown
          */}
          <div className={`${
            mobileChatOpen ? 'flex' : 'hidden sm:flex'
          } flex-1 flex-col overflow-hidden`}>

            {!selectedConversation ? (
              <div className={`flex-1 flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <div className="text-center px-4">
                  <MessageCircle className={`w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 ${
                    darkMode ? 'text-gray-600' : 'text-gray-300'
                  }`} />
                  <h3 className={`text-lg sm:text-2xl font-semibold mb-2 sm:mb-3 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Select a conversation
                  </h3>
                  <p className={`text-sm sm:text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            ) : (
              <div className={`flex flex-col flex-1 overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>

                {/* Chat header with back button on mobile */}
                <div className={`flex-shrink-0 border-b-2 px-4 sm:px-8 py-3 sm:py-5 flex items-center gap-3 ${
                  darkMode ? 'border-gray-800' : 'border-gray-50'
                }`}>
                  {/* Back button — mobile only */}
                  <button
                    onClick={() => setMobileChatOpen(false)}
                    className={`sm:hidden p-1.5 rounded-lg transition ${
                      darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <ArrowLeft className="w-5 h-5" strokeWidth={2} />
                  </button>

                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-base sm:text-lg">
                      {selectedConversation.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm sm:text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedConversation.user.name}
                    </h3>
                    <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {selectedConversation.user.major}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-3 sm:space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <MessageCircle className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 ${
                          darkMode ? 'text-gray-600' : 'text-gray-300'
                        }`} />
                        <p className={`text-sm sm:text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {newChatUser
                            ? `Start a conversation with ${selectedConversation.user.name}!`
                            : 'Say hi to start the conversation!'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {messages.map((message) => {
                        const isMe = message.sender._id === user._id;
                        return (
                          <div key={message._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] sm:max-w-xs lg:max-w-md xl:max-w-lg rounded-2xl sm:rounded-3xl px-4 sm:px-5 py-2.5 sm:py-3 ${
                              isMe
                                ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white'
                                : darkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'
                            }`}>
                              <p className="text-sm leading-relaxed">{message.content}</p>
                              <p className={`text-xs mt-1 sm:mt-2 ${
                                isMe ? 'text-indigo-100' : darkMode ? 'text-gray-500' : 'text-gray-400'
                              }`}>
                                {formatTime(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Input */}
                <div className={`flex-shrink-0 border-t-2 px-3 sm:px-6 py-3 sm:py-4 ${
                  darkMode ? 'border-gray-800' : 'border-gray-50'
                }`} style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
                  <form onSubmit={handleSendMessage} className="flex gap-2 sm:gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className={`flex-1 px-3 sm:px-5 py-2.5 sm:py-4 border-2 rounded-xl sm:rounded-2xl text-sm sm:text-base ${
                        darkMode
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                          : 'bg-white border-gray-100 text-gray-900 placeholder-gray-400'
                      }`}
                    />
                    <button
                      type="submit"
                      disabled={sendingMessage || !newMessage.trim()}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-4 sm:px-8 py-2.5 sm:py-4 rounded-xl sm:rounded-2xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base whitespace-nowrap"
                    >
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">{sendingMessage ? 'Sending...' : 'Send'}</span>
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error toast */}
        {error && (
          <div className={`fixed bottom-20 md:bottom-8 right-4 sm:right-8 border-2 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-xl max-w-xs sm:max-w-md z-50 ${
            darkMode ? 'bg-red-900/90 border-red-700 text-red-200' : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <div className="flex items-center gap-2 sm:gap-3 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium">{error}</span>
              <button onClick={() => setError('')} className="ml-1 font-bold">✕</button>
            </div>
          </div>
        )}
      </div>
    </ProtectedPage>
  );
}