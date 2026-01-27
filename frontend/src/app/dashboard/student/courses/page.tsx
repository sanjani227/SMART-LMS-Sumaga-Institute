export default function StudentCourses() {
    const courses = [
        { name: "Mathematics", teacher: "Ms. Lee", progress: "78%" },
        { name: "Physics", teacher: "Mr. Kumar", progress: "64%" },
        { name: "History", teacher: "Mrs. Grant", progress: "92%" },
    ];

    return (
        <div className="p-6 space-y-4">
            <div>
                <h2 className="text-xl font-semibold text-gray-800">My Courses</h2>
                <p className="text-sm text-gray-500">Current enrollments and progress.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {courses.map((course) => (
                    <div key={course.name} className="bg-white border rounded-xl p-4 shadow-sm">
                        <p className="text-lg font-semibold text-gray-800">{course.name}</p>
                        <p className="text-sm text-gray-500">{course.teacher}</p>
                        <div className="mt-3 h-2 bg-gray-100 rounded-full">
                            <div className="h-2 bg-orange-400 rounded-full" style={{ width: course.progress }}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Progress: {course.progress}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
