# SMART-LMS Codebase Analysis Report
**Date:** April 18, 2026 | **Severity:** Multiple Critical & High Issues Found

---

## 1. API ENDPOINT MISMATCHES

### 1.1 Hardcoded URLs vs Environment Variables (HIGH)
**Issue:** Frontend uses hardcoded `http://localhost:3000` URLs instead of centralized config.
- **Files Affected:**
  - [frontend/src/app/dashboard/page.tsx](frontend/src/app/dashboard/page.tsx#L33) - Lines 33, 42, 49-50
  - [frontend/src/app/dashboard/admin/classes/page.tsx](frontend/src/app/dashboard/admin/classes/page.tsx#L50) - Lines 50, 68, 79, 91, 119, 166, 187
  - [frontend/src/app/dashboard/admin/announcements/page.tsx](frontend/src/app/dashboard/admin/announcements/page.tsx#L26) - Lines 26, 45, 72
  - [frontend/src/app/dashboard/parent/profile/page.tsx](frontend/src/app/dashboard/parent/profile/page.tsx#L40) - Multiple lines
  - 30+ files total with hardcoded localhost URLs

**Inconsistency:** Some files use `process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'` (e.g., [frontend/src/app/dashboard/teacher/quizzes/page.tsx](frontend/src/app/dashboard/teacher/quizzes/page.tsx#L33)), while others hardcode URLs.

**Fix:** Create centralized API config:
```typescript
// frontend/src/config/api.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
```

---

### 1.2 Inconsistent Response Format (CRITICAL)
**Issue:** Backend endpoints return inconsistent response structures.

**Examples:**
| Endpoint | Response Structure |
|----------|-------------------|
| [POST /auth/login](backend/src/controller/authController.js#L86) | `{ message, token, data: {firstName, lastName, id, email, userType} }` |
| [GET /auth/me](backend/src/controller/authController.js#L252) | `{ code: 200, data: {...} }` |
| [POST /announcements/createAnnouncement](backend/src/routes/announcementRoutes.js#L6) | No `code` field in response |
| [GET /teachers/classes](backend/src/controller/teacherController.js#L120) | `{ code: 200, data: {...} }` |
| [POST /classes/createClass](backend/src/routes/classRoutes.js#L11) | Varies |

**Impact:** Frontend assumes `response.data.code === 200` but auth endpoints don't follow this pattern.

**Fix:** Standardize all responses:
```javascript
// Standard response wrapper
const apiResponse = (code, message, data = null) => ({
  code,
  message,
  data
});
```

---

### 1.3 Missing/Incorrect Route Parameters (HIGH)
**Issue:** Route parameters in frontend don't match backend routes.

| Frontend Call | Backend Route | Status |
|--------------|--------------|--------|
| `/teachers/assignments/:assignmentId/submissions` | ✓ Exists | OK |
| `/students/attendance` | ✓ Exists | OK |
| `/classes/:classId/students` | ✓ Exists but `?date=` query handled inconsistently | ISSUE |
| `/parents/children/:studentId/payments` | ✓ Exists | OK |

**Issue at [backend/src/routes/teacherRoutes.js](backend/src/routes/teacherRoutes.js#L63):**
- Route: `GET /classes/:classId/students` - expects `classId` in path
- Frontend: [frontend/src/app/dashboard/teacher/attendance/page.tsx](frontend/src/app/dashboard/teacher/attendance/page.tsx#L87) passes query parameter `?date=` but backend may not handle it properly

---

## 2. DATA STRUCTURE MISMATCHES

### 2.1 Response Data Field Inconsistencies (HIGH)

**Login Response Mismatch:**
- Backend returns: `{ data: { firstName, lastName, id, email, userType }, token }`
- [Frontend (login/page.tsx)](frontend/src/app/auth/login/page.tsx#L38) expects: `response.data.firstName` but gets `response.data.data.firstName`
- Line 52: `const userLoggedName = response.data.data.firstName` ✓ Correct workaround

**Profile Response Fields:**
- [Backend (auth/getMe)](backend/src/controller/authController.js#L257) returns User entity with password/OTP excluded
- Frontend expects consistent fields

**Teacher Classes Response:**
| Backend | Frontend |
|---------|----------|
| `{ classes: [...], teacherId, fullName, email }` | Expects `data.classes` array |
| Structure in [backend/src/controller/teacherController.js](backend/src/controller/teacherController.js#L130) | [Frontend dashboard/page.tsx](frontend/src/app/dashboard/page.tsx#L33) |

### 2.2 Attendance Data Structure (MEDIUM)
**Frontend expects:** [frontend/src/app/dashboard/student/attendance/page.tsx](frontend/src/app/dashboard/student/attendance/page.tsx#L20)
```typescript
interface AttendanceRecord {
  status: 'present' | 'absent' | 'late' | 'excused';
  attendanceDate: date;
  // ...
}
```

**Backend returns** ([database_schema.sql](database_schema.sql#L93)):
```sql
attendance table: attendanceId, studentId, classId, status, attendanceDate, remarks, createdAt, updatedAt
```
- ✓ Matches structure

---

## 3. AUTHENTICATION ISSUES

### 3.1 Token Storage Inconsistency (HIGH)
**Multiple storage keys used:**
- [frontend/src/app/auth/login/page.tsx](frontend/src/app/auth/login/page.tsx#L48): `localStorage.setItem("TOKEN", response.data.token)`
- [frontend/src/app/dashboard/page.tsx](frontend/src/app/dashboard/page.tsx#L31): `localStorage.getItem("TOKEN") || localStorage.getItem("token")`
- [frontend/src/app/dashboard/admin/income/page.tsx](frontend/src/app/dashboard/admin/income/page.tsx#L26): Checks both `"token"` and `"TOKEN"`

**Issue:** Inconsistent capitalization - some files use "token", others "TOKEN"

**Fix:** Standardize:
```typescript
// Create constants/storage.ts
export const TOKEN_KEY = "AUTH_TOKEN";
export const USER_TYPE_KEY = "USER_TYPE";
export const USER_NAME_KEY = "USER_NAME";
```

### 3.2 Token Extraction Logic Issue (HIGH)
**[backend/src/middleware/authentication.js](backend/src/middleware/authentication.js#L47):**
- Extracts token from `Authorization: Bearer <token>` ✓ Correct
- Falls back to `req.cookies.authToken` ✓ Correct
- But [backend/src/controller/authController.js](backend/src/controller/authController.js#L131) sets cookie as `authToken`:
  ```javascript
  res.cookie("authToken", token, { httpOnly: true, ... })
  ```
- Frontend never receives this cookie due to CORS `credentials: true` being set

**Issue:** Frontend relies on manual token storage, backend sets cookie that's never used.

---

### 3.3 Role-Based Access Control Bug (CRITICAL)
**[backend/src/middleware/authentication.js](backend/src/middleware/authentication.js#L115):**
```javascript
export const requireTeacher = (req, res, next) => {
  if (!req.user)
    return res.status({  // ❌ BUG: status() called incorrectly
      code: 403,
      message: "Unauthorized",
    });
```
Should be: `return res.status(403).json({ code: 403, message: "Unauthorized" })`

Same bug in all `require*` functions (lines 110-150):
- `requireTeacher` - Line 115
- `requireAdmin` - Line 126  
- `requireStudent` - Line 138
- `requireParent` - Line 151

**Impact:** 403 responses will fail silently, causing undefined behavior.

---

## 4. DATABASE SCHEMA ISSUES

### 4.1 Model-Schema Mismatches (MEDIUM)

**Duplicate Assessment Entities:**
- [backend/src/model/assessmentModel.js](backend/src/model/assessmentModel.js#L3) exports Assessment
- [backend/src/model/learningKeyModel.js](backend/src/model/learningKeyModel.js#L3) also exports Assessment (redundant)
- [database_schema.sql](database_schema.sql#L53): Table `assessments` exists

**Duplicate Payment Entities:**
- [backend/src/model/operationsModel.js](backend/src/model/operationsModel.js#L36) exports Payment
- [backend/src/model/paymentModel.js](backend/src/model/paymentModel.js#L3) also exports Payment (redundant)

**Duplicate Attendance Entities:**
- [backend/src/model/operationsModel.js](backend/src/model/operationsModel.js#L3) exports Attendance
- [backend/src/model/attendanceModel.js](backend/src/model/attendanceModel.js#L3) also exports Attendance (redundant)

**Impact:** Can cause namespace conflicts and confusion about which model to use.

### 4.2 Missing Relations in Models (MEDIUM)

**StudentClass Model:** Missing relation to Assignment/Submission entities
- Database has `student_classes` table linking students to classes
- No direct way to query student submissions per class

**LearningMaterial vs StudyMaterial:**
- [backend/src/model/learningKeyModel.js](backend/src/model/learningKeyModel.js#L55) exports `LearningMaterial`
- [backend/src/model/studyMaterialModel.js](backend/src/model/studyMaterialModel.js#L3) exports `StudyMaterial`
- [database_schema.sql](database_schema.sql#L125): Only `learning_materials` table exists
- Database doesn't have StudyMaterial table! ❌

**Fix:** Remove `studyMaterialModel.js` or unify with `learningKeyModel.js`

---

### 4.3 Result vs AssessmentResult Ambiguity (MEDIUM)

- [database_schema.sql](database_schema.sql#L189): `assessment_results` table (normalized)
- [database_schema.sql](database_schema.sql#L280): `results` table (appears to be legacy)
- [backend/src/model/learningKeyModel.js](backend/src/model/learningKeyModel.js#L28) exports `Result`
- [backend/src/model/assessmentModel.js](backend/src/model/assessmentModel.js#L117) exports `AssessmentResult`

**Impact:** Ambiguity about which table to query for assessment results.

---

## 5. TYPE/VALIDATION MISMATCHES

### 5.1 Frontend Validation vs Backend (MEDIUM)

**Frontend Password Validation** ([frontend/src/validations/auth.ts](frontend/src/validations/auth.ts#L2)):
```typescript
passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
// Requires: 6+ chars, at least 1 letter, at least 1 number
```

**Backend Password Requirement:**
[backend/src/controller/authController.js](backend/src/controller/authController.js) - No explicit validation!
- Only checks if password exists (line 20)
- No length, complexity, or character requirement

**Impact:** Backend accepts weak passwords that frontend rejects.

### 5.2 Email Validation (LOW)

**Frontend:** `emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i` ✓ Standard

**Backend:** Uses TypeORM `unique: true` constraint only, no format validation

---

## 6. ERROR HANDLING ISSUES

### 6.1 Inconsistent Error Response Structure (HIGH)

**Successful Response:**
```javascript
{ code: 200, message: "...", data: {...} }
```

**Error Response Examples:**
- [backend/src/controller/studentController.js](backend/src/controller/studentController.js#L55): `{ code: 404, message: "..." }` ✓ Consistent
- [backend/src/controller/authController.js](backend/src/controller/authController.js#L82): `{ message: "...", token, data }` ❌ Inconsistent (no code)
- [backend/src/middleware/authentication.js](backend/src/middleware/authentication.js#L70): `{ message: "..." }` ❌ No code field

**Impact:** Frontend `if (response.data.code === 200)` checks fail for some endpoints.

### 6.2 Missing Error Details (MEDIUM)

**Generic Error Messages:**
```javascript
res.status(500).json({ message: "Internal server error" })
```
- Repeated 50+ times across controllers
- No error logging or debugging information
- No error codes for frontend to handle programmatically

**Better approach:**
```javascript
const ERROR_CODES = {
  INVALID_CREDENTIALS: 'AUTH_001',
  USER_NOT_FOUND: 'AUTH_002',
  DUPLICATE_EMAIL: 'AUTH_003',
};
```

### 6.3 Missing Try-Catch in Sync Functions (HIGH)

**[backend/index.js](backend/index.js#L20):**
```javascript
try {
  const { syncStudentUser } = await import('./src/controller/studentController.js');
  await syncStudentUser(
    { user: { id: null } },
    { json: () => {}, status: () => ({ json: () => {} }) } // Dummy res
  );
} catch (err) {
  console.error('❌ Database sync failed:', err);
}
```

**Issue:** Passing dummy res object doesn't call error handlers properly.

---

## 7. CONFIGURATION ISSUES

### 7.1 CORS Configuration Mismatch (MEDIUM)

**Backend** ([backend/index.js](backend/index.js#L47)):
```javascript
cors({
  origin: "http://localhost:3001",  // Frontend port
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
})
```

**Frontend port:** Next.js typically runs on `3000` or `3001`
**Backend port:** Runs on `3000` (from code)

**Potential Issue:** Frontend on 3000, backend on 3000 = conflict. Need separate ports or proper config.

### 7.2 Environment Variables Not Documented (MEDIUM)

**Required .env variables:**
- `DB_NAME` - Used in [backend/index.js](backend/index.js#L22)
- `DB_PASSWORD` - Used in [backend/src/config/db.js](backend/src/config/db.js)
- `JWT_SECRET` - Used in [backend/src/middleware/token.js](backend/src/middleware/token.js#L9)
- `PORT` - Used in [backend/index.js](backend/index.js#L16)
- `NEXT_PUBLIC_API_URL` - Used in frontend files

**Issue:** No `.env.example` file provided. Developers don't know required variables.

---

## 8. UNUSED CODE & DEAD CODE

### 8.1 Duplicate Model Exports (HIGH)

- **operationsModel.js** exports Attendance, Payment (duplicated elsewhere)
- **learningKeyModel.js** exports Assessment, Result, LearningMaterial (duplicates)
- **paymentModel.js** exports Payment (duplicate)
- **attendanceModel.js** exports Attendance (duplicate)
- **studyMaterialModel.js** exports StudyMaterial (no table in database!)

**Fix:** Consolidate models and keep only one version of each.

### 8.2 Commented Code (MEDIUM)

**[backend/src/middleware/authentication.js](backend/src/middleware/authentication.js#L1):** 50+ lines of commented old code (lines 1-45)

**[backend/src/middleware/token.js](backend/src/middleware/token.js#L22):** 
```javascript
generateToken()  // ❌ Function called without parameters
```

### 8.3 Unused Imports

**[backend/index.js](backend/index.js):** 
- `import` statements executed but sync functions called with dummy parameters

**[frontend/src/app/dashboard/layout.tsx](frontend/src/app/dashboard/layout.tsx#L18):**
- `import { access } from "fs"` - Never used

---

## 9. MISSING REQUIRED FIELDS

### 9.1 Assignment/Submission Fields (MEDIUM)

**[database_schema.sql](database_schema.sql#L116):**
```sql
assignments table: assignmentId, classId, title, description, dueDate, maxScore, attachmentPath
```

**Missing in responses:**
- `createdAt` - Should be included for timestamp
- `updatedAt` - Should be tracked

**Frontend [frontend/src/app/dashboard/teacher/assignments/[assignmentId]/submissions/SubmissionsClient.tsx](frontend/src/app/dashboard/teacher/assignments/[assignmentId]/submissions/SubmissionsClient.tsx) expects:**
```typescript
submissionId, assignmentId, studentId, submissionText, attachmentPath, score, feedback, status, submittedAt
```

**Check:** Does backend provide all these fields?

### 9.2 Teacher Performance Data (MEDIUM)

**Backend route exists:** [backend/src/routes/teacherRoutes.js](backend/src/routes/teacherRoutes.js#L73)
```javascript
teacherRoute.get("/student-performance", ..., getStudentPerformanceBulk);
```

**Issue:** No response data structure documented. Frontend doesn't have corresponding call.

---

## 10. ROUTE PARAMETER HANDLING INCONSISTENCIES

### 10.1 ID Parameter Naming (MEDIUM)

**Inconsistent naming conventions:**
| Resource | Param Name | File |
|----------|-----------|------|
| Assignment | `:assignmentId` | [backend/src/routes/teacherRoutes.js](backend/src/routes/teacherRoutes.js#L63) |
| Student | `:studentId` | [backend/src/routes/parentRoutes.js](backend/src/routes/parentRoutes.js#L35) |
| Payment | `:paymentId` | [backend/src/routes/studentRoutes.js](backend/src/routes/studentRoutes.js#L62) |
| Class | `:id` | [backend/src/routes/classRoutes.js](backend/src/routes/classRoutes.js#L12) ❌ Inconsistent |
| User | `:id` | [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js#L21) ❌ Inconsistent |

**Better:** Use consistent pattern like `:classId`, `:userId` everywhere.

### 10.2 Query vs Path Parameters (MEDIUM)

**Attendance endpoint** [frontend/src/app/dashboard/teacher/attendance/page.tsx](frontend/src/app/dashboard/teacher/attendance/page.tsx#L87):
```javascript
GET /teachers/classes/${classId}/students?date=${date}
```

**Issue:** Backend route doesn't show query parameter handling. Check if `?date=` is actually processed.

---

## SUMMARY OF CRITICAL ISSUES

| # | Issue | Severity | File | Line |
|---|-------|----------|------|------|
| 1 | Invalid `.status()` call in auth middleware | CRITICAL | [backend/src/middleware/authentication.js](backend/src/middleware/authentication.js#L115) | 115, 126, 138, 151 |
| 2 | Inconsistent response format (some without `code` field) | CRITICAL | Multiple auth endpoints | Various |
| 3 | Duplicate model exports causing conflicts | HIGH | [backend/src/model/*.js](backend/src/model) | Multiple |
| 4 | Database table `study-materials` missing, model exists | HIGH | [backend/src/model/studyMaterialModel.js](backend/src/model/studyMaterialModel.js) | - |
| 5 | Token storage key inconsistency ("token" vs "TOKEN") | HIGH | 15+ frontend files | Various |
| 6 | Hardcoded API URLs instead of config | HIGH | 30+ frontend files | Various |
| 7 | No backend password validation | MEDIUM | [backend/src/controller/authController.js](backend/src/controller/authController.js) | 20 |
| 8 | Unused imports and commented code | MEDIUM | Multiple | Various |

---

## RECOMMENDED FIXES (PRIORITY ORDER)

1. **Fix authentication middleware `.status()` bug** - Will break all protected endpoints
2. **Standardize response format** - Add `code` field to all responses
3. **Remove duplicate models** - Use TypeORM correctly
4. **Create centralized API config** - Replace hardcoded URLs
5. **Standardize token storage** - Use consistent localStorage keys
6. **Add backend password validation** - Match frontend requirements
7. **Document environment variables** - Create `.env.example`
8. **Consolidate duplicate code** - Remove dead code and commented sections

---

## TESTING RECOMMENDATIONS

- Test all protected endpoints with invalid/missing tokens
- Test response format consistency across all endpoints
- Test CORS with frontend running on different ports
- Test with `.env` file missing to verify proper error handling
- Verify all role-based access control routes work correctly
