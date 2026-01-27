export default function StudentMaterials() {
    const materials = [
        { title: "Chapter 5 Notes", course: "Physics", type: "PDF" },
        { title: "Practice Problems", course: "Math", type: "Worksheet" },
        { title: "Lecture Slides", course: "History", type: "Slides" },
    ];

    return (
        <div className="p-6 space-y-4">
            <div>
                <h2 className="text-xl font-semibold text-gray-800">Study Materials</h2>
                <p className="text-sm text-gray-500">Download or review shared resources.</p>
            </div>

            <div className="bg-white border rounded-xl shadow-sm divide-y">
                {materials.map((item) => (
                    <div key={item.title} className="p-4 flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-gray-800">{item.title}</p>
                            <p className="text-xs text-gray-500">{item.course}</p>
                        </div>
                        <span className="text-sm text-orange-600 font-medium">{item.type}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
