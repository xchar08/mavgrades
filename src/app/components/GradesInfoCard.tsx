import React from "react";

export const GradesInfoCard = () => {
  return (
    <>
      <h3 className="text-lg font-bold mb-2 text-cyan-500">
        Grading Information
      </h3>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="pb-1">Grade</th>
            <th className="pb-1">Description</th>
            <th className="pb-1">Points</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>A</td>
            <td>Excellent</td>
            <td>4</td>
          </tr>
          <tr>
            <td>B</td>
            <td>Good</td>
            <td>3</td>
          </tr>
          <tr>
            <td>C</td>
            <td>Fair</td>
            <td>2</td>
          </tr>
          <tr>
            <td>D</td>
            <td>Passing, Below Average</td>
            <td>1</td>
          </tr>
          <tr>
            <td>F</td>
            <td>Failure</td>
            <td>0</td>
          </tr>
          <tr>
            <td>I</td>
            <td>Incomplete</td>
            <td>0</td>
          </tr>
          <tr>
            <td>W</td>
            <td>Withdrawn</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Q</td>
            <td>Withdrawn - No Penalty</td>
            <td>0</td>
          </tr>
          <tr>
            <td>P</td>
            <td>Pass</td>
            <td>0</td>
          </tr>
          <tr>
            <td>R</td>
            <td>Research</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Z</td>
            <td>No Credit</td>
            <td>0</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
