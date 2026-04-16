import { EntitySchema } from "typeorm";

export const Announcement = new EntitySchema({
  name: "Announcement",
  tableName: "announcements",
  columns: {
    id: { primary: true, type: "int", generated: true },
    title: { type: "varchar", nullable: false },
    status: { type: "varchar", nullable: false, default: "Published" },
    content: { type: "text", nullable: false },
    by: { type: "varchar", nullable: false, default: "Admin" },
    date: { type: "varchar", nullable: false },
    category: { type: "varchar", nullable: false },
    audience: { type: "simple-json", nullable: false },
    isDeleted: { type: "boolean", nullable: false, default: false }
  },
});
