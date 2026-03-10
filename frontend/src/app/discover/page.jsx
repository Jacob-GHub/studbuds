// app/discover/page.jsx
'use client';

import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import { useEffect, useState } from 'react';
import ProtectedPage from '../components/ProtectedPage';
import LoadingScreen from '../components/LoadingScreen';
import ClassCard from '../components/ClassCard';
import PageHeader from '../components/PageHeader';
import Pagination from '../components/Pagination';
import { useClasses } from '../hooks/useClasses';
import { usePagination } from '../hooks/usePagination';
import { Search, Filter, X } from 'lucide-react';

export default function DiscoverPage() {
  const { token } = useAuth();
  const { darkMode } = useDarkMode();

  const { classes: allClasses, loading } = useClasses(token);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [departments, setDepartments] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const uniqueDepts = [...new Set(
      allClasses.filter(c => c.department).map(c => c.department)
    )].sort();
    setDepartments(uniqueDepts);
  }, [allClasses]);

  const filteredClasses = allClasses.filter(cls => {
    const matchesSearch =
      cls.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cls.description && cls.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDepartment =
      selectedDepartment === 'all' || cls.department === selectedDepartment;

    let matchesType = true;
    if (selectedType === 'catalog')      matchesType = !cls.isUserCreated;
    else if (selectedType === 'user-created') matchesType = cls.isUserCreated;

    return matchesSearch && matchesDepartment && matchesType;
  });

  const { currentItems: paginatedClasses, currentPage, totalPages, goToPage } =
    usePagination(filteredClasses);

  const hasActiveFilters = selectedDepartment !== 'all' || selectedType !== 'all';
  const activeFilterCount = [selectedDepartment !== 'all', selectedType !== 'all'].filter(Boolean).length;

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('all');
    setSelectedType('all');
  };

  if (loading) return <LoadingScreen />;

  return (
    <ProtectedPage>
      <div className="pb-24 md:pb-0">
        <PageHeader
          title="Discover Courses"
          subtitle={`Browse ${allClasses.length} courses and start your learning journey`}
        />

        {/* ── Search & Filters ── */}
        <div className="mb-8 sm:mb-12">

          {/* Search bar */}
          <div className="relative mb-3 sm:mb-4">
            <Search
              className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}
              strokeWidth={2}
            />
            {/* Clear button */}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className={`absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-0.5 rounded-full transition ${
                  darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                }`}
                aria-label="Clear search"
              >
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            )}
            <input
              type="text"
              placeholder="Search by name, code, or description…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 sm:pl-12 pr-9 sm:pr-12 py-3 sm:py-4 border-2 rounded-xl sm:rounded-2xl focus:outline-none transition text-sm sm:text-lg ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-indigo-500'
                  : 'bg-white border-gray-100 text-gray-900 placeholder-gray-400 focus:border-indigo-300'
              }`}
            />
          </div>

          {/* Filter toggle row */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all text-sm sm:text-base ${
                showFilters || hasActiveFilters
                  ? darkMode
                    ? 'bg-indigo-900/50 text-indigo-300'
                    : 'bg-indigo-50 text-indigo-600'
                  : darkMode
                  ? 'text-gray-400 hover:bg-gray-800'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" strokeWidth={2} />
              <span className="font-medium">Filters</span>
              {hasActiveFilters && (
                <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
              <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {filteredClasses.length}
              </span>{' '}
              courses
            </p>
          </div>

          {/* Collapsible filter panel */}
          {showFilters && (
            <div className={`mt-3 sm:mt-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'
            }`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Department */}
                <div>
                  <label className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Department
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-xl focus:outline-none transition text-sm sm:text-base ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500'
                        : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-300'
                    }`}
                  >
                    <option value="all">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* Course Type */}
                <div>
                  <label className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Course Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-xl focus:outline-none transition text-sm sm:text-base ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500'
                        : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-300'
                    }`}
                  >
                    <option value="all">All Courses</option>
                    <option value="catalog">UCR Catalog Only</option>
                    <option value="user-created">User Created Only</option>
                  </select>
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className={`mt-3 sm:mt-4 text-xs sm:text-sm font-medium ${
                    darkMode
                      ? 'text-indigo-400 hover:text-indigo-300'
                      : 'text-indigo-600 hover:text-indigo-700'
                  }`}
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Results ── */}
        {paginatedClasses.length === 0 ? (
          <div className={`rounded-2xl sm:rounded-3xl p-10 sm:p-20 text-center ${
            darkMode ? 'bg-gray-800' : 'bg-gray-50'
          }`}>
            <Search
              className={`w-12 h-12 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 ${
                darkMode ? 'text-gray-600' : 'text-gray-300'
              }`}
              strokeWidth={1.5}
            />
            <h3 className={`text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              No courses found
            </h3>
            <p className={`mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-lg ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {searchTerm || hasActiveFilters
                ? 'Try adjusting your search or filters'
                : 'No courses available yet'}
            </p>
            {(searchTerm || hasActiveFilters) && (
              <button
                onClick={clearFilters}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:shadow-lg hover:shadow-indigo-500/30 transition-all text-sm sm:text-base"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/*
              Mobile:  1 column
              sm:      2 columns
              lg:      3 columns
              xl:      4 columns
            */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12">
              {paginatedClasses.map((course) => (
                <ClassCard key={course._id} course={course} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              darkMode={darkMode}
            />
          </>
        )}
      </div>
    </ProtectedPage>
  );
}