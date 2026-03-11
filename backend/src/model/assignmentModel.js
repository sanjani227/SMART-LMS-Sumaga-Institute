import { EntitySchema } from "typeorm";

export const Assignment = new EntitySchema({
    name: "Assignment",
    tableName: "assignments",
    columns: {
        assignmentId: { primary: true, type: "int", generated: true },
        classId: { type: "int", nullable: false },
        title: { type: "varchar", nullable: false },
        description: { type: "text", nullable: true },
        dueDate: { type: "datetime", nullable: false },
        maxScore: { type: "decimal", precision: 5, scale: 2, default: 100 },
        attachmentPath: { type: "varchar", nullable: true },
        createdAt: { type: "timestamp", createDate: true },
        updatedAt: { type: "timestamp", updateDate: true },
    },
    relations: {
        class: {
            type: "many-to-one",
            target: "Class",
            joinColumn: { name: "classId" },
            inverseSide: "assignments",
            onDelete: "CASCADE",
        },
        submissions: {
            type: "one-to-many",
            target: "AssignmentSubmission",
            inverseSide: "assignment",
        },
    },
});

export const AssignmentSubmission = new EntitySchema({
    name: "AssignmentSubmission",
    tableName: "assignment_submissions",
    columns: {
        submissionId: { primary: true, type: "int", generated: true },
        assignmentId: { type: "int", nullable: false },
        studentId: { type: "int", nullable: false },
        submissionText: { type: "text", nullable: true },
        attachmentPath: { type: "varchar", nullable: true },
        score: { type: "decimal", precision: 5, scale: 2, nullable: true },
        feedback: { type: "text", nullable: true },
        status: {
            type: "enum",
            enum: ["submitted", "graded", "late", "pending"],
            default: "pending",
            nullable: false,
        },
        submittedAt: { type: "timestamp", nullable: true },
        gradedAt: { type: "timestamp", nullable: true },
        createdAt: { type: "timestamp", createDate: true },
    },
    relations: {
        assignment: {
            type: "many-to-one",
            target: "Assignment",
            joinColumn: { name: "assignmentId" },
            inverseSide: "submissions",
            onDelete: "CASCADE",
        },
        student: {
            type: "many-to-one",
            target: "Student",
            joinColumn: { name: "studentId" },
            inverseSide: "submissions",
            onDelete: "CASCADE",
        },
    },
});