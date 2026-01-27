export default function TeacherAttendance() {
    const classes = [
        { course: "Math", section: "Grade 10", time: "09:00" },
        { course: "Physics", section: "Grade 11", time: "11:00" },
        { course: "Math", section: "Grade 9", time: "13:00" },
    ];

    return (
        <div className="p-6 space-y-4">
            <div>
                <h2 className="text-xl font-semibold text-gray-800">Today's Classes</h2>
                <p className="text-sm text-gray-500">Mark attendance for each session.</p>
            </div>

            <div className="bg-white border rounded-xl shadow-sm divide-y">
                {classes.map((cls) => (
                    <div key={`${cls.course}-${cls.time}`} className="p-4 flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-gray-800">{cls.course}</p>
                            <p className="text-xs text-gray-500">{cls.section}</p>
                        </div>
                        <span className="text-sm text-gray-700">{cls.time}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
