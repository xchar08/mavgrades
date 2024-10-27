import BarChart from "./BarChart";

const StatsCard = ({ selectedItems }: { selectedItems: Map<string, any> }) => {
  const aggregatedData = Array.from(selectedItems.values());

  const colorClasses = [
    "border-t-blue-400",
    "border-t-green-400",
    "border-t-orange-400",
    "border-t-teal-400",
    "border-t-rose-400",
    "border-t-yellow-400",
  ];

  return (
    <div className="w-2/3 pl-4 mt-10">
      {aggregatedData.length > 0 ? (
        <div className="flex flex-col p-4 rounded-lg shadow-md h-full gap-4 bg-gray-300 bg-opacity-30 mb-6">
          <h2 className="text-3xl mt-4 font-extrabold mb-4 text-center text-cyan-500 drop-shadow-md">
            {aggregatedData[0]?.subject_id && aggregatedData[0]?.course_number
              ? `${aggregatedData[0].subject_id} ${aggregatedData[0].course_number}`
              : "Course Information"}
          </h2>

          {/* Render differently depending on number of items */}
          {aggregatedData.length === 1 ? (
            <div className="flex flex-col gap-6 mr-0.5 ml-0.5">
              {/* Single pair, same layout */}
              <div className="flex flex-row gap-4 justify-evenly">
                {aggregatedData[0]?.instructor1 && (
                  <div
                    className={`flex flex-col bg-slate-100 p-3 gap-2 w-1/3 rounded-lg font-bold drop-shadow-lg border-t-4 ${colorClasses[0]} hover:drop-shadow-xl transition-transform ease-in-out duration-300`}
                  >
                    <span>PROFESSOR</span>
                    <span className="text-blue-500 text-lg">
                      {aggregatedData[0].instructor1}
                    </span>
                  </div>
                )}
                {aggregatedData[0]?.year && (
                  <div
                    className={`flex flex-col bg-slate-100 p-3 gap-2 w-1/3 rounded-lg font-bold drop-shadow-lg border-t-4 ${colorClasses[1]} hover:drop-shadow-xl transition-transform ease-in-out duration-300`}
                  >
                    <span>YEAR</span>
                    <span className="text-blue-500 text-lg">
                      {aggregatedData[0].year}
                    </span>
                  </div>
                )}
                {aggregatedData[0]?.semester && (
                  <div
                    className={`flex flex-col bg-slate-100 p-3 gap-2 w-1/3 rounded-lg font-bold drop-shadow-lg border-t-4 ${colorClasses[2]} hover:drop-shadow-xl transition-transform ease-in-out duration-300`}
                  >
                    <span>SEMESTER</span>
                    <span className="text-blue-500 text-lg">
                      {aggregatedData[0].semester}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-row gap-4 justify-evenly">
                {aggregatedData[0]?.section_number && (
                  <div
                    className={`flex flex-col bg-slate-100 p-3 gap-2 w-1/3 rounded-lg font-bold drop-shadow-lg border-t-4 ${colorClasses[3]} hover:drop-shadow-xl transition-transform ease-in-out duration-300`}
                  >
                    <span>SECTION</span>
                    <span className="text-blue-500 text-lg">
                      {aggregatedData[0].section_number}
                    </span>
                  </div>
                )}
                {aggregatedData[0]?.course_gpa && (
                  <div
                    className={`flex flex-col bg-slate-100 p-3 gap-2 w-1/3 rounded-lg font-bold drop-shadow-lg border-t-4 ${colorClasses[4]} hover:drop-shadow-xl transition-transform ease-in-out duration-300`}
                  >
                    <span>AVERAGE GPA</span>
                    <span className="text-blue-500 text-lg">
                      {aggregatedData[0].course_gpa}
                    </span>
                  </div>
                )}
                {aggregatedData[0]?.grades_count && (
                  <div
                    className={`flex flex-col bg-slate-100 p-3 gap-2 w-1/3 rounded-lg font-bold drop-shadow-lg border-t-4 ${colorClasses[5]} hover:drop-shadow-xl transition-transform ease-in-out duration-300`}
                  >
                    <span>TOTAL STUDENTS</span>
                    <span className="text-blue-500 text-lg">
                      {aggregatedData[0].grades_count}
                    </span>
                  </div>
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
                  <div className="flex flex-col w-1/5 font-bold">
                    <span>PROFESSOR</span>
                    <span className="text-blue-500 text-lg">
                      {sectionData.instructor1}
                    </span>
                  </div>
                )}
                {sectionData?.year && (
                  <div className="flex flex-col w-1/5 font-bold">
                    <span>SEMESTER</span>
                    <span className="text-blue-500 text-lg">
                    {sectionData.semester} {sectionData.year}
                    </span>
                  </div>
                )}
                {sectionData?.semester && (
                  <div className="flex flex-col w-1/5 font-bold">
                    <span>SECTION</span>
                    <span className="text-blue-500 text-lg">
                    {sectionData.section_number}
                    </span>
                  </div>
                )}
                {sectionData?.section_number && (
                  <div className="flex flex-col w-1/5 font-bold">
                    <span>STUDENTS</span>
                    <span className="text-blue-500 text-lg">
                      {sectionData.grades_count}
                    </span>
                  </div>
                )}
                {sectionData?.course_gpa && (
                  <div className="flex flex-col w-1/5 font-bold">
                    <span>AVERAGE GPA</span>
                    <span className="text-blue-500 text-lg">
                      {sectionData.course_gpa}
                    </span>
                  </div>
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
