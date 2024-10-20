"use client";
import React, { useState } from "react";
import SelectionDropdowns from "./SelectionDropdowns";

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

  return (
    <div className="flex flex-col w-1/3 pr-4 mt-10 bg-white bg-opacity-30 rounded-lg p-4 min-w-[320px]">
      {routeType === "course" ? (
        <ul className="space-y-4">
          {professors.map((professor, index) => (
            <li
              key={index}
              className="border p-4 rounded-lg shadow-sm cursor-pointer bg-white"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  onChange={(e) => {
                    // TODO: Handle checkbox change
                    console.log(
                      `Checkbox for ${professor} is ${e.target.checked}`
                    );
                  }}
                />
                <div
                  onClick={() => toggleProfessorAccordion(index, professor)}
                  className="flex justify-between items-center flex-1"
                >
                  <h2 className="text-lg font-semibold">{professor}</h2>
                  <span className="text-gray-500">
                    {openProfessorAccordion === index ? "-" : "+"}
                  </span>
                </div>
              </div>

              {openProfessorAccordion === index && (
                <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                  {/* Render SelectionDropdowns when a professor accordion is open */}
                  <SelectionDropdowns
                    selectedProfessor={professor}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    selectedSemester={selectedSemester}
                    setSelectedSemester={setSelectedSemester}
                    finalFilteredCourses={finalFilteredCourses}
                    selectedCourse={selectedCourse || ""}
                    selectedSection={selectedSection}
                    setSelectedSection={setSelectedSection}
                    years={years}
                    semesters={semesters}
                  />
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
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  onChange={(e) => {
                    // TODO: Handle checkbox change
                    console.log(
                      `Checkbox for ${course.subject_id} ${course.course_number} is ${e.target.checked}`
                    );
                  }}
                />
                <div
                  onClick={() =>
                    toggleCourseAccordion(
                      index,
                      `${course.subject_id} ${course.course_number}`
                    )
                  }
                  className="flex justify-between items-center flex-1"
                >
                  <h2 className="text-lg font-semibold">{`${course.subject_id} ${course.course_number}`}</h2>
                  <span className="text-gray-500">
                    {openCourseAccordion === index ? "-" : "+"}
                  </span>
                </div>
              </div>

              {openCourseAccordion === index && (
                <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                  {/* Render SelectionDropdowns when a course accordion is open */}
                  <SelectionDropdowns
                    selectedProfessor={selectedProfessor || ""}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    selectedSemester={selectedSemester}
                    setSelectedSemester={setSelectedSemester}
                    finalFilteredCourses={finalFilteredCourses}
                    selectedCourse={`${course.subject_id} ${course.course_number}`}
                    selectedSection={selectedSection}
                    setSelectedSection={setSelectedSection}
                    years={years}
                    semesters={semesters}
                  />
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
