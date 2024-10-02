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

  let suggestions = [];
  let courses = [];

  if (searchInput) {
    const input = searchInput.trim().toLowerCase();

    // Fetch matching course suggestions
    suggestions = await db.all(
      `SELECT DISTINCT subject_id || ' ' || course_number AS suggestion
       FROM allgrades
       WHERE LOWER(subject_id || ' ' || course_number) LIKE ?
       OR LOWER(instructor1) LIKE ?`,
      [`%${input}%`, `%${input}%`]
    );
  }

  if (course) {
    const input = course.trim().toLowerCase();

    // Fetch course details based on the course parameter
    courses = await db.all(
      `SELECT subject_id, course_number, instructor1, section_number, semester, year
       FROM allgrades
       WHERE LOWER(subject_id || ' ' || course_number) = ?`,
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
