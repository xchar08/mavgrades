"use client";
import React, { useState } from "react";

export interface Course {
  subject_id: string;
  course_number: string;
  instructor1: string;
  section_number: string;
  semester: string;
  year: string;
  course_gpa: string;
  grades_count: string;
  grades_A: number;
  grades_B: number;
  grades_C: number;
  grades_D: number;
  grades_F: number;
  grades_I: number;
  grades_P: number;
  grades_Q: number;
  grades_W: number;
  grades_Z: number;
  grades_R: number;
}
interface SideBarProps {
  professors: string[];
  selectedProfessor: string | null;
  setSelectedProfessor: (professor: string | null) => void;
  years: string[];
  selectedYear: string | null;
  setSelectedYear: (year: string | null) => void;
  selectedCourse: string | null;
  setSelectedCourse: (course: string | null) => void;
  coursesToDisplay: any[];
  setCoursesToDisplay: (course: Course[]) => void;
  semesters: string[];
  selectedSemester: string | null;
  setSelectedSemester: (semester: string | null) => void;
  finalFilteredCourses: any[];
  selectedSection: any | null;
  setSelectedSection: (section: any | null) => void;
  routeType: "course" | "professor" | null;
}

const SideBar: React.FC<SideBarProps> = ({
  professors,
  selectedProfessor,
  setSelectedProfessor,
  years,
  selectedYear,
  selectedCourse,
  coursesToDisplay,
  setCoursesToDisplay,
  setSelectedCourse,
  setSelectedYear,
  semesters,
  selectedSemester,
  setSelectedSemester,
  finalFilteredCourses,
  selectedSection,
  setSelectedSection,
  routeType,
}) => {
  const [openProfessorAccordion, setOpenProfessorAccordion] = useState<
    number | null
  >(null);
  const [openCourseAccordion, setOpenCourseAccordion] = useState<number | null>(
    null
  );

  const toggleProfessorAccordion = (index: number, professor: string) => {
    setOpenProfessorAccordion(openProfessorAccordion === index ? null : index);
    setSelectedProfessor(professor);
  };

  const toggleCourseAccordion = (index: number, course: string) => {
    setOpenCourseAccordion(openCourseAccordion === index ? null : index);
    setSelectedCourse(course);
  };

  const selectedProfAndCourse = selectedProfessor && selectedCourse;

  const handleBackButtonClick = () => {
    if (routeType === "professor") {
      // If currently on professor route, reset to course selection
      setSelectedCourse(null);
      setSelectedYear(null);
      setSelectedSemester(null);
      setSelectedSection(null);
    } else if (routeType === "course") {
      // If currently on course route, reset to professor selection
      setSelectedProfessor(null);
      setSelectedYear(null);
      setSelectedSemester(null);
      setSelectedSection(null);
    }
  };

  return (
    <div className="flex flex-col w-1/3 pr-4 mt-10 bg-white bg-opacity-30 rounded-lg p-4 min-w-[320px]">
      {selectedProfAndCourse ? (
        <div>
          <h2 className="text-lg text-white font-semibold mb-2">{`Sections for Professor: ${selectedProfessor}`}</h2>

          {/* Year Dropdown */}
          <div className="mb-4">
            <label
              htmlFor="year"
              className="text-white block font-semibold mb-1"
            >
              Select Year:
            </label>
            <select
              id="year"
              value={selectedYear || ""}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setSelectedSection(null);
                setSelectedSemester(null);
              }}
              className="border p-2 rounded-lg w-full"
            >
              <option value="" disabled>
                Select a year
              </option>
              {years.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Semester Dropdown */}
          <div className="mb-4">
            <label
              htmlFor="semester"
              className="text-white block font-semibold mb-1"
            >
              Select Semester:
            </label>
            <select
              id="semester"
              value={selectedSemester || ""}
              onChange={(e) => {
                setSelectedSemester(e.target.value);
                setSelectedSection(null);
              }}
              className="border p-2 rounded-lg w-full"
              disabled={!selectedYear} // Disable if selectedYear is not set
            >
              <option value="" disabled>
                Select a semester
              </option>
              {semesters.map((semester, index) => (
                <option key={index} value={semester}>
                  {semester}
                </option>
              ))}
            </select>
          </div>

          {/* Section List */}
          {selectedYear && selectedSemester && (
            <ul className="space-y-2">
              {finalFilteredCourses
                .filter((course) => {
                  const [subjectId, courseNumber] = selectedCourse.split(" ");
                  return (
                    course.subject_id === subjectId &&
                    course.course_number === courseNumber
                  );
                })
                .map((course, index) => (
                  <li
                    key={index}
                    onClick={() => setSelectedSection(course)}
                    className={`p-2 rounded-lg shadow-sm cursor-pointer ${
                      selectedSection?.section_number === course.section_number
                        ? "bg-blue-200"
                        : "bg-white"
                    }`}
                  >
                    {course.semester} {course.year} Section:{" "}
                    {course.section_number}
                  </li>
                ))}
            </ul>
          )}

          <button
            onClick={handleBackButtonClick}
            className="mt-4 bg-gray-200 hover:bg-gray-200 hover:text-gray-500 font-bold py-2 px-4 rounded-l rounded-r"
          >
            {routeType === "course" ? "Back to professors" : "Back to courses"}
          </button>
        </div>
      ) : routeType === "course" ? (
        <ul className="space-y-4">
          {professors.map((professor, index) => (
            <li
              key={index}
              className="border p-4 rounded-lg shadow-sm cursor-pointer bg-white"
            >
              {/* Professor header to toggle accordion */}
              <div
                onClick={() => toggleProfessorAccordion(index, professor)}
                className="flex justify-between items-center"
              >
                <h2 className="text-lg font-semibold">{professor}</h2>
                <span className="text-gray-500">
                  {openProfessorAccordion === index ? "-" : "+"}
                </span>
              </div>

              {/* Professor Accordion Content (Show when open) */}
              {openProfessorAccordion === index && (
                <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                  {/* Additional details about the professor can go here */}
                  <p>Details for Professor {professor}</p>
                  {/* You can add more content here */}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : routeType === "professor" ? (
        <ul className="space-y-4">
          {coursesToDisplay.map((course, index) => (
            <li
              key={index}
              className="border p-4 rounded-lg shadow-sm cursor-pointer bg-gray-300"
            >
              {/* Course header to toggle accordion */}
              <div
                onClick={() =>
                  toggleCourseAccordion(
                    index,
                    `${course.subject_id} ${course.course_number}`
                  )
                }
                className="flex justify-between items-center"
              >
                <h2 className="text-lg font-semibold">{`${course.subject_id} ${course.course_number}`}</h2>
                <span className="text-gray-500">
                  {openCourseAccordion === index ? "-" : "+"}
                </span>
              </div>

              {/* Course Accordion Content (Show when open) */}
              {openCourseAccordion === index && (
                <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-semibold">
                    Instructor: {course.instructor1}
                  </h3>
                  <p>Course GPA: {course.course_gpa}</p>
                  <p>Total Grades Count: {course.grades_count}</p>
                  {/* Additional course details */}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default SideBar;
