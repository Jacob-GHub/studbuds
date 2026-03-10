// app/components/course-detail/LogStudySessionModal.jsx
'use client';

import { useState, useEffect } from 'react';
import { useGamification } from '../../context/GamificationContext';

const EMPTY_FORM = {
  duration: '', topic: '', subtopics: '', whatILearned: '',
  difficulty: 'medium', studyTechnique: '', location: '',
};

const inputCls = 'w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:bg-gray-50 text-sm sm:text-base';
const labelCls = 'block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2';

export default function LogStudySessionModal({ isOpen, onClose, onSessionLogged, classId, token, baseUrl }) {
  const { handleXPAward } = useGamification();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    if (isOpen) { setError(''); setSuccess(false); }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(false);
    if (!formData.duration || !formData.topic || !formData.whatILearned) {
      setError('Duration, topic, and what you learned are required');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        duration: parseInt(formData.duration),
        subtopics: formData.subtopics
          ? formData.subtopics.split(',').map(s => s.trim()).filter(Boolean)
          : [],
      };
      const res = await fetch(`${baseUrl}/classes/${classId}/study-sessions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.xpAwarded) handleXPAward(data.xpAwarded);
        setSuccess(true);
        setTimeout(() => { onSessionLogged(); setFormData(EMPTY_FORM); }, 1500);
      } else {
        setError(data.message || 'Failed to log study session');
      }
    } catch {
      setError('Failed to log study session. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
      onClick={(e) => { if (e.target === e.currentTarget && !submitting) onClose(); }}
    >
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" />

      {/*
        Mobile: slides up from bottom (sheet style), full width, max 92vh
        sm+: centered modal, max-w-2xl
      */}
      <div className="relative bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto animate-slideUp">

        {/* Drag handle (mobile only) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-indigo-600 to-purple-600 text-white px-5 sm:px-6 py-4 sm:py-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold flex items-center gap-2">
                <span>📚</span> Log Study Session
              </h2>
              <p className="text-indigo-100 text-xs sm:text-sm mt-0.5">Track your learning progress</p>
            </div>
            <button
              onClick={onClose}
              disabled={submitting}
              type="button"
              className="text-white hover:bg-white/20 rounded-full p-1.5 sm:p-2 transition disabled:opacity-50"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5">
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Study session logged successfully!
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          {/* Duration + Difficulty */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className={labelCls}>Duration (min) *</label>
              <input type="number" name="duration" value={formData.duration} onChange={handleChange}
                min="1" placeholder="60" required disabled={submitting} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Difficulty *</label>
              <select name="difficulty" value={formData.difficulty} onChange={handleChange}
                disabled={submitting} className={inputCls}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="challenging">Challenging</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Topic *</label>
            <input type="text" name="topic" value={formData.topic} onChange={handleChange}
              placeholder="e.g., Dynamic Programming" required disabled={submitting} className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Subtopics (comma-separated)</label>
            <input type="text" name="subtopics" value={formData.subtopics} onChange={handleChange}
              placeholder="e.g., Fibonacci, Memoization" disabled={submitting} className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>What I Learned *</label>
            <textarea name="whatILearned" value={formData.whatILearned} onChange={handleChange}
              placeholder="Describe what you learned and key takeaways..."
              required disabled={submitting} rows="3" className={inputCls} />
            <p className="text-xs text-gray-500 mt-1">{formData.whatILearned.length}/1000</p>
          </div>

          <div>
            <label className={labelCls}>Study Technique</label>
            <select name="studyTechnique" value={formData.studyTechnique} onChange={handleChange}
              disabled={submitting} className={inputCls}>
              <option value="">Select a technique</option>
              {['Pomodoro','Active Recall','Spaced Repetition','Practice Problems',
                'Group Discussion','Video Lectures','Reading','Other'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange}
              placeholder="e.g., Library 3rd floor" disabled={submitting} className={inputCls} />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
            <button type="button" onClick={onClose} disabled={submitting}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition disabled:opacity-50 text-sm sm:text-base">
              Cancel
            </button>
            <button type="submit" disabled={submitting || success}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition disabled:opacity-50 shadow-md text-sm sm:text-base">
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Logging...
                </span>
              ) : success ? '✓ Logged!' : 'Log Study Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}