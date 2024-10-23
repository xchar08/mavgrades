import React, { useState, useEffect } from "react";
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
  selectedItems: Map<string, any>;
  setSelectedItems: React.Dispatch<React.SetStateAction<Map<string, any>>>;
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
  selectedItems,
  setSelectedItems,
}) => {
  const [openProfessorAccordion, setOpenProfessorAccordion] = useState<
    number | null
  >(null);
  const [openCourseAccordion, setOpenCourseAccordion] = useState<number | null>(
    null
  );

  // HashMap state to store selected sections
  //   const [selectedItems, setSelectedItems] = useState<Map<string, any>>(
  //     new Map()
  //   );

  // State to store whether a checkbox has been checked for a professor/course
  const [checkboxState, setCheckboxState] = useState<Map<string, boolean>>(
    new Map()
  );

  // State to track if selections for year, semester, and section are complete for each professor/course
  const [isSelectionComplete, setIsSelectionComplete] = useState<
    Map<string, boolean>
  >(new Map());

  // Function to handle checkbox state
  const handleCheckboxChange = (isChecked: boolean, key: string) => {
    if (isChecked) {
      if (selectedItems.size >= 3) {
        alert("You can only select up to 3 for comparison.");
        return;
      }
      // Ensure that selections are only made for the current accordion with all selections set
      const selectionsComplete = isSelectionComplete.get(key);

      if (selectionsComplete) {
        setSelectedItems((prevMap) =>
          new Map(prevMap).set(key, selectedSection)
        );
      } else {
        // Set the value as null if selections are incomplete
        setSelectedItems((prevMap) => new Map(prevMap).set(key, null));
      }
    } else {
      // Remove the key from the map when unchecked
      setSelectedItems((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.delete(key);
        return newMap;
      });
    }

    // Store the checkbox state
    setCheckboxState((prevMap) => new Map(prevMap).set(key, isChecked));
  };

  // Effect to update when year, semester, or section changes for a particular professor/course
  useEffect(() => {
    if (selectedProfessor) {
      const allSelectionsMade =
        selectedYear && selectedSemester && selectedSection;

      // Update the selection completion map
      setIsSelectionComplete((prevMap) =>
        new Map(prevMap).set(selectedProfessor, allSelectionsMade)
      );

      // If all selections are made and the professor is checked, update the selectedItems map
      if (checkboxState.get(selectedProfessor) && allSelectionsMade) {
        setSelectedItems((prevMap) =>
          new Map(prevMap).set(selectedProfessor, selectedSection)
        );
      }
    }

    if (selectedCourse) {
      const allSelectionsMade =
        selectedYear && selectedSemester && selectedSection;

      // Update the selection completion map
      setIsSelectionComplete((prevMap) =>
        new Map(prevMap).set(selectedCourse, allSelectionsMade)
      );

      // If all selections are made and the course is checked, update the selectedItems map
      if (checkboxState.get(selectedCourse) && allSelectionsMade) {
        setSelectedItems((prevMap) =>
          new Map(prevMap).set(selectedCourse, selectedSection)
        );
      }
    }
  }, [
    selectedYear,
    selectedSemester,
    selectedSection,
    selectedProfessor,
    selectedCourse,
    checkboxState,
  ]);

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
                  checked={checkboxState.get(professor) || false}
                  onChange={(e) => {
                    handleCheckboxChange(e.target.checked, professor);
                    toggleProfessorAccordion(index, professor);
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
                  checked={
                    checkboxState.get(
                      `${course.subject_id} ${course.course_number}`
                    ) || false
                  }
                  onChange={(e) => {
                    handleCheckboxChange(
                      e.target.checked,
                      `${course.subject_id} ${course.course_number}`
                    );
                    toggleCourseAccordion(
                      index,
                      `${course.subject_id} ${course.course_number}`
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
                  <h2 className="text-lg font-semibold">
                    {`${course.subject_id} ${course.course_number}`}
                  </h2>
                  <span className="text-gray-500">
                    {openCourseAccordion === index ? "-" : "+"}
                  </span>
                </div>
              </div>

              {openCourseAccordion === index && (
                <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                  <SelectionDropdowns
                    selectedProfessor={course.instructor1}
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
      ) : null}
    </div>
  );
};

export default SideBar;
