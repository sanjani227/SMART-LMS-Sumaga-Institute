import { EntitySchema } from "typeorm";

export const Attendance = new EntitySchema({
    name: "Attendance",
    tableName: "attendance",
    columns: {
        attendanceId: { primary: true, type: "int", generated: true },
        studentId: { type: "int", nullable: false },
        classId: { type: "int", nullable: false },
        date: { type: "date", nullable: false },
        status: {
            type: "enum",
            enum: ['Present', 'Absent', 'Late', 'Excused'],
            default: 'Absent',
            nullable: false
        },
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

export const Payment = new EntitySchema({
    name: "Payment",
    tableName: "payments",
    columns: {
        paymentId: { primary: true, type: "int", generated: true },
        studentId: { type: "int", nullable: false },
        amount: { type: "decimal", precision: 10, scale: 2, nullable: false },
        paymentDate: { type: "datetime", createDate: true, nullable: false },
        paymentType: {
            type: "enum",
            enum: ['Cash', 'Card', 'Online', 'Transfer'],
            nullable: false
        },
        status: {
            type: "enum",
            enum: ['Pending', 'Completed', 'Failed'],
            default: 'Completed',
            nullable: false
        },
    },
    relations: {
        student: {
            type: "many-to-one",
            target: "Student",
            joinColumn: { name: "studentId" },
            inverseSide: "payments",
            onDelete: "CASCADE",
        },
    },
});
