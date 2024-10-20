import BarChart from "./BarChart";

const StatsCard = ({
  selectedSection,
  selectedProfessor,
}: {
  selectedSection: any;
  selectedProfessor: any;
}) => {
  return (
    <div className="w-2/3 pl-4 mt-10">
      {selectedSection ? (
        <div className="flex flex-col p-4 rounded-lg shadow-md h-full gap-4 bg-gray-300 bg-opacity-30">
          <h2 className="text-3xl mt-4 font-extrabold mb-4 text-center text-cyan-500 drop-shadow-md">{`${selectedSection.subject_id} ${selectedSection.course_number}`}</h2>
          <div className="flex flex-col gap-6 mr-0.5 ml-0.5">
            <div className="flex flex-row gap-4 justify-evenly">
              <div className="flex flex-col bg-slate-100 p-3 gap-2 w-1/3 rounded-lg font-bold hover:-translate-y-1 drop-shadow-lg border-t-blue-400 border-t-4 hover:drop-shadow-xl transition-transform ease-in-out duration-300">
                <span>PROFESSOR</span>
                <span className="text-blue-500 text-lg">
                  {selectedSection.instructor1}
                </span>
              </div>
              <div className="flex flex-col bg-slate-100 p-3 gap-2 w-1/3 rounded-lg font-bold hover:-translate-y-1 drop-shadow-lg border-t-green-400 border-t-4 hover:drop-shadow-xl transition-transform ease-in-out duration-300">
                <span>YEAR</span>
                <span className="text-blue-500 text-lg">
                  {selectedSection.year}
                </span>
              </div>
              <div className="flex flex-col bg-slate-100 p-3 gap-2 w-1/3 rounded-lg font-bold hover:-translate-y-1 drop-shadow-lg border-t-orange-400 border-t-4 hover:drop-shadow-xl transition-transform ease-in-out duration-300">
                <span>SEMESTER</span>
                <span className="text-blue-500 text-lg">
                  {selectedSection.semester}
                </span>
              </div>
            </div>
            <div className="flex flex-row gap-4 justify-evenly">
              <div className="flex flex-col bg-slate-100 p-3 gap-2 w-1/3 rounded-lg font-bold hover:-translate-y-1 drop-shadow-lg border-t-teal-400 border-t-4 hover:drop-shadow-xl transition-transform ease-in-out duration-300">
                <span>SECTION</span>
                <span className="text-blue-500 text-lg">
                  {selectedSection.section_number}
                </span>
              </div>
              <div className="flex flex-col bg-slate-100 p-3 gap-2 w-1/3 rounded-lg font-bold hover:-translate-y-1 drop-shadow-lg border-t-rose-400 border-t-4 hover:drop-shadow-xl transition-transform ease-in-out duration-300">
                <span>AVERAGE GPA</span>
                <span className="text-blue-500 text-lg">
                  {selectedSection.course_gpa}
                </span>
              </div>
              <div className="flex flex-col bg-slate-100 p-3 gap-2 w-1/3 rounded-lg font-bold hover:-translate-y-1 drop-shadow-lg border-t-yellow-400 border-t-4 hover:drop-shadow-xl transition-transform ease-in-out duration-300">
                <span>TOTAL STUDENTS</span>
                <span className="text-blue-500 text-lg">
                  {selectedSection.grades_count}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-8 bg-white rounded-lg">
            <BarChart grades={selectedSection} />
          </div>
        </div>
      ) : (
        <div className="bg-gray-300 bg-opacity-30 rounded-lg shadow-md p-4 m-4 text-center">
          <p className="text-white">
            {selectedProfessor
              ? "Select a course to see more information."
              : "Select a Professor to see more information."}
          </p>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
