export default function StudentMessages() {
    const messages = [
        { from: "Mrs. Grant", subject: "Essay feedback", time: "2h ago" },
        { from: "Admin", subject: "Schedule update", time: "1d ago" },
        { from: "Mr. Kumar", subject: "Lab preparation", time: "2d ago" },
    ];

    return (
        <div className="p-6 space-y-4">
            <div>
                <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
                <p className="text-sm text-gray-500">Recent messages from teachers and staff.</p>
            </div>

            <div className="bg-white border rounded-xl shadow-sm divide-y">
                {messages.map((msg) => (
                    <div key={msg.subject} className="p-4 flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-gray-800">{msg.subject}</p>
                            <p className="text-xs text-gray-500">From {msg.from}</p>
                        </div>
                        <span className="text-xs text-gray-500">{msg.time}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
