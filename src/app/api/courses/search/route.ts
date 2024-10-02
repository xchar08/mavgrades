import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function GET(request) {
  const db = await open({
    filename: './public/data/grades.sqlite',
    driver: sqlite3.Database,
  });

  const searchParams = new URL(request.url).searchParams;
  const searchInput = searchParams.get("query") || "";  // user input for suggestions
  const course = searchParams.get("course") || ""; // course parameter for results
  const sort = searchParams.get("sort") || "course_number"; // sorting parameter (default: course_number)
  const direction = searchParams.get("direction") || "asc"; // sorting direction (default: asc)

  let suggestions = [];
  let courses = [];

  if (searchInput) {
    const input = searchInput.trim().toLowerCase();

    // Fetch matching course suggestions without instructor name
    suggestions = await db.all(
      `SELECT DISTINCT subject_id || ' ' || course_number AS suggestion
       FROM allgrades
       WHERE LOWER(subject_id || ' ' || course_number) LIKE ?
       ORDER BY ${sort} ${direction}`,  // Sort suggestions
      [`%${input}%`]
    );
  }

  if (course) {
    const input = course.trim().toLowerCase();

    // Fetch course details based on the course parameter
    courses = await db.all(
      `SELECT subject_id, course_number, instructor1, section_number, semester, year
       FROM allgrades
       WHERE LOWER(subject_id || ' ' || course_number) = ?
       ORDER BY ${sort} ${direction}`,  // Sort course details
      [input]
    );
  }

  // Return suggestions or course details based on what's requested
  if (suggestions.length > 0) {
    return NextResponse.json(suggestions.map((row) => row.suggestion));
  } else {
    return NextResponse.json(courses);
  }
}
