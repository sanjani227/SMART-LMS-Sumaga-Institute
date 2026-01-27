import { EntitySchema } from "typeorm";

export const Student = new EntitySchema({
    name: "Student",
    tableName: "students",
    columns: {
        studentId: { primary: true, type: "int", generated: true },
        userId: { type: "int", nullable: false },
        fullName: { type: "varchar", nullable: false },
        dob: { type: "date", nullable: false },
        address: { type: "text", nullable: true },
        grade: { type: "varchar", nullable: false },
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
            target: "Result",
            inverseSide: "student",
        },
    },
});
