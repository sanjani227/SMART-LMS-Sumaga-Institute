import { EntitySchema } from "typeorm";

export const Student = new EntitySchema({
    name: "Student",
    tableName: "students",
    columns: {
        studentId: { primary: true, type: "int", generated: true },
        userId: { type: "int", nullable: false },
        fullName: { type: "varchar", nullable: false },
        dob: { type: "date", nullable: true },
        address: { type: "text", nullable: true },
        grade: { type: "varchar", nullable: true },
        parentId: { type: "int", nullable: true },
    },
    relations: {
        user: {
            type: "one-to-one",
            target: "User",
            joinColumn: { name: "userId" },
            inverseSide: "studentProfile",
            onDelete: "CASCADE",
        },
        parent: {
            type: "many-to-one",
            target: "Parent",
            joinColumn: { name: "parentId" },
            inverseSide: "students",
            onDelete: "SET NULL",
        },
        attendance: {
            type: "one-to-many",
            target: "Attendance",
            inverseSide: "student",
        },
        payments: {
            type: "one-to-many",
            target: "Payment",
            inverseSide: "student",
        },
        results: {
            type: "one-to-many",
            target: "AssessmentResult",
            inverseSide: "student",
        },
        enrollments: {
            type: "one-to-many",
            target: "StudentClass",
            inverseSide: "student"
        },
        submissions: {
            type: "one-to-many",
            target: "AssignmentSubmission",
            inverseSide: "student",
        },
        answers: {
            type: "one-to-many",
            target: "StudentAnswer",
            inverseSide: "student",
        },
    },
});
