export default function ChildAttendancePage() {
    const days = [
        { date: "Mar 1", status: "Present" },
        { date: "Mar 2", status: "Present" },
        { date: "Mar 3", status: "Absent" },
    ];

    return (
        <div className="p-6 space-y-4">
            <div>
                <h2 className="text-xl font-semibold text-gray-800">Attendance</h2>
                <p className="text-sm text-gray-500">Your child's recent attendance.</p>
            </div>

            <div className="bg-white border rounded-xl shadow-sm divide-y">
                {days.map((day) => (
                    <div key={day.date} className="p-4 flex items-center justify-between">
                        <span className="text-gray-800">{day.date}</span>
                        <span className={`text-sm font-medium ${day.status === "Present" ? "text-green-600" : "text-orange-600"}`}>
                            {day.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}