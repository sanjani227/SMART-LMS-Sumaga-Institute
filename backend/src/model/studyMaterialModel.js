import { EntitySchema } from "typeorm";

export const StudyMaterial = new EntitySchema({
  name: "StudyMaterial",
  tableName: "study-materials",
  columns: {
    fileId: { primary: true, type: "int", generated: true },
    fileName: { type: "varchar", nullable: false },
    grade: { type: "int", nullable: false },
    isDeleted: { type: "boolean", nullable: false, default: false },
    createdAt: { type: "timestamp", createDate: true },
    subjectId: { type: "int", nullable: false },
    teacherId: { type: "int", nullable: false },
  },
  relations: {
    subject: {
      type: "many-to-one",
      target: "Subject",
      inverseSide: "studyMaterials",
      joinColumn: { name: "subjectId" },
      onDelete: "CASCADE",
    },
    teacher: {
      type: "many-to-one",
      target: "Teacher",
      joinColumn: { name: "teacherId" },
      inverseSide: "studyMaterials",
      onDelete: "CASCADE",
    },
    // student: {
    //     type: "many-to-one",
    //     target: "Student",
    //     joinColumn: {
    //         name: "studentId"
    //     },
    //     inverseSide: "studyMaterials",
    //     onDelete: "CASCADE"
    // }
  },
});
