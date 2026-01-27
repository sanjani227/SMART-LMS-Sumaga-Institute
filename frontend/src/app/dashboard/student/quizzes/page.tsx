export default function StudentQuizzes() {
    const quizzes = [
        { title: "Algebra Quiz", date: "Mar 12", status: "Scheduled" },
        { title: "World War II", date: "Mar 15", status: "Scheduled" },
        { title: "Optics", date: "Mar 20", status: "Draft" },
    ];

    return (
        <div className="p-6 space-y-4">
            <div>
                <h2 className="text-xl font-semibold text-gray-800">Upcoming Quizzes</h2>
                <p className="text-sm text-gray-500">Check schedule and status.</p>
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
