import { EntitySchema } from "typeorm";

export const Assessment = new EntitySchema({
    name: "Assessment",
    tableName: "assessments",
    columns: {
        assessmentId: { primary: true, type: "int", generated: true },
        classId: { type: "int", nullable: false },
        title: { type: "varchar", nullable: false },
        maxMarks: { type: "int", nullable: false },
    },
    relations: {
        classSession: {
            type: "many-to-one",
            target: "Class",
            joinColumn: { name: "classId" },
            inverseSide: "assessments",
            onDelete: "CASCADE",
        },
        results: {
            type: "one-to-many",
            target: "Result",
            inverseSide: "assessment",
        },
    },
});

export const Result = new EntitySchema({
    name: "Result",
    tableName: "results",
    columns: {
        resultId: { primary: true, type: "int", generated: true },
        assessmentId: { type: "int", nullable: false },
        studentId: { type: "int", nullable: false },
        marksObtained: { type: "int", nullable: false },
    },
    relations: {
        assessment: {
            type: "many-to-one",
            target: "Assessment",
            joinColumn: { name: "assessmentId" },
            inverseSide: "results",
            onDelete: "CASCADE",
        },
        student: {
            type: "many-to-one",
            target: "Student",
            joinColumn: { name: "studentId" },
            inverseSide: "results",
            onDelete: "CASCADE",
        },
    },
});

export const LearningMaterial = new EntitySchema({
    name: "LearningMaterial",
    tableName: "learning_materials",
    columns: {
        materialId: { primary: true, type: "int", generated: true },
        classId: { type: "int", nullable: false },
        title: { type: "varchar", nullable: false },
        filePath: { type: "varchar", length: 500, nullable: false },
        uploadDate: { type: "datetime", createDate: true, nullable: false },
    },
    relations: {
        classSession: {
            type: "many-to-one",
            target: "Class",
            joinColumn: { name: "classId" },
            inverseSide: "learningMaterials",
            onDelete: "CASCADE",
        },
    },
});
