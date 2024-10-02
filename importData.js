import fs from 'fs';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const dbPath = path.join(process.cwd(), 'public', 'data', 'grades.sqlite');

// Function to open the database
async function openDB() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
}

// Function to create a table (adjust based on your data)
async function createTable(db) {
  await db.exec(`CREATE TABLE IF NOT EXISTS allgrades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subjectId TEXT,
    courseNumber TEXT,
    instructor TEXT,
    grade TEXT,
    gpa REAL
    -- Add more fields as needed
  );`);
}

// Function to insert data
async function insertData(db, data) {
  const stmt = await db.prepare(`INSERT INTO allgrades (subjectId, courseNumber, instructor, grade, gpa) VALUES (?, ?, ?, ?, ?)`);
  for (const row of data) {
    await stmt.run(row.subjectId, row.courseNumber, row.instructor, row.grade, row.gpa);
  }
  await stmt.finalize();
}

// Function to read CSV files and import data
async function importData() {
  const db = await openDB();
  await createTable(db);

  const rawDataDir = path.join(process.cwd(), 'public', 'data');
  const files = fs.readdirSync(rawDataDir).filter(file => file.endsWith('.csv')); // Adjust based on your file types

  for (const file of files) {
    const filePath = path.join(rawDataDir, file);
    const data = [];
    
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        data.push(row);
      })
      .on('end', async () => {
        await insertData(db, data);
        console.log(`Imported ${data.length} rows from ${file}`);
      });
  }

  await db.close();
}

// Run the import
importData().catch(console.error);
