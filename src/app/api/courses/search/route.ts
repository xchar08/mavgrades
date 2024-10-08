import { NextRequest, NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function GET(request: NextRequest) {
  const db = await open({
    filename: './public/data/grades.sqlite',
    driver: sqlite3.Database,
  });

  const searchParams = new URL(request.url).searchParams;
  const searchInput = searchParams.get("query") || "";  // user input for suggestions
  const course = searchParams.get("course") || ""; // course parameter for results
  const professor = searchParams.get("professor") || ""; // professor parameter for results
  const sort = searchParams.get("sort") || "course_number"; // sorting parameter (default: course_number)
  const direction = searchParams.get("direction") || "asc"; // sorting direction (default: asc)

  let suggestions = [];
  let courses = [];

  if (searchInput) {
    const input = searchInput.trim().toLowerCase();
    
    // Fetch matching course suggestions and professor names
    suggestions = await db.all(
      `SELECT DISTINCT 
         subject_id || ' ' || course_number AS suggestion, 
         'course' AS type
       FROM allgrades
       WHERE LOWER(subject_id || ' ' || course_number) LIKE ? 
       UNION 
       SELECT DISTINCT 
         instructor1 AS suggestion, 
         'professor' AS type
       FROM allgrades
       WHERE LOWER(instructor1) LIKE ? 
       ORDER BY suggestion`,
      [`%${input}%`, `%${input}%`]
    );
  }

  // Fetch course details based on the course parameter
  if (course) {
    const input = course.trim().toLowerCase();
    courses = await db.all(
      `SELECT DISTINCT subject_id, course_number, instructor1, section_number, semester, year, course_gpa,
        grades_count, grades_A, grades_B, grades_C, grades_D, grades_F, grades_I, grades_P, grades_Q, 
        grades_W, grades_Z, grades_R
       FROM allgrades
       WHERE LOWER(subject_id || ' ' || course_number) = ?
       ORDER BY ${sort} ${direction}`, 
      [input]
    );
  }

  // Fetch courses taught by a professor
  if (professor) {
    const input = professor.trim().toLowerCase();
    courses = await db.all(
      `SELECT DISTINCT subject_id, course_number, instructor1, section_number, semester, year, course_gpa,
        grades_count, grades_A, grades_B, grades_C, grades_D, grades_F, grades_I, grades_P, grades_Q, 
        grades_W, grades_Z, grades_R
       FROM allgrades
       WHERE LOWER(instructor1) LIKE ?
       ORDER BY ${sort} ${direction}`, 
      [`%${input}%`]
    );
  }

  // Return suggestions or course details based on what's requested
  if (suggestions.length > 0) {
    return NextResponse.json(suggestions);
  } else {
    return NextResponse.json(courses);
  }
}
