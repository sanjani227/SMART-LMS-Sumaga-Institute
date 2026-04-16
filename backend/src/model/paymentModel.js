import { EntitySchema } from "typeorm";

export const Payment = new EntitySchema({
    name: "Payment",
    tableName: "payments",
    columns: {
        paymentId: { primary: true, type: "int", generated: true },
        studentId: { type: "int", nullable: false },
        amount: { type: "decimal", precision: 10, scale: 2, nullable: false },
        paymentType: {
            type: "enum",
            enum: ["tuition", "registration", "material_fee", "exam_fee", "late_fee", "other"],
            default: "tuition",
            nullable: false,
        },
        paymentMethod: {
            type: "enum",
            enum: ["cash", "bank_transfer", "card", "mobile_money", "cheque"],
            nullable: false,
        },
        status: {
            type: "enum",
            enum: ["pending", "completed", "failed", "refunded"],
            default: "pending",
            nullable: false,
        },
        reference: { type: "varchar", nullable: true, unique: true },
        dueDate: { type: "date", nullable: true },
        paidDate: { type: "date", nullable: true },
        description: { type: "text", nullable: true },
        receiptNumber: { type: "varchar", nullable: true, unique: true },
        slipUrl: { type: "longtext", nullable: true },
        createdAt: { type: "timestamp", createDate: true },
        updatedAt: { type: "timestamp", updateDate: true },
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