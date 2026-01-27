export default function TeacherAssignments() {
    const grading = [
        { title: "Algebra Homework", submissions: 24, due: "Mar 12" },
        { title: "Lab Report", submissions: 18, due: "Mar 14" },
        { title: "Essay Draft", submissions: 27, due: "Mar 16" },
    ];

    return (
        <div className="p-6 space-y-4">
            <div>
                <h2 className="text-xl font-semibold text-gray-800">Assignments to Grade</h2>
                <p className="text-sm text-gray-500">Quick snapshot of pending work.</p>
            </div>

            <div className="bg-white border rounded-xl shadow-sm divide-y">
                {grading.map((item) => (
                    <div key={item.title} className="p-4 flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-gray-800">{item.title}</p>
                            <p className="text-xs text-gray-500">Due {item.due}</p>
                        </div>
                        <span className="text-sm text-gray-700">{item.submissions} submissions</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
