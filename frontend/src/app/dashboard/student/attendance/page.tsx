export default function StudentAttendance() {
    const records = [
        { date: "Mar 1", status: "Present", remark: "On time" },
        { date: "Mar 2", status: "Present", remark: "On time" },
        { date: "Mar 3", status: "Absent", remark: "Sick" },
    ];

    return (
        <div className="p-6 space-y-4">
            <div>
                <h2 className="text-xl font-semibold text-gray-800">Attendance</h2>
                <p className="text-sm text-gray-500">Quick overview of recent days.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">This week</p>
                    <p className="text-2xl font-bold">4/5</p>
                </div>
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Late arrivals</p>
                    <p className="text-2xl font-bold">0</p>
                </div>
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Absences</p>
                    <p className="text-2xl font-bold">1</p>
                </div>
            </div>

            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <div className="grid grid-cols-3 bg-gray-50 text-xs font-semibold text-gray-600 px-4 py-2 uppercase tracking-wide">
                    <span>Date</span>
                    <span>Status</span>
                    <span>Remark</span>
                </div>
                {records.map((row) => (
                    <div key={row.date} className="grid grid-cols-3 px-4 py-3 text-sm border-t">
                        <span className="text-gray-800">{row.date}</span>
                        <span className="text-green-600 font-medium">{row.status}</span>
                        <span className="text-gray-500">{row.remark}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
