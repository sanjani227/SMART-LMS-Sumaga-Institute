import { EntitySchema } from "typeorm";

export const Assessment = new EntitySchema({
    name: "Assessment",
    tableName: "assessments",
    columns: {
        assessmentId: { primary: true, type: "int", generated: true },
        classId: { type: "int", nullable: false },
        title: { type: "varchar", nullable: false },
        description: { type: "text", nullable: true },
        type: {
            type: "enum",
            enum: ["quiz", "test", "exam", "midterm", "final"],
            default: "quiz",
            nullable: false,
        },
        totalMarks: { type: "int", default: 100, nullable: false },
        duration: { type: "int", nullable: true, comment: "Duration in minutes" },
        startTime: { type: "datetime", nullable: false },
        endTime: { type: "datetime", nullable: false },
        isActive: { type: "boolean", default: true },
        createdAt: { type: "timestamp", createDate: true },
        updatedAt: { type: "timestamp", updateDate: true },
    },
    relations: {
        classSession: {
            type: "many-to-one",
            target: "Class",
            joinColumn: { name: "classId" },
            inverseSide: "assessments",
            onDelete: "CASCADE",
        },
        questions: {
            type: "one-to-many",
            target: "Question",
            inverseSide: "assessment",
        },
        results: {
            type: "one-to-many",
            target: "AssessmentResult",
            inverseSide: "assessment",
        },
    },
});

export const Question = new EntitySchema({
    name: "Question",
    tableName: "questions",
    columns: {
        questionId: { primary: true, type: "int", generated: true },
        assessmentId: { type: "int", nullable: false },
        questionText: { type: "text", nullable: false },
        questionType: {
            type: "enum",
            enum: ["multiple_choice", "true_false", "short_answer", "essay"],
            default: "multiple_choice",
            nullable: false,
        },
        options: { type: "json", nullable: true, comment: "For multiple choice questions" },
        correctAnswer: { type: "text", nullable: true },
        points: { type: "int", default: 1, nullable: false },
        order: { type: "int", nullable: false },
    },
    relations: {
        assessment: {
            type: "many-to-one",
            target: "Assessment",
            joinColumn: { name: "assessmentId" },
            inverseSide: "questions",
            onDelete: "CASCADE",
        },
        studentAnswers: {
            type: "one-to-many",
            target: "StudentAnswer",
            inverseSide: "question",
        },
    },
});

export const StudentAnswer = new EntitySchema({
    name: "StudentAnswer",
    tableName: "student_answers",
    columns: {
        answerId: { primary: true, type: "int", generated: true },
        questionId: { type: "int", nullable: false },
        studentId: { type: "int", nullable: false },
        assessmentId: { type: "int", nullable: false },
        answer: { type: "text", nullable: true },
        isCorrect: { type: "boolean", nullable: true },
        pointsEarned: { type: "int", default: 0 },
        answeredAt: { type: "timestamp", createDate: true },
    },
    relations: {
        question: {
            type: "many-to-one",
            target: "Question",
            joinColumn: { name: "questionId" },
            inverseSide: "studentAnswers",
            onDelete: "CASCADE",
        },
        student: {
            type: "many-to-one",
            target: "Student",
            joinColumn: { name: "studentId" },
            inverseSide: "answers",
            onDelete: "CASCADE",
        },
        assessment: {
            type: "many-to-one",
            target: "Assessment",
            joinColumn: { name: "assessmentId" },
            onDelete: "CASCADE",
        },
    },
});

export const AssessmentResult = new EntitySchema({
    name: "AssessmentResult",
    tableName: "assessment_results",
    columns: {
        resultId: { primary: true, type: "int", generated: true },
        assessmentId: { type: "int", nullable: false },
        studentId: { type: "int", nullable: false },
        totalScore: { type: "int", default: 0 },
        percentage: { type: "decimal", precision: 5, scale: 2, nullable: true },
        grade: { type: "varchar", nullable: true },
        status: {
            type: "enum",
            enum: ["completed", "in_progress", "not_started"],
            default: "not_started",
            nullable: false,
        },
        startedAt: { type: "timestamp", nullable: true },
        completedAt: { type: "timestamp", nullable: true },
        createdAt: { type: "timestamp", createDate: true },
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