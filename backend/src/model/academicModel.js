/**
 * ========== ACADEMIC DATA MODELS ==========
 * File: backend/src/model/academicModel.js
 * Purpose: TypeORM schemas for academic entities - Subjects and Classes
 * 
 * @section Imports
 */
import { EntitySchema } from "typeorm";

// ========== SUBJECT ENTITY SCHEMA ==========
/**
 * Represents subjects/courses offered in the school
 */
export const Subject = new EntitySchema({
    name: "Subject",
    tableName: "subjects",
    columns: {
        subjectId: { primary: true, type: "int", generated: true },
        subjectName: { type: "varchar", nullable: false, unique: true },
        gradeLevel: { type: "varchar", nullable: false },
    },
    relations: {
        classes: {
            type: "one-to-many",
            target: "Class",
            inverseSide: "subject",
        },
    },
});

// ========== CLASS ENTITY SCHEMA ==========
/**
 * Represents classes/sections with their associated subject and teacher
 */
export const Class = new EntitySchema({
    name: "Class",
    tableName: "classes",
    columns: {
        classId: { primary: true, type: "int", generated: true },
        subjectId: { type: "int", nullable: false },
        teacherId: { type: "int", nullable: false },
        scheduleDay: {
            type: "enum",
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            nullable: false
        },
        scheduleTime: { type: "time", nullable: false },
        isDeleted: {type:"boolean" , nullable: false, default: false}
    },
    relations: {
        subject: {
            type: "many-to-one",
            target: "Subject",
            joinColumn: { name: "subjectId" },
            inverseSide: "classes",
            onDelete: "CASCADE",
        },
        teacher: {
            type: "many-to-one",
            target: "Teacher",
            joinColumn: { name: "teacherId" },
            inverseSide: "classes",
            onDelete: "CASCADE",
        },
        attendance: {
            type: "one-to-many",
            target: "Attendance",
            inverseSide: "classSession", // distinct name to avoid keyword collision if any
        },
        assessments: {
            type: "one-to-many",
            target: "Assessment",
            inverseSide: "classSession",
        },
        assignments: {
            type: "one-to-many",
            target: "Assignment",
            inverseSide: "class",
        },
        enrolledStudents: {
            type: "one-to-many",
            target: "StudentClass",
            inverseSide: "class",
        },
        learningMaterials: {
            type: "one-to-many",
            target: "LearningMaterial",
            inverseSide: "classSession",
        },
    },
});
