"use client";

import { Bar } from "react-chartjs-2";
import { Course } from "./SideBar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Define the props type for the BarChart component
interface BarChartProps {
  grades: Course[];
  colors: string[]; // Array of colors for each dataset
}

const BarChart = ({ grades, colors }: BarChartProps) => {
  // Check if grades or colors are null or empty
  if (!grades || grades.length === 0 || !colors || colors.length === 0) {
    return null; // Do not render anything
  }

  // Convert Tailwind classes to actual CSS color values
  const tailwindColors: { [key: string]: string } = {
    "border-t-blue-400": "#3B82F6",
    "border-t-green-400": "#22C55E",
    "border-t-orange-400": "#F97316",
    "border-t-teal-400": "#14B8A6",
    "border-t-rose-400": "#FB7185",
    "border-t-yellow-400": "#FBBF24",
  };

  // Prepare the grade data and labels
  const gradeLabels = ["A", "B", "C", "D", "F", "I", "P", "Q", "W", "Z", "R"];
  const gradeDescriptions = [
    "Excellent",
    "Good",
    "Fair",
    "Passing",
    "Failure",
    "Incomplete",
    "Pass",
    "Withdrawn - No Penalty",
    "Withdrawn",
    "No Credit",
    "Research",
  ];

  // Create datasets for each course selection
  const datasets = grades.map((course, index) => {
    if (!course) {
      return {
        label: `Professor ${index + 1}`, // Fallback label for null courses
        data: new Array(gradeLabels.length).fill(0), // Default to an array of zeros
        backgroundColor:
          tailwindColors[colors[index % colors.length]] || "gray",
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
    console.log(grades);

    return {
      label: `${course.instructor1}`,
      data: gradeValues,
      backgroundColor: tailwindColors[colors[index % colors.length]] || "gray",
    };
  });

  // Filter labels and datasets to only include those with non-zero values
  const nonZeroIndices = gradeLabels.reduce((indices, label, index) => {
    const hasNonZeroData = datasets.some((dataset) => dataset.data[index] > 0);
    if (hasNonZeroData) {
      indices.push(index);
    }
    return indices;
  }, [] as number[]);

  const filteredLabels = nonZeroIndices.map((index) => gradeLabels[index]);
  const filteredDatasets = datasets.map((dataset) => ({
    ...dataset,
    data: nonZeroIndices.map((index) => dataset.data[index]),
  }));

  const data = {
    labels: filteredLabels,
    datasets: filteredDatasets,
  };

  return grades && grades.length > 0 ? (
    <div className="mt-8 bg-white rounded-lg p-4">
      <h2 className="text-xl text-center font-bold mb-4">
        Grades Distribution
      </h2>
      <Bar data={data} options={{
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              //displays grade description after grade label
              title: (tooltipItems) => {
                const index = tooltipItems[0].dataIndex;
                return `${gradeLabels[index]} - ${gradeDescriptions[index]}`;
              },
              //calculates and displays percentage
              footer: (tooltipItems) => {
                const datasetIndex = tooltipItems[0].datasetIndex;
                const gradeCount = (data.datasets[datasetIndex].data[tooltipItems[0].dataIndex]);
                const totalGrades = (data.datasets[datasetIndex].data).reduce
                ((sum, value) => sum + (Number(value)), 0);
                const percentage = ((gradeCount / totalGrades) * 100).toFixed(2);
                return `Percentage: ${percentage}%`;
              },
            }
          }
        }
      }
      } />
    </div>
  ) : null;
};

export default BarChart;
