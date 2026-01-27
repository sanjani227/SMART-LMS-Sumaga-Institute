-- =======================================================================================
-- Database Schema for Sumaga Institute Smart LMS
-- Purpose: Create strictly 3NF schema with strict data validation matching frontend rules.
-- Author: Database Architect (Antigravity)
-- Dependencies: None (Creates database from scratch)
-- =======================================================================================

-- 1. Database Creation (Fail-safe: Drops existing DB to ensure clean state)
DROP DATABASE IF EXISTS sumaga_lms;
CREATE DATABASE sumaga_lms;
USE sumaga_lms;

-- =======================================================================================
-- 2. Table Definitions (Execution Order Preserved for Foreign Key Integrity)
-- =======================================================================================

-- ---------------------------------------------------------------------------------------
-- Table: users (Root Dependency)
-- Description: Central authentication table. Matches backend models/frontend validation.
-- ---------------------------------------------------------------------------------------
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    userType ENUM('student', 'parent', 'teacher', 'admin', 'owner') NOT NULL DEFAULT 'student',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Data Integrity Checks (Fail-proof validation at DB level)
    CONSTRAINT chk_email_format CHECK (email REGEXP '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$'),
    CONSTRAINT chk_firstName_alpha CHECK (firstName REGEXP '^[a-zA-Z]+$'),
    CONSTRAINT chk_lastName_alpha CHECK (lastName REGEXP '^[a-zA-Z]+$')
    -- Note: Password length check omitted intentionally as we store HASHED passwords, which are long fixed strings.
);

-- ---------------------------------------------------------------------------------------
-- Table: parents
-- Description: Extended profile for parents.
-- ---------------------------------------------------------------------------------------
DROP TABLE IF EXISTS parents;
CREATE TABLE parents (
    parentId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    contact VARCHAR(20) NOT NULL,
    
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------------------
-- Table: students
-- Description: Extended profile for students, linking to Parent.
-- ---------------------------------------------------------------------------------------
DROP TABLE IF EXISTS students;
CREATE TABLE students (
    studentId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    address TEXT,
    grade VARCHAR(50) NOT NULL,
    parentId INT, -- Can be NULL if parent not yet registered/linked, or enforce NOT NULL based on business rule.
    
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parentId) REFERENCES parents(parentId) ON DELETE SET NULL
);

