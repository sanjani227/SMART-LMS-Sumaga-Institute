import { EntitySchema } from "typeorm";

export const Parent = new EntitySchema({
    name: "Parent",
    tableName: "parents",
    columns: {
        parentId: { primary: true, type: "int", generated: true },
        userId: { type: "int", nullable: false },
        fullName: { type: "varchar", nullable: false },
        contact: { type: "varchar", nullable: false },
    },
    relations: {
        user: {
            type: "one-to-one",
            target: "User",
            joinColumn: { name: "userId" },
            inverseSide: "parentProfile",
            onDelete: "CASCADE",
        },
        students: {
            type: "one-to-many",
            target: "Student",
            inverseSide: "parent",
        },
    },
});
