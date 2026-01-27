export default function ChildProgress() {
    const subjects = [
        { name: "Math", grade: "A-" },
        { name: "Science", grade: "B+" },
        { name: "History", grade: "A" },
    ];

    return (
        <div className="p-6 space-y-4">
            <div>
                <h2 className="text-xl font-semibold text-gray-800">Progress Overview</h2>
                <p className="text-sm text-gray-500">Latest grades for your child.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {subjects.map((subj) => (
                    <div key={subj.name} className="bg-white border rounded-xl p-4 shadow-sm">
                        <p className="text-sm text-gray-500">{subj.name}</p>
                        <p className="text-2xl font-bold">{subj.grade}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}