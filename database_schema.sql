-- =======================================================================================
-- Database Schema for sumaga_lms
-- Auto-generated from current database state
-- =======================================================================================

DROP DATABASE IF EXISTS sumaga_lms;
CREATE DATABASE sumaga_lms;
USE sumaga_lms;

SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------------------------
-- Table: announcements
-- ---------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `announcements`;
CREATE TABLE `announcements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `audience` text NOT NULL,
  `by` varchar(255) NOT NULL DEFAULT 'Admin',
  `isDeleted` tinyint NOT NULL DEFAULT '0',
  `status` varchar(255) NOT NULL DEFAULT 'Published',
  `date` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------------------
-- Table: assessment_results
-- ---------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `assessment_results`;
CREATE TABLE `assessment_results` (
  `resultId` int NOT NULL AUTO_INCREMENT,
  `assessmentId` int NOT NULL,
  `studentId` int NOT NULL,
  `totalScore` int NOT NULL DEFAULT '0',
  `percentage` decimal(5,2) DEFAULT NULL,
  `grade` varchar(255) DEFAULT NULL,
  `status` enum('completed','in_progress','not_started') NOT NULL DEFAULT 'not_started',
  `startedAt` timestamp NULL DEFAULT NULL,
  `completedAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`resultId`),
  KEY `FK_73d09446c6f30e6a7b1cbba18d9` (`assessmentId`),
  KEY `FK_7265fdddcf81c52cf477e7f4b91` (`studentId`),
  CONSTRAINT `FK_7265fdddcf81c52cf477e7f4b91` FOREIGN KEY (`studentId`) REFERENCES `students` (`studentId`) ON DELETE CASCADE,
  CONSTRAINT `FK_73d09446c6f30e6a7b1cbba18d9` FOREIGN KEY (`assessmentId`) REFERENCES `assessments` (`assessmentId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------------------
-- Table: assessments
-- ---------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `assessments`;
CREATE TABLE `assessments` (
  `assessmentId` int NOT NULL AUTO_INCREMENT,
  `classId` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `maxMarks` int NOT NULL,
  `description` text,
  `type` enum('quiz','test','exam','midterm','final') NOT NULL DEFAULT 'quiz',
  `totalMarks` int NOT NULL DEFAULT '100',
  `duration` int DEFAULT NULL COMMENT 'Duration in minutes',
  `startTime` datetime NOT NULL,
  `endTime` datetime NOT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`assessmentId`),
  KEY `FK_b4f3db3ac8ac27cfb43c70572bd` (`classId`),
  CONSTRAINT `FK_b4f3db3ac8ac27cfb43c70572bd` FOREIGN KEY (`classId`) REFERENCES `classes` (`classId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------------------
-- Table: assignment_submissions
-- ---------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `assignment_submissions`;
CREATE TABLE `assignment_submissions` (
  `submissionId` int NOT NULL AUTO_INCREMENT,
  `assignmentId` int NOT NULL,
  `studentId` int NOT NULL,
  `submissionText` text,
  `attachmentPath` varchar(255) DEFAULT NULL,
  `score` decimal(5,2) DEFAULT NULL,
  `feedback` text,
  `status` enum('submitted','graded','late','pending') NOT NULL DEFAULT 'pending',
  `submittedAt` timestamp NULL DEFAULT NULL,
  `gradedAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`submissionId`),
  KEY `FK_6e8a68594fde52f61876a40489c` (`assignmentId`),
  KEY `FK_dfb5017c979e0e8e47659b0da24` (`studentId`),
  CONSTRAINT `FK_6e8a68594fde52f61876a40489c` FOREIGN KEY (`assignmentId`) REFERENCES `assignments` (`assignmentId`) ON DELETE CASCADE,
  CONSTRAINT `FK_dfb5017c979e0e8e47659b0da24` FOREIGN KEY (`studentId`) REFERENCES `students` (`studentId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------------------
-- Table: assignments
-- ---------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `assignments`;
CREATE TABLE `assignments` (
  `assignmentId` int NOT NULL AUTO_INCREMENT,
  `classId` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `dueDate` datetime NOT NULL,
  `maxScore` decimal(5,2) NOT NULL DEFAULT '100.00',
  `attachmentPath` varchar(255) DEFAULT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`assignmentId`),
  KEY `FK_c5382064b68e93e2ac371de898e` (`classId`),
  CONSTRAINT `FK_c5382064b68e93e2ac371de898e` FOREIGN KEY (`classId`) REFERENCES `classes` (`classId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------------------
-- Table: attendance
-- ---------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `attendance`;
CREATE TABLE `attendance` (
  `attendanceId` int NOT NULL AUTO_INCREMENT,
  `studentId` int NOT NULL,
  `classId` int NOT NULL,
  `status` enum('present','absent','late','excused') NOT NULL DEFAULT 'absent',
  `attendanceDate` date NOT NULL,
  `remarks` text,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`attendanceId`),
  KEY `FK_120e1c6edcec4f8221f467c8039` (`studentId`),
  KEY `FK_af129543ec010c822cb6f0254b5` (`classId`),
  CONSTRAINT `FK_120e1c6edcec4f8221f467c8039` FOREIGN KEY (`studentId`) REFERENCES `students` (`studentId`) ON DELETE CASCADE,
  CONSTRAINT `FK_af129543ec010c822cb6f0254b5` FOREIGN KEY (`classId`) REFERENCES `classes` (`classId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------------------
-- Table: classes
-- ---------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `classes`;
CREATE TABLE `classes` (
  `classId` int NOT NULL AUTO_INCREMENT,
  `subjectId` int NOT NULL,
  `teacherId` int NOT NULL,
  `scheduleDay` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
  `scheduleTime` time NOT NULL,
  `isDeleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`classId`),
  KEY `FK_6df8dacbeed6e130c7032bf6f74` (`subjectId`),
  KEY `FK_4b7ac7a7eb91f3e04229c7c0b6f` (`teacherId`),
  CONSTRAINT `FK_4b7ac7a7eb91f3e04229c7c0b6f` FOREIGN KEY (`teacherId`) REFERENCES `teachers` (`teacherId`) ON DELETE CASCADE,
  CONSTRAINT `FK_6df8dacbeed6e130c7032bf6f74` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`subjectId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------------------
-- Table: learning_materials
-- ---------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `learning_materials`;
CREATE TABLE `learning_materials` (
  `materialId` int NOT NULL AUTO_INCREMENT,
  `classId` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `filePath` varchar(500) NOT NULL,
  `uploadDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`materialId`),
  KEY `FK_8c9188e826ea2ee87a9a3a14ec2` (`classId`),
  CONSTRAINT `FK_8c9188e826ea2ee87a9a3a14ec2` FOREIGN KEY (`classId`) REFERENCES `classes` (`classId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------------------
-- Table: parents
-- ---------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `parents`;
CREATE TABLE `parents` (
  `parentId` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `contact` varchar(255) NOT NULL,
  PRIMARY KEY (`parentId`),
  UNIQUE KEY `REL_f1e08daeefd9c2e5def5746be7` (`userId`),
  CONSTRAINT `FK_f1e08daeefd9c2e5def5746be7e` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------------------
-- Table: payments
-- ---------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments` (
  `paymentId` int NOT NULL AUTO_INCREMENT,
  `studentId` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `paymentType` enum('tuition','registration','material_fee','exam_fee','late_fee','other') NOT NULL DEFAULT 'tuition',
  `status` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
  `paymentMethod` enum('cash','bank_transfer','card','mobile_money','cheque') NOT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `dueDate` date DEFAULT NULL,
  `paidDate` date DEFAULT NULL,
  `description` text,
  `receiptNumber` varchar(255) DEFAULT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `slipUrl` longtext,
  PRIMARY KEY (`paymentId`),
  UNIQUE KEY `IDX_866ddee0e17d9385b4e3b86851` (`reference`),
  UNIQUE KEY `IDX_ccf1990399854743306e7ab852` (`receiptNumber`),
  KEY `FK_b2731e10aef7f886a08c552290e` (`studentId`),
  CONSTRAINT `FK_b2731e10aef7f886a08c552290e` FOREIGN KEY (`studentId`) REFERENCES `students` (`studentId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------------------
-- Table: questions
-- ---------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `questions`;
CREATE TABLE `questions` (
  `questionId` int NOT NULL AUTO_INCREMENT,
  `assessmentId` int NOT NULL,
  `questionText` text NOT NULL,
  `questionType` enum('multiple_choice','true_false','short_answer','essay') NOT NULL DEFAULT 'multiple_choice',
  `options` json DEFAULT NULL COMMENT 'For multiple choice questions',
  `correctAnswer` text,
  `points` int NOT NULL DEFAULT '1',
  `order` int NOT NULL,
  PRIMARY KEY (`questionId`),
  KEY `FK_465acef6f7d1194fb40a2e786cf` (`assessmentId`),
  CONSTRAINT `FK_465acef6f7d1194fb40a2e786cf` FOREIGN KEY (`assessmentId`) REFERENCES `assessments` (`assessmentId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------------------
-- Table: results
-- ---------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `results`;
CREATE TABLE `results` (
  `resultId` int NOT NULL AUTO_INCREMENT,
  `assessmentId` int NOT NULL,
  `studentId` int NOT NULL,
  `marksObtained` int NOT NULL,
  PRIMARY KEY (`resultId`),
  KEY `FK_da07d57f43a104a35dbaeeef940` (`assessmentId`),
  KEY `FK_c09b15b279d5542d4f130bc4cdb` (`studentId`),
  CONSTRAINT `FK_c09b15b279d5542d4f130bc4cdb` FOREIGN KEY (`studentId`) REFERENCES `students` (`studentId`) ON DELETE CASCADE,
  CONSTRAINT `FK_da07d57f43a104a35dbaeeef940` FOREIGN KEY (`assessmentId`) REFERENCES `assessments` (`assessmentId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------------------
-- Table: student_answers
-- ---------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `student_answers`;
CREATE TABLE `student_answers` (
  `answerId` int NOT NULL AUTO_INCREMENT,
  `questionId` int NOT NULL,
  `studentId` int NOT NULL,
  `assessmentId` int NOT NULL,
  `answer` text,
  `isCorrect` tinyint DEFAULT NULL,
  `pointsEarned` int NOT NULL DEFAULT '0',
  `answeredAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`answerId`),
  KEY `FK_ddc3986d2a233f54cc215067913` (`questionId`),
  KEY `FK_f6341cc688c8086ef66c5c6293d` (`studentId`),
  KEY `FK_61099b87e790c0e446adea8c30c` (`assessmentId`),
  CONSTRAINT `FK_61099b87e790c0e446adea8c30c` FOREIGN KEY (`assessmentId`) REFERENCES `assessments` (`assessmentId`) ON DELETE CASCADE,
  CONSTRAINT `FK_ddc3986d2a233f54cc215067913` FOREIGN KEY (`questionId`) REFERENCES `questions` (`questionId`) ON DELETE CASCADE,
  CONSTRAINT `FK_f6341cc688c8086ef66c5c6293d` FOREIGN KEY (`studentId`) REFERENCES `students` (`studentId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------------------
-- Table: student_classes
-- ---------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `student_classes`;
CREATE TABLE `student_classes` (
  `studentClassId` int NOT NULL AUTO_INCREMENT,
  `studentId` int NOT NULL,
  `classId` int NOT NULL,
  `enrollmentDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `status` enum('active','inactive','dropped') NOT NULL DEFAULT 'active',
  PRIMARY KEY (`studentClassId`),
  KEY `FK_033117f841e292b127c2770693a` (`studentId`),
  KEY `FK_3f18cbd0ea5362b0c8727070739` (`classId`),
  CONSTRAINT `FK_033117f841e292b127c2770693a` FOREIGN KEY (`studentId`) REFERENCES `students` (`studentId`) ON DELETE CASCADE,
  CONSTRAINT `FK_3f18cbd0ea5362b0c8727070739` FOREIGN KEY (`classId`) REFERENCES `classes` (`classId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------------------
-- Table: students
-- ---------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students` (
  `studentId` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `dob` date DEFAULT NULL,
  `address` text,
  `grade` varchar(255) DEFAULT NULL,
  `parentId` int DEFAULT NULL,
  `contact` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`studentId`),
  UNIQUE KEY `REL_e0208b4f964e609959aff431bf` (`userId`),
  KEY `FK_6fea943b3b432a9e3e38d53c31b` (`parentId`),
  CONSTRAINT `FK_6fea943b3b432a9e3e38d53c31b` FOREIGN KEY (`parentId`) REFERENCES `parents` (`parentId`) ON DELETE SET NULL,
  CONSTRAINT `FK_e0208b4f964e609959aff431bf9` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------------------
-- Table: study-materials
-- ---------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `study-materials`;
CREATE TABLE `study-materials` (
  `fileId` int NOT NULL AUTO_INCREMENT,
  `fileName` varchar(255) NOT NULL,
  `grade` int NOT NULL,
  `isDeleted` tinyint NOT NULL DEFAULT '0',
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `subjectId` int NOT NULL,
  `teacherId` int NOT NULL,
  PRIMARY KEY (`fileId`),
  KEY `FK_ba4e7e1055d96053c55b851e071` (`subjectId`),
  KEY `FK_3934106299a0291c2c54671f1d0` (`teacherId`),
  CONSTRAINT `FK_3934106299a0291c2c54671f1d0` FOREIGN KEY (`teacherId`) REFERENCES `teachers` (`teacherId`) ON DELETE CASCADE,
  CONSTRAINT `FK_ba4e7e1055d96053c55b851e071` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`subjectId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------------------
-- Table: subjects
-- ---------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `subjects`;
CREATE TABLE `subjects` (
  `subjectId` int NOT NULL AUTO_INCREMENT,
  `subjectName` varchar(255) NOT NULL,
  `gradeLevel` varchar(255) NOT NULL,
  PRIMARY KEY (`subjectId`),
  UNIQUE KEY `IDX_06f2f0b8c4f0220ff847a920f9` (`subjectName`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------------------
-- Table: teachers
-- ---------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `teachers`;
CREATE TABLE `teachers` (
  `teacherId` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `specialization` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`teacherId`),
  UNIQUE KEY `REL_4d8041cbc103a5142fa2f2afad` (`userId`),
  CONSTRAINT `FK_4d8041cbc103a5142fa2f2afad4` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------------------
-- Table: users
-- ---------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `userType` enum('student','parent','teacher','admin','owner') NOT NULL DEFAULT 'student',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `isDeleted` tinyint NOT NULL DEFAULT '0',
  `otp` varchar(255) DEFAULT NULL,
  `otpExpires` datetime DEFAULT NULL,
  `notifications` text,
  `systemPreferences` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS = 1;


-- =======================================================================================
-- Initial Data Seeding (Preserved Admin Credentials)
-- =======================================================================================

-- Admin account (Password is pre-hashed for 'sumaga123')
INSERT INTO \users\ (\irstName\, \lastName\, \email\, \password\, \userType\) 
VALUES ('Sumudu', 'Asanka', 'Sumaga@gmail.com', '/b.wIc2JenWOBIgKGGJbTSCqgTlMIM6pDsP6ttty', 'admin')
ON DUPLICATE KEY UPDATE email=email;

