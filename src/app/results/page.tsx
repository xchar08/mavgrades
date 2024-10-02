"use client"
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; // Correct import

const ResultsPage = () => {
  const searchParams = useSearchParams(); // Use useSearchParams to get query parameters
  const course = searchParams.get('course'); // Get the course query parameter
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Search Results for "{course}"</h1>
      {loading ? (
        <p>Loading...</p>
      ) : courses.length === 0 ? (
        <p>No results found for "{course}". Please try another search.</p>
      ) : (
        <ul className="space-y-4">
          {courses.map((course, index) => (
            <li key={index} className="border p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold">{`${course.subject_id} ${course.course_number}`}</h2>
              <p className="text-gray-600">Instructor: {course.instructor1}</p>
              <p className="text-gray-600">Section: {course.section_number}</p>
              <p className="text-gray-600">{`${course.year} ${course.semester}`}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ResultsPage;
