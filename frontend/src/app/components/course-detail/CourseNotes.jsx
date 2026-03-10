// app/components/course-detail/CourseNotes.jsx
'use client';

import { useState, useEffect } from 'react';
import AddNoteModal from './AddNoteModal';
import { useDarkMode } from '../../context/DarkModeContext';

export default function CourseNotes({ classId, token, baseUrl }) {
  const { darkMode } = useDarkMode();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => { fetchNotes(); }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch(`${baseUrl}/classes/${classId}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setNotes(data.notes || []);
    } catch { console.error('Error fetching notes'); }
    finally { setLoading(false); }
  };

  const handleNoteUploaded = () => { setShowAddModal(false); fetchNotes(); };

  const handleDownload = async (note) => {
    try {
      const response = await fetch(note.fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = note.fileName;
      document.body.appendChild(a); a.click();
      window.URL.revokeObjectURL(url); document.body.removeChild(a);
      await fetch(`${baseUrl}/notes/${note._id}/download`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch { console.error('Error downloading'); }
  };

  return (
    <>
      <div className={`rounded-xl border ${darkMode ? 'bg-gray-900 border-gray-700 shadow-none' : 'bg-white border-gray-100 shadow-sm'}`}>

        {/* Header */}
        <div className={`px-4 sm:px-6 py-4 sm:py-5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className={`text-base sm:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Course Notes
              </h2>
              <p className={`text-xs sm:text-sm mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {notes.length} {notes.length === 1 ? 'note' : 'notes'} shared
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3 sm:px-6 py-2 sm:py-3 rounded-lg transition shadow-md hover:shadow-lg flex items-center gap-1.5 text-sm sm:text-base"
            >
              <span className="text-base sm:text-xl leading-none">+</span>
              <span className="hidden sm:inline">Add Note</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* Notes list */}
        <div className="p-4 sm:p-6">
          {loading ? (
            <div className="text-center py-10 sm:py-12">
              <div className={`animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 mx-auto ${
                darkMode ? 'border-indigo-400' : 'border-indigo-600'
              }`} />
              <p className={`mt-3 sm:mt-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Loading notes...
              </p>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-10 sm:py-12">
              <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">📝</div>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                No notes yet
              </h3>
              <p className={`mb-4 sm:mb-6 text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Be the first to share your notes with the class!
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg transition inline-flex items-center gap-2 text-sm sm:text-base"
              >
                <span className="text-base sm:text-xl leading-none">+</span>
                Upload First Note
              </button>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className={`border rounded-lg p-3 sm:p-4 transition hover:shadow-sm ${
                    darkMode
                      ? 'border-gray-700 hover:border-indigo-600 bg-gray-800'
                      : 'border-gray-200 hover:border-indigo-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold text-sm sm:text-base mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {note.title}
                      </h3>
                      {note.description && (
                        <p className={`text-xs sm:text-sm mb-2 sm:mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {note.description}
                        </p>
                      )}
                      {/* Meta — wraps on mobile */}
                      <div className={`flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        <span className="flex items-center gap-1">
                          <span>👤</span>
                          <span className="font-medium">{note.uploadedBy?.name || 'Anonymous'}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span>📅</span>
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>⬇️</span>
                          {note.downloadCount} downloads
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(note)}
                      className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition text-xs sm:text-sm font-medium"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddNoteModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onNoteUploaded={handleNoteUploaded}
        classId={classId}
        token={token}
        baseUrl={baseUrl}
      />
    </>
  );
}