import { EntitySchema } from "typeorm";

export const Teacher = new EntitySchema({
    name: "Teacher",
    tableName: "teachers",
    columns: {
        teacherId: { primary: true, type: "int", generated: true },
        userId: { type: "int", nullable: false },
        fullName: { type: "varchar", nullable: false },
        specialization: { type: "varchar", nullable: true },
    },
    relations: {
        user: {
            type: "one-to-one",
            target: "User",
            joinColumn: { name: "userId" },
            inverseSide: "teacherProfile",
            onDelete: "CASCADE",
        },
        classes: {
            type: "one-to-many",
            target: "Class",
            inverseSide: "teacher",
        },
    },
});
