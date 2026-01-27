export default function TeacherCourses() {
    const courses = [
        { name: "Math", students: 32, next: "Quiz on Mar 12" },
        { name: "Physics", students: 28, next: "Lab on Mar 14" },
        { name: "Robotics", students: 18, next: "Project check-in" },
    ];

    return (
        <div className="p-6 space-y-4">
            <div>
                <h2 className="text-xl font-semibold text-gray-800">My Courses</h2>
                <p className="text-sm text-gray-500">Enrollments and upcoming tasks.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {courses.map((course) => (
                    <div key={course.name} className="bg-white border rounded-xl p-4 shadow-sm">
                        <p className="text-lg font-semibold text-gray-800">{course.name}</p>
                        <p className="text-sm text-gray-500">Students: {course.students}</p>
                        <p className="text-xs text-gray-500 mt-2">{course.next}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
