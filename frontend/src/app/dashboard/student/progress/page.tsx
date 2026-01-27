export default function StudentProgress() {
    const subjects = [
        { name: "Math", grade: "B+", trend: "+3%" },
        { name: "Physics", grade: "B", trend: "+1%" },
        { name: "History", grade: "A", trend: "+2%" },
    ];

    return (
        <div className="p-6 space-y-4">
            <div>
                <h2 className="text-xl font-semibold text-gray-800">Progress</h2>
                <p className="text-sm text-gray-500">Grades and recent trends.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {subjects.map((subj) => (
                    <div key={subj.name} className="bg-white border rounded-xl p-4 shadow-sm">
                        <p className="text-sm text-gray-500">{subj.name}</p>
                        <p className="text-2xl font-bold">{subj.grade}</p>
                        <p className="text-xs text-green-600">{subj.trend} this term</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
