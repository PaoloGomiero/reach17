-- =====================================================
-- REACH17 DATABASE
-- =====================================================

-- Create database
CREATE DATABASE IF NOT EXISTS reach17;

USE reach17;


-- =====================================================
-- COURSE TYPES
-- =====================================================

CREATE TABLE IF NOT EXISTS course_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);


-- =====================================================
-- COURSES
-- =====================================================

CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    course_type_id INT NOT NULL,

    CONSTRAINT fk_courses_course_type
        FOREIGN KEY (course_type_id)
        REFERENCES course_types(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);


-- =====================================================
-- UNIVERSITIES
-- =====================================================

CREATE TABLE IF NOT EXISTS universities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);


-- =====================================================
-- COURSE - UNIVERSITY ASSOCIATION
-- =====================================================

CREATE TABLE IF NOT EXISTS course_universities (
    course_id INT NOT NULL,
    university_id INT NOT NULL,

    PRIMARY KEY (course_id, university_id),

    CONSTRAINT fk_course_universities_course
        FOREIGN KEY (course_id)
        REFERENCES courses(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_course_universities_university
        FOREIGN KEY (university_id)
        REFERENCES universities(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);