-- ---------------------------------------------------------------------------------------
-- Table: teachers
-- Description: Extended profile for teachers.
-- ---------------------------------------------------------------------------------------
DROP TABLE IF EXISTS teachers;
CREATE TABLE teachers (
    teacherId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    specialization VARCHAR(100),
    
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------------------
-- Table: subjects
-- Description: Academic subjects.
-- ---------------------------------------------------------------------------------------
DROP TABLE IF EXISTS subjects;
CREATE TABLE subjects (
    subjectId INT AUTO_INCREMENT PRIMARY KEY,
    subjectName VARCHAR(100) NOT NULL UNIQUE,
    gradeLevel VARCHAR(50) NOT NULL
);

-- ---------------------------------------------------------------------------------------
-- Table: classes
-- Description: Scheduled classes linking subjects and teachers.
-- ---------------------------------------------------------------------------------------
DROP TABLE IF EXISTS classes;
CREATE TABLE classes (
    classId INT AUTO_INCREMENT PRIMARY KEY,
    subjectId INT NOT NULL,
    teacherId INT NOT NULL,
    scheduleDay ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    scheduleTime TIME NOT NULL,
    
    FOREIGN KEY (subjectId) REFERENCES subjects(subjectId) ON DELETE CASCADE,
    FOREIGN KEY (teacherId) REFERENCES teachers(teacherId) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------------------
-- Table: attendance
-- Description: Tracks student attendance for classes.
-- ---------------------------------------------------------------------------------------
DROP TABLE IF EXISTS attendance;
CREATE TABLE attendance (
    attendanceId INT AUTO_INCREMENT PRIMARY KEY,
    studentId INT NOT NULL,
    classId INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('Present', 'Absent', 'Late', 'Excused') NOT NULL DEFAULT 'Absent',
    
    FOREIGN KEY (studentId) REFERENCES students(studentId) ON DELETE CASCADE,
    FOREIGN KEY (classId) REFERENCES classes(classId) ON DELETE CASCADE,
    UNIQUE KEY unique_attendance (studentId, classId, date) -- Prevent duplicate attendance records
);

-- ---------------------------------------------------------------------------------------
-- Table: payments
-- Description: Financial records for student fees.
-- ---------------------------------------------------------------------------------------
DROP TABLE IF EXISTS payments;
CREATE TABLE payments (
    paymentId INT AUTO_INCREMENT PRIMARY KEY,
    studentId INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    paymentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    paymentType ENUM('Cash', 'Card', 'Online', 'Transfer') NOT NULL,
    status ENUM('Pending', 'Completed', 'Failed') NOT NULL DEFAULT 'Completed',
    
    FOREIGN KEY (studentId) REFERENCES students(studentId) ON DELETE CASCADE,
    CONSTRAINT chk_amount_positive CHECK (amount > 0)
);

-- ---------------------------------------------------------------------------------------
-- Table: assessments
-- Description: Tests/Exams created for a class.
-- ---------------------------------------------------------------------------------------
DROP TABLE IF EXISTS assessments;
CREATE TABLE assessments (
    assessmentId INT AUTO_INCREMENT PRIMARY KEY,
    classId INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    maxMarks INT NOT NULL,
    
    FOREIGN KEY (classId) REFERENCES classes(classId) ON DELETE CASCADE,
    CONSTRAINT chk_maxMarks_positive CHECK (maxMarks > 0)
);

-- ---------------------------------------------------------------------------------------
-- Table: results
-- Description: Student scores for assessments.
-- ---------------------------------------------------------------------------------------
DROP TABLE IF EXISTS results;
CREATE TABLE results (
    resultId INT AUTO_INCREMENT PRIMARY KEY,
    assessmentId INT NOT NULL,
    studentId INT NOT NULL,
    marksObtained INT NOT NULL,
    
    FOREIGN KEY (assessmentId) REFERENCES assessments(assessmentId) ON DELETE CASCADE,
    FOREIGN KEY (studentId) REFERENCES students(studentId) ON DELETE CASCADE,
    CONSTRAINT chk_marks_valid CHECK (marksObtained >= 0)
);

-- ---------------------------------------------------------------------------------------
-- Table: learning_materials
-- Description: Files uploaded for classes.
-- ---------------------------------------------------------------------------------------
DROP TABLE IF EXISTS learning_materials;
CREATE TABLE learning_materials (
    materialId INT AUTO_INCREMENT PRIMARY KEY,
    classId INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    filePath VARCHAR(500) NOT NULL,
    uploadDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (classId) REFERENCES classes(classId) ON DELETE CASCADE
);

-- =======================================================================================
-- 3. Initial Data Seeding (For Testing & UI Verification)
-- =======================================================================================

-- Insert Owner/Super Admin
INSERT INTO users (firstName, lastName, email, password, userType) 
VALUES ('Sumudu', 'Asanka', 'Sumaga@gmail.com', 'sumaga123', 'owner'); 
-- Note: Password in production MUST be hashed using bcrypt/argon2. 'sumaga123' is placeholder.

-- Insert Sample Teacher
INSERT INTO users (firstName, lastName, email, password, userType) 
VALUES ('John', 'Doe', 'john.doe@example.com', 'teacher123', 'teacher');

INSERT INTO teachers (userId, fullName, specialization)
VALUES ((SELECT id FROM users WHERE email='john.doe@example.com'), 'John Doe', 'Mathematics');

-- Insert Sample Parent
INSERT INTO users (firstName, lastName, email, password, userType) 
VALUES ('Jane', 'Smith', 'jane.smith@example.com', 'parent123', 'parent');

INSERT INTO parents (userId, fullName, contact)
VALUES ((SELECT id FROM users WHERE email='jane.smith@example.com'), 'Jane Smith', '0771234567');

-- Insert Sample Student
INSERT INTO users (firstName, lastName, email, password, userType) 
VALUES ('Alice', 'Wonder', 'alice.wonder@example.com', 'student123', 'student');

INSERT INTO students (userId, fullName, dob, address, grade, parentId)
VALUES (
    (SELECT id FROM users WHERE email='alice.wonder@example.com'), 
    'Alice Wonder', 
    '2010-05-15', 
    '123 Wonderland Ave', 
    'Grade 10', 
    (SELECT parentId FROM parents WHERE fullName='Jane Smith')
);

-- Insert Sample Subject & Class
INSERT INTO subjects (subjectName, gradeLevel) VALUES ('Mathematics', 'Grade 10');

INSERT INTO classes (subjectId, teacherId, scheduleDay, scheduleTime) 
VALUES (
    (SELECT subjectId FROM subjects WHERE subjectName='Mathematics'),
    (SELECT teacherId FROM teachers WHERE fullName='John Doe'),
    'Monday',
    '08:30:00'
);
