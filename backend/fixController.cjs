const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "src/controller/studentController.js");
let content = fs.readFileSync(filePath, "utf-8");

// Add contact to getStudentSettings
content = content.replace(
  `student: {
          studentId: student.studentId,
          fullName: student.fullName,
          grade: student.grade,
          email: student.user?.email,
        },`,
  `student: {
          studentId: student.studentId,
          fullName: student.fullName,
          grade: student.grade,
          email: student.user?.email,
          contact: student.contact,
        },`
);

const newFunctions = `

// Process an open payment invoice (simulate online / store bank_transfer slip)
export const processPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { paymentId } = req.params;
    const { paymentMethod, slipUrl } = req.body;

    const student = await studentRepo.findOne({
      where: { userId },
    });

    if (!student) return res.status(404).json({ code: 404, message: "Student not found" });

    const payment = await paymentRepo.findOne({
      where: { paymentId: parseInt(paymentId) },
    });

    if (!payment) return res.status(404).json({ code: 404, message: "Payment not found" });

    if (payment.studentId !== student.studentId) {
        return res.status(403).json({ code: 403, message: "Payment invoice does not belong to you." });
    }

    if (paymentMethod === "card") {
        payment.paymentMethod = "card";
        payment.status = "completed";
        payment.paidDate = new Date();
    } else if (paymentMethod === "bank_transfer") {
        payment.paymentMethod = "bank_transfer";
        payment.slipUrl = slipUrl || null;
        payment.status = "pending"; 
    } else {
        return res.status(400).json({ code: 400, message: "Unsupported payment method format." });
    }

    await paymentRepo.save(payment);

    return res.status(200).json({ code: 200, message: "Payment submitted successfully." });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ code: 500, message: "Internal server error" });
  }
};

// Update student profile Details (email, name, contact)
export const updateStudentProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, contact, email } = req.body;

    const student = await studentRepo.findOne({
      where: { userId },
      relations: ["user"]
    });

    if (!student) {
      return res.status(404).json({ code: 404, message: "Student profile not found" });
    }

    if (fullName) student.fullName = fullName;
    if (contact !== undefined) student.contact = contact;

    await studentRepo.save(student);

    if (student.user) {
        if (email) {
            const existingUser = await userRepo.findOne({ where: { email } });
            if (existingUser && existingUser.id !== student.user.id) {
                return res.status(400).json({ code: 400, message: "Email already exists" });
            }
            student.user.email = email;
        }

        if (fullName) {
            const nameParts = fullName.split(' ');
            student.user.firstName = nameParts[0] || '';
            student.user.lastName = nameParts.slice(1).join(' ') || '';
        }

        await userRepo.save(student.user);
    }

    return res.status(200).json({
      code: 200,
      message: "Profile updated successfully",
      data: student
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ code: 500, message: "Internal server error" });
  }
};
`;

content += newFunctions;

fs.writeFileSync(filePath, content, "utf-8");
console.log("Successfully appended functions.");
