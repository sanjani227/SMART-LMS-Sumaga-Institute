import { EntitySchema } from "typeorm";

export const Attendance = new EntitySchema({
    name: "Attendance",
    tableName: "attendance",
    columns: {
        attendanceId: { primary: true, type: "int", generated: true },
        studentId: { type: "int", nullable: false },
        classId: { type: "int", nullable: false },
        attendanceDate: { type: "date", nullable: false },
        status: {
            type: "enum",
            enum: ["present", "absent", "late", "excused"],
            default: "absent",
            nullable: false,
        },
        remarks: { type: "text", nullable: true },
        createdAt: { type: "timestamp", createDate: true },
        updatedAt: { type: "timestamp", updateDate: true },
    },
    relations: {
        student: {
            type: "many-to-one",
            target: "Student",
            joinColumn: { name: "studentId" },
            inverseSide: "attendance",
            onDelete: "CASCADE",
        },
        classSession: {
            type: "many-to-one",
            target: "Class",
            joinColumn: { name: "classId" },
            inverseSide: "attendance",
            onDelete: "CASCADE",
        },
    },
});