export default function StudentAssignments() {
    const assignments = [
        { title: "Algebra Homework", due: "Mar 10", status: "Pending" },
        { title: "History Essay", due: "Mar 14", status: "Submitted" },
        { title: "Physics Lab", due: "Mar 18", status: "Pending" },
    ];

    return (
        <div className="p-6 space-y-4">
            <div>
                <h2 className="text-xl font-semibold text-gray-800">Assignments</h2>
                <p className="text-sm text-gray-500">Track what is due next.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Pending</p>
                    <p className="text-2xl font-bold">2</p>
                </div>
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Submitted</p>
                    <p className="text-2xl font-bold">1</p>
                </div>
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Average grade</p>
                    <p className="text-2xl font-bold">B+</p>
                </div>
            </div>

            <div className="bg-white border rounded-xl shadow-sm divide-y">
                {assignments.map((item) => (
                    <div key={item.title} className="p-4 flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-gray-800">{item.title}</p>
                            <p className="text-xs text-gray-500">Due {item.due}</p>
                        </div>
                        <span className="text-sm font-medium text-orange-600">{item.status}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
