export default function TeacherQuizzes() {
    const quizzes = [
        { title: "Algebra Quiz", date: "Mar 12", status: "Published" },
        { title: "Mechanics", date: "Mar 18", status: "Draft" },
        { title: "Calculus", date: "Mar 25", status: "Scheduled" },
    ];

    return (
        <div className="p-6 space-y-4">
            <div>
                <h2 className="text-xl font-semibold text-gray-800">Quizzes</h2>
                <p className="text-sm text-gray-500">Manage upcoming and draft quizzes.</p>
            </div>

            <div className="bg-white border rounded-xl shadow-sm divide-y">
                {quizzes.map((quiz) => (
                    <div key={quiz.title} className="p-4 flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-gray-800">{quiz.title}</p>
                            <p className="text-xs text-gray-500">{quiz.date}</p>
                        </div>
                        <span className="text-sm font-medium text-orange-600">{quiz.status}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
