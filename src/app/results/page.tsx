"use client";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; // Correct import

const ResultsPage = () => {
  const searchParams = useSearchParams(); // Use useSearchParams to get query parameters
  const course = searchParams.get('course'); // Get the course query parameter
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/courses/search?course=${encodeURIComponent(course)}`);
        const data = await response.json();
        console.log(data); // Log the fetched data
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    if (course) {
      fetchCourses();
    }
  }, [course]);

  // Extract distinct professors
  const professors = [...new Set(courses.map(course => course.instructor1))];

  // Filter courses for the selected professor
  const filteredCourses = selectedProfessor
    ? courses.filter(course => course.instructor1 === selectedProfessor)
    : [];

  // Extract distinct years and semesters from filtered courses
  const years = [...new Set(filteredCourses.map(course => course.year))];
  const semesters = [...new Set(filteredCourses.map(course => course.semester))];

  // Filter courses based on selected year and semester
  const finalFilteredCourses = filteredCourses.filter(course => {
    const matchesYear = selectedYear ? course.year === selectedYear : true;
    const matchesSemester = selectedSemester ? course.semester === selectedSemester : true;
    return matchesYear && matchesSemester;
  });

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Search Results for "{course}"</h1>
      {loading ? (
        <p>Loading...</p>
      ) : courses.length === 0 ? (
        <p>No results found for "{course}". Please try another search.</p>
      ) : (
        <div>
          {selectedProfessor ? (
            <div>
              <h2 className="text-lg font-semibold mb-2">{`Courses for Professor: ${selectedProfessor}`}</h2>

              {/* Year Dropdown */}
              <div className="mb-4">
                <label htmlFor="year" className="block font-semibold mb-1">Select Year:</label>
                <select
                  id="year"
                  value={selectedYear || ""}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="border p-2 rounded-lg w-full"
                >
                  <option value="" disabled>Select a year</option>
                  {years.map((year, index) => (
                    <option key={index} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Semester Dropdown */}
              <div className="mb-4">
                <label htmlFor="semester" className="block font-semibold mb-1">Select Semester:</label>
                <select
                  id="semester"
                  value={selectedSemester || ""}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="border p-2 rounded-lg w-full"
                >
                  <option value="" disabled>Select a semester</option>
                  {semesters.map((semester, index) => (
                    <option key={index} value={semester}>{semester}</option>
                  ))}
                </select>
              </div>

              {/* Display filtered courses based on selected year and semester */}
              <ul className="space-y-4 mt-4">
                {finalFilteredCourses.map((course, index) => (
                  <li key={index} className="border p-4 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold">{`${course.subject_id} ${course.course_number}`}</h2>
                    <p className="text-gray-600">Section: {course.section_number}</p>
                    <p className="text-gray-600">{`${course.year} ${course.semester}`}</p>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => {
                  setSelectedProfessor(null);
                  setSelectedYear(null);
                  setSelectedSemester(null);
                }} 
                className="mt-4 text-blue-500 underline"
              >
                Back to Professors
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {professors.map((professor, index) => (
                <li key={index} className="border p-4 rounded-lg shadow-sm cursor-pointer" onClick={() => setSelectedProfessor(professor)}>
                  <h2 className="text-lg font-semibold">{professor}</h2>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
