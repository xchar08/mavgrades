"use client";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from '../components/SearchBar';
import BarChart from '../components/BarChart';
import SideBar from '../components/SideBar';
import { IoHomeOutline } from 'react-icons/io5';
import {Poppins, Montserrat} from 'next/font/google';


const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'], // Specify weights you need
  variable: '--font-poppins',
});
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-montserrat',
});

const ResultsPage = () => {
  const searchParams = useSearchParams();
  const course = searchParams.get('course');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null); // For displaying more info

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        if (course) {
          const response = await fetch(`/api/courses/search?course=${encodeURIComponent(course)}`);
          const data = await response.json();
          setCourses(data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    if (course) {
      fetchCourses();
      setSelectedProfessor(null);
      setSelectedYear(null);
      setSelectedSemester(null);
      setSelectedSection(null); // Reset section selection too
    }
  }, [course]);

  const professors = [...new Set(courses.map(course => course.instructor1))];
  const filteredCourses = selectedProfessor
    ? courses.filter(course => course.instructor1 === selectedProfessor)
    : [];
  const years = [...new Set(filteredCourses.map(course => course.year))];
  const semesters = [...new Set(filteredCourses.map(course => course.semester))];

  const finalFilteredCourses = filteredCourses.filter(course => {
    const matchesYear = selectedYear ? course.year === selectedYear : true;
    const matchesSemester = selectedSemester ? course.semester === selectedSemester : true;
    return matchesYear && matchesSemester;
  }).reduce((unique, item) => {
    return unique.some(course => course.section_number === item.section_number) ? unique : [...unique, item];
  }, []);

  const handleProfessorClick = (professor) => {
    setSelectedProfessor(professor);
    setSelectedYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);
  };

  return (
    <div className="max-w-7xl mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <IoHomeOutline
          onClick={() => (window.location.href = '/')}
          className="text-2xl cursor-pointer ml-4 mt-1"
          aria-label="Home"
        />
        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={() => (window.location.href = '/')}
        >
          <h1 className="text-2xl font-montserrat">
            <span className={`${poppins.className} font-bold`}>UTA</span>
            <span className={`${montserrat.className} font-normal`}> GRADES</span>
          </h1>
        </div>
        <div className="w-8"></div>
      </div>
      {/* SearchBar always at the top */}
      <SearchBar initialValue={course || ''} />

      {loading ? (
        <p>Loading...</p>
      ) : courses.length === 0 ? (
        <p>No results found for "{course}". Please try another search.</p>
      ) : (
        <div className="flex">
          {/* Sidebar */}
          <SideBar
            professors={professors}
            selectedProfessor={selectedProfessor}
            setSelectedProfessor={handleProfessorClick}
            years={years}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            semesters={semesters}
            selectedSemester={selectedSemester}
            setSelectedSemester={setSelectedSemester}
            finalFilteredCourses={finalFilteredCourses}
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
          />

          {/* Right content area */}
          <div className="w-2/3 pl-4 mt-16">
            {selectedSection ? (
              <div className="border p-4 rounded-lg shadow-md h-full">
                <h2 className="text-2xl font-semibold mb-4">{`${selectedSection.subject_id} ${selectedSection.course_number}`}</h2>
                <p><strong>Professor:</strong> {selectedSection.instructor1}</p>
                <p><strong>Year:</strong> {selectedSection.year}</p>
                <p><strong>Semester:</strong> {selectedSection.semester}</p>
                <p><strong>Section:</strong> {selectedSection.section_number}</p>
                <p><strong>Average GPA:</strong> {selectedSection.course_gpa}</p>
                <p><strong>Total Students:</strong> {selectedSection.grades_count}</p>

                <div className="mt-8">
                  <BarChart grades={selectedSection} />
                </div>
              </div>
            ) : (
              <p>{selectedProfessor 
                    ? "Select Year, Semester, and Section to see more information." 
                    : "Select a Professor to see more information."
                }
              </p>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;