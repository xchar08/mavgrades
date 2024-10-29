"use client";

import { Bar } from "react-chartjs-2";
import { Course } from "./SideBar";
import {
   Chart as ChartJS,
   ChartOptions,
   CategoryScale,
   LinearScale,
   BarElement,
   Title as ChartTitle,
   Tooltip,
   Legend,
   ChartData,
} from "chart.js";

ChartJS.register(
   CategoryScale,
   LinearScale,
   BarElement,
   ChartTitle,
   Tooltip,
   Legend
);

// Define the props type for the BarChart component
interface BarChartProps {
   grades: Course[];
   colors: string[]; // Array of colors for each dataset
}

const BarChart: React.FC<BarChartProps> = ({ grades, colors }) => {
   // Check if grades or colors are null or empty
   if (!grades || grades.length === 0 || !colors || colors.length === 0) {
      return null; // Do not render anything
   }

   // Map Tailwind CSS classes to hex codes if needed
   const tailwindColors: { [key: string]: string } = {
      "border-t-blue-400": "#60A5FA",
      "border-t-green-400": "#34D399",
      "border-t-orange-400": "#FBBF24",
      "border-t-teal-400": "#2DD4BF",
      "border-t-rose-400": "#FB7185",
      "border-t-yellow-400": "#FDE047",
      // Add more mappings if necessary
   };

   // Prepare the grade data and labels
   const gradeLabels = ["A", "B", "C", "D", "F", "I", "P", "Q", "W", "Z", "R"];

   // Create datasets for each course selection
   const datasets = grades.map((course, index) => {
      // Determine the color for this dataset
      const colorKey = colors[index % colors.length];
      const backgroundColor = tailwindColors[colorKey] || colorKey || "#57D2DD"; // Fallback to #57D2DD if color not found

      if (!course) {
         return {
            label: `Professor ${index + 1}`, // Fallback label for null courses
            data: new Array(gradeLabels.length).fill(0), // Default to an array of zeros
            backgroundColor,
            borderRadius: 7, // Increase border radius to 10
            borderSkipped: "bottom" as const, // Only round the top corners
         };
      }

      const gradeValues = [
         course.grades_A ?? 0, // Default to 0 if null
         course.grades_B ?? 0,
         course.grades_C ?? 0,
         course.grades_D ?? 0,
         course.grades_F ?? 0,
         course.grades_I ?? 0,
         course.grades_P ?? 0,
         course.grades_Q ?? 0,
         course.grades_W ?? 0,
         course.grades_Z ?? 0,
         course.grades_R ?? 0,
      ];

      return {
         label: `${course.instructor1}`,
         data: gradeValues,
         backgroundColor,
         borderRadius: 7, // Increase border radius to 10
         borderSkipped: "bottom" as const, // Only round the top corners
      };
   });

   // Filter labels and datasets to only include those with non-zero values
   const nonZeroIndices = gradeLabels.reduce(
      (indices: number[], label, index) => {
         const hasNonZeroData = datasets.some(
            (dataset) => dataset.data[index] > 0
         );
         if (hasNonZeroData) {
            indices.push(index);
         }
         return indices;
      },
      []
   );

   const filteredLabels = nonZeroIndices.map((index) => gradeLabels[index]);
   const filteredDatasets = datasets.map((dataset) => ({
      ...dataset,
      data: nonZeroIndices.map((index) => dataset.data[index]),
   }));

   const data: ChartData<"bar", number[], string> = {
      labels: filteredLabels,
      datasets: filteredDatasets,
   };

   //formatting the chart
   const options: ChartOptions<"bar"> = {
      responsive: true,
      scales: {
         x: {
            ticks: {
               color: "white",
            },
            grid: {
               color: "gray",
            },
         },
         y: {
            ticks: {
               color: "white",
            },
            grid: {
               color: "gray",
            },
         },
      },
      plugins: {
         legend: {
            labels: {
               color: "white",
            },
         },
      },
   };

   return grades && grades.length > 0 ? (
      <div className="mt-8 bg-gray-200 bg-opacity-10 rounded-lg p-4">
         <h2 className="text-xl text-center text-white font-bold mb-2">
            Grades Distribution
         </h2>
         <div className="border-b-2 rounded border-gray-500 w-1/2 mx-auto mb-4 px-10"></div>{" "}
         <Bar data={data} options={options} />
      </div>
   ) : null;
};

export default BarChart;
