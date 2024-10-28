import { useState, useEffect, useRef } from "react";
import BarChart from "./BarChart";
import { GradesInfoCard } from "./GradesInfoCard";

const StatsCard = ({ selectedItems }: { selectedItems: Map<string, any> }) => {
  const [showInfoBox, setShowInfoBox] = useState(false);
  const infoBoxRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const aggregatedData = Array.from(selectedItems.values());

  const colorClasses = [
    "border-t-blue-400",
    "border-t-green-400",
    "border-t-orange-400",
    "border-t-teal-400",
    "border-t-rose-400",
    "border-t-yellow-400",
  ];

  const InfoBox = ({
    label,
    value,
    colorClass,
  }: {
    label: string;
    value: string | number;
    colorClass: string;
  }) => {
    return (
      <div
        className={`flex flex-col bg-slate-100 p-3 gap-2 w-1/3 rounded-lg font-bold drop-shadow-lg border-t-4 ${colorClass} hover:drop-shadow-xl transition-transform ease-in-out duration-300`}
      >
        <span>{label}</span>
        <span className="text-blue-500 text-lg">{value}</span>
      </div>
    );
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showInfoBox &&
        infoBoxRef.current &&
        !infoBoxRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowInfoBox(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showInfoBox]);

  return (
    <div className="w-2/3 pl-4 mt-10 relative">
      {aggregatedData.length > 0 && aggregatedData[0] ? (
        <div className="flex flex-col p-4 rounded-lg shadow-md h-full gap-4 bg-gray-300 bg-opacity-30 mb-6 relative">
          {/* Info Button */}
          <button
            ref={buttonRef}
            className="absolute top-4 right-4 bg-cyan-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold"
            title="Info"
            onClick={() => setShowInfoBox((prev) => !prev)}
          >
            i
          </button>

          {/* Info Box Modal */}
          {showInfoBox && (
            <div
              ref={infoBoxRef}
              className="absolute top-12 right-4 bg-white p-4 rounded-lg shadow-lg w-72 border border-gray-300 z-10"
            >
              <GradesInfoCard />
            </div>
          )}

          <h2 className="text-3xl mt-4 font-extrabold mb-4 text-center text-cyan-500 drop-shadow-md">
            {aggregatedData[0]?.subject_id && aggregatedData[0]?.course_number
              ? `${aggregatedData[0].subject_id} ${aggregatedData[0].course_number}`
              : "Course Information"}
          </h2>

          {/* Render differently depending on the number of items */}
          {aggregatedData.length === 1 ? (
            <div className="flex flex-col gap-6 mr-0.5 ml-0.5">
              <div className="flex flex-row gap-4 justify-evenly">
                {aggregatedData[0]?.instructor1 && (
                  <InfoBox
                    label="PROFESSOR"
                    value={aggregatedData[0].instructor1}
                    colorClass={colorClasses[0]}
                  />
                )}
                {aggregatedData[0]?.year && (
                  <InfoBox
                    label="SECTION"
                    value={`${aggregatedData[0].semester} ${aggregatedData[0].year}-${aggregatedData[0]?.section_number}`}
                    colorClass={colorClasses[1]}
                  />
                )}
                {aggregatedData[0]?.grades_count && (
                  <InfoBox
                    label="TOTAL STUDENTS"
                    value={aggregatedData[0].grades_count}
                    colorClass={colorClasses[2]}
                  />
                )}
              </div>
              <div className="flex flex-row gap-4 justify-evenly">
                {aggregatedData[0]?.section_number && (
                  <InfoBox
                    label="PASS RATE"
                    value={`${Math.ceil(
                      (Number(aggregatedData[0].grades_A) +
                       Number(aggregatedData[0].grades_B) +
                       Number(aggregatedData[0].grades_C)) /
                       Number(aggregatedData[0].grades_count) * 100
                    )}%`}
                    colorClass={colorClasses[3]}
                  />
                )}
                {aggregatedData[0]?.course_gpa && (
                  <InfoBox
                    label="AVERAGE GRADE"
                    value={Math.floor(aggregatedData[0].course_gpa*25) + `%`}
                    colorClass={colorClasses[4]}
                  />
                )}
                {aggregatedData[0]?.grades_count && (
                  <InfoBox
                    label="WITHDRAWAL RATE"
                    value={`${Math.ceil(Number(aggregatedData[0].grades_W)/Number(aggregatedData[0].grades_count) * 100)}%`}
                    colorClass={colorClasses[5]}
                  />
                )}
              </div>
            </div>
          ) : (
            // Multiple items, display as lines
            aggregatedData.map((sectionData, index) => (
              <div
                key={index}
                className={`flex flex-row justify-evenly p-3 rounded-lg drop-shadow-lg bg-slate-100 border-t-4 ${
                  colorClasses[index % colorClasses.length]
                } hover:drop-shadow-xl transition-transform ease-in-out duration-300 mb-4`}
              >
                {sectionData?.instructor1 && (
                  <InfoBox
                    label="PROFESSOR"
                    value={sectionData.instructor1}
                    colorClass=""
                  />
                )}
                {sectionData?.year && (
                  <InfoBox
                    label="SECTION"
                    value={`${sectionData.semester} ${sectionData.year}-${sectionData.section_number}`}
                    colorClass=""
                  />
                )}
                {sectionData?.grades_count && (
                  <InfoBox
                    label="TOTAL STUDENTS"
                    value={sectionData.grades_count}
                    colorClass=""
                  />
                )}
                {sectionData?.section_number && (
                  <InfoBox
                    label="PASS RATE"
                    value={`${Math.ceil(
                      ((Number(sectionData.grades_A) +
                        Number(sectionData.grades_B) +
                        Number(sectionData.grades_C)) /
                        Number(sectionData.grades_count)) * 100
                    )}%`}
                    colorClass=""
                  />
                )}
                {sectionData?.course_gpa && (
                  <InfoBox
                    label="AVERAGE GRADE"
                    value={`${Math.floor(sectionData.course_gpa * 25)}%`}
                    colorClass=""
                  />
                )}
              </div>
            ))
          )}

          {/* Pass the grades and colors to the BarChart */}
          <BarChart grades={aggregatedData} colors={colorClasses} />
        </div>
      ) : (
        <div className="bg-gray-300 bg-opacity-30 rounded-lg shadow-md p-4 m-4 text-center">
          <p className="text-white">
            Select a professor or course to see more information.
          </p>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
