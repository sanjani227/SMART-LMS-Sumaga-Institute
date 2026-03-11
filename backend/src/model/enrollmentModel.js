import { EntitySchema } from "typeorm";

export const StudentClass = new EntitySchema({
    name: "StudentClass",
    tableName: "student_classes",
    columns: {
        studentClassId: { primary: true, type: "int", generated: true },
        studentId: { type: "int", nullable: false },
        classId: { type: "int", nullable: false },
        enrollmentDate: { type: "datetime", createDate: true, nullable: false },
        status: {
            type: "enum",
            enum: ["active", "inactive", "dropped"],
            default: "active",
            nullable: false,
        },
    },
    relations: {
        student: {
            type: "many-to-one",
            target: "Student",
            joinColumn: { name: "studentId" },
            inverseSide: "enrollments",
            onDelete: "CASCADE",
        },
        class: {
            type: "many-to-one",
            target: "Class",
            joinColumn: { name: "classId" },
            inverseSide: "enrolledStudents",
            onDelete: "CASCADE",
        },
    },
});