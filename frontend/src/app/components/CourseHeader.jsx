'use client';

export default function CourseHeader({ code, name, term, instructor, studentCount }) {
  return (
    <div className="bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 rounded-xl p-5 sm:p-8 mb-4 sm:mb-6 text-white shadow-lg">
      <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-3 leading-tight">
        {code}: {name}
      </h1>
      {/* Stack vertically on mobile, inline with separators on sm+ */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-1 sm:gap-3 text-sm sm:text-base text-indigo-100">
        {term && <span>{term}</span>}
        {instructor && (
          <>
            <span className="hidden sm:inline">•</span>
            <span>Taught by {instructor}</span>
          </>
        )}
        <span className="hidden sm:inline">•</span>
        <span>{studentCount} students enrolled</span>
      </div>
    </div>
  );
}